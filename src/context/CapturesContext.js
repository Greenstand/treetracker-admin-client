import React, { useContext, useState, useEffect, createContext } from 'react';
import FilterModel, { ALL_ORGANIZATIONS } from '../models/Filter';
import api from '../api/treeTrackerApi';
// import { captureStatus } from '../common/variables';
import { AppContext } from './AppContext.js';
import {
  setOrganizationFilter,
  handleQuerySearchParams,
} from '../common/utils';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../context/CapturesContext');

const DEFAULT_ROWS_PER_PAGE = 25;
const DEFAULT_PAGE = 0;
const DEFAULT_ORDER = 'desc';
const DEFAULT_ORDER_BY = 'created_at';

export const CapturesContext = createContext({
  isLoading: false,
  captures: [],
  captureCount: 0,
  capture: {},
  page: DEFAULT_PAGE,
  rowsPerPage: DEFAULT_ROWS_PER_PAGE,
  order: DEFAULT_ORDER,
  orderBy: DEFAULT_ORDER_BY,
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
  const { searchParams } = props;

  const {
    rowsPerPage: rowsPerPageParam = undefined,
    page: pageParam = undefined,
    order: orderParam = undefined,
    orderBy: orderByParam = undefined,
    ...filterParams
  } = Object.fromEntries(searchParams || []);

  const [captures, setCaptures] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const [capture, setCapture] = useState({});
  const [page, setPage] = useState(Number(pageParam) || DEFAULT_PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(
    Number(rowsPerPageParam) || DEFAULT_ROWS_PER_PAGE
  );
  const [order, setOrder] = useState(orderParam || DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(orderByParam || DEFAULT_ORDER_BY);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(
    FilterModel.fromSearchParams({
      organization_id: ALL_ORGANIZATIONS,
      ...filterParams,
    })
  );

  useEffect(() => {
    handleQuerySearchParams({
      rowsPerPage:
        rowsPerPage === DEFAULT_ROWS_PER_PAGE ? undefined : rowsPerPage,
      page: page === DEFAULT_PAGE ? undefined : page,
      order: order === DEFAULT_ORDER ? undefined : order,
      orderBy: orderBy === DEFAULT_ORDER_BY ? undefined : orderBy,
      ...filter.toSearchParams(),
    });

    const abortController = new AbortController();
    // orgId can be either null or an [] of uuids
    if (orgId !== undefined) {
      getCaptures({ signal: abortController.signal });
    }
    return () => abortController.abort();
  }, [filter, rowsPerPage, page, order, orderBy, orgId]);

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    const {
      rowsPerPage: rowsPerPageParam = undefined,
      page: pageParam = undefined,
      order: orderParam = undefined,
      orderBy: orderByParam = undefined,
      ...filterParams
    } = Object.fromEntries(searchParams);

    setFilter(FilterModel.fromSearchParams(filterParams));

    setPage(Number(pageParam) || DEFAULT_PAGE);
    setRowsPerPage(Number(rowsPerPageParam) || DEFAULT_ROWS_PER_PAGE);
    setOrder(orderParam || DEFAULT_ORDER);
    setOrderBy(orderByParam || DEFAULT_ORDER_BY);
  }, [searchParams]);

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
