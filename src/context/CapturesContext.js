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
  order: 'asc',
  orderBy: 'id',
  filter: new FilterModel(),
  setRowsPerPage: () => {},
  setPage: () => {},
  setOrder: () => {},
  setOrderBy: () => {},
  queryCapturesApi: () => {},
  getCaptureCount: () => {},
  getCapturesAsync: () => {},
  getCaptureAsync: () => {},
  getAllCaptures: () => {},
  updateFilter: () => {},
  // getLocationName: () => {},
});

export function CapturesProvider(props) {
  // log.debug('render: captures');
  const [captures, setCaptures] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const [capture, setCapture] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  // const [byId, setById] = useState({});
  const [filter, setFilter] = useState(
    new FilterModel({
      approved: true,
      active: true,
    }),
  );

  useEffect(() => {
    getCapturesAsync();
    getCaptureCount();
  }, [filter, rowsPerPage, page, order, orderBy]);

  // STATE HELPER FUNCTIONS

  // receiveLocation = (payload, { id, address }) => {
  //   if (address === 'cached') {
  //     return state;
  //   } else {
  //     const byId = Object.assign({}, state.byId);
  //     if (byId[id] == null) byId[id] = {};
  //     byId[id].location = payload.address;
  //     setState({ ...state, byId });
  //   }
  // };

  // receiveStatus = (payload) => {
  //   setState((prev) => ({ ...prev, status: payload }));
  // };

  // EVENT HANDLERS

  const queryCapturesApi = ({ id = null, count = false, paramString = null }) =>
    // abortController,
    {
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}trees${count ? '/count' : ''}${
        id != null ? '/' + id : ''
      }${paramString ? '?' + paramString : ''}`;

      // log.debug('queryCapturesApi', query, session);

      return axios.get(query, {
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
        // signal: abortController?.signal,
      });
    };

  const getCaptureCount = async () => {
    log.debug('load capture count');
    const paramString = `where=${JSON.stringify(
      filter ? filter.getWhereObj() : {},
    )}`;
    const response = await queryCapturesApi({
      count: true,
      paramString,
    });
    const { count } = response.data;

    setCaptureCount(Number(count));
  };

  const getCapturesAsync = async () => {
    // log.debug('4 - load captures');
    const where = filter ? filter.getWhereObj() : {};

    const lbFilter = {
      where: { ...where },
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      skip: page * rowsPerPage,
      fields: {
        id: true,
        timeCreated: true,
        status: true,
        active: true,
        approved: true,
        planterId: true,
        planterIdentifier: true,
        deviceIdentifier: true,
        speciesId: true,
        tokenId: true,
        age: true,
        morphology: true,
        captureApprovalTag: true,
        rejectionReason: true,
      },
    };

    const paramString = `filter=${JSON.stringify(lbFilter)}`;
    const response = await queryCapturesApi({ paramString });
    setCaptures(response.data);
  };

  const getAllCaptures = async (filterInfo = {}) => {
    log.debug('load all captures');
    console.log('captures filterInfo -- ', filterInfo);

    // if filterInfo contains new values override the defaults in state hooks
    const { filter = new FilterModel() } = filterInfo;

    const where = filter ? filter.getWhereObj() : {};

    const lbFilter = {
      where: { ...where },
      order: [`${orderBy} ${order}`],
      limit: 20000,
      fields: {
        id: true,
        timeCreated: true,
        status: true,
        active: true,
        approved: true,
        planterId: true,
        planterIdentifier: true,
        deviceIdentifier: true,
        speciesId: true,
        tokenId: true,
        age: true,
        morphology: true,
        captureApprovalTag: true,
        rejectionReason: true,
      },
    };

    const paramString = `filter=${JSON.stringify(lbFilter)}`;
    const response = await queryCapturesApi({ paramString });
    return response;
  };

  const getCaptureAsync = (id) => {
    queryCapturesApi({ id })
      .then((res) => {
        setCapture(res.data);
      })
      .catch((err) =>
        console.error(`ERROR: FAILED TO GET SELECTED TREE ${err}`),
      );
  };

  // getLocationName = async (payload, rootState) => {
  //   if (
  //     (rootState.captures.byId[payload.id] &&
  //       rootState.captures.byId[payload.id].location &&
  //       rootState.captures.byId[payload.id].location.lat !== payload.lat &&
  //       rootState.captures.byId[payload.id].location.lon !== payload.lon) ||
  //     !rootState.captures.byId[payload.id] ||
  //     !rootState.captures.byId[payload.id].location
  //   ) {
  //     const query = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${payload.latitude}&lon=${payload.longitude}`;
  //     axios
  //       .get(query, {
  //         headers: {
  //           'content-type': 'application/json',
  //           Authorization: session.token,
  //         },
  //       })
  //       .then((response) => {
  //         receiveLocation(response.data, payload);
  //       });
  //   } else {
  //     receiveLocation(null, { id: payload.id, address: 'cached' });
  //   }
  // };

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
    getAllCaptures,
    updateFilter,
    // getLocationName,
  };

  return (
    <CapturesContext.Provider value={value}>
      {props.children}
    </CapturesContext.Provider>
  );
}
