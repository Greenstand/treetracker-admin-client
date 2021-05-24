import { init } from '@rematch/core';
import verify from './verify';
import Filter from './Filter';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../models/verify.test');

describe('verify', () => {
  //{{{
  let store;
  let api;

  beforeEach(() => {
    //mock the api
    api = require('../api/treeTrackerApi').default;
    api.getCaptureImages = jest.fn(() =>
      Promise.resolve([
        {
          id: '1',
        },
      ]),
    );
    api.approveCaptureImage = jest.fn(() => Promise.resolve(true));
    api.rejectCaptureImage = jest.fn(() => Promise.resolve(true));
    api.undoCaptureImage = () => Promise.resolve(true);
    api.getUnverifiedCaptureCount = () =>
      Promise.resolve({
        count: 1,
      });
    api.getCaptureCount = () =>
      Promise.resolve({
        count: 1,
      });
  });

  describe('with a default store', () => {
    //{{{
    beforeEach(() => {
      store = init({
        models: {
          verify,
        },
      });
    });

    it('check initial state', () => {
      expect(store.getState().verify.isLoading).toBe(false);
    });

    describe('loadCaptureImages() ', () => {
      //{{{
      beforeEach(async () => {
        const result = await store.dispatch.verify.loadCaptureImages();
        expect(result).toBe(true);
      });

      it('should get some captures', () => {
        expect(store.getState().verify.captureImages).toHaveLength(1);
      });

      it('should call api with param: skip = 0', () => {
        expect(api.getCaptureImages.mock.calls[0][0]).toMatchObject({
          skip: 0,
        });
      });

      it('by default, should call capture api with filter: approve=false, active=true', () => {
        expect(api.getCaptureImages.mock.calls[0][0]).toMatchObject({
          filter: {
            approved: false,
            active: true,
          },
        });
      });

      describe('getCaptureCount()', () => {
        beforeEach(async () => {
          const result = await store.dispatch.verify.getCaptureCount();
          expect(result).toBe(true);
        });

        it('getCaptureCount should be 1', () => {
          expect(store.getState().verify.captureCount).toBe(1);
        });
      });

      describe('approveCaptureImage(1, {seedling, new_capture, simple_leaf, 6})', () => {
        let approveAction = {
          morphology: 'seedling',
          age: 'new_capture',
          isApproved: true,
          captureApprovalTag: 'simple_leaf',
          speciesId: 6,
        };
        beforeEach(async () => {
          const result = await store.dispatch.verify.approve({
            id: '1',
            approveAction,
          });
          expect(result).toBe(true);
        });

        it('state capture list should remove the capture, so return []', () => {
          expect(store.getState().verify.captureImages).toEqual(
            expect.any(Array),
          );
          expect(store.getState().verify.captureImages).toHaveLength(0);
        });

        it('api.approve should be called by : id, seedling...', () => {
          console.log(api.approveCaptureImage.mock);
          expect(api.approveCaptureImage.mock.calls[0]).toMatchObject([
            '1',
            'seedling',
            'new_capture',
            'simple_leaf',
            6,
          ]);
        });
      });

      describe('rejectCaptureImage(1, not_capture)', () => {
        //{{{
        let approveAction = {
          isApproved: false,
          rejectionReason: 'not_capture',
        };
        beforeEach(async () => {
          const result = await store.dispatch.verify.approve({
            id: '1',
            approveAction,
          });
          expect(result).toBe(true);
        });

        it('state capture list should removed the capture, so, get []', () => {
          expect(store.getState().verify.captureImages).toHaveLength(0);
        });

        it('api.reject should be called by : id, not_capture ...', () => {
          console.log(api.approveCaptureImage.mock);
          expect(api.rejectCaptureImage.mock.calls[0]).toMatchObject([
            '1',
            'not_capture',
          ]);
        });

        //}}}
      });

      describe('loadCaptureImages() load second page', () => {
        //{{{
        beforeEach(async () => {
          api.getCaptureImages.mockClear();
          await store.dispatch.verify.loadCaptureImages();
        });

        it('should call api with param: skip = 1', () => {
          expect(api.getCaptureImages.mock.calls[0][0]).toMatchObject({
            skip: 1,
          });
        });
        //}}}
      });

      describe('updateFilter({approved:false, active:false}) test filter', () => {
        //{{{
        beforeEach(async () => {
          //clear
          api.getCaptureImages.mockClear();
          const filter = new Filter();
          filter.approved = false;
          filter.active = false;
          await store.dispatch.verify.updateFilter(filter);
        });

        it('after updateFilter, should call load captures with filter(approved:false, active:false)', () => {
          expect(api.getCaptureImages.mock.calls[0][0]).toMatchObject({
            filter: {
              approved: false,
              active: false,
            },
          });
        });
        //}}}
      });

      describe('set pageSize', () => {
        beforeEach(async () => {
          await store.dispatch.verify.set({ pageSize: 24 });
        });

        it('pageSize should be 24', () => {
          expect(store.getState().verify.pageSize).toBe(24);
        });
      });

      describe('set currentPage', () => {
        beforeEach(async () => {
          store.dispatch.verify.set({ currentPage: 1 });
        });

        it('currentPage should be 1', () => {
          expect(store.getState().verify.currentPage).toBe(1);
        });
      });

      //}}}
    });

    //}}}
  });

  describe('a store with 10 captures', () => {
    //{{{
    beforeEach(() => {
      //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
      const verifyInit = {
        state: {
          ...verify.state,
          captureImages: Array.from(new Array(10)).map((e, i) => {
            return {
              id: 9 - i,
              imageUrl: 'http://' + (9 - i),
            };
          }),
        },
        reducers: verify.reducers,
        effects: verify.effects,
      };
      store = init({
        models: {
          verify: verifyInit,
        },
      });
    });

    it('the capture images has length 10', () => {
      log.debug(store.getState().verify.captureImages);
      expect(store.getState().verify.captureImages).toHaveLength(10);
    });

    describe('selectAll(true)', () => {
      //{{{
      beforeEach(() => {
        store.dispatch.verify.selectAll(true);
      });

      it('selected should be 10', () => {
        expect(store.getState().verify.captureImagesSelected).toHaveLength(10);
      });

      describe('selectAll(false)', () => {
        //{{{
        beforeEach(() => {
          store.dispatch.verify.selectAll(false);
        });

        it('selected should be 0', () => {
          expect(store.getState().verify.captureImagesSelected).toHaveLength(0);
        });

        //}}}
      });
      //}}}
    });

    describe('clickCapture(7)', () => {
      //{{{
      beforeEach(() => {
        //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
        store.dispatch.verify.clickCapture({ captureId: 7 });
      });

      it('captureImagesSelected should be [7]', () => {
        expect(store.getState().verify.captureImagesSelected).toMatchObject([
          7,
        ]);
      });

      it('captureImageAnchor should be 7', () => {
        expect(store.getState().verify.captureImageAnchor).toBe(7);
      });

      describe('clickCapture(5)', () => {
        //{{{
        beforeEach(() => {
          //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
          store.dispatch.verify.clickCapture({ captureId: 5 });
        });

        it('captureImagesSelected should be [5]', () => {
          expect(store.getState().verify.captureImagesSelected).toMatchObject([
            5,
          ]);
        });
        //}}}
      });

      describe('clickCapture(5, isShift)', () => {
        //{{{
        beforeEach(() => {
          //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
          store.dispatch.verify.clickCapture({ captureId: 5, isShift: true });
        });

        it('captureImagesSelected should be [7, 6, 5]', () => {
          //9, 8, [7, 6, 5], 4, 3, 2, 1, 0
          expect(store.getState().verify.captureImagesSelected).toMatchObject([
            7,
            6,
            5,
          ]);
        });

        describe('approveAll()', () => {
          //{{{
          let approveAction = {
            morphology: 'seedling',
            age: 'new_capture',
            isApproved: true,
            captureApprovalTag: 'simple_leaf',
            speciesId: 6,
          };
          beforeEach(async () => {
            await store.dispatch.verify.approveAll({ approveAction });
          });

          it('isBulkApproving === true', () => {
            expect(store.getState().verify.isBulkApproving).toBe(true);
          });

          it('capture images should be 7', () => {
            console.error('capture:', store.getState().verify.captureImages);
            expect(store.getState().verify.captureImages).toHaveLength(7);
          });

          it('isApproveAllProcessing === false', () => {
            expect(store.getState().verify.isApproveAllProcessing).toBe(false);
          });

          it('after approveAll, should get an undo list', () => {
            expect(store.getState().verify.captureImagesUndo).toHaveLength(3);
          });

          it('api.approve should be called with ...', () => {
            expect(api.approveCaptureImage.mock.calls[0]).toMatchObject([
              7,
              'seedling',
              'new_capture',
              'simple_leaf',
              6,
            ]);
          });

          //					describe('undoAll()', () => {
          //						//{{{
          //						beforeEach(async () => {
          //							await store.dispatch.verify.undoAll()
          //						})
          //
          //						it('capture list should restore to 10', () => {
          //							expect(store.getState().verify.captureImages).toHaveLength(10)
          //						})
          //
          //						it('isBulkApproving === false', () => {
          //							expect(store.getState().verify.isBulkApproving).toBe(false)
          //						})
          //
          //						it('capture list order should be correct', () => {
          //							expect(store.getState().verify.captureImages.map(capture => capture.id)).toMatchObject(
          //								[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          //							)
          //						})
          //						//}}}
          //					})

          //}}}
        });

        describe('rejectAll()', () => {
          let approveAction = {
            isApproved: false,
            rejectionReason: 'not_capture',
          };
          beforeEach(async () => {
            await store.dispatch.verify.approveAll({ approveAction });
          });

          it('isBulkApproving === true', () => {
            expect(store.getState().verify.isBulkApproving).toBe(true);
          });

          it('capture images should be 7', () => {
            expect(store.getState().verify.captureImages).toHaveLength(7);
          });

          it('isRejectAllProcessing === false', () => {
            expect(store.getState().verify.isRejectAllProcessing).toBe(false);
          });

          it('after rejectAll, should get an undo list', () => {
            expect(store.getState().verify.captureImagesUndo).toHaveLength(3);
          });

          it('api.approve should be called with ...', () => {
            expect(api.rejectCaptureImage.mock.calls[0]).toMatchObject([
              7,
              'not_capture',
            ]);
          });

          //					describe('undoAll()', () => {
          //						//{{{
          //						beforeEach(async () => {
          //							await store.dispatch.verify.undoAll()
          //						})
          //
          //						it('isBulkRejecting === false', () => {
          //							expect(store.getState().verify.isBulkRejecting).toBe(false)
          //						})
          //
          //						it('capture list should restore to 10', () => {
          //							expect(store.getState().verify.captureImages).toHaveLength(10)
          //						})
          //
          //						it('capture list order should be correct', () => {
          //							expect(store.getState().verify.captureImages.map(capture => capture.id)).toMatchObject(
          //								[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          //							)
          //						})
          //						//}}}
          //					})
        });

        describe('clickCapture(9, isShift)', () => {
          //{{{
          beforeEach(() => {
            store.dispatch.verify.clickCapture({ captureId: 9, isShift: true });
          });

          it('captureImagesSelected should be [9,8,7]', () => {
            expect(
              store.getState().verify.captureImagesSelected,
            ).toMatchObject([9, 8, 7]);
          });
          //}}}
        });

        describe('clickCapture(0)', () => {
          //{{{
          beforeEach(() => {
            store.dispatch.verify.clickCapture({ captureId: 0 });
          });

          it('captureImagesSelected should be [0]', () => {
            expect(
              store.getState().verify.captureImagesSelected,
            ).toMatchObject([0]);
          });
          //}}}
        });

        //}}}
      });

      //}}}
    });

    //}}}
  });

  //}}}
});
