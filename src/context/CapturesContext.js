import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
// import { getOrganizationUUID } from '../api/apiUtils';
import { session } from '../models/auth';
import FilterModel from '../models/Filter';
import api from '../api/treeTrackerApi';

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
  queryCapturesApi: () => {},
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
  const [filter, setFilter] = useState(new FilterModel());

  useEffect(() => {
    getCaptures();
  }, [filter, rowsPerPage, page, order, orderBy]);

  // EVENT HANDLERS
  const queryCapturesApi = ({ ...params }) => {
    let filterObj = { limit: 25, offset: 0, ...params };

    const query = `${process.env.REACT_APP_QUERY_API_ROOT}/v2/captures${
      filterObj ? `?${api.makeQueryString(filterObj)}` : ''
    }`;

    return axios.get(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    });
  };

  const getCaptures = async () => {
    log.debug('4 - load captures');

    const filterData = {
      ...filter.getWhereObj(),
      order_by: orderBy,
      order,
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    };

    // log.debug('getCaptures filter', filterData);

    setIsLoading(true);
    const response = await queryCapturesApi(filterData);
    // log.debug('getCaptures -->', response.data);
    setIsLoading(false);
    setCaptures(response?.data?.captures);
    setCaptureCount(Number(response?.data?.total));
  };

  // GET CAPTURES FOR EXPORT
  const getAllCaptures = async () => {
    log.debug('load all captures for export');
    const filterData = {
      ...filter.getWhereObj(),
      order: [`${orderBy} ${order}`],
      limit: 20000,
    };
    const { data } = await queryCapturesApi(filterData);
    return data;
  };

  const getCapture = (id) => {
    setIsLoading(true);

    api
      .getCaptureById(id)
      .then((res) => {
        setIsLoading(false);
        setCapture(res);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(`ERROR: FAILED TO GET SELECTED TREE ${err}`);
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
    queryCapturesApi,
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
