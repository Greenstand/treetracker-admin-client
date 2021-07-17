import { getOrganization } from '../api/apiUtils';
import Axios from 'axios';
import { session } from '../models/auth';
import FilterModel from '../models/Filter';

const captures = {
  state: {
    data: [],
    captureCount: null,
    selected: [],
    capture: {},
    numSelected: 0,
    page: 0,
    rowsPerPage: 25,
    order: 'asc',
    orderBy: 'id',
    allIds: [],
    byId: {},
    displayDrawer: {
      isOpen: false,
    },
    filter: new FilterModel(),
    totalCaptureCount: null,
    verifiedCaptureCount: null,
    unprocessedCaptureCount: null,
  },
  reducers: {
    selectAll(state) {
      return { ...state };
    },
    getCapture(state, capture) {
      return { ...state, capture };
    },
    getCaptures(state, payload, request) {
      return {
        ...state,
        data: payload,
        ...request,
      };
    },
    receiveCaptureCount(state, payload) {
      return { ...state, captureCount: payload };
    },
    receiveLocation(state, payload, { id, address }) {
      if (address === 'cached') {
        return state;
      } else {
        const byId = Object.assign({}, state.byId);
        if (byId[id] == null) byId[id] = {};
        byId[id].location = payload.address;
        return { ...state, byId };
      }
    },
    // TODO: not quite sure if we need to keep this. I'll leave it until merge
    receiveStatus(state, payload) {
      return { ...state, status: payload };
    },
    toggleDisplayDrawer(state) {
      return { displayDrawer: { isOpen: !state.isOpen } };
    },
    openDisplayDrawer() {
      return { displayDrawer: { isOpen: true } };
    },
    closeDisplayDrawer() {
      return { displayDrawer: { isOpen: false } };
    },
    setTotalCaptureCount(state, totalCaptureCount) {
      return {
        ...state,
        totalCaptureCount,
      };
    },
    setUnprocessedCaptureCount(state, unprocessedCaptureCount) {
      return {
        ...state,
        unprocessedCaptureCount,
      };
    },
    setVerifiedCaptureCount(state, verifiedCaptureCount) {
      return {
        ...state,
        verifiedCaptureCount,
      };
    },
  },
  effects: {
    queryCapturesApi({ id = null, count = false, paramString = null }) {
      const query = `${
        process.env.REACT_APP_API_ROOT
      }/api/${getOrganization()}trees${count ? '/count' : ''}${
        id != null ? '/' + id : ''
      }${paramString ? '?' + paramString : ''}`;

      return Axios.get(query, {
        headers: {
          'content-type': 'application/json',
          Authorization: session.token,
        },
      });
    },

    async getCapturesWithImagesAsync({
      page,
      rowsPerPage,
      orderBy = 'id',
      order = 'desc',
    }) {
      const paramString =
        `filter[order]=${orderBy} ${order}&filter[limit]=${rowsPerPage}&filter[skip]=${
          page * rowsPerPage
        }&filter[fields][imageUrl]=true&filter[fields][lat]=true&filter[fields][lon]=true` +
        `&filter[fields][id]=true&filter[fields][timeCreated]=true&filter[fields][timeUpdated]=true` +
        `&filter[where][active]=true&field[imageURL]`;

      this.queryCapturesApi({ paramString }).then((response) => {
        this.getCaptures(response.data, {
          page: page,
          rowsPerPage: rowsPerPage,
          orderBy: orderBy,
          order: order,
        });
      });
    },

    async getCaptureCount(payload, state) {
      // Destruct payload and fill in any gaps from rootState.captures
      const { filter } = { ...state.captures, ...payload };

      /*
       * first load the page count
       */

      const paramString = `where=${JSON.stringify(
        filter ? filter.getWhereObj() : {},
      )}`;
      const response = await this.queryCapturesApi({
        count: true,
        paramString,
      });
      const { count } = response.data;
      this.receiveCaptureCount(count);
    },

    async getCapturesAsync(payload, rootState) {
      // Destruct payload and fill in any gaps from rootState.captures
      const { page, rowsPerPage, filter, orderBy, order } = {
        ...rootState.captures,
        ...payload,
      };

      /*
       * first load the page count
       */
      if (!rootState.captureCount) {
        await this.getCaptureCount(payload, rootState);
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
    },
    async getCaptureAsync(id) {
      this.queryCapturesApi({ id })
        .then((res) => {
          this.getCapture(res.data);
        })
        .catch((err) =>
          console.error(`ERROR: FAILED TO GET SELECTED TREE ${err}`),
        );
    },
    async getLocationName(payload, rootState) {
      if (
        (rootState.captures.byId[payload.id] &&
          rootState.captures.byId[payload.id].location &&
          rootState.captures.byId[payload.id].location.lat !== payload.lat &&
          rootState.captures.byId[payload.id].location.lon !== payload.lon) ||
        !rootState.captures.byId[payload.id] ||
        !rootState.captures.byId[payload.id].location
      ) {
        const query = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${payload.latitude}&lon=${payload.longitude}`;
        Axios.get(query, {
          headers: {
            'content-type': 'application/json',
            Authorization: session.token,
          },
        }).then((response) => {
          this.receiveLocation(response.data, payload);
        });
      } else {
        this.receiveLocation(null, { id: payload.id, address: 'cached' });
      }
    },
    async getTotalCaptureCount() {
      const response = await this.queryCapturesApi({
        count: true,
        paramString: 'where[active]=true',
      });
      const { count } = response.data;
      this.setTotalCaptureCount(count);
    },
    async getUnprocessedCaptureCount() {
      const response = await this.queryCapturesApi({
        count: true,
        paramString: 'where[active]=true&where[approved]=false',
      });
      const { count } = response.data;
      this.setUnprocessedCaptureCount(count);
    },
    async getVerifiedCaptureCount() {
      const response = await this.queryCapturesApi({
        count: true,
        paramString: 'where[active]=true&where[approved]=true',
      });
      const { count } = response.data;
      this.setVerifiedCaptureCount(count);
    },
  },
};

export default captures;
