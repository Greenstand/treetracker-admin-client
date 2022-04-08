import React, { useState, useEffect, createContext } from 'react';
import FilterStakeholder from '../models/FilterStakeholder';
import api from '../api/stakeholders';
import * as loglevel from 'loglevel';
import { getOrganizationId } from 'api/apiUtils';

const log = loglevel.getLogger('../context/StakeholderContext');

export const StakeholdersContext = createContext({
  stakeholders: [],
  count: 0,
  columns: [],
  page: 0,
  rowsPerPage: 5,
  filter: new FilterStakeholder(),
  initialFilterState: {},
  isLoading: false,
  orderBy: undefined,
  order: 'asc',
  setStakeholders: () => {},
  setPage: () => {},
  setRowsPerPage: () => {},
  setOrder: () => {},
  setOrderBy: () => {},
  setFilter: () => {},
  setIsLoading: () => {},
  sort: () => {},
  updateFilter: () => {},
  getStakeholder: () => {},
  getStakeholders: () => {},
  deleteStakeholder: () => {},
  createStakeholder: () => {},
  updateStakeholder: () => {},
});

const initialFilterState = {
  id: '',
  type: '',
  org_name: '',
  first_name: '',
  last_name: '',
  image_url: '',
  email: '',
  phone: '',
  website: '',
  logo_url: '',
  map: '',
};

export function StakeholdersProvider(props) {
  const [stakeholders, setStakeholders] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState(
    new FilterStakeholder(initialFilterState)
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

  // call w/ or w/o an id, it will default to the organization id or be null
  const getStakeholders = async (id) => {
    log.debug('load stakeholders', id);
    const { stakeholders, totalCount } = await api.getStakeholders(id, {
      filter,
    });
    setStakeholders(stakeholders);
    setCount(totalCount);
  };

  const updateFilter = async (filter) => {
    log.debug('update filter', filter);
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
            c.id === updated.id ? updated : c
          );
          s.children = updatedChildren;
        }
        return s.id === updated.id ? updated : s;
      });

      setStakeholders(updatedStakeholders);
    }
  };

  const createStakeholder = async (payload) => {
    const created = await api.createStakeholder(payload);
    if (created.id) {
      setStakeholders([...stakeholders, created]);
    }
    return created;
  };

  const deleteStakeholder = async (id, payload) => {
    log.debug('delete stakeholder', id, payload);
    const result = await api.deleteStakeholder(id, payload);
    console.log('deleted', result);
    setIsLoading(true);
    getStakeholders(getOrganizationId()).then(() => setIsLoading(false));
  };

  const value = {
    stakeholders,
    count,
    columns,
    page,
    rowsPerPage,
    filter,
    initialFilterState,
    isLoading,
    setStakeholders,
    setPage,
    setRowsPerPage,
    setFilter,
    setIsLoading,
    updateFilter,
    getStakeholders,
    createStakeholder,
    deleteStakeholder,
    updateStakeholder,
  };

  return (
    <StakeholdersContext.Provider value={value}>
      {props.children}
    </StakeholdersContext.Provider>
  );
}
