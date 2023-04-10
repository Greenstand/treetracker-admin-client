import React, { useContext, useState, useEffect, createContext } from 'react';
import api from '../api/treeTrackerApi';
import FilterModel, { ALL_ORGANIZATIONS } from '../models/Filter';
import * as loglevel from 'loglevel';
import { captureStatus } from 'common/variables';
import { AppContext } from './AppContext.js';
import { setOrganizationFilter } from '../common/utils';

const log = loglevel.getLogger('../context/VerifyContext');

export const VerifyContext = createContext({
  captureImages: [],
  captureImagesSelected: [],
  captureImageAnchor: undefined,
  captureImagesUndo: [],
  isLoading: false,
  isProcessing: false,
  percentComplete: 0,
  pageSize: 24,
  currentPage: 0,
  filter: new FilterModel(),
  invalidateCaptureCount: true,
  captureCount: null,
  approve: () => {},
  loadCaptureImages: () => {},
  processCaptures: () => {},
  undoAll: () => {},
  updateFilter: () => {},
  getCaptureCount: () => {},
  clickCapture: () => {},
  setPageSize: () => {},
  setCurrentPage: () => {},
  setCaptureImagesSelected: () => {},
  getCaptureSelectedArr: () => {},
});

export function VerifyProvider(props) {
  const { orgId, orgList } = useContext(AppContext);
  const [captureImages, setCaptureImages] = useState([]);
  const [captureImagesUndo, setCaptureImagesUndo] = useState([]);
  const [captureImagesSelected, setCaptureImagesSelected] = useState({});
  const [captureImageAnchor, setCaptureImageAnchor] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [percentComplete, setPercentComplete] = useState(0);
  const [pageSize, setPageSize] = useState(24);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState(
    new FilterModel({
      organization_id: ALL_ORGANIZATIONS,
      status: captureStatus.UNPROCESSED,
    })
  );
  const [invalidateCaptureCount, setInvalidateCaptureCount] = useState(true);
  const [captureCount, setCaptureCount] = useState(null);

  useEffect(() => {
    if (invalidateCaptureCount) getCaptureCount();
  }, [invalidateCaptureCount]);

  /* load captures when the page or page size changes */
  useEffect(() => {
    const abortController = new AbortController();
    // orgId can be either null or an [] of uuids
    if (orgId !== undefined) {
      setCaptureImages([]);
      loadCaptureImages({ signal: abortController.signal });
    }
    return () => abortController.abort();
  }, [filter, pageSize, currentPage, orgId]);

  // STATE HELPER FUNCTIONS

  // /*
  //  * replace approve and reject
  //  */
  const undoedCaptureImage = (state, captureId) => {
    //put the capture back, from undo list, sort by id
    const captureUndo = captureImagesUndo.reduce((a, c) =>
      c.id === captureId ? c : a
    );
    const undoneImages = captureImagesUndo.filter(
      (capture) => capture.id !== captureId
    );
    const captures = [...captureImages, captureUndo].sort(
      (a, b) => a.id - b.id
    );
    setCaptureImages(captures);
    setCaptureImagesUndo(undoneImages);
  };

  // to reset the page status, load from beginning
  const reset = () => {
    setCaptureImages([]);
    setCurrentPage(0);
    setCaptureCount(null);
    setInvalidateCaptureCount(true);
  };
  /*
   * to clear all selection
   */
  const resetSelection = () => {
    setCaptureImagesSelected({});
    setCaptureImageAnchor(undefined);
  };

  // EVENT HANDLERS

  const updateCaptureStatus = async ({ approveAction, capture }) => {
    if (!approveAction) {
      throw Error('no approve action object!');
    }
    if (approveAction.isApproved) {
      log.debug('approve', capture.id);
      await api.approveCaptureImage(
        capture,
        approveAction.morphology,
        approveAction.age,
        approveAction.speciesId
      );

      if (approveAction.tags.length) {
        await api.createCaptureTags(capture.id, approveAction.tags);
      }
    } else {
      log.debug('reject', capture.id);
      await api.rejectCaptureImage(capture, approveAction.rejectionReason);
    }

    return true;
  };

  const undoCaptureImage = async (id) => {
    await api.undoCaptureImage(id);
    undoedCaptureImage(id);
    return true;
  };

  const loadCaptureImages = async (abortController) => {
    log.debug('Verify to load images');

    //set loading status
    setIsLoading(true);

    //set correct values for organization_id, an array of uuids for ALL_ORGANIZATIONS or a uuid string if provided
    const finalFilter = setOrganizationFilter({ ...filter }, orgId, orgList);

    const pageParams = {
      page: currentPage,
      rowsPerPage: pageSize,
      filter: new FilterModel(finalFilter),
    };

    const result = await api.getRawCaptures(pageParams, abortController);
    setCaptureImages(result?.raw_captures || []);
    setCaptureCount(Number(result?.total));
    setInvalidateCaptureCount(false);
    //restore loading status
    setIsLoading(false);
  };

  const getCaptureSelectedArr = () => {
    return captureImages.filter(
      (capture) => !!captureImagesSelected[capture.id]
    );
  };

  const clickCapture = (payload) => {
    const { captureId, isShift } = payload;
    if (isShift) {
      log.debug('press shift, and there is an anchor:', captureImageAnchor);
      //if no anchor, then, select from beginning
      let indexAnchor = 0;
      if (captureImageAnchor !== undefined) {
        indexAnchor = captureImages.reduce((a, c, i) => {
          if (c !== undefined && c.id === captureImageAnchor) {
            return i;
          } else {
            return a;
          }
        }, -1);
      }
      const indexCurrent = captureImages.reduce((a, c, i) => {
        if (c !== undefined && c.id === captureId) {
          return i;
        } else {
          return a;
        }
      }, -1);
      let captureShiftSelected = {};
      captureImages
        .slice(
          Math.min(indexAnchor, indexCurrent),
          Math.max(indexAnchor, indexCurrent) + 1
        )
        .forEach((capture) => {
          captureShiftSelected[capture.id] = capture;
        });
      setCaptureImagesSelected(captureShiftSelected);
    } else {
      setCaptureImageAnchor(captureId);
      const value = !captureImagesSelected[captureId]
        ? captureImages.find((c) => c.id === captureId)
        : null;
      setCaptureImagesSelected({
        ...captureImagesSelected,
        [captureId]: value,
      });
    }
  };

  const processCaptures = async (approveAction) => {
    try {
      setIsLoading(true);
      setIsProcessing(true);
      const captureSelected = getCaptureSelectedArr();
      const total = captureSelected.length;

      log.debug(
        'processCaptures items: %d of %d',
        captureSelected.length,
        captureImages.length
      );
      log.debug('captureSelected', captureSelected);

      for (let i = 0; i < total; i++) {
        const capture = captureSelected[i];
        await updateCaptureStatus({
          capture,
          approveAction,
        });
        setPercentComplete(100 * ((i + 1) / total));
      }

      //push to undo list and set status flags
      setCaptureImagesUndo(captureSelected), setIsLoading(false);
      await loadCaptureImages();
      setIsProcessing(false);
      setPercentComplete(0);
      setInvalidateCaptureCount(true);

      resetSelection();
      return { error: false, message: 'Captures were approved' };
    } catch (e) {
      log.warn('get error:', e);
      setIsLoading(false);
      setIsProcessing(false);
      return { error: true, message: `There was a problem: ${e}` };
    }
  };

  const undoAll = async () => {
    log.debug('undo with state:', captureImagesUndo);
    setIsLoading(true);
    setIsProcessing(true);

    const total = captureImagesUndo.length;
    log.debug('items:%d', captureImages.length);
    try {
      for (let i = 0; i < captureImagesUndo.length; i++) {
        const captureImage = captureImagesUndo[i];
        // log.trace('undo:%d', captureImage.id);
        await undoCaptureImage(captureImage.id);

        setPercentComplete(100 * ((i + 1) / total));
        setInvalidateCaptureCount(true);
      }
    } catch (e) {
      log.warn('get error:', e);
      setIsLoading(true);
      setIsProcessing(true);
      return false;
    }
    setIsLoading(false);
    setIsProcessing(false);
    setPercentComplete(0);
    setInvalidateCaptureCount(true);

    resetSelection();
    return true;
  };

  const updateFilter = async (updatedFilter = filter) => {
    setFilter(updatedFilter);
    // each time the filter updates clear the currently loaded captures
    reset();
    resetSelection();
  };

  const getCaptureCount = async (newfilter = filter) => {
    log.debug('getCaptureCount');

    //set correct values for organization_id, an array of uuids for ALL_ORGANIZATIONS or a uuid string if provided
    const finalFilter = setOrganizationFilter(
      newfilter.getWhereObj(),
      orgId,
      orgList
    );
    const pageParams = {
      filter: new FilterModel(finalFilter),
    };
    const result = await api.getRawCaptureCount(pageParams);
    setCaptureCount(Number(result?.count));
    setInvalidateCaptureCount(false);
  };

  const value = {
    captureImages,
    captureImagesSelected,
    captureImageAnchor,
    captureImagesUndo,
    isLoading,
    isProcessing,
    percentComplete,
    pageSize,
    currentPage,
    filter,
    invalidateCaptureCount,
    captureCount,
    loadCaptureImages,
    processCaptures,
    undoAll: undoAll,
    updateFilter,
    getCaptureCount,
    clickCapture,
    setPageSize,
    setCurrentPage,
    setCaptureImagesSelected,
    getCaptureSelectedArr,
  };

  return (
    <VerifyContext.Provider value={value}>
      {props.children}
    </VerifyContext.Provider>
  );
}
