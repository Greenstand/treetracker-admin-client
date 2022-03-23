import React, { useState, useEffect, createContext } from 'react';
import api from '../api/regions';
import * as loglevel from 'loglevel';
import FilterRegion from 'models/FilterRegion';
import { getOrganizationUUID } from 'api/apiUtils';

const log = loglevel.getLogger('../context/RegionContext');

export const RegionContext = createContext({
  regions: [],
  pageSize: 25,
  regionCount: null,
  currentPage: 0,
  filter: new FilterRegion(),
  isLoading: false,
  changePageSize: () => {},
  changeCurrentPage: () => {},
  changeSort: () => {},
  updateRegions: () => {},
  loadRegions: () => {},
  getRegion: () => {},
  createRegion: () => {},
  updateRegion: () => {},
  updateFilter: () => {},
  deleteRegion: () => {},
});

export function RegionProvider(props) {
  const [regions, setRegions] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [regionCount, setRegionCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderBy, setOrderBy] = useState('id');
  const [filter, setFilter] = useState(new FilterRegion());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRegions();
  }, [filter, pageSize, currentPage, orderBy]); //

  // EVENT HANDLERS

  const changePageSize = async (pageSize) => {
    setPageSize(pageSize);
  };

  const changeCurrentPage = async (val) => {
    setCurrentPage(val);
  };

  const changeSort = async (val) => {
    setOrderBy(val);
  };

  const updateRegions = (regions) => {
    setRegions(regions);
  };

  const loadRegions = async () => {
    log.debug('load regions');
    setIsLoading(true);
    const pageNumber = currentPage;
    const ownerId = getOrganizationUUID();
    const queryFilter = ownerId
      ? {
          owner_id: ownerId,
          ...filter,
        }
      : filter;

    const {
      regions,
      query: { count },
    } = await api.getRegions({
      skip: pageNumber * pageSize,
      rowsPerPage: pageSize,
      orderBy,
      order: 'asc',
      filter: queryFilter,
    });
    setRegions(regions);
    setRegionCount(count);
    setIsLoading(false);
  };

  const getRegion = async (payload) => {
    const { id } = payload;
    // Look for a match in the local state first
    let region = regions.find((p) => p.id === id);
    if (!region) {
      // Otherwise query the API
      region = await api.getRegion(id);
    }
    return region;
  };

  const createRegion = async (payload) => {
    if (payload.shape.type.endsWith('Collection')) {
      const createdCollection = await api.createCollection({
        owner_id: getOrganizationUUID() || undefined,
        ...payload,
      });
      setRegions((regions) => [...regions, ...createdCollection.regions]);
    } else {
      const createdRegion = await api.createRegion({
        owner_id: getOrganizationUUID() || undefined,
        ...payload,
      });
      setRegions((regions) => [...regions, createdRegion]);
    }
  };

  const updateRegion = async (payload) => {
    delete payload.shape;
    delete payload.nameKey;
    const updatedRegion = await api.updateRegion(payload, payload.id);
    const index = regions.findIndex((p) => p.id === updatedRegion.id);
    if (index >= 0) {
      const regions = Object.assign([], regions, {
        [index]: updatedRegion,
      });
      setRegions(regions);
    }
  };

  const deleteRegion = async (id) => {
    await api.deleteRegion(id);
    const index = regions.findIndex((region) => region.id === id);
    if (index >= 0) {
      setRegions([
        ...regions.slice(0, index),
        ...regions.slice(index + 1, regions.length),
      ]);
    }
  };

  const updateFilter = async (newFilter) => {
    setCurrentPage(0);
    setFilter(newFilter);
  };

  const value = {
    regions,
    pageSize,
    regionCount,
    currentPage,
    orderBy,
    filter,
    isLoading,
    changePageSize,
    changeCurrentPage,
    changeSort,
    updateRegions,
    loadRegions,
    getRegion,
    createRegion,
    updateRegion,
    updateFilter,
    deleteRegion,
  };

  return (
    <RegionContext.Provider value={value}>
      {props.children}
    </RegionContext.Provider>
  );
}
