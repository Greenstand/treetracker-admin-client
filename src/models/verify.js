/*
 * The model for verify page
 */
import * as loglevel from 'loglevel';
import api from '../api/treeTrackerApi';
import FilterModel from './Filter';

const log = loglevel.getLogger('../models/verify');

const verify = {
  state: {
    captureImages: [],
    /*
     * The array of all current selected captures, user click to select true
     * [captureId, captureId, ...]
     */
    captureImagesSelected: [],
    /*
     * this is a capture id, used to assist selecting captures, when click a capture,
     * and press shift to select a range, then, need use this capture id to cal
     * the whole range
     */
    captureImageAnchor: undefined,
    /*
     * When approved a lot of captures, put them in this array, so could undo the
     * approving action
     * Note, the element of this array is capture object, not capture id
     */
    captureImagesUndo: [],
    /*
     * When approving a lot of captures, set isBulkApproving to true
     * set it back to false when undo
     */
    isBulkApproving: false,
    isLoading: false,
    isRejectAllProcessing: false,
    isApproveAllProcessing: false,
    //cal the complete of progress (0-100)
    rejectAllComplete: 0,
    approveAllComplete: 0,
    pageSize: 12,
    currentPage: 0,
    /*
     * The default value means: image not approved yet, and not rejected yet too
     */
    filter: new FilterModel({
      approved: false,
      active: true,
    }),
    verifiedFilter: new FilterModel({
      approved: true,
      active: true,
    }),
    rejectedFilter: new FilterModel({
      approved: false,
      active: false,
    }),

    invalidateCaptureCount: true,
    invalidateVerifiedCount: true,
    invalidateRejectedCount: true,
    captureCount: null,
    rejectedCaptureCount: null,
    verifiedCaptureCount: null,
  },
  reducers: {
    appendCaptureImages(state, captureImages) {
      let newCaptureImages = [...state.captureImages, ...captureImages];
      let newState = {
        ...state,
        captureImages: newCaptureImages,
      };
      return newState;
    },
    setCaptureImages(state, captureImages) {
      return {
        ...state,
        captureImages,
      };
    },
    setLoading(state, isLoading) {
      return {
        ...state,
        isLoading,
      };
    },
    setApproveAllProcessing(state, isApproveAllProcessing) {
      return {
        ...state,
        isApproveAllProcessing,
      };
    },
    setIsBulkApproving(state, isBulkApproving) {
      return {
        ...state,
        isBulkApproving,
      };
    },
    setRejectAllProcessing(state, isRejectAllProcessing) {
      return {
        ...state,
        isRejectAllProcessing,
      };
    },
    setFilter(state, filter) {
      log.debug('setFilter', state.filter, filter);
      // ensure filter is a FilterModel
      const newFilter = new FilterModel(filter);
      return filter.getWhereObj()
        ? { ...state, filter }
        : { ...state, filter: newFilter };
    },
    setCaptureCount(state, captureCount) {
      return {
        ...state,
        captureCount: Number(captureCount),
        invalidateCaptureCount: false,
      };
    },
    invalidateCaptureCount(state, payload) {
      return {
        ...state,
        invalidateCaptureCount: payload,
      };
    },
    setRejectedCaptureCount(state, unprocessedCaptureCount) {
      return {
        ...state,
        unprocessedCaptureCount,
        invalidateRejectedCount: false,
      };
    },
    invalidateRejectedCount(state, payload) {
      return {
        ...state,
        invalidateRejectedCount: payload,
      };
    },
    setVerifiedCaptureCount(state, verifiedCaptureCount) {
      window.api = api;
      return {
        ...state,
        verifiedCaptureCount,
        invalidateVerifiedCount: false,
      };
    },
    invalidateVerifiedCount(state, payload) {
      return {
        ...state,
        invalidateVerifiedCount: payload,
      };
    },
    setApproveAllComplete(state, approveAllComplete) {
      return {
        ...state,
        approveAllComplete,
        invalidateCaptureCount: true,
        invalidateVerifiedCount: true,
      };
    },
    setRejectAllComplete(state, rejectAllComplete) {
      return {
        ...state,
        rejectAllComplete,
        invalidateCaptureCount: true,
        invalidateRejectedCount: true,
      };
    },
    /*
     * replace approve and reject
     */
    approved(state, captureId) {
      const captureImages = state.captureImages.filter(
        (captureImage) => captureImage.id !== captureId,
      );
      //remove if selected
      const captureImagesSelected = state.captureImagesSelected.filter(
        (id) => id !== captureId,
      );
      return {
        ...state,
        captureImages,
        captureImagesSelected,
      };
    },
    approvedCaptureImage(state, captureId) {
      const captureImages = state.captureImages.filter(
        (captureImage) => captureImage.id !== captureId,
      );
      //remove if selected
      const captureImagesSelected = state.captureImagesSelected.filter(
        (id) => id !== captureId,
      );
      return {
        ...state,
        captureImages,
        captureImagesSelected,
      };
    },
    rejectedCaptureImage(state, captureId) {
      const captureImages = state.captureImages.filter(
        (captureImage) => captureImage.id !== captureId,
      );
      //remove if selected
      const captureImagesSelected = state.captureImagesSelected.filter(
        (id) => id !== captureId,
      );
      return {
        ...state,
        captureImages,
        captureImagesSelected,
      };
    },
    undoedCaptureImage(state, captureId) {
      /*
       * put the capture back, from undo list, sort by id
       */
      const captureUndo = state.captureImagesUndo.reduce((a, c) =>
        c.id === captureId ? c : a,
      );
      const captureImagesUndo = state.captureImagesUndo.filter(
        (capture) => capture.id !== captureId,
      );
      const captureImages = [...state.captureImages, captureUndo].sort(
        (a, b) => a.id - b.id,
      );
      return {
        ...state,
        captureImages,
        captureImagesUndo,
      };
    },
    //to reset the page status, load from beginning
    reset(state) {
      return {
        ...state,
        captureImages: [],
        currentPage: 0,
        captureCount: null,
        verifiedCaptureCount: null,
        unprocessedCaptureCount: null,
        invalidateCaptureCount: true,
        invalidateVerifiedCount: true,
        invalidateRejectedCount: true,
      };
    },
    /*
     * to clear all selection
     */
    resetSelection(state) {
      return {
        ...state,
        captureImagesSelected: [],
        captureImageAnchor: undefined,
      };
    },
    /*
     * could we set reducer with a generic way?
     */
    set(state, object) {
      return {
        ...state,
        ...object,
      };
    },
  },
  effects: {
    /*
     * Dedicated, by approve
     * approve a capture, given capture id
     */
    async approveCaptureImage(id) {
      await api.approveCaptureImage(id);
      this.approvedCaptureImage(id);
      return true;
    },
    /*
     * Dedicated, by approve
     * reject a capture, given capture id
     */
    async rejectCaptureImage(id) {
      await api.rejectCaptureImage(id);
      this.rejectedCaptureImage(id);
      return true;
    },
    /*
     * Sat Apr 11 17:23:16 CST 2020
     * use new method to replace old ones: approveCaptureImage, rejectCaptureImage
     * add approveAction to indicate if it's approve or reject, and other
     * arguments
     *
     * payload: {
     *  id,
     *  approveAction,
     * }
     */
    async approve(payload) {
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
    },
    async undoCaptureImage(id) {
      await api.undoCaptureImage(id);
      this.undoedCaptureImage(id);
      return true;
    },
    /*
     * To load captures into the list
     */
    async loadCaptureImages(_payload, state) {
      //{{{
      log.debug('to load images');
      const verifyState = state.verify;

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
      //}}}
    },

    /*
     * Dedicated, by approveAll
     * reject all capture
     */
    async rejectAll(payload, state) {
      log.debug('rejectAll with state:', state);
      this.setLoading(true);
      this.setApproveAllProcessing(true);
      this.setIsBulkRejecting(true);
      const verifyState = state.verify;
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
          log.trace('reject:%d', captureImage.id);
          await this.rejectCaptureImage(captureImage.id);
          this.setApproveAllComplete(100 * ((i + 1) / total));
        }
      } catch (e) {
        log.warn('get error:', e);
        this.setLoading(false);
        this.setRejectAllProcessing(false);
        return false;
      }
      //push to undo list
      this.set({
        captureImagesUndo: undo,
      });
      //finished, set status flags
      this.setLoading(false);
      this.setApproveAllProcessing(false);
      this.setRejectAllProcessing(false);
      this.invalidateVerifiedCount(true);
      this.invalidateCaptureCount(true);
      this.invalidateRejectedCount(true);

      //reset
      this.setApproveAllComplete(0);
      this.resetSelection();
      return true;
    },

    /*
     * approve all capture
     * REVISE Tue Apr 14 16:20:31 CST 2020
     * Merge approve and reject to one, just: approveAll
     * payload : {
     *  approveAction,
     * }
     *
     */
    async approveAll(payload, state) {
      //{{{
      log.debug('approveAll with state:', state);
      this.setLoading(true);
      this.setApproveAllProcessing(true);
      this.setIsBulkApproving(true);
      const verifyState = state.verify;
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
          log.trace('approve:%d', captureImage.id);
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
      this.invalidateRejectedCount(true);
      this.invalidateCaptureCount(true);
      this.invalidateVerifiedCount(true);
      //reset
      this.setApproveAllComplete(0);
      this.resetSelection();
      return true;
      //}}}
    },
    /*
     * Dedicated
     * To undo all approved captures
     */
    async undoAll(payload, state) {
      //{{{
      log.debug('undo with state:', state);
      this.setLoading(true);
      this.setRejectAllProcessing(true);
      this.setApproveAllProcessing(true);
      const verifyState = state.verify;
      const total = verifyState.captureImagesUndo.length;
      log.debug('items:%d', verifyState.captureImages.length);
      try {
        for (let i = 0; i < verifyState.captureImagesUndo.length; i++) {
          const captureImage = verifyState.captureImagesUndo[i];
          log.trace('undo:%d', captureImage.id);
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
      this.invalidateRejectedCount(true);
      this.invalidateCaptureCount(true);
      this.invalidateVerifiedCount(true);
      this.resetSelection();
      return true;
      //}}}
    },
    /*
     * trigger when user submit filter form
     */
    async updateFilter(filter) {
      //{{{
      this.setFilter(filter);
      this.reset();
      this.resetSelection();
      //clear all stuff
      await this.loadCaptureImages();
      //}}}
    },
    /*
     * gets and sets count for unverified captures
     */
    async getCaptureCount(payload, state) {
      this.invalidateCaptureCount(false);
      const result = await api.getCaptureCount(state.verify.filter);
      this.setCaptureCount(result.count);
      return true;
    },

    /*
     * gets and sets count for captures with no tag data (entirely unprocessed)
     */
    async getRejectedCaptureCount(payload, state) {
      this.invalidateRejectedCount(false);
      const result = await api.getCaptureCount(state.verify.rejectedFilter);
      this.setRejectedCaptureCount(result.count);
      return true;
    },

    /*
     * gets and sets count for captures that are active and approved
     */
    async getVerifiedCaptureCount(payload, state) {
      this.invalidateVerifiedCount(false);
      const result = await api.getCaptureCount(state.verify.verifiedFilter);
      this.setVerifiedCaptureCount(result.count);
      return true;
    },

    /*
     * to select captures
     * payload:
     *   {
     *     captureId    : string,
     *     isShift    : boolean,
     *     isCmd    : boolean,
     *     isCtrl    : boolean
     *     }
     */
    clickCapture(payload, state) {
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
          state.verify.captureImageAnchor,
        );
        //if no anchor, then, select from beginning
        let indexAnchor = 0;
        if (state.verify.captureImageAnchor !== undefined) {
          indexAnchor = state.verify.captureImages.reduce((a, c, i) => {
            if (c !== undefined && c.id === state.verify.captureImageAnchor) {
              return i;
            } else {
              return a;
            }
          }, -1);
        }
        const indexCurrent = state.verify.captureImages.reduce((a, c, i) => {
          if (c !== undefined && c.id === captureId) {
            return i;
          } else {
            return a;
          }
        }, -1);
        const captureImagesSelected = state.verify.captureImages
          .slice(
            Math.min(indexAnchor, indexCurrent),
            Math.max(indexAnchor, indexCurrent) + 1,
          )
          .map((capture) => capture.id);
        log.trace(
          'find range:[%d,%d], selected:%d',
          indexAnchor,
          indexCurrent,
          captureImagesSelected.length,
        );
        this.set({
          captureImagesSelected,
        });
      } else if (isCmd || isCtrl) {
        // Toggle the selection state
        let captureImagesSelected;
        if (state.verify.captureImagesSelected.find((el) => el === captureId)) {
          captureImagesSelected = state.verify.captureImagesSelected.filter(
            function (capture) {
              return capture !== captureId;
            },
          );
        } else {
          captureImagesSelected = [
            ...state.verify.captureImagesSelected,
            captureId,
          ];
        }
        this.set({
          captureImagesSelected,
        });
      }
      //}}}
    },
    selectAll(selected, state) {
      //{{{
      this.set({
        captureImagesSelected: selected
          ? state.verify.captureImages.map((capture) => capture.id)
          : [],
        captureImageAnchor: undefined,
      });
      //}}}
    },
  },
};

export default verify;
