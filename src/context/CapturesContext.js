import React, { useContext, useState, useEffect, createContext } from 'react';
import FilterModel, { ALL_ORGANIZATIONS } from '../models/Filter';
import api from '../api/treeTrackerApi';
// import { captureStatus } from '../common/variables';
import { AppContext } from './AppContext.js';
import { setOrganizationFilter } from '../common/utils';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../context/CapturesContext');

export const CapturesContext = createContext({
  isLoading: false,
  captures: [],
  captureCount: 0,
  capture: {},
  page: 0,
  rowsPerPage: 25,
  order: 'desc',
  orderBy: 'timeCreated',
  filter: new FilterModel(),
  setRowsPerPage: () => {},
  setPage: () => {},
  setOrder: () => {},
  setOrderBy: () => {},
  setCapture: () => {},
  getCaptures: () => {},
  getCapture: () => {},
  getAllCaptures: () => {},
  updateFilter: () => {},
});

export function CapturesProvider(props) {
  const { orgId, orgList } = useContext(AppContext);
  const [captures, setCaptures] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const [capture, setCapture] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('created_at');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(
    new FilterModel({ organization_id: ALL_ORGANIZATIONS })
  );

  useEffect(() => {
    const abortController = new AbortController();
    // orgId can be either null or an [] of uuids
    if (orgId !== undefined) {
      getCaptures({ signal: abortController.signal });
    }
    return () => abortController.abort();
  }, [filter, rowsPerPage, page, order, orderBy, orgId]);

  const getCaptures = async (abortController) => {
    log.debug('4 - load captures', filter);

    //set correct values for organization_id, an array of uuids for ALL_ORGANIZATIONS or a uuid string if provided
    const finalFilter = setOrganizationFilter(filter, orgId, orgList);

    const filterData = {
      filter: new FilterModel(finalFilter),
      order_by: orderBy,
      order,
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    };

    // status is not allowed by api because all captures should be "approved"
    if (filterData.status) {
      delete filterData.status;
    }

    setIsLoading(true);
    const response = await api.getCaptures(filterData, abortController);
    setIsLoading(false);
    setCaptures(response?.captures);
    setCaptureCount(Number(response?.total));
  };

  // GET CAPTURES FOR EXPORT
  const getAllCaptures = async () => {
    log.debug('load all captures for export');
    //set correct values for organization_id, an array of uuids for ALL_ORGANIZATIONS or a uuid string if provided
    const finalFilter = setOrganizationFilter({ ...filter }, orgId, orgList);

    const filterData = {
      filter: new FilterModel(finalFilter),
      order: [`${orderBy} ${order}`],
      limit: 20000,
    };

    // status is not allowed by api because all captures should be "approved"
    if (filterData.status) {
      delete filterData.status;
    }

    const { captures } = await api.getCaptures(filterData);
    return captures;
  };

  const getCapture = (id) => {
    setIsLoading(true);

    api
      .getCaptureById(`${process.env.REACT_APP_QUERY_API_ROOT}/v2/captures`, id)
      .then((res) => {
        setIsLoading(false);
        setCapture(res);
      })
      .catch((err) => {
        setIsLoading(false);
        log.error(`ERROR: FAILED TO GET SELECTED CAPTURE ${err}`);
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
  };

  const value = {
    captures,
    captureCount,
    capture,
    page,
    rowsPerPage,
    order,
    orderBy,
    filter,
    isLoading,
    setIsLoading,
    setRowsPerPage,
    setPage,
    setOrder,
    setOrderBy,
    getCaptures,
    getCapture,
    setCapture,
    getAllCaptures,
    updateFilter,
  };

  return (
    <CapturesContext.Provider value={value}>
      {props.children}
    </CapturesContext.Provider>
  );
}
