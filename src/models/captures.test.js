import { init } from '@rematch/core';
import captures from './captures';
import * as loglevel from 'loglevel';
import Axios from 'axios';

const log = loglevel.getLogger('../models/captures.test');

jest.mock('axios');

describe('captures', () => {
  let store;

  beforeEach(() => {});

  describe('with a default store', () => {
    beforeEach(async () => {
      store = init({
        models: {
          captures,
        },
      });
    });

    it('should have no captures', () => {
      expect(store.getState().captures.data).toHaveLength(0);
    });

    it('should be on page 0', () => {
      expect(store.getState().captures.page).toBe(0);
    });

    describe('getCapturesAsync()', () => {
      beforeEach(async () => {
        const data = [
          {
            id: '1',
          },
        ];
        // Mock the call to captures/count first
        Axios.get
          .mockReturnValueOnce({ data: { count: data.length } })
          .mockReturnValueOnce({ data });
        await store.dispatch.captures.getCapturesAsync();
      });

      it('should get a capture count', () => {
        expect(store.getState().captures.captureCount).toBe(1);
      });

      it('should get some captures', () => {
        expect(store.getState().captures.data).toHaveLength(1);
      });

      it('should get the capture count first', () => {
        expect(Axios.get.mock.calls[0][0]).toContain(`trees/count`);
      });

      it('should call captures API with a valid filter', () => {
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
        expect(Axios.get.mock.calls[lastCallIdx][0]).toContain(
          `trees?filter=${filter}`,
        );
      });
    });
  });
});
