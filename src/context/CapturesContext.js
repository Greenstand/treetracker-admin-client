import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { getOrganizationUUID } from '../api/apiUtils';
import { session } from '../models/auth';
import FilterModel from '../models/Filter';

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
  }, [filter, rowsPerPage, page, order, orderBy]);

  function makeQueryString(filterObj) {
    let query = '';
    for (const key in filterObj) {
      if ((filterObj[key] || filterObj[key] === 0) && filterObj[key] !== '') {
        query += `&${key}=${JSON.stringify(filterObj[key])}`;
      }
      // console.log('key', key, filterObj[key], query);
    }
    return query;
  }

  // EVENT HANDLERS
  const queryCapturesApi = ({ id = null, ...params }) => {
    let filterObj = { limit: 25, offset: 0, ...params };

    const query = `${process.env.REACT_APP_FIELD_DATA_ROOT}/raw-captures${
      id != null ? '/' + id : ''
    }${filterObj ? `?${makeQueryString(filterObj)}` : ''}`;

    return axios.get(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    });
  };

  const getCaptures = async () => {
    log.debug('4 - load captures');

    // TODO: how to handle verify status?
    // filter.getWhereObj() contains ...
    //     or: Array(2)
    //         0: {active: true, approved: true}
    //         1: {active: true, approved: false}
    //     length: 2
    //     [[Prototype]]: Array(0)
    //     organizationId: undefined
    //     speciesId: undefined
    //     stakeholderUUID: undefined

    const filterData = {
      // TODO:: order and orderBy filters need to be implemented
      // ...filter.getWhereObj(),
      // orderBy,
      // order,
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      id: getOrganizationUUID(),
    };

    console.log('filterData -->', filterData);

    setIsLoading(true);
    const response = await queryCapturesApi(filterData);
    setIsLoading(false);
    setCaptures(response.data.raw_captures);
    setCaptureCount(Number(response.data.query.count));
  };

  // GET CAPTURES FOR EXPORT
  const getAllCaptures = async () => {
    log.debug('load all captures for export');
    const filterData = {
      ...filter.getWhereObj(),
      order: [`${orderBy} ${order}`],
      limit: 20000,
    };
    const response = await queryCapturesApi(filterData);
    return response;
  };

  const getCapture = (id) => {
    setIsLoading(true);
    queryCapturesApi({ id })
      .then((res) => {
        setIsLoading(false);
        setCapture(res.data);
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
