import React, { useState, useEffect, createContext } from 'react';
import api from '../api/regions';
import * as loglevel from 'loglevel';
import FilterRegion from 'models/FilterRegion';
import { getOrganizationUUID } from 'api/apiUtils';

const log = loglevel.getLogger('../context/RegionContext');

export const RegionContext = createContext({
  regions: [],
  collections: [],
  pageSize: 25,
  regionCount: null,
  collectionCount: null,
  currentPage: 0,
  filter: new FilterRegion(),
  isLoading: false,
  showCollections: false,
  changePageSize: () => {},
  changeCurrentPage: () => {},
  changeSort: () => {},
  setShowCollections: () => {},
  loadRegions: () => {},
  loadCollections: () => {},
  getRegion: () => {},
  upload: () => {},
  updateRegion: () => {},
  updateCollection: () => {},
  updateFilter: () => {},
  deleteRegion: () => {},
  deleteCollection: () => {},
});

export function RegionProvider(props) {
  const [regions, setRegions] = useState([]);
  const [collections, setCollections] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [regionCount, setRegionCount] = useState(null);
  const [collectionCount, setCollectionCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [filter, setFilter] = useState(new FilterRegion());
  const [isLoading, setIsLoading] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  useEffect(() => {
    if (showCollections) {
      setRegions([]);
      loadCollections();
    } else {
      setCollections([]);
      loadRegions();
    }
  }, [filter, pageSize, currentPage, orderBy, showCollections]);

  useEffect(() => {
    setCurrentPage(0);
  }, [showCollections]);

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

    const collectionIds = [
      ...new Set(
        regions.map((region) => region.collection_id).filter((id) => id)
      ),
    ];
    const collectionLookup = (
      await Promise.all(collectionIds.map((id) => api.getCollection(id)))
    ).map((res) => res.collection);
    setRegions(
      regions.map((region) => {
        const collection =
          region.collection_id &&
          collectionLookup.find(
            (collection) => collection.id === region.collection_id
          );
        return {
          ...region,
          collection_name: collection?.name || undefined,
          collection: collection,
        };
      })
    );

    setIsLoading(false);
  };

  const loadCollections = async () => {
    log.debug('load collections');
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
      collections,
      query: { count },
    } = await api.getCollections({
      skip: pageNumber * pageSize,
      rowsPerPage: pageSize,
      orderBy,
      order: 'asc',
      filter: queryFilter,
    });
    setCollections(collections);
    setCollectionCount(count);
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

  const upload = async (payload) => {
    // If the user has an organization, that should be applied as the owner
    const res = await api.upload({
      owner_id: getOrganizationUUID() || undefined,
      ...payload,
    });
    await loadRegions();
    await loadCollections();
    return res;
  };

  const updateRegion = async (payload) => {
    const res = await api.updateRegion(payload, payload.id);
    await loadRegions();
    return res;
  };

  const updateCollection = async (payload) => {
    const res = await api.updateCollection(payload, payload.id);
    await loadCollections();
    return res;
  };

  const deleteRegion = async (id) => {
    const res = await api.deleteRegion(id);
    await loadRegions();
    return res;
  };

  const deleteCollection = async (id) => {
    const res = await api.deleteCollection(id);
    await loadCollections();
    return res;
  };

  const updateFilter = async (newFilter) => {
    setCurrentPage(0);
    setFilter(newFilter);
  };

  const value = {
    regions,
    collections,
    pageSize,
    regionCount,
    collectionCount,
    currentPage,
    orderBy,
    filter,
    isLoading,
    showCollections,
    changePageSize,
    changeCurrentPage,
    changeSort,
    setShowCollections,
    loadRegions,
    loadCollections,
    getRegion,
    upload,
    updateRegion,
    updateCollection,
    updateFilter,
    deleteRegion,
    deleteCollection,
  };

  return (
    <RegionContext.Provider value={value}>
      {props.children}
    </RegionContext.Provider>
  );
}
