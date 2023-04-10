import React, { useContext, useState, useEffect, createContext } from 'react';
import { AppContext } from './AppContext.js';
import FilterGrower, { ALL_ORGANIZATIONS } from 'models/FilterGrower';
import api from 'api/growers';
import { setOrganizationFilter } from '../common/utils';
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
  getWallets: () => {},
});

export function GrowerProvider(props) {
  const { orgId, orgList } = useContext(AppContext);
  const [growers, setGrowers] = useState([]);
  const [pageSize, setPageSize] = useState(24);
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState(
    new FilterGrower({ organization_id: ALL_ORGANIZATIONS })
  );
  const [isLoading, setIsLoading] = useState(false);
  const [totalGrowerCount, setTotalGrowerCount] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    // orgId can be either null or an [] of uuids
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

    //set correct values for organization_id, an array of uuids for ALL_ORGANIZATIONS or a uuid string if provided
    const finalFilter = setOrganizationFilter(filter, orgId, orgList);

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

  const getWallets = async (name, pageNumber) => {
    const { total, wallets } = await api.getWallets({
      skip: pageNumber * pageSize,
      rowsPerPage: pageSize,
      filter: new FilterGrower({
        wallet: name,
      }),
    });

    return {
      total,
      wallets,
    };
  };

  const getCount = async () => {
    //set correct values for organization_id, an array of uuids for ALL_ORGANIZATIONS or a uuid string if provided
    const finalFilter = setOrganizationFilter(
      filter.getWhereObj(),
      orgId,
      orgList
    );

    log.debug('load grower count', filter);

    const { count } = await api.getCount({
      filter: new FilterGrower(finalFilter),
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
    getWallets,
  };

  return (
    <GrowerContext.Provider value={value}>
      {props.children}
    </GrowerContext.Provider>
  );
}
