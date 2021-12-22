import React, { useState, useEffect, createContext } from 'react';
import FilterStakeholder from '../models/FilterStakeholder';
import api from '../api/stakeholders';
import * as loglevel from 'loglevel';
import { getOrganizationId } from 'api/apiUtils';

const log = loglevel.getLogger('../context/StakeholderContext');

export const StakeholdersContext = createContext({
  stakeholders: [],
  count: 0,
  unlinkedStakeholders: [],
  display: [],
  columns: [],
  page: 0,
  rowsPerPage: 5,
  filter: new FilterStakeholder(),
  initialFilterState: {},
  isLoading: false,
  orderBy: undefined,
  order: true,
  setPage: () => {},
  setRowsPerPage: () => {},
  setOrder: () => {},
  setOrderBy: () => {},
  setFilter: () => {},
  setIsLoading: () => {},
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
  id: '',
  type: '',
  orgName: '',
  firstName: '',
  lastName: '',
  imageUrl: '',
  email: '',
  phone: '',
  website: '',
  logoUrl: '',
  map: '',
  organization_id: '',
  owner_id: '',
};

export function StakeholdersProvider(props) {
  const [stakeholders, setStakeholders] = useState([]);
  const [count, setCount] = useState(0);
  const [unlinkedStakeholders, setUnlinkedStakeholders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
    const orgId = getOrganizationId();
    setIsLoading(true);
    getStakeholders(orgId)
      .then(() => setIsLoading(false))
      .catch((e) => console.error(e));
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
    setOrderBy(payload.col);
    setOrder(payload.order);
    setDisplay();
  };

  // call w/ or w/o an id, it will default to the organization id or be null
  const getStakeholders = async (id) => {
    log.debug('load stakeholders', id);
    const { stakeholders, totalCount } = await api.getStakeholders(id, {
      offset: page * rowsPerPage,
      rowsPerPage,
      orderBy,
      order,
      filter,
    });
    setStakeholders(stakeholders);
    setCount(totalCount);
  };

  const updateFilter = async (filter) => {
    setPage(0);
    setFilter(filter);
  };

  const updateStakeholder = async (payload) => {
    const updated = await api.updateStakeholder(payload);
    if (updated.id) {
      const updatedStakeholders = stakeholders.map((s) => {
        if (
          updated.parents.length &&
          updated.parents.find((p) => p.id === s.id)
        ) {
          const updatedChildren = s.children.map((c) =>
            c.id === updated.id ? updated : c,
          );
          s.children = updatedChildren;
        }
        return s.id === updated.id ? updated : s;
      });
      const updatedUnlinked = unlinkedStakeholders.map((s) => {
        return s.id === updated.id ? updated : s;
      });

      setStakeholders(updatedStakeholders);
      setUnlinkedStakeholders(updatedUnlinked);
    }
  };

  const createStakeholder = async (payload) => {
    const created = await api.createStakeholder(payload);
    if (created.id) {
      setStakeholders([...stakeholders, created]);
      setUnlinkedStakeholders([...unlinkedStakeholders, created]);
    }
    return created;
  };

  const getUnlinkedStakeholders = async (id) => {
    const unlinked = await api.getUnlinkedStakeholders(id);
    setUnlinkedStakeholders(unlinked.stakeholders);
  };

  const updateLinks = async (id, payload) => {
    await api.updateLinks(id, payload);
    getUnlinkedStakeholders(id);
    setIsLoading(true);
    getStakeholders(getOrganizationId()).then(() => setIsLoading(false));
  };

  const value = {
    stakeholders,
    count,
    unlinkedStakeholders,
    columns,
    page,
    rowsPerPage,
    filter,
    initialFilterState,
    isLoading,
    orderBy,
    order,
    setPage,
    setRowsPerPage,
    setOrder,
    setOrderBy,
    setFilter,
    setIsLoading,
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
