import React, { useContext, useState, useEffect, createContext } from 'react';
import { AppContext } from './AppContext.js';
import FilterGrower, { ALL_ORGANIZATIONS } from 'models/FilterGrower';
import api from 'api/growers';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('context/GrowerContext');

export const GrowerContext = createContext({
  growers: [],
  pageSize: 24,
  count: null,
  currentPage: 0,
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
  const [growers, setGrowers] = useState([]);
  const [pageSize, setPageSize] = useState(24);
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState(new FilterGrower());
  const [isLoading, setIsLoading] = useState(false);
  const [totalGrowerCount, setTotalGrowerCount] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    if (orgId !== undefined) {
      load({ signal: abortController.signal });
      // getCount();
    }
    return () => abortController.abort();
  }, [filter, pageSize, currentPage, orgId]);

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

    if (!filter.organizationId && orgId === null) {
      filter.organizationId = null;
    } else if (
      //handle organization_id query to query all uuids for logged in org by default
      filter.organizationId === ALL_ORGANIZATIONS ||
      (!filter.organizationId && orgId)
    ) {
      // prevent it from being assigned an empty array
      if (orgList.length && orgId !== null) {
        filter.organizationId = orgList.map((org) => org.stakeholder_uuid);
      } else {
        filter.organizationId = orgId;
      }
    }

    // log.debug('load growers', filter);

    const { total, grower_accounts } = await api.getGrowers(
      {
        skip: pageNumber * pageSize,
        rowsPerPage: pageSize,
        filter,
      },
      abortController
    );
    setCount(total);
    setGrowers(grower_accounts);
    setIsLoading(false);
  };

  const getCount = async () => {
    if (!filter.organizationId && orgId === null) {
      filter.organizationId = null;
    } else if (
      //handle organization_id query to query all uuids for logged in org by default
      filter.organizationId === ALL_ORGANIZATIONS ||
      (!filter.organizationId && orgId)
    ) {
      // prevent it from being assigned an empty array
      if (orgList.length && orgId !== null) {
        filter.organizationId = orgList.map((org) => org.stakeholder_uuid);
      } else {
        filter.organizationId = orgId;
      }
    }

    log.debug('load grower count', filter);

    const { count } = await api.getCount({ filter });
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
