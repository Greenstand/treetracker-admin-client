import React, { useState, createContext } from 'react';
import axios from 'axios';
import { getOrganization } from '../api/apiUtils';
import { session } from '../models/auth';
import FilterModel from '../models/Filter';
// import * as loglevel from 'loglevel';

// const log = loglevel.getLogger('../context/CapturesContext');

export const CapturesContext = createContext({
  captures: [],
  captureCount: 0,
  selected: [],
  capture: {},
  numSelected: 0,
  page: 0,
  rowsPerPage: 25,
  order: 'asc',
  orderBy: 'id',
  allIds: [],
  byId: {},
  // displayDrawer: {
  //   isOpen: false,
  // },
  filter: new FilterModel(),
  // totalCaptureCount: null,
  // verifiedCaptureCount: null,
  // unprocessedCaptureCount: null,
  queryCapturesApi: () => {},
  // getCapturesWithImagesAsync: () => {},
  getCaptureCount: () => {},
  getCapturesAsync: () => {},
  getCaptureAsync: () => {},
  // getLocationName: () => {},
  // getTotalCaptureCount: () => {},
  // getUnprocessedCaptureCount: () => {},
  // getVerifiedCaptureCount: () => {},
});

export function CapturesProvider(props) {
  const [state, setState] = useState({
    captures: [],
    captureCount: 0,
    selected: [],
    capture: {},
    numSelected: 0,
    page: 0,
    rowsPerPage: 25,
    order: 'asc',
    orderBy: 'id',
    allIds: [],
    byId: {},
    filter: new FilterModel(),
    queryCapturesApi: () => {},
    getCaptureCount: () => {},
    getCapturesAsync: () => {},
    getCaptureAsync: () => {},
  });
  // const [captures, setCaptures] = useState([]);
  // const [captureCount, setCaptureCount] = useState(0);
  // const [selected, setSelected] = useState([]);
  // const [capture, setCapture] = useState({});
  // const [numSelected, setNumSelected] = useState(0);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(25);
  // const [order, setOrder] = useState('asc');
  // const [orderBy, setOrderBy] = useState('id');
  // const [allIds, setAllIds] = useState([]);
  // const [byId, setById] = useState({});
  // const [filter, setFilter] = useState(new FilterModel());
  // const [displayDrawer, setDisplayDrawer] = useState({
  //   isOpen: false,
  // })
  // const [totalCaptureCount, setTotalCaptureCount] = useState(null)
  // const [verifiedCaptureCount, setVerifiedCaptureCount] = useState(null)
  // const [unprocessedCaptureCount, setUnprocessedCaptureCount] = useState(null)

  // STATE HELPER FUNCTIONS

  // save capture to state after a successful request
  const setCapture = (capture) => {
    setState((prev) => ({ ...prev, capture }));
  };

  // save captures to state after a successful request
  const setCaptures = (captures, filterInfo) => {
    // console.log('capturesData, filterInfo', captures, filterInfo);
    setState((prev) => ({
      ...prev,
      captures,
      ...filterInfo,
    }));
  };

  const receiveCaptureCount = (payload) => {
    setState((prev) => ({ ...prev, captureCount: payload }));
  };

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

  // setTotalCaptureCount = (totalCaptureCount) => {
  //   setState({
  //     ...state,
  //     totalCaptureCount,
  //   });
  // };

  // setUnprocessedCaptureCount = (unprocessedCaptureCount) => {
  //   setState({
  //     ...state,
  //     unprocessedCaptureCount,
  //   });
  // };

  // setVerifiedCaptureCount = (verifiedCaptureCount) => {
  //   setState({
  //     ...state,
  //     verifiedCaptureCount,
  //   });
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

  // getCapturesWithImagesAsync = async ({
  //   page,
  //   rowsPerPage,
  //   orderBy = 'id',
  //   order = 'desc',
  // }) => {
  //   const paramString =
  //     `filter[order]=${orderBy} ${order}&filter[limit]=${rowsPerPage}&filter[skip]=${
  //       page * rowsPerPage
  //     }&filter[fields][imageUrl]=true&filter[fields][lat]=true&filter[fields][lon]=true` +
  //     `&filter[fields][id]=true&filter[fields][timeCreated]=true&filter[fields][timeUpdated]=true` +
  //     `&filter[where][active]=true&field[imageURL]`;

  //   queryCapturesApi({ paramString }).then((response) => {
  //     getCaptures(response.data, {
  //       page: page,
  //       rowsPerPage: rowsPerPage,
  //       orderBy: orderBy,
  //       order: order,
  //     });
  //   });
  // };

  const getCaptureCount = async (payload) => {
    // Destruct payload and fill in any gaps from state
    const { filter } = { ...state, ...payload };
    // first load the page count
    const paramString = `where=${JSON.stringify(
      filter ? filter.getWhereObj() : {},
    )}`;
    const response = await queryCapturesApi({
      count: true,
      paramString,
    });
    const { count } = response.data;
    receiveCaptureCount(count);
  };

  const getCapturesAsync = async (filterInfo) => {
    // Destruct payload and fill in any gaps from captures
    const { page, rowsPerPage, filter, orderBy, order } = {
      ...state,
      ...filterInfo,
    };
    // first load the page count
    if (!state.captureCount) {
      getCaptureCount(filterInfo);
    }

    const where = filter ? filter.getWhereObj() : {};

    const lbFilter = {
      where: { ...where, active: true },
      order: [`${orderBy} ${order}`],
      limit: rowsPerPage,
      skip: page * rowsPerPage,
      fields: {
        id: true,
        timeCreated: true,
        status: true,
        approved: true,
        planterId: true,
        treeTags: true,
      },
    };

    const paramString = `filter=${JSON.stringify(lbFilter)}`;
    const response = await queryCapturesApi({ paramString });
    setCaptures(response.data, {
      page,
      rowsPerPage,
      orderBy,
      order,
      filter,
    });
  };

  const getCaptureAsync = async (id) => {
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

  // getTotalCaptureCount = async () => {
  //   const response = await queryCapturesApi({
  //     count: true,
  //     paramString: 'where[active]=true',
  //   });
  //   const { count } = response.data;
  //   setTotalCaptureCount(count);
  // };

  // getUnprocessedCaptureCount = async () => {
  //   const response = await queryCapturesApi({
  //     count: true,
  //     paramString: 'where[active]=true&where[approved]=false',
  //   });
  //   const { count } = response.data;
  //   setUnprocessedCaptureCount(count);
  // };

  // getVerifiedCaptureCount = async () => {
  //   const response = await queryCapturesApi({
  //     count: true,
  //     paramString: 'where[active]=true&where[approved]=true',
  //   });
  //   const { count } = response.data;
  //   setVerifiedCaptureCount(count);
  // };

  // const updateFilter = async (filter = state.filter) => {
  //   getCapturesAsync({
  //     page: 0,
  //     filter,
  //   });
  // };

  const value = {
    captures: state.captures,
    captureCount: state.captureCount,
    selected: state.selected,
    capture: state.capture,
    numSelected: state.numSelected,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    order: state.order,
    orderBy: state.orderBy,
    allIds: state.allIds,
    byId: state.byId,
    // displayDrawer: state.displayDrawer: state.// displayDrawer: state.displayDrawer,
    filter: state.filter,
    // totalCaptureCount: state.totalCaptureCount,
    // verifiedCaptureCount: state.verifiedCaptureCount,
    // unprocessedCaptureCount: state.unprocessedCaptureCount,
    queryCapturesApi,
    // getCapturesWithImagesAsync: getCapturesWithImagesAsync,
    getCaptureCount,
    getCapturesAsync,
    getCaptureAsync,
    // getLocationName: getLocationName,
    // getTotalCaptureCount: getTotalCaptureCount,
    // getUnprocessedCaptureCount: getUnprocessedCaptureCount,
    // getVerifiedCaptureCount: getVerifiedCaptureCount,
  };

  return (
    <CapturesContext.Provider value={value}>
      {props.children}
    </CapturesContext.Provider>
  );
}
