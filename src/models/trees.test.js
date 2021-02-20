import { init } from "@rematch/core";
import trees from "./trees";
import * as loglevel from "loglevel";
import Axios from 'axios';

const log = loglevel.getLogger("../models/trees.test");

jest.mock('axios');

describe('trees', () => {

  let store;

  beforeEach(() => {
  });

  describe('with a default store', () => {
    beforeEach(async () => {
      store = init({
        models: {
          trees,
        },
      });
    });

    it('should have no trees', () => {
      expect(store.getState().trees.data).toHaveLength(0);
    });

    it('should be on page 0', () => {
      expect(store.getState().trees.page).toBe(0);
    });

    describe('getTreesAsync()', () => {
      beforeEach(async () => {
        const data = [{
          id: '1'
        }];
        // Mock the call to trees/count first
        Axios.get.mockReturnValueOnce({data: {count: data.length}}).mockReturnValueOnce({data});
        await store.dispatch.trees.getTreesAsync();
      });

      it('should get a tree count', () => {
        expect(store.getState().trees.treeCount).toBe(1);
      });

      it('should get some trees', () => {
        expect(store.getState().trees.data).toHaveLength(1);
      });

      it('should get the tree count first', () => {
        expect(Axios.get.mock.calls[0][0]).toContain(`trees/count`);
      });

      it('should call trees API with a valid filter', () => {
        const filter = JSON.stringify({
          where: { active: true },
          order: ['id asc'],
          limit: 25,
          skip: 0,
          fields: {
            id: true,
            timeCreated: true,
            status: true,
            planterId: true,
            treeTags: true,
          },
        });

        // The first arg (URL) should include a stringified default filter object
        expect(Axios.get).toHaveBeenCalled();
        const lastCallIdx = Axios.get.mock.calls.length - 1;
        expect(Axios.get.mock.calls[lastCallIdx][0]).toContain(`trees?filter=${filter}`);
      });
    });
  });
});
