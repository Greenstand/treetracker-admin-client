import React, { useState, useEffect, createContext } from 'react';
import api from '../api/treeTrackerApi';
import FilterModel from '../models/Filter';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/VerifyContext');

export const VerifyContext = createContext({
  captureImages: [],
  captureImagesSelected: [],
  captureImageAnchor: undefined,
  captureImagesUndo: [],
  // isBulkApproving: false,
  isLoading: false,
  isApproveAllProcessing: false,
  // isRejectAllProcesssing: false,
  approveAllComplete: 0,
  pageSize: 12,
  currentPage: 0,
  filter: new FilterModel({
    approved: false,
    active: true,
  }),
  invalidateCaptureCount: true,
  captureCount: null,
  // approveCaptureImage: () => {},
  // rejectCaptureImage: () => {},
  approve: () => {},
  // undoCaptureImage: () => {},
  loadCaptureImages: () => {},
  // rejectAll: () => {},
  approveAll: () => {},
  undoAll: () => {},
  updateFilter: () => {},
  getCaptureCount: () => {},
  clickCapture: () => {},
  // selectAll: () => {},
  // set: () => {},
  setPageSize: () => {},
  setCurrentPage: () => {},
});

export function VerifyProvider(props) {
  const [captureImages, setCaptureImages] = useState([]);
  const [captureImagesUndo, setCaptureImagesUndo] = useState([]);
  const [captureImagesSelected, setCaptureImagesSelected] = useState([]);
  const [captureImageAnchor, setCaptureImageAnchor] = useState(undefined);
  // const [isBulkApproving, setIsBulkApproving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproveAllProcessing, setIsApproveAllProcessing] = useState(false);
  const [approveAllComplete, setApproveAllComplete] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState(
    new FilterModel({
      approved: false,
      active: true,
    }),
  );
  const [invalidateCaptureCount, setInvalidateCaptureCount] = useState(true);
  const [captureCount, setCaptureCount] = useState(null);

  useEffect(() => {
    if (invalidateCaptureCount) getCaptureCount();
  }, [invalidateCaptureCount]);

  // STATE HELPER FUNCTIONS

  const appendCaptureImages = (images) => {
    // console.log('appendCaptureImages', captureImages);
    let newCaptureImages = [...captureImages, ...images];
    setCaptureImages(newCaptureImages);
  };

  // /*
  //  * replace approve and reject
  //  */
  const approved = (captureId) => {
    //remove from captures
    const captured = captureImages.filter(
      (captureImage) => captureImage.id !== captureId,
    );
    //remove if selected
    const selectedImages = captureImagesSelected.filter(
      (id) => id !== captureId,
    );
    setCaptureImages(captured);
    setCaptureImagesSelected(selectedImages);
  };

  // approvedCaptureImage(state, captureId) {
  //   const captureImages = state.captureImages.filter(
  //     (captureImage) => captureImage.id !== captureId,
  //   );
  //   //remove if selected
  //   const captureImagesSelected = state.captureImagesSelected.filter(
  //     (id) => id !== captureId,
  //   );
  //   return {
  //     ...state,
  //     captureImages,
  //     captureImagesSelected,
  //   };
  // }

  // rejectedCaptureImage(state, captureId) {
  //   const captureImages = state.captureImages.filter(
  //     (captureImage) => captureImage.id !== captureId,
  //   );
  //   //remove if selected
  //   const captureImagesSelected = state.captureImagesSelected.filter(
  //     (id) => id !== captureId,
  //   );
  //   return {
  //     ...state,
  //     captureImages,
  //     captureImagesSelected,
  //   };
  // }

  const undoedCaptureImage = (state, captureId) => {
    //put the capture back, from undo list, sort by id
    const captureUndo = captureImagesUndo.reduce((a, c) =>
      c.id === captureId ? c : a,
    );
    const undoneImages = captureImagesUndo.filter(
      (capture) => capture.id !== captureId,
    );
    const captures = [...captureImages, captureUndo].sort(
      (a, b) => a.id - b.id,
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
    setCaptureImagesSelected([]);
    setCaptureImageAnchor(undefined);
  };

  // EVENT HANDLERS

  // approveCaptureImage = async (id) => {
  //   await api.approveCaptureImage(id);
  //   approvedCaptureImage(id);
  //   return true;
  // };

  // rejectCaptureImage = async (id) => {
  //   await api.rejectCaptureImage(id);
  //   rejectedCaptureImage(id);
  //   return true;
  // };

  const approve = async ({ approveAction, id }) => {
    if (!approveAction) {
      throw Error('no approve action object!');
    }
    if (approveAction.isApproved) {
      log.debug('approve');
      await api.approveCaptureImage(
        id,
        approveAction.morphology,
        approveAction.age,
        approveAction.captureApprovalTag,
        approveAction.speciesId,
      );
    } else {
      log.debug('reject');
      await api.rejectCaptureImage(id, approveAction.rejectionReason);
    }

    if (approveAction.tags) {
      await api.createCaptureTags(id, approveAction.tags);
    }

    approved(id);
    return true;
  };

  const undoCaptureImage = async (id) => {
    await api.undoCaptureImage(id);
    undoedCaptureImage(id);
    return true;
  };

  const loadCaptureImages = async (abortController) => {
    log.debug('to load images');
    // console.log(
    //   isLoading,
    //   captureCount,
    //   captureImages.length,
    //   pageSize * (currentPage + 1),
    //   pageSize * (currentPage + 1) <= captureImages.length,
    // );

    // if it's already loading, has all the images, or has enough images for the next page already don't load images
    if (
      isLoading ||
      (captureCount > 0 && captureImages.length >= captureCount) ||
      pageSize * (currentPage + 1) <= captureImages.length
    ) {
      // No need to request more images
      log.debug("cancel load because condition doesn't meet");
      return true;
    }
    //set loading status
    setIsLoading(true);

    const pageParams = {
      //page: nextPage,
      //REVISE Fri Aug 16 10:56:34 CST 2019
      //change the api to use skip parameter directly, because there is a bug to use page as param
      skip: captureImages.length,
      rowsPerPage: pageSize * (currentPage + 1) - captureImages.length,
      filter: filter,
    };
    log.debug('load page with params:', pageParams);
    const result = await api.getCaptureImages(pageParams, abortController);
    log.debug('loaded captures:', result.length);
    appendCaptureImages(result);
    //restore loading status
    setIsLoading(false);
  };

  // rejectAll = async () => {
  //   log.debug('rejectAll with state:', state);
  //   set({
  //     isLoading: true,
  //     isApproveAllProcessing: true,
  //     isBulkApproving: true,
  //   });

  //   const verifyState = state;
  //   const total = verifyState.captureImagesSelected.length;
  //   const undo = verifyState.captureImages.filter((capture) =>
  //     verifyState.captureImagesSelected.some((id) => id === capture.id),
  //   );
  //   log.debug('items:%d', verifyState.captureImages.length);
  //   try {
  //     for (let i = 0; i < verifyState.captureImagesSelected.length; i++) {
  //       const captureId = verifyState.captureImagesSelected[i];
  //       const captureImage = verifyState.captureImages.reduce((a, c) => {
  //         if (c && c.id === captureId) {
  //           return c;
  //         } else {
  //           return a;
  //         }
  //       }, undefined);
  //       // log.trace('reject:%d', captureImage.id);
  //       await rejectCaptureImage(captureImage.id);
  //       set({
  //         approveAllComplete: 100 * ((i + 1) / total),
  //         invalidateCaptureCount: true,
  //       });
  //     }
  //   } catch (e) {
  //     log.warn('get error:', e);
  //     set({ isLoading: false });
  //     setRejectAllProcessing(false);
  //     return false;
  //   }
  //   //push to undo list
  //   //finished, set status flags
  //   set({
  //     captureImagesUndo: undo,
  //     isLoading: false,
  //     isApproveAllProcessing: false,
  //     // isRejectAllProcessing: false,
  //     approveAllComplete: 0,
  //     invalidateCaptureCount: true,
  //   });

  //   //reset
  //   resetSelection();
  // };

  const approveAll = async (approveAction) => {
    log.debug('approveAll with approveAction:', approveAction);
    setIsLoading(true);
    setIsApproveAllProcessing(true);
    // setIsBulkApproving(true)

    const total = captureImagesSelected.length;
    const undo = captureImages.filter((capture) =>
      captureImagesSelected.some((id) => id === capture.id),
    );
    log.debug('items:%d', captureImages.length);
    try {
      for (let i = 0; i < total; i++) {
        const captureId = captureImagesSelected[i];
        const captureImage = captureImages.reduce((a, c) => {
          if (c && c.id === captureId) {
            return c;
          } else {
            return a;
          }
        }, undefined);
        log.debug('approve:%d', captureImage.id);
        log.trace('approve:%d', captureImage.id);
        await approve({
          id: captureImage.id,
          approveAction,
        });
        setApproveAllComplete(100 * ((i + 1) / total));
        // setInvalidateCaptureCount(true);
      }
    } catch (e) {
      log.warn('get error:', e);
      setIsLoading(false);
      setIsApproveAllProcessing(false);
      return false;
    }
    //push to undo list and set status flags
    setCaptureImagesUndo(undo), setIsLoading(false);
    setIsApproveAllProcessing(false);
    // setIsBulkApproving(false)
    setApproveAllComplete(0);
    setInvalidateCaptureCount(true);

    resetSelection();
    return true;
  };

  const undoAll = async () => {
    log.debug('undo with state:', captureImagesUndo);
    setIsLoading(true);
    setIsApproveAllProcessing(true);
    // setIsRejectAllProcessing(true);

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
    //finished, set status flags
    //   // isBulkApproving: false,
    //   // isRejectAllProcessing: false,
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
    // console.log('-- verify getCaptureCount');
    // setInvalidateCaptureCount(false);
    const result = await api.getCaptureCount(newfilter);
    setCaptureCount(Number(result.count));
    setInvalidateCaptureCount(false);
  };

  const clickCapture = (payload) => {
    //{{{
    const { captureId, isShift, isCmd, isCtrl } = payload;
    if (!isShift && !isCmd && !isCtrl) {
      setCaptureImagesSelected([captureId]);
      setCaptureImageAnchor(captureId);
    } else if (isShift) {
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
      const captureImagesSelected = captureImages
        .slice(
          Math.min(indexAnchor, indexCurrent),
          Math.max(indexAnchor, indexCurrent) + 1,
        )
        .map((capture) => capture.id);
      // log.trace(
      //   'find range:[%d,%d], selected:%d',
      //   indexAnchor,
      //   indexCurrent,
      //   captureImagesSelected.length,
      // );
      setCaptureImagesSelected(captureImagesSelected);
    } else if (isCmd || isCtrl) {
      // Toggle the selection state
      let selectedImages;
      if (captureImagesSelected.find((el) => el === captureId)) {
        selectedImages = captureImagesSelected.filter(function (capture) {
          return capture !== captureId;
        });
      } else {
        selectedImages = [...captureImagesSelected, captureId];
      }
      setCaptureImagesSelected(selectedImages);
    }
    //}}}
  };

  // selectAll(selected, state) {
  //   //{{{
  //   set({
  //     captureImagesSelected: selected
  //       ? captureImages.map((capture) => capture.id)
  //       : [],
  //     captureImageAnchor: undefined,
  //   });
  //   //}}}
  // }

  const value = {
    captureImages,
    captureImagesSelected,
    captureImageAnchor,
    captureImagesUndo,
    // isBulkApproving,
    isLoading,
    isApproveAllProcessing,
    // isRejectAllProcesssing: isRejectAllProcessing,
    approveAllComplete,
    pageSize,
    currentPage,
    filter,
    invalidateCaptureCount,
    captureCount,
    // approveCaptureImage: approveCaptureImage,
    // rejectCaptureImage: rejectCaptureImage,
    // approve: approve,
    // undoCaptureImage: undoCaptureImage,
    loadCaptureImages,
    // rejectAll: rejectAll,
    approveAll,
    undoAll: undoAll,
    updateFilter,
    getCaptureCount,
    clickCapture,
    // selectAll: selectAll,
    // set,
    setPageSize,
    setCurrentPage,
  };

  return (
    <VerifyContext.Provider value={value}>
      {props.children}
    </VerifyContext.Provider>
  );
}
