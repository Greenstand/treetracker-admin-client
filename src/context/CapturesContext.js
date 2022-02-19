import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { getOrganization } from '../api/apiUtils';
import { session } from '../models/auth';
import FilterModel from '../models/Filter';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../context/CapturesContext');

export const CapturesContext = createContext({
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
  getCaptureCount: () => {},
  getCapturesAsync: () => {},
  getCaptureAsync: () => {},
  getAllCaptures: () => {},
  updateFilter: () => {},
});

export function CapturesProvider(props) {
  // log.debug('render: captures');
  const [captures, setCaptures] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const [capture, setCapture] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('timeCreated');
  const [filter, setFilter] = useState(
    new FilterModel({
      verifyStatus: [
        { active: true, approved: true },
        { active: true, approved: false },
      ],
    })
  );

  useEffect(() => {
    getCapturesAsync();
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
    });
    const { count } = response.data;
    setCaptureCount(Number(count));
  };

  const getCapturesAsync = async () => {
    log.debug('4 - load captures');
    const filterData = {
      where: filter.getWhereObj(),
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      skip: page * rowsPerPage,
    };
    const paramString = `filter=${JSON.stringify(filterData)}`;
    const response = await queryCapturesApi({ paramString });
    setCaptures(response.data);
  };

  // GET CAPTURES FOR EXPORT
  const getAllCaptures = async () => {
    log.debug('load all captures for export');
    const filterData = {
      where: filter.getWhereObj(),
      order: [`${orderBy} ${order}`],
      limit: 20000,
    };

    const paramString = `filter=${JSON.stringify(filterData)}`;
    const response = await queryCapturesApi({ paramString });
    return response;
  };

  const getCaptureAsync = (id) => {
    queryCapturesApi({ id })
      .then((res) => {
        setCapture(res.data);
      })
      .catch((err) =>
        console.error(`ERROR: FAILED TO GET SELECTED TREE ${err}`)
      );
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
    setRowsPerPage,
    setPage,
    setOrder,
    setOrderBy,
    queryCapturesApi,
    getCaptureCount,
    getCapturesAsync,
    getCaptureAsync,
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
