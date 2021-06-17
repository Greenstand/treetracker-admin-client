import React, { Component, createContext } from 'react';
import api from '../api/treeTrackerApi';
import FilterModel from '../models/Filter';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/VerifyContext');

export const VerifyContext = createContext({
  captureImages: [],
  captureImagesSelected: [],
  // captureImageAnchor: undefined,
  captureImagesUndo: [],
  isBulkApproving: false,
  isLoading: false,
  isApprovedAllProcessing: false,
  isRejectAllProcesssing: false,
  // rejectAllComplete: 0,
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
  // approve: () => {},
  // undoCaptureImage: () => {},
  loadCaptureImages: () => {},
  // rejectAll: () => {},
  approveAll: () => {},
  undoAll: () => {},
  updateFilter: () => {},
  getCaptureCount: () => {},
  clickCapture: () => {},
  // selectAll: () => {},
  set: () => {},
});

export class VerifyProvider extends Component {
  state = {
    captureImages: [],
    captureImagesSelected: [],
    // captureImageAnchor: undefined,
    captureImagesUndo: [],
    isBulkApproving: false,
    isLoading: false,
    isApprovedAllProcessing: false,
    isRejectAllProcesssing: false,
    // rejectAllComplete: 0,
    approveAllComplete: 0,
    pageSize: 12,
    currentPage: 0,
    filter: new FilterModel({
      approved: false,
      active: true,
    }),
    invalidateCaptureCount: true,
    captureCount: null,
  };

  // STATE HELPER FUNCTIONS

  appendCaptureImages(captureImages) {
    let newCaptureImages = [...this.state.captureImages, ...captureImages];
    this.setState({
      ...this.state,
      captureImages: newCaptureImages,
    });
  }

  // setCaptureImages(state, captureImages) {
  //   return {
  //     ...state,
  //     captureImages,
  //   };
  // }

