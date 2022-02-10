import React, { useState, useEffect, createContext } from 'react';
import api from '../api/treeTrackerApi';
import { getOrganization } from '../api/apiUtils';
import { session } from '../models/auth';
import FilterModel from '../models/Filter';

const CAPTURE_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}`;
const dateStartDefault = null;
const dateEndDefault = null;

export const CaptureMatchingContext = createContext({
  isFilterShown: false,
  setIsFilterShown: () => {},
  handleFilterClick: () => {},
  captureImages: [],
  setCaptureImages: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  loading: false,
  setLoading: () => {},
  candidateImgData: [],
  setCandidateImgData: () => {},
  noOfPages: null,
  setNoOfPages: () => {},
  imgCount: null,
  setImgCount: () => {},
  treesCount: 0,
  setTreesCount: () => {},
  fetchCandidateTrees: () => {},
  fetchCaptures: () => {},
  handleChange: () => {},
  sameTreeHandler: () => {},
  handleSkip: () => {},
  dateStart: null,
  setDateStart: () => {},
  dateEnd: null,
  setDateEnd: () => {},
  organizationId: null,
  setOrganizationId: () => {},
});

export default function CaptureMatchingProvider(props) {
  const [isFilterShown, setIsFilterShown] = useState(false);
  const [captureImages, setCaptureImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [candidateImgData, setCandidateImgData] = useState([]);
  const [noOfPages, setNoOfPages] = useState(null); //for pagination
  const [imgCount, setImgCount] = useState(null); //for header icon
  const [treesCount, setTreesCount] = useState(0);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  // To get total tree count on candidate capture image icon
  // const treesCount = candidateImgData.length;

  async function fetchCandidateTrees(captureId, abortController) {
    const data = await api.fetchCandidateTrees(captureId, abortController);
    if (data) {
      setCandidateImgData(data.matches);
      setTreesCount(data.matches.length);
      setLoading(false);
    }
  }

  async function fetchCaptures(currentPage, abortController) {
    setLoading(true);
    const data = await api.fetchCapturesToMatch(currentPage, abortController);
    console.log('fetchCaptures', currentPage, data);
    if (data) {
      setCaptureImages(data.captures);
      setNoOfPages(data.count);
      setImgCount(data.count);
    }
  }

  useEffect(() => {
    console.log('loading captures', currentPage);
    const abortController = new AbortController();
    fetchCaptures(currentPage, abortController);
    return () => abortController.abort();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage <= 0 || currentPage > noOfPages) {
      setCurrentPage(1);
    }
  }, [noOfPages, currentPage]);

  useEffect(() => {
    const abortController = new AbortController();
    if (captureImages.length) {
      console.log('loading candidate images');
      const captureId = captureImages[0].id;
      console.log('captureId', captureId);
      fetchCandidateTrees(captureId, abortController);
    }
    return () => abortController.abort();
  }, [captureImages]);

  // Capture Image Pagination function
  const handleChange = (e, value) => {
    setCurrentPage(value);
  };

  // Same Tree Capture function
  const sameTreeHandler = async (treeId) => {
    const captureId = captureImages[0].id;
    console.log('captureId treeId', captureId, treeId);
    await fetch(`${CAPTURE_API}/captures/${captureId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        // Authorization: session.token,
      },
      body: JSON.stringify({
        tree_id: treeId,
      }),
    });

    // make sure new captures are loaded by updating page or if it's the first page reloading directly
    if (currentPage === 1) {
      fetchCaptures(currentPage);
    } else {
      setCurrentPage((page) => page + 1);
    }
  };

  // Skip button
  const handleSkip = () => {
    setCurrentPage((page) => page + 1);
  };

  const handleFilterClick = () => {
    setIsFilterShown((prev) => !prev);
  };
  const value = {
    isFilterShown,
    setIsFilterShown,
    handleFilterClick,
    captureImages,
    setCaptureImages,
    currentPage,
    setCurrentPage,
    loading,
    setLoading,
    candidateImgData,
    setCandidateImgData,
    noOfPages,
    setNoOfPages,
    imgCount,
    setImgCount,
    treesCount,
    setTreesCount,
    fetchCandidateTrees,
    fetchCaptures,
    handleChange,
    sameTreeHandler,
    handleSkip,
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    organizationId,
    setOrganizationId,
  };

  return (
    <CaptureMatchingContext.Provider value={value}>
      {props.children}
    </CaptureMatchingContext.Provider>
  );
}
