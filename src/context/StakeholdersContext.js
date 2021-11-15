import React, { useState, useEffect, createContext } from 'react';
import Filter from '../models/Filter';
import api from '../api/stakeholders';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/GrowerContext');

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
  setIsLoading: () => {},
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
  const [stakeholders, setStakeholders] = useState([
    {
      type: 'Organization',
      logo: './logo_192x192.png',
      name: 'Greenstand',
      id: '10193',
      map: '/greenstandMap',
      email: 'hello@greenstand.com',
      phone: '123-123-2122',
      website: 'greenstand.org',
      children: [
        {
          type: 'person',
          name: 'Child One',
          id: '22214',
          map: '/childOne',
          email: 'child@gmail.com',
          phone: '123-123-1234',
          website: 'childone.com',
        },
        {
          type: 'person',
          name: 'Child Two',
          id: '31234',
          map: '/childtwo',
          email: 'childtwo@gmail.com',
          phone: '123-234-1234',
          website: 'childtwo.com',
        },
      ],
      parents: [
        {
          type: 'person',
          name: 'Parent One',
          id: '10123',
          map: '/parentone',
          email: 'parent@gmail.com',
          phone: '123-123-1234',
          website: 'parentone.com',
        },
      ],
      users: [
        {
          id: '1234',
          username: 'admin1',
          fullName: 'Admin One',
          roles: 'admin',
        },
        {
          id: '1235',
          username: 'admin2',
          fullName: 'Admin Two',
          roles: 'admin',
        },
      ],
      growers: [
        { fullName: 'Grower One', id: '12345', createdAt: '01/02/2021' },
        { fullName: 'Grower Two', id: '12331', createdAt: '20/02/2021' },
        { fullName: 'Grower Three', id: '12316', createdAt: '01/02/2021' },
        { fullName: 'Grower Four', id: '12317', createdAt: '20/02/2021' },
        { fullName: 'Grower Five', id: '12329', createdAt: '01/02/2021' },
        { fullName: 'Grower Six', id: '12335', createdAt: '20/02/2021' },
        { fullName: 'Grower Seven', id: '12137', createdAt: '01/02/2021' },
        { fullName: 'Grower Eight', id: '12334', createdAt: '20/02/2021' },
        { fullName: 'Grower Nine', id: '12318', createdAt: '01/02/2021' },
        { fullName: 'Grower Ten', id: '12330', createdAt: '20/02/2021' },
      ],
    },
    {
      type: 'org',
      logo: './logo_192x192.png',
      name: 'Greenstance',
      id: '41341',
      map: '/greenstance',
      email: 'hello@greenstance.com',
      phone: '123-123-1234',
      website: 'greenstance.com',
      children: [],
      parents: [],
      users: [],
      growers: [],
    },
    {
      type: 'org',
      logo: './logo_192x192.png',
      name: 'Green Space',
      id: '51324',
      map: '/greenspace',
      email: 'greenspace@green.com',
      phone: '123-123-1324',
      website: 'greenspace.com',
      children: [],
      parents: [],
      users: [],
      growers: [],
    },
    {
      type: 'org',
      logo: './logo_192x192.png',
      name: 'Green World',
      id: '61234',
      map: '/greenworld',
      email: 'hi@greenworld.com',
      phone: '123-123-1234',
      website: 'greenworld.com',
      children: [],
      parents: [],
      users: [],
      growers: [],
    },
  ]);
  const [stakeholder, setStakeholder] = useState([
    {
      type: 'Organization',
      logo: './logo_192x192.png',
      name: 'Greenstand',
      id: '10193',
      map: '/greenstandMap',
      email: 'hello@greenstand.com',
      phone: '123-123-2122',
      website: 'greenstand.org',
      children: [
        {
          type: 'person',
          name: 'Child One',
          id: '22214',
          map: '/childOne',
          email: 'child@gmail.com',
          phone: '123-123-1234',
          website: 'childone.com',
        },
        {
          type: 'person',
          name: 'Child Two',
          id: '31234',
          map: '/childtwo',
          email: 'childtwo@gmail.com',
          phone: '123-234-1234',
          website: 'childtwo.com',
        },
      ],
      parents: [
        {
          type: 'person',
          name: 'Parent One',
          id: '10123',
          map: '/parentone',
          email: 'parent@gmail.com',
          phone: '123-123-1234',
          website: 'parentone.com',
        },
      ],
      users: [
        {
          id: '1234',
          username: 'admin1',
          fullName: 'Admin One',
          roles: 'admin',
        },
        {
          id: '1235',
          username: 'admin2',
          fullName: 'Admin Two',
          roles: 'admin',
        },
      ],
      growers: [
        { fullName: 'Grower One', id: '12345', createdAt: '01/02/2021' },
        { fullName: 'Grower Two', id: '12331', createdAt: '20/02/2021' },
        { fullName: 'Grower Three', id: '12316', createdAt: '01/02/2021' },
        { fullName: 'Grower Four', id: '12317', createdAt: '20/02/2021' },
        { fullName: 'Grower Five', id: '12329', createdAt: '01/02/2021' },
        { fullName: 'Grower Six', id: '12335', createdAt: '20/02/2021' },
        { fullName: 'Grower Seven', id: '12137', createdAt: '01/02/2021' },
        { fullName: 'Grower Eight', id: '12334', createdAt: '20/02/2021' },
        { fullName: 'Grower Nine', id: '12318', createdAt: '01/02/2021' },
        { fullName: 'Grower Ten', id: '12330', createdAt: '20/02/2021' },
      ],
    },
  ]);
  const [columns, setColumns] = useState([
    { label: 'Name', value: 'name' },
    { label: 'ID', value: 'id' },
    { label: 'Map', value: 'map' },
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Website', value: 'website' },
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [order, setOrder] = useState(true);
  const [orderBy, setOrderBy] = useState('asc');
  const [filter, setFilter] = useState(new Filter());
  const [isLoading, setIsLoading] = useState(false);
  // const [totalGrowerCount, setTotalGrowerCount] = useState(null);

  useEffect(() => {
    getStakeholder();
  }, [filter, page, rowsPerPage]);

  useEffect(() => {
    setDisplay();
  }, [order, orderBy]);

  // EVENT HANDLERS

  // const load = async () => {
  //   log.debug('load growers');
  //   setIsLoading(true);
  //   const pageNumber = page;
  //   const stakeholder = await api.getStakeholder({
  //     skip: pageNumber * rowsPerPage,
  //     rowsPerPage,
  //     filter,
  //   });
  //   setStakeholder(stakeholder);
  //   setIsLoading(false);
  // };

  // const getCount = async () => {
  //   const { count } = await api.getCount({ filter });
  //   setCount(Number(count));
  // };

  const getStakeholders = async () => {
    const stakeholdersData = await api.getStakeholders();
    setStakeholders(stakeholdersData);
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
    console.log({ type: payload.type, id: payload.id });
  };

  const unlinkStakeholder = async (payload) => {
    console.log('unlink');
    console.log({ type: payload.type, id: payload.id });
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
    setIsLoading,
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
