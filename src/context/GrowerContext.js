import React, { useState, useEffect, createContext } from 'react';
import FilterGrower from 'models/FilterGrower';
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
  const [growers, setGrowers] = useState([]);
  const [pageSize, setPageSize] = useState(24);
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState(new FilterGrower());
  const [isLoading, setIsLoading] = useState(false);
  const [totalGrowerCount, setTotalGrowerCount] = useState(null);

  useEffect(() => {
    load();
    getCount();
  }, [filter, pageSize, currentPage]);

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

  const load = async () => {
    log.debug('load growers');
    setIsLoading(true);
    const pageNumber = currentPage;
    const { total, grower_accounts } = await api.getGrowers({
      skip: pageNumber * pageSize,
      rowsPerPage: pageSize,
      filter,
    });
    setCount(total);
    setGrowers(grower_accounts);
    setIsLoading(false);
  };

  const getCount = async () => {
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
