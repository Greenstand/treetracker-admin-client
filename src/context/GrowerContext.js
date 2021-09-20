import React, { useState, createContext } from 'react';
import FilterGrower from '../models/FilterGrower';
import api from '../api/growers';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/GrowerContext');

export const GrowerContext = createContext({
  growers: [],
  pageSize: 24,
  count: null,
  currentPage: 0,
  filter: new FilterGrower(),
  isLoading: false,
  totalPlanterCount: null,
  load: () => {},
  getCount: () => {},
  changePageSize: () => {},
  changeCurrentPage: () => {},
  getGrower: () => {},
  updateGrower: () => {},
  updateGrowers: () => {},
  updateFilter: () => {},
  getTotalGrowerCount: () => {},
});

export function GrowerProvider(props) {
  const [growers, setGrowers] = useState([]);
  const [pageSize, setPageSize] = useState(24);
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState(new FilterGrower());
  const [isLoading, setIsLoading] = useState(false);
  const [totalPlanterCount, setTotalPlanterCount] = useState(null);

  // EVENT HANDLERS

  const changePageSize = async (pageSize) => {
    setPageSize(pageSize);
  };

  const changeCurrentPage = async (currentPage) => {
    setCurrentPage(currentPage);
  };

  const updatePlanters = (growers) => {
    setGrowers(growers);
  };

  const load = async () => {
    log.debug('load growers');
    setIsLoading(true);
    const pageNumber = currentPage;
    const growers = await api.getPlanters({
      skip: pageNumber * pageSize,
      rowsPerPage: pageSize,
      filter,
    });
    setGrowers(growers);
    setIsLoading(false);
  };

  const getCount = async () => {
    const { count } = await api.getCount({ filter });
    setCount(count);
  };

  const getPlanter = async (payload) => {
    const { id } = payload;
    // Look for a match in the local state first
    let planter = growers.find((p) => p.id === id);
    if (!planter) {
      // Otherwise query the API
      planter = await api.getPlanter(id);
    }
    return planter;
  };

  const updatePlanter = async (payload) => {
    await api.updatePlanter(payload);
    const updatedPlanter = await api.getPlanter(payload.id);
    const index = growers.findIndex((p) => p.id === updatedPlanter.id);
    if (index >= 0) {
      const growers = Object.assign([], growers, {
        [index]: updatedPlanter,
      });
      setGrowers(growers);
    }
  };

  const updateFilter = async (filter) => {
    setCurrentPage(0);
    setFilter(filter);
  };

  const getTotalPlanterCount = async () => {
    const { count } = await api.getCount({});
    setTotalPlanterCount(count);
  };

  const value = {
    growers,
    pageSize,
    count,
    currentPage,
    filter,
    isLoading,
    totalPlanterCount,
    load,
    getCount,
    changePageSize,
    changeCurrentPage,
    getPlanter,
    updatePlanter,
    updatePlanters,
    updateFilter,
    getTotalPlanterCount,
  };

  return (
    <GrowerContext.Provider value={value}>
      {props.children}
    </GrowerContext.Provider>
  );
}