  setLoading(isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

  // setApproveAllProcessing(state, isApproveAllProcessing) {
  //   return {
  //     ...state,
  //     isApproveAllProcessing,
  //   };
  // }

  // setIsBulkApproving(state, isBulkApproving) {
  //   return {
  //     ...state,
  //     isBulkApproving,
  //   };
  // }

  // setRejectAllProcessing(state, isRejectAllProcessing) {
  //   return {
  //     ...state,
  //     isRejectAllProcessing,
  //   };
  // }

  setCaptureCount(captureCount) {
    this.setState({
      ...this.state,
      captureCount: Number(captureCount),
      invalidateCaptureCount: false,
    });
  }

  invalidateCaptureCount(count) {
    this.setState({
      ...this.state,
      invalidateCaptureCount: count,
    });
  }

  // setApproveAllComplete(state, approveAllComplete) {
  //   return {
  //     ...state,
  //     approveAllComplete,
  //     invalidateCaptureCount: true,
  //   };
  // }

  // setRejectAllComplete(state, rejectAllComplete) {
  //   return {
  //     ...state,
  //     rejectAllComplete,
  //     invalidateCaptureCount: true,
  //   };
  // }

  // /*
  //  * replace approve and reject
  //  */
  // approved(state, captureId) {
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

  setFilter(filter = this.state.filter) {
    log.debug('setFilter', filter);
    // ensure filter is a FilterModel
    const newFilter = new FilterModel(filter);
    this.setState((prevState) => {
      return filter.getWhereObj()
        ? { ...prevState, filter }
        : { ...prevState, filter: newFilter };
    });
  }

  // to reset the page status, load from beginning
  reset() {
    this.setState({
      ...this.state,
      captureImages: [],
      currentPage: 0,
      captureCount: null,
      invalidateCaptureCount: true,
    });
  }
  /*
   * to clear all selection
   */
  resetSelection() {
    this.setState({
      ...this.state,
      captureImagesSelected: [],
      captureImageAnchor: undefined,
    });
  }

  // ALLOW STATE TO BE SET FROM CHILD COMPONENT

  set = (obj) => {
    this.setState({
      ...this.state,
      ...obj,
    });
  };

  // EVENT HANDLERS

  approveCaptureImage = async (id) => {
    await api.approveCaptureImage(id);
    this.approvedCaptureImage(id);
    return true;
  };

  rejectCaptureImage = async (id) => {
    await api.rejectCaptureImage(id);
    this.rejectedCaptureImage(id);
    return true;
  };

  approve = async (payload) => {
    if (!payload.approveAction) {
      throw Error('no apprive action object!');
    }
    if (payload.approveAction.isApproved) {
      log.debug('approve');
      await api.approveCaptureImage(
        payload.id,
        payload.approveAction.morphology,
        payload.approveAction.age,
        payload.approveAction.captureApprovalTag,
        payload.approveAction.speciesId,
      );
    } else {
      log.debug('reject');
      await api.rejectCaptureImage(
        payload.id,
        payload.approveAction.rejectionReason,
      );
    }

    if (payload.approveAction.tags) {
      await api.createCaptureTags(payload.id, payload.approveAction.tags);
    }

    this.approved(payload.id);
    return true;
  };

  undoCaptureImage = async (id) => {
    await api.undoCaptureImage(id);
    this.undoedCaptureImage(id);
    return true;
  };

  loadCaptureImages = async () => {
    const verifyState = this.state;
    log.debug('to load images');

    // if it's already loading, has all the images, or has enough images for the next page alreay don't load images
    if (
      verifyState.isLoading ||
      (verifyState.captureCount > 0 &&
        verifyState.captureImages.length >= verifyState.captureCount) ||
      verifyState.pageSize * (verifyState.currentPage + 1) <=
        verifyState.captureImages.length
    ) {
      // No need to request more images
      log.debug("cancel load because condition doesn't meet");
      return true;
    }
    //set loading status
    this.setLoading(true);

    const pageParams = {
      //page: nextPage,
      //REVISE Fri Aug 16 10:56:34 CST 2019
      //change the api to use skip parameter directly, because there is a
      //bug to use page as param
      skip: verifyState.captureImages.length,
      rowsPerPage:
        verifyState.pageSize * (verifyState.currentPage + 1) -
        verifyState.captureImages.length,
      filter: verifyState.filter,
    };
    log.debug('load page with params:', pageParams);
    const result = await api.getCaptureImages(pageParams);
    log.debug('loaded captures:', result.length);
    this.appendCaptureImages(result);
    //restore loading status
    this.setLoading(false);
    return true;
  };

  // rejectAll = async () => {
  //   log.debug('rejectAll with state:', this.state);
  //   this.setLoading(true);
  //   this.setApproveAllProcessing(true);
  //   this.setIsBulkRejecting(true);
  //   const verifyState = this.state;
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
  //       await this.rejectCaptureImage(captureImage.id);
  //       this.setApproveAllComplete(100 * ((i + 1) / total));
  //     }
  //   } catch (e) {
  //     log.warn('get error:', e);
  //     this.setLoading(false);
  //     this.setRejectAllProcessing(false);
  //     return false;
  //   }
  //   //push to undo list
  //   this.set({
  //     captureImagesUndo: undo,
  //   });
  //   //finished, set status flags
  //   this.setLoading(false);
  //   this.setApproveAllProcessing(false);
  //   this.setRejectAllProcessing(false);
  //   this.invalidateCaptureCount(true);

  //   //reset
  //   this.setApproveAllComplete(0);
  //   this.resetSelection();
  //   return true;
  // };

  approveAll = async (payload) => {
    log.debug('approveAll with state:', this.state);
    this.setLoading(true);
    this.setApproveAllProcessing(true);
    this.setIsBulkApproving(true);
    const verifyState = this.state;
    const total = verifyState.captureImagesSelected.length;
    const undo = verifyState.captureImages.filter((capture) =>
      verifyState.captureImagesSelected.some((id) => id === capture.id),
    );
    log.debug('items:%d', verifyState.captureImages.length);
    try {
      for (let i = 0; i < verifyState.captureImagesSelected.length; i++) {
        const captureId = verifyState.captureImagesSelected[i];
        const captureImage = verifyState.captureImages.reduce((a, c) => {
          if (c && c.id === captureId) {
            return c;
          } else {
            return a;
          }
        }, undefined);
        // log.trace('approve:%d', captureImage.id);
        await this.approve({
          id: captureImage.id,
          approveAction: payload.approveAction,
        });
        this.setApproveAllComplete(100 * ((i + 1) / total));
      }
    } catch (e) {
      log.warn('get error:', e);
      this.setLoading(false);
      this.setApproveAllProcessing(false);
      return false;
    }
    //push to undo list
    this.set({
      captureImagesUndo: undo,
    });
    //finished, set status flags
    this.setLoading(false);
    this.setApproveAllProcessing(false);
    this.invalidateCaptureCount(true);
    //reset
    this.setApproveAllComplete(0);
    this.resetSelection();
    return true;
  };

  undoAll = async () => {
    log.debug('undo with state:', this.state);
    this.setLoading(true);
    this.setRejectAllProcessing(true);
    this.setApproveAllProcessing(true);
    const verifyState = this.state;
    const total = verifyState.captureImagesUndo.length;
    log.debug('items:%d', verifyState.captureImages.length);
    try {
      for (let i = 0; i < verifyState.captureImagesUndo.length; i++) {
        const captureImage = verifyState.captureImagesUndo[i];
        // log.trace('undo:%d', captureImage.id);
        await this.undoCaptureImage(captureImage.id);
        this.setApproveAllComplete(100 * ((i + 1) / total));
      }
    } catch (e) {
      log.warn('get error:', e);
      this.setLoading(false);
      this.setRejectAllProcessing(false);
      this.setApproveAllProcessing(false);
      return false;
    }
    //finished, set status flags
    this.setLoading(false);
    this.setIsBulkApproving(false);
    this.setIsBulkRejecting(false);
    this.setApproveAllProcessing(false);
    this.setRejectAllProcessing(false);
    //reset
    this.setRejectAllComplete(0);
    this.setApproveAllComplete(0);
    this.invalidateCaptureCount(true);
    this.resetSelection();
    return true;
  };

  updateFilter = async (filter = this.state.filter) => {
    // each time the filter updates clear the currently loaded captures
    await this.setFilter(filter);
    await this.reset();
    await this.resetSelection();
    //clear all stuff
    await this.loadCaptureImages();
  };

  getCaptureCount = async (filter = this.state.filter) => {
    this.invalidateCaptureCount(false);
    const result = await api.getCaptureCount(filter);
    this.setCaptureCount(result.count);
    return true;
  };

  clickCapture = (payload) => {
    //{{{
    const { captureId, isShift, isCmd, isCtrl } = payload;
    if (!isShift && !isCmd && !isCtrl) {
      this.set({
        captureImagesSelected: [captureId],
        captureImageAnchor: captureId,
      });
    } else if (isShift) {
      log.debug(
        'press shift, and there is an anchor:',
        this.captureImageAnchor,
      );
      //if no anchor, then, select from beginning
      let indexAnchor = 0;
      if (this.captureImageAnchor !== undefined) {
        indexAnchor = this.captureImages.reduce((a, c, i) => {
          if (c !== undefined && c.id === this.captureImageAnchor) {
            return i;
          } else {
            return a;
          }
        }, -1);
      }
      const indexCurrent = this.captureImages.reduce((a, c, i) => {
        if (c !== undefined && c.id === captureId) {
          return i;
        } else {
          return a;
        }
      }, -1);
      const captureImagesSelected = this.captureImages
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
      this.set({
        captureImagesSelected,
      });
    } else if (isCmd || isCtrl) {
      // Toggle the selection state
      let captureImagesSelected;
      if (this.captureImagesSelected.find((el) => el === captureId)) {
        captureImagesSelected = this.captureImagesSelected.filter(function (
          capture,
        ) {
          return capture !== captureId;
        });
      } else {
        captureImagesSelected = [...this.captureImagesSelected, captureId];
      }
      this.set({
        captureImagesSelected,
      });
    }
    //}}}
  };

  // selectAll(selected, state) {
  //   //{{{
  //   this.set({
  //     captureImagesSelected: selected
  //       ? this.captureImages.map((capture) => capture.id)
  //       : [],
  //     captureImageAnchor: undefined,
  //   });
  //   //}}}
  // }

  render() {
    const value = {
      captureImages: this.state.captureImages,
      captureImagesSelected: this.state.captureImagesSelected,
      // captureImageAnchor: this.state.captureImageAnchor,
      captureImagesUndo: this.state.captureImagesUndo,
      isBulkApproving: this.state.isBulkApproving,
      isLoading: this.state.isLoading,
      isApproveAllProcessing: this.state.isApprovedAllProcessing,
      isRejectAllProcesssing: this.state.isRejectAllProcessing,
      // rejectAllComplete: this.state.rejectAllComplete,
      approveAllComplete: this.state.approveAllComplete,
      pageSize: this.state.pageSize,
      currentPage: this.state.currentPage,
      filter: this.state.filter,
      invalidateCaptureCount: this.state.invalidateCaptureCount,
      captureCount: this.state.captureCount,
      // approveCaptureImage: this.approveCaptureImage,
      // rejectCaptureImage: this.rejectCaptureImage,
      // approve: this.approve,
      // undoCaptureImage: this.undoCaptureImage,
      loadCaptureImages: this.loadCaptureImages,
      // rejectAll: this.rejectAll,
      approveAll: this.approveAll,
      undoAll: this.undoAll,
      updateFilter: this.updateFilter,
      getCaptureCount: this.getCaptureCount,
      clickCapture: this.clickCapture,
      // selectAll: this.selectAll,
      set: this.set,
    };
    return (
      <VerifyContext.Provider value={value}>
        {this.props.children}
      </VerifyContext.Provider>
    );
  }
}
