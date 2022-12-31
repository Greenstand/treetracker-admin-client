import React, { useState, useEffect, createContext } from 'react';
import FilterModel from '../models/Filter';
import api from '../api/treeTrackerApi';
import { captureStatus } from '../common/variables';

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
  const [captures, setCaptures] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const [capture, setCapture] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('created_at');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(
    new FilterModel({
      status: captureStatus.APPROVED,
    })
  );

  useEffect(() => {
    getCaptures();
  }, [filter, rowsPerPage, page, order, orderBy]);

  const getCaptures = async () => {
    log.debug('4 - load captures');

    const filterData = {
      ...filter.getWhereObj(),
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
    const response = await api.getCaptures(filterData);
    setIsLoading(false);
    setCaptures(response?.captures);
    setCaptureCount(Number(response?.total));
  };

  // GET CAPTURES FOR EXPORT
  const getAllCaptures = async () => {
    log.debug('load all captures for export');
    const filterData = {
      ...filter.getWhereObj(),
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
