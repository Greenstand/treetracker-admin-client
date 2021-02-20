/*
 * The model for verity page
 */
import * as loglevel    from 'loglevel'
import api    from '../api/treeTrackerApi'
import FilterModel    from './Filter';

const log    = loglevel.getLogger('../models/verity')

const verity = {
  state: {
    treeImages    : [],
    /*
     * The array of all current selected trees, user click to select true
     * [treeId, treeId, ...]
     */
    treeImagesSelected    : [],
    /*
     * this is a tree id, used to assist selecting trees, when click a tree,
     * and press shift to select a range, then, need use this tree id to cal
     * the whole range
     */
    treeImageAnchor    : undefined,
    /*
     * When approved a lot of trees, put them in this array, so could undo the
     * approving action
     * Note, the element of this array is tree object, not tree id
     */
    treeImagesUndo    : [],
    /*
     * When approving a lot of trees, set isBulkApproving to true
     * set it back to false when undo
     */
    isBulkApproving    : false,
    isLoading    : false,
    isRejectAllProcessing    : false,
    isApproveAllProcessing    : false,
    //cal the complete of progress (0-100)
    rejectAllComplete    : 0,
    approveAllComplete    : 0,
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
      active: false
    }),

    invalidateTreeCount: true,
    invalidateVerifiedCount: true,
    invalidateRejectedCount: true,
    treeCount: null,
    rejectedTreeCount: null,
    verifiedTreeCount: null,
  },
  reducers: {
    appendTreeImages(state, treeImages){
      let newTreeImages = [...state.treeImages, ...treeImages]
      let newState = {
        ...state,
        treeImages: newTreeImages,
      };
      return newState;
    },
    setTreeImages(state, treeImages){
      return {
        ...state,
        treeImages,
      }
    },
    setLoading(state, isLoading){
      return {
        ...state,
        isLoading,
      };
    },
    setApproveAllProcessing(state, isApproveAllProcessing){
      return {
        ...state,
        isApproveAllProcessing,
      }
    },
    setIsBulkApproving(state, isBulkApproving){
      return {
        ...state,
        isBulkApproving,
      }

    },
    setRejectAllProcessing(state, isRejectAllProcessing){
      return {
        ...state,
        isRejectAllProcessing,
      }
    },
    setFilter(state, filter){
      return {
        ...state,
        filter
      }
    },
    setTreeCount(state, treeCount) {
      return {
          ...state,
          treeCount,
          invalidateTreeCount: false,
      };
    },
    invalidateTreeCount(state, payload) {
      return {
        ...state,
        invalidateTreeCount: payload,
      }
    },
    setRejectedTreeCount(state, unprocessedTreeCount) {
      return {
          ...state,
          unprocessedTreeCount,
          invalidateRejectedCount: false,
      }
    },
    invalidateRejectedCount(state, payload) {
      return {
        ...state,
        invalidateRejectedCount: payload,
      }
    },
    setVerifiedTreeCount(state, verifiedTreeCount) {
      window.api = api;
      return {
          ...state,
          verifiedTreeCount,
          invalidateVerifiedCount: false,
      };
    },
    invalidateVerifiedCount(state, payload) {
      return {
        ...state,
        invalidateVerifiedCount: payload,
      }
    },
    setApproveAllComplete(state, approveAllComplete){
      return {
        ...state,
        approveAllComplete,
        invalidateTreeCount: true,
        invalidateVerifiedCount: true,
      }
    },
    setRejectAllComplete(state, rejectAllComplete){
      return {
        ...state,
        rejectAllComplete,
        invalidateTreeCount: true,
        invalidateRejectedCount: true,
      }
    },
    /*
     * replace approve and reject
     */
    approved(state, treeId){
      const treeImages = state.treeImages.filter(
        treeImage => treeImage.id !== treeId
      )
      //remove if selected
      const treeImagesSelected    = state.treeImagesSelected.filter(
        id => id !== treeId
      )
      return {
        ...state,
        treeImages,
        treeImagesSelected,
      }
    },
    approvedTreeImage(state, treeId){
      const treeImages = state.treeImages.filter(
        treeImage => treeImage.id !== treeId
      )
      //remove if selected
      const treeImagesSelected    = state.treeImagesSelected.filter(
        id => id !== treeId
      )
      return {
        ...state,
        treeImages,
        treeImagesSelected,
      }
    },
    rejectedTreeImage(state, treeId){
      const treeImages = state.treeImages.filter(
        treeImage => treeImage.id !== treeId
      )
      //remove if selected
      const treeImagesSelected    = state.treeImagesSelected.filter(
        id => id !== treeId
      )
      return {
        ...state,
        treeImages,
        treeImagesSelected,
      }
    },
    undoedTreeImage(state, treeId){
      /*
       * put the tree back, from undo list, sort by id
       */
      const treeUndo    = state.treeImagesUndo.reduce((a,c) =>
        (c.id === treeId ? c:a))
      const treeImagesUndo    = state.treeImagesUndo.filter(tree =>
        tree.id !== treeId)
      const treeImages    = [...state.treeImages, treeUndo].sort((a,b) =>
        (a.id - b.id)
      )
      return {
        ...state,
        treeImages,
        treeImagesUndo,
      }
    },
    //to reset the page status, load from beginning
    reset(state){
      return {
        ...state,
        treeImages: [],
        currentPage: 0,
        treeCount: null,
        verifiedTreeCount: null,
        unprocessedTreeCount: null,
        invalidateTreeCount: true,
        invalidateVerifiedCount: true,
        invalidateRejectedCount: true,
      }
    },
    /*
     * to clear all selection
     */
    resetSelection(state){
      return {
        ...state,
        treeImagesSelected: [],
        treeImageAnchor: undefined,
      }
    },
    /*
     * could we set reducer with a generic way?
     */
    set(state, object){
      return {
        ...state,
        ...object,
      }
    },
  },
  effects    : {
    /*
     * Dedicated, by approve
     * approve a tree, given tree id
     */
    async approveTreeImage(id){
      await api.approveTreeImage(id)
      this.approvedTreeImage(id)
      return true
    },
    /*
     * Dedicated, by approve
     * reject a tree, given tree id
     */
    async rejectTreeImage(id){
      await api.rejectTreeImage(id)
      this.rejectedTreeImage(id)
      return true
    },
    /*
     * Sat Apr 11 17:23:16 CST 2020
     * use new method to replace old ones: approveTreeImage, rejectTreeImage
     * add approveAction to indicate if it's approve or reject, and other
     * arguments
     *
     * payload: {
     *  id,
     *  approveAction,
     * }
     */
    async approve(payload){
      if(!payload.approveAction){
        throw Error('no apprive action object!')
      }
      if(payload.approveAction.isApproved){
        log.debug('approve')
        await api.approveTreeImage(
          payload.id,
          payload.approveAction.morphology,
          payload.approveAction.age,
          payload.approveAction.captureApprovalTag,
          payload.approveAction.speciesId,
        )
      }else{
        log.debug('reject')
        await api.rejectTreeImage(
          payload.id,
          payload.approveAction.rejectionReason,
        )
      }

      if (payload.approveAction.tags) {
        await api.createTreeTags(payload.id, payload.approveAction.tags)
      }

      this.approved(payload.id)
      return true
    },
    async undoTreeImage(id){
      await api.undoTreeImage(id)
      this.undoedTreeImage(id)
      return true
    },
    /*
     * To load trees into the list
     */
    async loadTreeImages(_payload, state){
      //{{{
      log.debug('to load images')
      const verityState    = state.verity
      if (verityState.isLoading ||
          (verityState.treeCount > 0 && verityState.treeImages.length >= verityState.treeCount) ||
          verityState.pageSize * (verityState.currentPage+1) <= verityState.treeImages.length) {
        // No need to request more images
        log.debug('cancel load because condition doesn\'t meet')
        return true;
      }
      //set loading status
      this.setLoading(true)

      const pageParams = {
        //page: nextPage,
        //REVISE Fri Aug 16 10:56:34 CST 2019
        //change the api to use skip parameter directly, because there is a
        //bug to use page as param
        skip    : verityState.treeImages.length,
        rowsPerPage: verityState.pageSize * (verityState.currentPage+1) - verityState.treeImages.length,
        filter    : verityState.filter,
      };
      log.debug('load page with params:', pageParams)
      const result    = await api.getTreeImages(pageParams)
      log.debug('loaded trees:%d', result.length)
      this.appendTreeImages(result);
      //restore loading status
      this.setLoading(false)
      return true;
      //}}}
    },

      /*
       * Dedicated, by approveAll
     * reject all tree
     */
    async rejectAll(payload, state){
      log.debug('rejectAll with state:', state)
      this.setLoading(true);
      this.setApproveAllProcessing(true);
      this.setIsBulkRejecting(true);
      const verityState    = state.verity;
      const total    = verityState.treeImagesSelected.length;
      const undo    = verityState.treeImages.filter(tree =>
        verityState.treeImagesSelected.some(id => id === tree.id)
      )
      log.debug('items:%d', verityState.treeImages.length);
      try{
        for(let i = 0; i < verityState.treeImagesSelected.length; i++){
          const treeId    = verityState.treeImagesSelected[i]
          const treeImage    = verityState.treeImages.reduce((a,c) => {
            if(c && c.id === treeId){
              return c
            }else{
              return a
            }
          }, undefined)
          log.trace('reject:%d', treeImage.id)
          await this.rejectTreeImage(treeImage.id)
          this.setApproveAllComplete(100 * ((i + 1) / total))
        }
      }catch(e){
        log.warn('get error:', e)
        this.setLoading(false);
        this.setRejectAllProcessing(false);
        return false
      }
      //push to undo list
      this.set({
        treeImagesUndo    : undo,
      })
      //finished, set status flags
      this.setLoading(false);
      this.setApproveAllProcessing(false);
      this.setRejectAllProcessing(false);
      this.invalidateVerifiedCount(true)
      this.invalidateTreeCount(true)
      this.invalidateRejectedCount(true)

      //reset
      this.setApproveAllComplete(0);
      this.resetSelection();
      return true;
    },

    /*
     * approve all tree
     * REVISE Tue Apr 14 16:20:31 CST 2020
     * Merge approve and reject to one, just: approveAll
     * payload : {
     *  approveAction,
     * }
     *
     */
    async approveAll(payload, state){
      //{{{
      log.debug('approveAll with state:', state)
      this.setLoading(true);
      this.setApproveAllProcessing(true);
      this.setIsBulkApproving(true);
      const verityState    = state.verity;
      const total    = verityState.treeImagesSelected.length;
      const undo    = verityState.treeImages.filter(tree =>
        verityState.treeImagesSelected.some(id => id === tree.id)
      )
      log.debug('items:%d', verityState.treeImages.length);
      try{
        for(let i = 0; i < verityState.treeImagesSelected.length; i++){
          const treeId    = verityState.treeImagesSelected[i]
          const treeImage    = verityState.treeImages.reduce((a,c) => {
            if(c && c.id === treeId){
              return c
            }else{
              return a
            }
          }, undefined)
          log.trace('approve:%d', treeImage.id)
          await this.approve({
            id: treeImage.id,
            approveAction: payload.approveAction,
          })
          this.setApproveAllComplete(100 * ((i + 1) / total))
        }
      }catch(e){
        log.warn('get error:', e)
        this.setLoading(false);
        this.setApproveAllProcessing(false);
        return false
      }
      //push to undo list
      this.set({
        treeImagesUndo    : undo,
      })
      //finished, set status flags
      this.setLoading(false);
      this.setApproveAllProcessing(false);
      this.invalidateRejectedCount(true);
      this.invalidateTreeCount(true);
      this.invalidateVerifiedCount(true);
      //reset
      this.setApproveAllComplete(0);
      this.resetSelection();
      return true;
      //}}}
    },
    /*
     * Dedicated
     * To undo all approved trees
     */
    async undoAll(payload, state){
      //{{{
      log.debug('undo with state:', state)
      this.setLoading(true);
      this.setRejectAllProcessing(true);
      this.setApproveAllProcessing(true);
      const verityState    = state.verity;
      const total    = verityState.treeImagesUndo.length;
      log.debug('items:%d', verityState.treeImages.length);
      try{
        for(let i = 0; i < verityState.treeImagesUndo.length; i++){
          const treeImage    = verityState.treeImagesUndo[i]
          log.trace('undo:%d', treeImage.id)
          await this.undoTreeImage(treeImage.id)
          this.setApproveAllComplete(100 * ((i + 1) / total))
        }
      }catch(e){
        log.warn('get error:', e)
        this.setLoading(false);
        this.setRejectAllProcessing(false);
        this.setApproveAllProcessing(false);
        return false
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
      this.invalidateTreeCount(true);
      this.invalidateVerifiedCount(true);
      this.resetSelection();
      return true;
      //}}}
    },
    /*
     * trigger when user submit filter form
     */
    async updateFilter(filter){
      //{{{
      this.setFilter(filter)
      this.reset()
      this.resetSelection()
      //clear all stuff
      await this.loadTreeImages()
      //}}}
    },
    /*
     * gets and sets count for unverified trees
     */
    async getTreeCount(payload, state) {
      this.invalidateTreeCount(false)
      const result = await api.getTreeCount(state.verity.filter)
      this.setTreeCount(result.count)
      return true
    },

    /*
     * gets and sets count for trees with no tag data (entirely unprocessed)
     */
    async getRejectedTreeCount(payload, state) {
      this.invalidateRejectedCount(false)
      const result = await api.getTreeCount(state.verity.rejectedFilter)
      this.setRejectedTreeCount(result.count)
      return true
    },

    /*
     * gets and sets count for trees that are active and approved
     */
    async getVerifiedTreeCount(payload, state) {
      this.invalidateVerifiedCount(false)
      const result = await api.getTreeCount(state.verity.verifiedFilter)
      this.setVerifiedTreeCount(result.count)
      return true
    },

    /*
     * to select trees
     * payload:
     *   {
     *     treeId    : string,
     *     isShift    : boolean,
     *     isCmd    : boolean,
     *     isCtrl    : boolean
     *     }
     */
    clickTree(payload, state){
      //{{{
      const {treeId, isShift, isCmd, isCtrl}    = payload
      if(!isShift && !isCmd && !isCtrl){
        this.set({
          treeImagesSelected    : [treeId],
          treeImageAnchor    : treeId,
        })
      }else if(isShift){
        log.debug(
          'press shift, and there is an anchor:',
          state.verity.treeImageAnchor
        )
        //if no anchor, then, select from beginning
        let indexAnchor    = 0
        if(state.verity.treeImageAnchor !== undefined){
          indexAnchor    = state.verity.treeImages.reduce((a,c,i) => {
            if(c !== undefined && c.id === state.verity.treeImageAnchor){
              return i
            }else{
              return a
            }
          }, -1)
        }
        const indexCurrent    = state.verity.treeImages.reduce((a,c,i) => {
          if(c !== undefined && c.id === treeId){
            return i
          }else{
            return a
          }
        }, -1)
        const treeImagesSelected    = state.verity.treeImages.slice(
            Math.min(indexAnchor, indexCurrent),
            Math.max(indexAnchor, indexCurrent) + 1,
          ).map(tree => tree.id)
        log.trace('find range:[%d,%d], selected:%d',
          indexAnchor,
          indexCurrent,
          treeImagesSelected.length,
        )
        this.set({
          treeImagesSelected,
        })
      } else if (isCmd || isCtrl) {
        // Toggle the selection state
        let treeImagesSelected;
        if (state.verity.treeImagesSelected.find(el => el === treeId)) {
          treeImagesSelected = state.verity.treeImagesSelected.filter(function(tree) {
            return tree !== treeId
          })
        } else {
          treeImagesSelected = [...state.verity.treeImagesSelected, treeId]
        }
        this.set({
          treeImagesSelected,
        })
      }
      //}}}
    },
    selectAll(selected, state){
      //{{{
      this.set({
        treeImagesSelected    : selected ?
          state.verity.treeImages.map(tree => tree.id)
          :
          [],
        treeImageAnchor    : undefined,
      })
      //}}}
    },
  },
}

export default verity
