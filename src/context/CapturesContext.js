import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import api from '../api/treeTrackerApi';
import { getOrganization } from '../api/apiUtils';
import { session } from '../models/auth';
import FilterModel from '../models/Filter';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../context/CapturesContext');

export const CapturesContext = createContext({
  isLoading: false,
  captures: [],
  captureCount: 0,
  capture: {},
  capturesSelected: [],
  captureImageAnchor: undefined,
  invalidateCaptureCount: false,
  isApproveAllProcessing: false,
  approveAllComplete: 0,
  page: 0,
  rowsPerPage: 24,
  order: 'desc',
  orderBy: 'timeCreated',
  filter: new FilterModel(),
  setIsLoading: () => {},
  setCapture: () => {},
  setRowsPerPage: () => {},
  setPage: () => {},
  setOrder: () => {},
  setOrderBy: () => {},
  clickCapture: () => {},
  queryCapturesApi: () => {},
  getCaptureCount: () => {},
  getCaptures: () => {},
  getCaptureById: () => {},
  getCaptureExports: () => {},
  approveAll: () => {},
  updateFilter: () => {},
});

export function CapturesProvider(props) {
  // log.debug('render: captures');
  const [captures, setCaptures] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const [capture, setCapture] = useState({});
  const [capturesSelected, setCapturesSelected] = useState([]);
  const [captureImageAnchor, setCaptureImageAnchor] = useState(undefined);
  const [invalidateCaptureCount, setInvalidateCaptureCount] = useState(false);
  const [isApproveAllProcessing, setIsApproveAllProcessing] = useState(false);
  const [approveAllComplete, setApproveAllComplete] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(24);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('timeCreated');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(
    new FilterModel({
      verifyStatus: [
        { active: true, approved: true },
        { active: true, approved: false },
      ],
    })
  );

  useEffect(() => {
    getCaptures();
    getCaptureCount();
  }, [filter, rowsPerPage, page, order, orderBy]);

  // EVENT HANDLERS
  const queryCapturesApi = ({
    id = null,
    count = false,
    paramString = null,
  }) => {
    const query = `${
      process.env.REACT_APP_API_ROOT
    }/api/${getOrganization()}trees${count ? '/count' : ''}${
      id != null ? '/' + id : ''
    }${paramString ? '?' + paramString : ''}`;

    return axios.get(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    });
  };

  const getCaptureCount = async () => {
    log.debug('load capture count');
    const paramString = `where=${JSON.stringify(filter.getWhereObj())}`;
    const response = await queryCapturesApi({
      count: true,
      paramString,
    }).catch((err) =>
      console.error(`ERROR: Failed to get capture count: ${err}`)
    );
    const { count } = response.data;
    setCaptureCount(Number(count));
    setInvalidateCaptureCount(false);
  };

  const getCaptures = async () => {
    log.debug('4 - load captures');
    const filterData = {
      where: filter.getWhereObj(),
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      skip: page * rowsPerPage,
    };

    const paramString = `filter=${JSON.stringify(filterData)}`;
    setIsLoading(true);
    log.debug('load page with params:', paramString);
    await queryCapturesApi({ paramString })
      .then(({ data }) => {
        log.debug('loaded captures:', data.length);
        setCaptures(data);
        setIsLoading(false);
      })
      .catch((err) => console.error(`ERROR: Failed to get captures: ${err}`));
  };

  // GET CAPTURES FOR EXPORT
  const getCaptureExports = async () => {
    log.debug('load all captures for export');
    const filterData = {
      where: filter.getWhereObj(),
      order: [`${orderBy} ${order}`],
      limit: 20000,
    };

    const paramString = `filter=${JSON.stringify(filterData)}`;
    const response = await queryCapturesApi({ paramString }).catch((err) =>
      console.error(`ERROR: Failed to get captures for export: ${err}`)
    );
    return response;
  };

  const getCaptureById = (id) => {
    queryCapturesApi({ id })
      .then((res) => {
        setIsLoading(false);
        setCapture(res.data);
      })
      .catch((err) => {
        // setIsLoading(false);
        console.error(`ERROR: Failed to get selected capture: ${err}`);
      });
  };

  const updateFilter = async (filter) => {
    log.debug('2 - updateFilter', filter);
    setFilter(filter);
    reset();
  };

  const reset = () => {
    setCaptures([]);
    setPage(0);
    setCaptureCount(null);
    setInvalidateCaptureCount(true);
  };

  /**  VERIFICATION METHODS **/

  const resetSelection = () => {
    setCapturesSelected([]);
    setCaptureImageAnchor(undefined);
  };

  const clickCapture = (payload) => {
    const { captureId, isShift, isCmd, isCtrl } = payload;
    if (!isShift && !isCmd && !isCtrl) {
      setCapturesSelected([captureId]);
      setCaptureImageAnchor(captureId);
    } else if (isShift) {
      log.debug('press shift, and there is an anchor:', captureImageAnchor);
      //if no anchor, then, select from beginning
      let indexAnchor = 0;
      if (captureImageAnchor) {
        indexAnchor = captures.reduce(
          (a, c, i) => (c && c.id === captureImageAnchor ? i : a),
          -1
        );
      }
      const indexCurrent = captures.reduce(
        (a, c, i) => (c && c.id === captureId ? i : a),
        -1
      );
      const capturesSelected = captures
        .slice(
          Math.min(indexAnchor, indexCurrent),
          Math.max(indexAnchor, indexCurrent) + 1
        )
        .map((capture) => capture.id);
      setCapturesSelected(capturesSelected);
    } else if (isCmd || isCtrl) {
      // Toggle the selection state
      let selectedImages;
      if (capturesSelected.find((el) => el === captureId)) {
        selectedImages = capturesSelected.filter(
          (capture) => capture !== captureId
        );
      } else {
        selectedImages = [...capturesSelected, captureId];
      }
      setCapturesSelected(selectedImages);
    }
  };

  const approve = async ({ approveAction, id }) => {
    if (!approveAction) {
      throw Error('no approve action object!');
    }
    if (approveAction.isApproved) {
      log.debug('approve');
      await api.approveCaptureImage(
        id,
        approveAction.morphology,
        approveAction.age,
        approveAction.captureApprovalTag,
        approveAction.speciesId
      );
    } else {
      log.debug('reject');
      await api.rejectCaptureImage(id, approveAction.rejectionReason);
    }

    if (approveAction.tags) {
      await api.createCaptureTags(id, approveAction.tags);
    }

    return true;
  };

  const approveAll = async (approveAction) => {
    log.debug('approveAll with approveAction:', approveAction);
    setIsLoading(true);
    setIsApproveAllProcessing(true);

    const total = capturesSelected.length;

    log.debug('captures total:%d', captures.length);
    try {
      for (let i = 0; i < total; i++) {
        const captureId = capturesSelected[i];
        const captureImage = captures.reduce(
          (a, c) => (c && c.id === captureId ? c : a),
          undefined
        );
        log.debug('approve:%d', captureImage.id);
        log.trace('approve:%d', captureImage.id);
        await approve({
          id: captureImage.id,
          approveAction,
        });
        setApproveAllComplete(100 * ((i + 1) / total));
      }
    } catch (e) {
      log.warn('get error:', e);
      setIsLoading(false);
      setIsApproveAllProcessing(false);
      return false;
    }

    setIsLoading(false);
    await getCaptures();
    setIsApproveAllProcessing(false);
    setApproveAllComplete(0);
    setInvalidateCaptureCount(true);

    resetSelection();
    return true;
  };

  const value = {
    captures,
    captureCount,
    capture,
    capturesSelected,
    captureImageAnchor,
    isLoading,
    isApproveAllProcessing,
    approveAllComplete,
    page,
    rowsPerPage,
    order,
    orderBy,
    filter,
    setIsLoading,
    setCapture,
    setRowsPerPage,
    setPage,
    setOrder,
    setOrderBy,
    clickCapture,
    queryCapturesApi,
    getCaptureCount,
    getCaptures,
    getCaptureById,
    getCaptureExports,
    approveAll,
    updateFilter,
  };

  return (
    <CapturesContext.Provider value={value}>
      {props.children}
    </CapturesContext.Provider>
  );
}
