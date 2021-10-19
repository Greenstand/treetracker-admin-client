import React, { useState, createContext } from 'react';
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
  // byId: {},
  filter: new FilterModel(),
  queryCapturesApi: () => {},
  getCaptureCount: () => {},
  getCapturesAsync: () => {},
  getCaptureAsync: () => {},
  // getLocationName: () => {},
});

export function CapturesProvider(props) {
  log.debug('render: captures');
  // const [state, setState] = useState({
  //   captures: [],
  //   captureCount: 0,
  //   capture: {},
  //   page: 0,
  //   rowsPerPage: 25,
  //   order: 'asc',
  //   orderBy: 'id',
  //   byId: {},
  //   filter: new FilterModel(),
  // });
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

  // toggleDisplayDrawer = () => {
  //   setState({
  //     ...state,
  //     displayDrawer: { isOpen: !state.isOpen },
  //   });
  // };

  // openDisplayDrawer = () => {
  //   setState({ ...state, displayDrawer: { isOpen: true } });
  // };

  // closeDisplayDrawer = () => {
  //   setState({ ...state, displayDrawer: { isOpen: false } });
  // };

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

    // console.log('queryCapturesApi', query, session);

    return axios.get(query, {
      headers: {
        'content-type': 'application/json',
        Authorization: session.token,
      },
    });
  };

  const getCaptureCount = async (payload) => {
    log.debug('load capture count');
    // Destruct payload and fill in any gaps from state
    // const { filter } = { ...state, ...payload };
    const filter = payload.filter ? payload.filter : filter;
    // first load the page count
    const paramString = `where=${JSON.stringify(
      filter ? filter.getWhereObj() : {},
    )}`;
    const response = await queryCapturesApi({
      count: true,
      paramString,
    });
    // console.log('get capture count', response);
    const { count } = response.data;
    // receiveCaptureCount(count);
    // setState((prev) => ({ ...prev, captureCount: count }));
    setCaptureCount(Number(count));
  };

  const getCapturesAsync = async (filterInfo = {}) => {
    log.debug('load captures');
    console.log('captures filterInfo -- ', filterInfo);
    // Destruct payload and fill in any gaps from captures
    // const { page, rowsPerPage, filter, orderBy, order } = {
    //   ...state,
    //   ...filterInfo,
    // };

    // WHY ISN'T THIS READING THE STATE as HOOKS?
    console.log(
      'captures state -- ',
      captures,
      captureCount,
      capture,
      page,
      rowsPerPage,
      orderBy,
      order,
      filter,
    );

    // if filterInfo contains new values override the defaults in state hooks
    const {
      page = 0,
      rowsPerPage = 25,
      filter = new FilterModel(),
      orderBy = 'id',
      order = 'asc',
    } = filterInfo;

    // first load the page count
    getCaptureCount(filterInfo);

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
      },
    };

    const paramString = `filter=${JSON.stringify(lbFilter)}`;
    const response = await queryCapturesApi({ paramString });
    // console.log('get captures async filter', filter);
    // setState((prev) => ({
    //   ...prev,
    //   captures: response.data,
    //   page,
    //   rowsPerPage,
    //   orderBy,
    //   order,
    //   filter,
    // }));
    setCaptures(response.data);
    setPage(page);
    setRowsPerPage(rowsPerPage);
    setOrderBy(orderBy);
    setOrder(order);
    setFilter(filter);
  };

  const getCaptureAsync = async (id) => {
    queryCapturesApi({ id })
      .then((res) => {
        // setState((prev) => ({ ...prev, capture: res.data }));
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

  // const updateFilter = async (filter = state.filter) => {
  //   getCapturesAsync({
  //     page: 0,
  //     filter,
  //   });
  // };

  const value = {
    captures,
    captureCount,
    capture,
    page,
    rowsPerPage,
    order,
    orderBy,
    // byId,
    filter,
    queryCapturesApi,
    getCaptureCount,
    getCapturesAsync,
    getCaptureAsync,
    // getLocationName,
  };

  return (
    <CapturesContext.Provider value={value}>
      {props.children}
    </CapturesContext.Provider>
  );
}
