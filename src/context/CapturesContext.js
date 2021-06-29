import React, { Component, createContext } from 'react';
import axios from 'axios';
// import * as loglevel from 'loglevel';
// import api from '../api/treeTrackerApi';
import { getOrganization } from '../api/apiUtils';
import { session } from '../models/auth';
import FilterModel from '../models/Filter';

// const log = loglevel.getLogger('../context/CapturesContext');

const CaptureContext = createContext({
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

export default CaptureContext;

export class CapturesProvider extends Component {
  // export const CaptureProvider = (props) => {
  state = {
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
  };

  // TEST MOVING TO HOOKS -- CLASS IS EASIER FOR NOW
  // const [captures, setCaptures] = useState([]);
  // const [captureCount, setCaptureCount]  = useState (null);
  // const [selected, setSelected]  = useState([]);
  // const [capture, setCapture] = useState({})
  // const [numSelected, setNumSelected] = useState(0)
  // const [page, setPage] = useState(0)
  // const [rowsPerPage, setRowsPerPage] = useState(25)
  // const [order, setOrder] = useState('asc')
  // const [orderBy, setOrderBy] = useState('id')
  // const [allIds, setAllIds] = useState([])
  // const [byId, setById] = useState({})
  // const [displayDrawer, setDisplayDrawer] = useState({
  //   isOpen: false,
  // })
  // const [filter, setFilter] = useState(new FilterModel())
  // const [totalCaptureCount, setTotalCaptureCount] = useState(null)
  // const [verifiedCaptureCount, setVerifiedCaptureCount] = useState(null)
  // const [unprocessedCaptureCount, setUnprocessedCaptureCount] = useState(null)

  // STATE HELPER FUNCTIONS

  // selectAll = () => {
  //   this.setState({ ...this.state });
  // };

  // save capture to state after a successful request

  getCapture = (capture) => {
    this.setState((prev) => ({ ...prev, capture }));
  };

  // save captures to state after a successful request
  getCaptures = (captures, filterInfo) => {
    // console.log('capturesData, filterInfo', captures, filterInfo);
    this.setState((prev) => ({
      ...prev,
      captures,
      ...filterInfo,
    }));
  };

  receiveCaptureCount = (payload) => {
    this.setState((prev) => ({ ...prev, captureCount: payload }));
  };

  // receiveLocation = (payload, { id, address }) => {
  //   if (address === 'cached') {
  //     return this.state;
  //   } else {
  //     const byId = Object.assign({}, this.state.byId);
  //     if (byId[id] == null) byId[id] = {};
  //     byId[id].location = payload.address;
  //     this.setState({ ...this.state, byId });
  //   }
  // };

  // receiveStatus = (payload) => {
  //   this.setState((prev) => ({ ...prev, status: payload }));
  // };

  // toggleDisplayDrawer = () => {
  //   this.setState({
  //     ...this.state,
  //     displayDrawer: { isOpen: !this.state.isOpen },
  //   });
  // };

  // openDisplayDrawer = () => {
  //   this.setState({ ...this.state, displayDrawer: { isOpen: true } });
  // };

  // closeDisplayDrawer = () => {
  //   this.setState({ ...this.state, displayDrawer: { isOpen: false } });
  // };

  // setTotalCaptureCount = (totalCaptureCount) => {
  //   this.setState({
  //     ...this.state,
  //     totalCaptureCount,
  //   });
  // };

  // setUnprocessedCaptureCount = (unprocessedCaptureCount) => {
  //   this.setState({
  //     ...this.state,
  //     unprocessedCaptureCount,
  //   });
  // };

  // setVerifiedCaptureCount = (verifiedCaptureCount) => {
  //   this.setState({
  //     ...this.state,
  //     verifiedCaptureCount,
  //   });
  // };

  // EVENT HANDLERS

  queryCapturesApi = ({ id = null, count = false, paramString = null }) => {
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

  //   this.queryCapturesApi({ paramString }).then((response) => {
  //     this.getCaptures(response.data, {
  //       page: page,
  //       rowsPerPage: rowsPerPage,
  //       orderBy: orderBy,
  //       order: order,
  //     });
  //   });
  // };

  getCaptureCount = async (payload) => {
    // Destruct payload and fill in any gaps from state.captures
    const { filter } = { ...this.state, ...payload };
    // first load the page count
    const paramString = `where=${JSON.stringify(
      filter ? filter.getWhereObj() : {},
    )}`;
    const response = await this.queryCapturesApi({
      count: true,
      paramString,
    });
    const { count } = response.data;
    this.receiveCaptureCount(count);
  };

  getCapturesAsync = async (filterInfo) => {
    // Destruct payload and fill in any gaps from state.captures
    const { page, rowsPerPage, filter, orderBy, order } = {
      ...this.state,
      ...filterInfo,
    };
    // first load the page count
    if (!this.state.captureCount) {
      this.getCaptureCount(filterInfo);
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
    const response = await this.queryCapturesApi({ paramString });
    this.getCaptures(response.data, {
      page,
      rowsPerPage,
      orderBy,
      order,
      filter,
    });
  };

  getCaptureAsync = async (id) => {
    this.queryCapturesApi({ id })
      .then((res) => {
        this.getCapture(res.data);
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
  //         this.receiveLocation(response.data, payload);
  //       });
  //   } else {
  //     this.receiveLocation(null, { id: payload.id, address: 'cached' });
  //   }
  // };

  // getTotalCaptureCount = async () => {
  //   const response = await this.queryCapturesApi({
  //     count: true,
  //     paramString: 'where[active]=true',
  //   });
  //   const { count } = response.data;
  //   this.setTotalCaptureCount(count);
  // };

  // getUnprocessedCaptureCount = async () => {
  //   const response = await this.queryCapturesApi({
  //     count: true,
  //     paramString: 'where[active]=true&where[approved]=false',
  //   });
  //   const { count } = response.data;
  //   this.setUnprocessedCaptureCount(count);
  // };

  // getVerifiedCaptureCount = async () => {
  //   const response = await this.queryCapturesApi({
  //     count: true,
  //     paramString: 'where[active]=true&where[approved]=true',
  //   });
  //   const { count } = response.data;
  //   this.setVerifiedCaptureCount(count);
  // };

  updateFilter = async (filter = this.state.filter) => {
    this.getCapturesAsync({
      page: 0,
      filter,
    });
  };

  render() {
    const value = {
      captures: this.state.captures,
      captureCount: this.state.captureCount,
      selected: this.state.selected,
      capture: this.state.capture,
      numSelected: this.state.numSelected,
      page: this.state.page,
      rowsPerPage: this.state.rowsPerPage,
      order: this.state.order,
      orderBy: this.state.orderBy,
      allIds: this.state.allIds,
      byId: this.state.byId,
      // displayDrawer: this.state.displayDrawer,
      filter: this.state.filter,
      // totalCaptureCount: this.state.totalCaptureCount,
      // verifiedCaptureCount: this.state.verifiedCaptureCount,
      // unprocessedCaptureCount: this.state.unprocessedCaptureCount,
      queryCapturesApi: this.queryCapturesApi,
      // getCapturesWithImagesAsync: this.getCapturesWithImagesAsync,
      getCaptureCount: this.getCaptureCount,
      getCapturesAsync: this.getCapturesAsync,
      getCaptureAsync: this.getCaptureAsync,
      // getLocationName: this.getLocationName,
      // getTotalCaptureCount: this.getTotalCaptureCount,
      // getUnprocessedCaptureCount: this.getUnprocessedCaptureCount,
      // getVerifiedCaptureCount: this.getVerifiedCaptureCount,
    };
    return (
      <CaptureContext.Provider value={value}>
        {this.props.children}
      </CaptureContext.Provider>
    );
  }
}
