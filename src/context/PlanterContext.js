import React, { useState, createContext } from 'react';
import FilterPlanter from '../models/FilterPlanter';
import api from '../api/planters';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/PlanterContext');

export const PlanterContext = createContext({
  planters: [],
  pageSize: 24,
  count: null,
  currentPage: 0,
  filter: new FilterPlanter(),
  isLoading: false,
  totalPlanterCount: null,
  load: () => {},
  getCount: () => {},
  changePageSize: () => {},
  changeCurrentPage: () => {},
  getPlanter: () => {},
  updatePlanter: () => {},
  updatePlanters: () => {},
  updateFilter: () => {},
  getTotalPlanterCount: () => {},
});

export function PlanterProvider(props) {
  const [planters, setPlanters] = useState([]);
  const [pageSize, setPageSize] = useState(24);
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState(new FilterPlanter());
  const [isLoading, setIsLoading] = useState(false);
  const [totalPlanterCount, setTotalPlanterCount] = useState(null);

  // EVENT HANDLERS

  const changePageSize = async (pageSize) => {
    setPageSize(pageSize);
  };

  const changeCurrentPage = async (currentPage) => {
    setCurrentPage(currentPage);
  };

  const updatePlanters = (planters) => {
    setPlanters(planters);
  };

  const load = async () => {
    log.debug('load planters');
    setIsLoading(true);
    const pageNumber = currentPage;
    const planters = await api.getPlanters({
      skip: pageNumber * pageSize,
      rowsPerPage: pageSize,
      filter,
    });
    setPlanters(planters);
    setIsLoading(false);
  };

  const getCount = async () => {
    const { count } = await api.getCount({ filter });
    setCount(Number(count));
  };

  const getPlanter = async (payload) => {
    const { id } = payload;
    // Look for a match in the local state first
    let planter = planters.find((p) => p.id === id);
    if (!planter) {
      // Otherwise query the API
      planter = await api.getPlanter(id);
    }
    return planter;
  };

  const updatePlanter = async (payload) => {
    await api.updatePlanter(payload);
    const updatedPlanter = await api.getPlanter(payload.id);
    const index = planters.findIndex((p) => p.id === updatedPlanter.id);
    if (index >= 0) {
      const planters = Object.assign([], planters, {
        [index]: updatedPlanter,
      });
      setPlanters(planters);
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
    planters,
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
    <PlanterContext.Provider value={value}>
      {props.children}
    </PlanterContext.Provider>
  );
}
