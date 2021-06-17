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
  set: () => {},
  load: () => {},
  getCount: () => {},
  changePageSize: () => {},
  changeCurrentPage: () => {},
  getPlanter: () => {},
  updatePlanter: () => {},
  updateFilter: () => {},
  getTotalPlanterCount: () => {},
});

export function PlanterProvider(props) {
  const [state, setState] = useState({
    planters: [],
    pageSize: 24,
    count: null,
    currentPage: 0,
    filter: new FilterPlanter(),
    isLoading: false,
    totalPlanterCount: null,
  });

  // STATE HELPER FUNCTIONS

  const set = (obj) => {
    setState((prev) => ({
      ...prev,
      ...obj,
    }));
  };

  // EVENT HANDLERS

  const changePageSize = async (pageSize) => {
    set({ pageSize });
  };

  const changeCurrentPage = async (currentPage) => {
    set({ currentPage });
  };

  const load = async () => {
    log('load planters');
    set({ isLoading: true });
    const filter = state.filter;
    const pageNumber = state.currentPage;
    const planters = await api.getPlanters({
      skip: pageNumber * state.pageSize,
      rowsPerPage: state.pageSize,
      filter,
    });
    set({ planters, isLoading: false });
  };

  const getCount = async () => {
    const { count } = await api.getCount({
      filter: state.filter,
    });
    set({ count });
  };

  const getPlanter = async (payload) => {
    const { id } = payload;
    // Look for a match in the local state first
    let planter = state.planters.find((p) => p.id === id);
    if (!planter) {
      // Otherwise query the API
      planter = await api.getPlanter(id);
    }
    return planter;
  };

  const updatePlanter = async (payload) => {
    await api.updatePlanter(payload);
    const updatedPlanter = await api.getPlanter(payload.id);
    const index = state.planters.findIndex((p) => p.id === updatedPlanter.id);
    if (index >= 0) {
      const planters = Object.assign([], state.planters, {
        [index]: updatedPlanter,
      });
      set({ planters });
    }
  };

  const updateFilter = async (filter) => {
    set({ currentPage: 0 });
    set({ filter });
  };

  const getTotalPlanterCount = async () => {
    const { count } = await api.getCount({});
    set({ totalPlanterCount: count });
  };

  const value = {
    planters: state.planters,
    pageSize: state.pageSize,
    count: state.count,
    currentPage: state.currentPage,
    filter: state.filter,
    isLoading: state.isLoading,
    totalPlanterCount: state.totalPlanterCount,
    set,
    load,
    getCount,
    changePageSize,
    changeCurrentPage,
    getPlanter,
    updatePlanter,
    updateFilter,
    getTotalPlanterCount,
  };

  return (
    <PlanterContext.Provider value={value}>
      {props.children}
    </PlanterContext.Provider>
  );
}
