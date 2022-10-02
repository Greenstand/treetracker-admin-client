import React, { useState, useEffect, createContext } from 'react';
import api from '../api/treeTrackerApi';
import FilterModel from '../models/Filter';
import * as loglevel from 'loglevel';
import { getOrganizationUUID } from 'api/apiUtils';

const log = loglevel.getLogger('../context/VerifyContext');

export const VerifyContext = createContext({
  captureImages: [],
  captureImagesSelected: [],
  captureImageAnchor: undefined,
  captureImagesUndo: [],
  isLoading: false,
  isApproveAllProcessing: false,
  approveAllComplete: 0,
  pageSize: 24,
  currentPage: 0,
  filter: new FilterModel({
    approved: false,
    active: true,
  }),
  invalidateCaptureCount: true,
  captureCount: null,
  approve: () => {},
  loadCaptureImages: () => {},
  approveAll: () => {},
  undoAll: () => {},
  updateFilter: () => {},
  getCaptureCount: () => {},
  clickCapture: () => {},
  setPageSize: () => {},
  setCurrentPage: () => {},
  setCaptureImagesSelected: () => {},
  getCaptureSelectedArr: () => {},
  getCaptureSelectedIdArr: () => {},
});

export function VerifyProvider(props) {
  const [captureImages, setCaptureImages] = useState([]);
  const [captureImagesUndo, setCaptureImagesUndo] = useState([]);
  const [captureImagesSelected, setCaptureImagesSelected] = useState({});
  const [captureImageAnchor, setCaptureImageAnchor] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproveAllProcessing, setIsApproveAllProcessing] = useState(false);
  const [approveAllComplete, setApproveAllComplete] = useState(0);
  const [pageSize, setPageSize] = useState(24);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState(
    new FilterModel({
      approved: false,
      active: true,
    })
  );
  const [invalidateCaptureCount, setInvalidateCaptureCount] = useState(true);
  const [captureCount, setCaptureCount] = useState(null);

  useEffect(() => {
    if (invalidateCaptureCount) getCaptureCount();
  }, [invalidateCaptureCount]);

  /* load captures when the page or page size changes */
  useEffect(() => {
    const abortController = new AbortController();
    setCaptureImages([]);
    loadCaptureImages({ signal: abortController.signal });
    return () => abortController.abort();
  }, [filter, pageSize, currentPage]);

  // STATE HELPER FUNCTIONS

  // /*
  //  * replace approve and reject
  //  */
  const undoedCaptureImage = (state, captureId) => {
    //put the capture back, from undo list, sort by id
    const captureUndo = captureImagesUndo.reduce((a, c) =>
      c.id === captureId ? c : a
    );
    const undoneImages = captureImagesUndo.filter(
      (capture) => capture.id !== captureId
    );
    const captures = [...captureImages, captureUndo].sort(
      (a, b) => a.id - b.id
    );
    setCaptureImages(captures);
    setCaptureImagesUndo(undoneImages);
  };

  // to reset the page status, load from beginning
  const reset = () => {
    setCaptureImages([]);
    setCurrentPage(0);
    setCaptureCount(null);
    setInvalidateCaptureCount(true);
  };
  /*
   * to clear all selection
   */
  const resetSelection = () => {
    setCaptureImagesSelected({});
    setCaptureImageAnchor(undefined);
  };

  // EVENT HANDLERS

  const approve = async ({ approveAction, capture }) => {
    if (!approveAction) {
      throw Error('no approve action object!');
    }
    if (approveAction.isApproved) {
      log.debug('approve');
      await api.approveCaptureImage(
        capture,
        approveAction.morphology,
        approveAction.age,
        approveAction.captureApprovalTag,
        approveAction.speciesId
      );
    } else {
      log.debug('reject');
      await api.rejectCaptureImage(capture, approveAction.rejectionReason);
    }

    if (approveAction.tags) {
      await api.createCaptureTags(capture.uuid, approveAction.tags);
    }

    return true;
  };

  const undoCaptureImage = async (id) => {
    await api.undoCaptureImage(id);
    undoedCaptureImage(id);
    return true;
  };

  const loadCaptureImages = async (abortController) => {
    log.debug('to load images');

    //set loading status
    setIsLoading(true);

    const pageParams = {
      page: currentPage,
      rowsPerPage: pageSize,
      filter: filter,
    };
    log.debug('load page with params:', pageParams);
    const result = await api.getRawCaptures(pageParams, abortController);
    setCaptureImages(result?.raw_captures || []);
    setCaptureCount(Number(result?.total));
    setInvalidateCaptureCount(false);
    //restore loading status
    setIsLoading(false);
  };

  const getCaptureSelectedArr = () => {
    return Object.keys(captureImagesSelected).filter((captureId) => {
      return captureImagesSelected[captureId] === true;
    });
    // .map((captureId) => parseInt(captureId));
  };

  const getCaptureSelectedIdArr = () => {
    return Object.keys(captureImagesSelected).filter((captureId) => {
      return captureImagesSelected[captureId] === true;
    });
  };

  const clickCapture = (payload) => {
    const { captureId, isShift } = payload;
    if (isShift) {
      log.debug('press shift, and there is an anchor:', captureImageAnchor);
      //if no anchor, then, select from beginning
      let indexAnchor = 0;
      if (captureImageAnchor !== undefined) {
        indexAnchor = captureImages.reduce((a, c, i) => {
          if (c !== undefined && c.id === captureImageAnchor) {
            return i;
          } else {
            return a;
          }
        }, -1);
      }
      const indexCurrent = captureImages.reduce((a, c, i) => {
        if (c !== undefined && c.id === captureId) {
          return i;
        } else {
          return a;
        }
      }, -1);
      let captureShiftSelected = {};
      captureImages
        .slice(
          Math.min(indexAnchor, indexCurrent),
          Math.max(indexAnchor, indexCurrent) + 1
        )
        .forEach((capture) => {
          captureShiftSelected[capture.id] = true;
        });
      setCaptureImagesSelected(captureShiftSelected);
    } else {
      setCaptureImageAnchor(captureId);
      setCaptureImagesSelected({
        ...captureImagesSelected,
        [captureId]: !captureImagesSelected[captureId],
      });
    }
  };

  const approveAll = async (approveAction) => {
    log.debug('approveAll with approveAction:', approveAction);
    setIsLoading(true);
    setIsApproveAllProcessing(true);
    const captureSelected = getCaptureSelectedArr();
    const total = captureSelected.length;
    const undo = captureImages.filter((capture) =>
      captureSelected.some((id) => id === capture.id)
    );
    log.debug('items:%d', captureImages.length);
    try {
      for (let i = 0; i < total; i++) {
        const captureId = captureSelected[i];
        const capture = captureImages.reduce((a, c) => {
          if (c && c.id === captureId) {
            return c;
          } else {
            return a;
          }
        }, undefined);
        const currentFilter = filter.getWhereObj();
        capture.organization_id =
          currentFilter.organizationId || getOrganizationUUID();
        log.debug(
          'organization_id:',
          currentFilter.organizationId,
          getOrganizationUUID(),
          capture.organization_id
        );
        log.debug('approve:%d', capture.id);
        log.trace('approve:%d', capture.id);
        await approve({
          capture,
          approveAction,
        });
        setApproveAllComplete(100 * ((i + 1) / total));
      }
    } catch (e) {
      log.warn('get error:', e);
      setIsLoading(false);
      setIsApproveAllProcessing(false);
      return false;
    }
    //push to undo list and set status flags
    setCaptureImagesUndo(undo), setIsLoading(false);
    await loadCaptureImages();
    setIsApproveAllProcessing(false);
    setApproveAllComplete(0);
    setInvalidateCaptureCount(true);

    resetSelection();
    return true;
  };

  const undoAll = async () => {
    log.debug('undo with state:', captureImagesUndo);
    setIsLoading(true);
    setIsApproveAllProcessing(true);

    const total = captureImagesUndo.length;
    log.debug('items:%d', captureImages.length);
    try {
      for (let i = 0; i < captureImagesUndo.length; i++) {
        const captureImage = captureImagesUndo[i];
        // log.trace('undo:%d', captureImage.id);
        await undoCaptureImage(captureImage.id);

        setApproveAllComplete(100 * ((i + 1) / total));
        setInvalidateCaptureCount(true);
      }
    } catch (e) {
      log.warn('get error:', e);

      //   // isRejectAllProcessing: false,
      setIsLoading(true);
      setIsApproveAllProcessing(true);
      return false;
    }
    setIsLoading(false);
    setIsApproveAllProcessing(false);
    setApproveAllComplete(0);
    setInvalidateCaptureCount(true);

    resetSelection();
    return true;
  };

  const updateFilter = async (updatedFilter = filter) => {
    setFilter(updatedFilter);
    // each time the filter updates clear the currently loaded captures
    reset();
    resetSelection();
  };

  const getCaptureCount = async (newfilter = filter) => {
    log.debug('-- verify getCaptureCount');

    const pageParams = {
      page: currentPage,
      rowsPerPage: pageSize,
      filter: newfilter,
    };
    const result = await api.getRawCaptures(pageParams);
    setCaptureCount(Number(result?.total));
    setInvalidateCaptureCount(false);
  };

  const value = {
    captureImages,
    captureImagesSelected,
    captureImageAnchor,
    captureImagesUndo,
    isLoading,
    isApproveAllProcessing,
    approveAllComplete,
    pageSize,
    currentPage,
    filter,
    invalidateCaptureCount,
    captureCount,
    loadCaptureImages,
    approveAll,
    undoAll: undoAll,
    updateFilter,
    getCaptureCount,
    clickCapture,
    setPageSize,
    setCurrentPage,
    setCaptureImagesSelected,
    getCaptureSelectedArr,
    getCaptureSelectedIdArr,
  };

  return (
    <VerifyContext.Provider value={value}>
      {props.children}
    </VerifyContext.Provider>
  );
}
