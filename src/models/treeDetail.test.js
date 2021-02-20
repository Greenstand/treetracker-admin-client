import {init} from '@rematch/core';
import treeDetail from './treeDetail';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../models/treeDetail.test');


describe('treeDetail', () => {
  //{{{
  let store
  let api
  const TREE = {
    id: 0,
    planterId: 10,
    planterIdentifier: 'plater@some.place',
    deviceId: 20,
    approved: true,
    active: true,
    status: 'planted',
    speciesId: 30,
    timeCreated: '2020-07-29T21:46:03.522Z',
    morphology: 'seedling',
    age: 'new_tree',
    captureApprovalTag: 'simple_leaf',
    treeTags: [{
      id: 1,
      treeId: 0,
      tagId: 3,
    }]
  }
  
  const SPECIES = {
    id: 30,
    name: "fig",
  }

  const TAG = {
    id: 3,
    tagName: 'test',
  }

  beforeEach(() => {
    //mock the api
    api = require('../api/treeTrackerApi').default
    api.getTreeById = (id) => {
      log.debug('mock getTreeById:')
      return Promise.resolve(TREE)
    }
    api.getSpeciesById = (id) => {
      log.debug('mock getSpeciesById')
      return Promise.resolve(SPECIES)
    }
    api.getTagById = (id) => {
      log.debug('mock getTagById')
      return Promise.resolve(TAG)
    }
  })

  describe('with a default store', () => {
    //{{{
    beforeEach(() => {
      store = init({
        models: {
          treeDetail,
        },
      })
    })

    describe('query treeDetail', () => {
      beforeEach(async () => {
        await store.dispatch.treeDetail.getTreeDetail(0)
      })

      it('loaded treeDetail', () => {
        expect(store.getState().treeDetail.tree).toStrictEqual(TREE)
        expect(store.getState().treeDetail.species).toStrictEqual(SPECIES)
        expect(store.getState().treeDetail.tags).toStrictEqual([TAG])
      })
    })
    //}}}
  })

  //}}}
})

