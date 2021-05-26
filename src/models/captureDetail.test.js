import { init } from '@rematch/core';
import captureDetail from './captureDetail';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../models/captureDetail.test');

describe('captureDetail', () => {
  //{{{
  let store;
  let api;
  const CAPTURE = {
    id: 0,
    planterId: 10,
    planterIdentifier: 'planter@some.place',
    deviceIdentifier: 'abcdef123456',
    approved: true,
    active: true,
    status: 'planted',
    speciesId: 30,
    timeCreated: '2020-07-29T21:46:03.522Z',
    morphology: 'seedling',
    age: 'new_tree',
    captureApprovalTag: 'simple_leaf',
    treeTags: [
      {
        id: 1,
        treeId: 0,
        tagId: 3,
      },
    ],
  };

  const SPECIES = {
    id: 30,
    name: 'fig',
  };

  const TAG = {
    id: 3,
    tagName: 'test',
  };

  beforeEach(() => {
    //mock the api
    api = require('../api/treeTrackerApi').default;
    api.getCaptureById = (id) => {
      log.debug('mock getCaptureById:');
      return Promise.resolve(CAPTURE);
    };
    api.getSpeciesById = (id) => {
      log.debug('mock getSpeciesById');
      return Promise.resolve(SPECIES);
    };
    api.getTagById = (id) => {
      log.debug('mock getTagById');
      return Promise.resolve(TAG);
    };
  });

  describe('with a default store', () => {
    //{{{
    beforeEach(() => {
      store = init({
        models: {
          captureDetail,
        },
      });
    });

    describe('query captureDetail', () => {
      beforeEach(async () => {
        await store.dispatch.captureDetail.getCaptureDetail(0);
      });

      it('loaded captureDetail', () => {
        expect(store.getState().captureDetail.capture).toStrictEqual(CAPTURE);
        expect(store.getState().captureDetail.species).toStrictEqual(SPECIES);
        expect(store.getState().captureDetail.tags).toStrictEqual([TAG]);
      });
    });
    //}}}
  });

  //}}}
});
