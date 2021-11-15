import React, { useState, useEffect, createContext } from 'react';
import Filter from '../models/Filter';
import api from '../api/stakeholders';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/StakeholderContext');

export const StakeholdersContext = createContext({
  stakeholder: {},
  stakeholders: [],
  display: [],
  columns: [],
  page: 0,
  rowsPerPage: 1,
  filters: {},
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
  linkStakeholder: () => {},
  unlinkStakeholder: () => {},
});

export function StakeholdersProvider(props) {
  const [stakeholders, setStakeholders] = useState([]);
  const [stakeholder, setStakeholder] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [order, setOrder] = useState(true);
  const [orderBy, setOrderBy] = useState('asc');
  const [filter, setFilter] = useState(new Filter());
  // const [isLoading, setIsLoading] = useState(false);
  const columns = [
    { label: 'Name', value: 'name' },
    { label: 'ID', value: 'id' },
    { label: 'Map', value: 'map' },
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Website', value: 'website' },
  ];
  // const [totalGrowerCount, setTotalGrowerCount] = useState(null);

  useEffect(() => {
    getStakeholders();
  }, [filter, page, rowsPerPage]);

  useEffect(() => {
    setDisplay();
  }, [order, orderBy]);

  // EVENT HANDLERS

  // const getCount = async () => {
  //   const { count } = await api.getCount({ filter });
  //   setCount(Number(count));
  // };

  const getStakeholders = async () => {
    log.debug('load stakeholders');
    // setIsLoading(true);
    const data = await api.getStakeholders({
      skip: page * rowsPerPage,
      rowsPerPage,
      orderBy,
      order,
      filter,
    });
    setStakeholders(data);
    // setIsLoading(false);
  };

  const getStakeholder = async (id) => {
    let stakeholderData;
    stakeholderData = stakeholders.find((p) => p.id === id);
    if (!stakeholderData) {
      stakeholderData = await api.getStakeholder(id);
    }
    setStakeholder(stakeholderData);
  };

  const updateStakeholder = async (payload) => {
    await api.updateStakeholder(payload);
    const updatedStakeholder = await api.getStakeholder(payload.id);
    const index = stakeholders.findIndex((p) => p.id === updatedStakeholder.id);
    if (index >= 0) {
      const stakeholdersData = Object.assign([], stakeholders, {
        [index]: updatedStakeholder,
      });
      setStakeholders(stakeholdersData);
    }
  };

  const setDisplay = () => {
    let display;

    // sorting
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

    // pagination
    display = display.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    setStakeholders(display);
  };

  const sort = (payload) => {
    this.setSortBy(payload);
    this.setSortAsc();
    this.setDisplay();
  };
  const updateFilter = async () => {
    setPage(0);
    setFilter(filter);
    // fetch api
    // set data
    // set display
  };

  const createStakeholder = async (payload) => {
    console.log(payload);
    // send api request
  };

  const linkStakeholder = async (payload) => {
    console.log('link');
    console.log({
      type: payload.type,
      id: payload.id,
    });
    updateStakeholder(payload);
    //determine which request to make (growers, users, etc)
    //get stakeholders
    //when one's selected
    //add id to the array of that type on the current stakeholder & update the stakeholder
  };

  const unlinkStakeholder = async (payload) => {
    console.log('unlink');
    console.log({ type: payload.type, id: payload.id });
    updateStakeholder(payload);
    //remove the id from the type array in the current stakeholder
  };

  const value = {
    stakeholder,
    stakeholders,
    columns,
    page,
    rowsPerPage,
    filter,
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
    getStakeholder,
    getStakeholders,
    createStakeholder,
    linkStakeholder,
    unlinkStakeholder,
  };

  return (
    <StakeholdersContext.Provider value={value}>
      {props.children}
    </StakeholdersContext.Provider>
  );
}
