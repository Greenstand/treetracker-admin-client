import React, { useState, useEffect, createContext } from 'react';
import { getOrganization } from '../api/apiUtils';
import { session } from '../models/auth';
import FilterModel from '../models/Filter';

const CAPTURE_API = `${process.env.REACT_APP_TREETRACKER_API_ROOT}`;

export const CaptureMatchingContext = createContext({
  isFilterShown: false,
  setIsFilterShown: () => {},
  handleFilterClick: () => {},
});

export default function CaptureMatchingProvider(props) {
  const [isFilterShown, setIsFilterShown] = useState(false);
  //   const [captureImages, setCaptureImages] = useState([]);
  //   const [currentPage, setCurrentPage] = useState(1);
  //   const [loading, setLoading] = useState(false);
  //   const [candidateImgData, setCandidateImgData] = useState([]);
  //   const [noOfPages, setNoOfPages] = useState(null); //for pagination
  //   const [imgCount, setImgCount] = useState(null); //for header icon
  //   const [treesCount, setTreesCount] = useState(0);

  //   useEffect(() => {
  //     console.log('loading candidate images');
  //     async function fetchCandidateTrees(captureId) {
  //       // TODO: handle errors and give user feedback
  //       setLoading(true);
  //       const data = await fetch(
  //         `${CAPTURE_API}/trees/potential_matches?capture_id=${captureId}`,
  //         {
  //           headers: {
  //             // Authorization: session.token,
  //           },
  //         }
  //       ).then((res) => res.json());
  //       console.log('candidate images ---> ', data);
  //       setCandidateImgData(data.matches);
  //       setTreesCount(data.matches.length);
  //       setLoading(false);
  //     }

  //     // setCandidateImgData([]);

  //     if (
  //       captureImages &&
  //       currentPage > 0 &&
  //       currentPage <= captureImages.length
  //     ) {
  //       const captureId = captureImages[currentPage - 1].id;
  //       console.log('captureId', captureId);
  //       if (captureId) {
  //         fetchCandidateTrees(captureId);
  //       }
  //     }
  //   }, [currentPage, captureImages]);

  //   useEffect(() => {
  //     console.log('loading captures');
  //     async function fetchCaptures() {
  //       // TODO: handle errors and give user feedback
  //       setLoading(true);
  //       const data = await fetch(`${CAPTURE_API}/captures`, {
  //         headers: {
  //           // Authorization: session.token,
  //         },
  //       }).then((res) => res.json());
  //       setCaptureImages(data);
  //       setLoading(false);
  //     }
  //     fetchCaptures();
  //   }, []);

  //   useEffect(() => {
  //     if (currentPage <= 0 || currentPage > noOfPages) {
  //       setCurrentPage(1);
  //     }
  //   }, [noOfPages, currentPage]);

  //   useEffect(() => {
  //     setNoOfPages(captureImages.length);
  //     setImgCount(captureImages.length);
  //   }, [captureImages]);

  const handleFilterClick = () => {
    setIsFilterShown((prev) => !prev);
  };
  const value = {
    isFilterShown,
    setIsFilterShown,
    handleFilterClick,
  };

  return (
    <CaptureMatchingContext.Provider value={value}>
      {props.children}
    </CaptureMatchingContext.Provider>
  );
}
