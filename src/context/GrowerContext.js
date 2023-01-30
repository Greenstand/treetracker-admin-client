import React, { useContext, useState, useEffect, createContext } from 'react';
import { AppContext } from './AppContext.js';
import FilterGrower, { ALL_ORGANIZATIONS } from 'models/FilterGrower';
import api from 'api/growers';
import { setOrganizationFilter, handleQuerySearchParams } from '../common/utils';
import * as loglevel from 'loglevel';
import { useLocation } from 'react-router-dom';

const log = loglevel.getLogger('context/GrowerContext');

const DEFAULT_PAGE_SIZE = 24;
const DEFAULT_CURRENT_PAGE = 0;

export const GrowerContext = createContext({
  growers: [],
  pageSize: DEFAULT_PAGE_SIZE,
  count: null,
  currentPage: DEFAULT_CURRENT_PAGE,
  filter: new FilterGrower(),
  isLoading: false,
  totalGrowerCount: null,
  load: () => {},
  getCount: () => {},
  changePageSize: () => {},
  changeCurrentPage: () => {},
  getGrower: () => {},
  updateGrower: () => {},
  updateGrowers: () => {},
  updateFilter: () => {},
  getTotalGrowerCount: () => {},
  getGrowerSelfies: () => {},
});

export function GrowerProvider(props) {
  const { orgId, orgList } = useContext(AppContext);
  const { searchParams } = props;

  const {
    pageSize: pageSizeParam = undefined,
    currentPage: currentPageParam = undefined,
    ...filterParams
  } = Object.fromEntries(searchParams);

  const [growers, setGrowers] = useState([]);
  const [pageSize, setPageSize] = useState(
    Number(pageSizeParam) || DEFAULT_PAGE_SIZE
  );
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    Number(currentPageParam) || DEFAULT_CURRENT_PAGE
  );
  const [filter, setFilter] = useState(
    FilterGrower.fromSearchParams({
      organization_id: ALL_ORGANIZATIONS,
      ...filterParams
    })
  );
  const [isLoading, setIsLoading] = useState(false);
  const [totalGrowerCount, setTotalGrowerCount] = useState(null);
  const location = useLocation();

  useEffect(() => {
    handleQuerySearchParams({
      pageSize,
      currentPage,
      ...filter.toSearchParams(),
    });

    const abortController = new AbortController();
    if (orgId !== undefined) {
      load({ signal: abortController.signal });
      // getCount({ signal: abortController.signal });
    }
    return () => abortController.abort();
  }, [filter, pageSize, currentPage, orgId]);

  useEffect(() => {
    const {
      pageSize: pageSizeParam = undefined,
      currentPage: currentPageParam = undefined,
      ...filterParams
    } = Object.fromEntries(searchParams);
    setFilter(FilterGrower.fromSearchParams(filterParams));
    setPageSize(Number(pageSizeParam) || DEFAULT_PAGE_SIZE);
    setCurrentPage(Number(currentPageParam) || DEFAULT_CURRENT_PAGE);
  }, [searchParams, location]);

  // EVENT HANDLERS

  const changePageSize = async (pageSize) => {
    setPageSize(pageSize);
  };

  const changeCurrentPage = async (currentPage) => {
    setCurrentPage(currentPage);
  };

  const updateGrowers = (growers) => {
    setGrowers(growers);
  };

  const load = async (abortController) => {
    log.debug('load growers');
    setIsLoading(true);
    const pageNumber = currentPage;

    //set correct values for organization_id, an array of uuids for ALL_ORGANIZATIONS or a uuid string if provided
    const finalFilter = setOrganizationFilter(
      filter.getWhereObj(),
      orgId,
      orgList
    );

    log.debug('load growers');

    const { total, grower_accounts } = await api.getGrowers(
      {
        skip: pageNumber * pageSize,
        rowsPerPage: pageSize,
        filter: new FilterGrower(finalFilter),
      },
      abortController
    );
    setCount(total);
    setGrowers(grower_accounts);
    setIsLoading(false);
  };

  const getCount = async (abortController) => {
    //set correct values for organization_id, an array of uuids for ALL_ORGANIZATIONS or a uuid string if provided
    const finalFilter = setOrganizationFilter(
      filter.getWhereObj(),
      orgId,
      orgList
    );

    log.debug('load grower count', filter);

    const { count } = await api.getCount({
      filter: new FilterGrower(finalFilter),
      abortController
    });
    setCount(Number(count));
  };

  const getGrower = async (payload) => {
    const { id } = payload;
    // Look for a match in the local state first
    let grower = growers.find((p) => p.id === id);
    if (!grower) {
      // Otherwise query the API
      grower = await api.getGrower(id);
    }
    return grower;
  };

  const updateGrower = async (payload) => {
    if (payload.organizationId === 'ORGANIZATION_NOT_SET') {
      payload.organizationId = null;
    }
    await api.updateGrower(payload);
    const updatedGrower = await api.getGrower(payload.id);
    const index = growers.findIndex((p) => p.id === updatedGrower.id);
    if (index >= 0) {
      const newGrowers = [...growers];
      newGrowers[index] = updatedGrower;
      setGrowers(newGrowers);
    }
  };

  const updateFilter = async (filter) => {
    setCurrentPage(0);
    setFilter(filter);
  };

  const getTotalGrowerCount = async () => {
    const { count } = await api.getCount({});
    setTotalGrowerCount(count);
  };

  const getGrowerSelfies = async (growerId) => {
    return await api.getGrowerSelfies(growerId);
  };

  const value = {
    growers,
    pageSize,
    count,
    currentPage,
    filter,
    isLoading,
    totalGrowerCount,
    load,
    getCount,
    changePageSize,
    changeCurrentPage,
    getGrower,
    updateGrower,
    updateGrowers,
    updateFilter,
    getTotalGrowerCount,
    getGrowerSelfies,
  };

  return (
    <GrowerContext.Provider value={value}>
      {props.children}
    </GrowerContext.Provider>
  );
}
