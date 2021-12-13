import React, { useState, useEffect, createContext } from 'react';
import FilterStakeholder from '../models/FilterStakeholder';
import api from '../api/stakeholders';
import * as loglevel from 'loglevel';
// import { getOrganizationId } from 'api/apiUtils';

const log = loglevel.getLogger('../context/StakeholderContext');

export const StakeholdersContext = createContext({
  stakeholder: {},
  stakeholders: [],
  unlinkedStakeholders: [],
  display: [],
  columns: [],
  page: 0,
  rowsPerPage: 1,
  filter: new FilterStakeholder(),
  initialFilterState: {},
  orderBy: undefined,
  order: true,
  setPage: () => {},
  setRowsPerPage: () => {},
  setOrder: () => {},
  setOrderBy: () => {},
  setFilter: () => {},
  // setIsLoading: () => {},
  setDisplay: () => {},
  sort: () => {},
  updateFilter: () => {},
  getStakeholder: () => {},
  getStakeholders: () => {},
  createStakeholder: () => {},
  updateStakeholder: () => {},
  getUnlinkedStakeholders: () => {},
  updateLinks: () => {},
});

const initialFilterState = {
  id: null,
  type: null,
  orgName: null,
  firstName: null,
  lastName: null,
  imageUrl: null,
  email: null,
  phone: null,
  website: null,
  logoUrl: null,
  map: null,
  stakeholder_uuid: null,
};

export function StakeholdersProvider(props) {
  const [stakeholders, setStakeholders] = useState([]);
  const [unlinkedStakeholders, setUnlinkedStakeholders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(undefined);
  const [filter, setFilter] = useState(
    new FilterStakeholder(initialFilterState),
  );
  const columns = [
    { label: 'Name', value: 'name' },
    { label: 'ID', value: 'id' },
    { label: 'Map', value: 'map' },
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Website', value: 'website' },
  ];

  useEffect(() => {
    getStakeholders();
  }, [filter, page, rowsPerPage]);

  useEffect(() => {
    setDisplay();
  }, [order, orderBy]);

  // EVENT HANDLERS

  const setDisplay = () => {
    let display;
    // orderBy => field & order => true = asc/ false = desc
    if (orderBy) {
      if (order) {
        display = stakeholders
          .slice()
          .sort((a, b) => (a[orderBy] > b[orderBy] ? -1 : 1));
      } else {
        display = stakeholders
          .slice()
          .sort((a, b) => (a[orderBy] > b[orderBy] ? 1 : -1));
      }
    } else {
      display = stakeholders;
    }

    setStakeholders(display);
  };

  const sort = (payload) => {
    console.log('sort', payload);
    setOrderBy(payload.col);
    setOrder(payload.order);
    setDisplay();
  };

  // call w/ or w/o an id, it will default to the organization id or be null
  const getStakeholders = async (id = null) => {
    log.debug('load stakeholders', id);
    let data;
    // compare both id and uuid while transitioning
    // can remove id comparison when all stakeholders use uuid
    data = stakeholders.find((p) => p.id === id || p.id === id);
    if (!data) {
      data = await api.getStakeholders(id, {
        offset: page * rowsPerPage,
        rowsPerPage,
        orderBy,
        order,
        filter,
      });
    }
    setStakeholders(data.stakeholders);
  };

  const updateFilter = async (filter) => {
    setPage(0);
    setFilter(filter);
  };

  const updateStakeholder = async (payload) => {
    await api.updateStakeholder(payload);
    getStakeholders();
  };

  const createStakeholder = async (payload) => {
    await api.createStakeholder(payload);
    getStakeholders();
  };

  const getUnlinkedStakeholders = async (id) => {
    const unlinked = await api.getUnlinkedStakeholders(id);
    setUnlinkedStakeholders(unlinked.stakeholders);
  };

  const updateLinks = async (id, payload) => {
    await api.updateLinks(id, payload);
    // getUnlinkedStakeholders();
    getStakeholders();
  };

  const value = {
    stakeholders,
    unlinkedStakeholders,
    columns,
    page,
    rowsPerPage,
    filter,
    initialFilterState,
    orderBy,
    order,
    setPage,
    setRowsPerPage,
    setOrder,
    setOrderBy,
    setFilter,
    // setIsLoading,
    setDisplay,
    sort,
    updateFilter,
    getStakeholders,
    createStakeholder,
    updateStakeholder,
    getUnlinkedStakeholders,
    updateLinks,
  };

  return (
    <StakeholdersContext.Provider value={value}>
      {props.children}
    </StakeholdersContext.Provider>
  );
}
