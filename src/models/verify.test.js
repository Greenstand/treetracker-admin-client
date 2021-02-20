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
    api.getTreeImages = jest.fn(() =>
      Promise.resolve([
        {
          id: '1',
        },
      ]),
    );
    api.approveTreeImage = jest.fn(() => Promise.resolve(true));
    api.rejectTreeImage = jest.fn(() => Promise.resolve(true));
    api.undoTreeImage = () => Promise.resolve(true);
    api.getUnverifiedTreeCount = () =>
      Promise.resolve({
        count: 1,
      });
    api.getTreeCount = () =>
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

    describe('loadTreeImages() ', () => {
      //{{{
      beforeEach(async () => {
        const result = await store.dispatch.verify.loadTreeImages();
        expect(result).toBe(true);
      });

      it('should get some trees', () => {
        expect(store.getState().verify.treeImages).toHaveLength(1);
      });

      it('should call api with param: skip = 0', () => {
        expect(api.getTreeImages.mock.calls[0][0]).toMatchObject({
          skip: 0,
        });
      });

      it('by default, should call tree api with filter: approve=false, active=true', () => {
        expect(api.getTreeImages.mock.calls[0][0]).toMatchObject({
          filter: {
            approved: false,
            active: true,
          },
        });
      });

      describe('getTreeCount()', () => {
        beforeEach(async () => {
          const result = await store.dispatch.verify.getTreeCount();
          expect(result).toBe(true);
        });

        it('getTreeCount should be 1', () => {
          expect(store.getState().verify.treeCount).toBe(1);
        });
      });

      describe('approveTreeImage(1, {seedling, new_tree, simple_leaf, 6})', () => {
        let approveAction = {
          morphology: 'seedling',
          age: 'new_tree',
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

        it('state tree list should remove the tree, so return []', () => {
          expect(store.getState().verify.treeImages).toEqual(expect.any(Array));
          expect(store.getState().verify.treeImages).toHaveLength(0);
        });

        it('api.approve should be called by : id, seedling...', () => {
          console.log(api.approveTreeImage.mock);
          expect(api.approveTreeImage.mock.calls[0]).toMatchObject([
            '1',
            'seedling',
            'new_tree',
            'simple_leaf',
            6,
          ]);
        });
      });

      describe('rejectTreeImage(1, not_tree)', () => {
        //{{{
        let approveAction = {
          isApproved: false,
          rejectionReason: 'not_tree',
        };
        beforeEach(async () => {
          const result = await store.dispatch.verify.approve({
            id: '1',
            approveAction,
          });
          expect(result).toBe(true);
        });

        it('state tree list should removed the tree, so, get []', () => {
          expect(store.getState().verify.treeImages).toHaveLength(0);
        });

        it('api.reject should be called by : id, not_tree ...', () => {
          console.log(api.approveTreeImage.mock);
          expect(api.rejectTreeImage.mock.calls[0]).toMatchObject([
            '1',
            'not_tree',
          ]);
        });

        //}}}
      });

      describe('loadTreeImages() load second page', () => {
        //{{{
        beforeEach(async () => {
          api.getTreeImages.mockClear();
          await store.dispatch.verify.loadTreeImages();
        });

        it('should call api with param: skip = 1', () => {
          expect(api.getTreeImages.mock.calls[0][0]).toMatchObject({
            skip: 1,
          });
        });
        //}}}
      });

      describe('updateFilter({approved:false, active:false}) test filter', () => {
        //{{{
        beforeEach(async () => {
          //clear
          api.getTreeImages.mockClear();
          const filter = new Filter();
          filter.approved = false;
          filter.active = false;
          await store.dispatch.verify.updateFilter(filter);
        });

        it('after updateFilter, should call load trees with filter(approved:false, active:false)', () => {
          expect(api.getTreeImages.mock.calls[0][0]).toMatchObject({
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

  describe('a store with 10 trees', () => {
    //{{{
    beforeEach(() => {
      //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
      const verifyInit = {
        state: {
          ...verify.state,
          treeImages: Array.from(new Array(10)).map((e, i) => {
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

    it('the tree images has length 10', () => {
      log.debug(store.getState().verify.treeImages);
      expect(store.getState().verify.treeImages).toHaveLength(10);
    });

    describe('selectAll(true)', () => {
      //{{{
      beforeEach(() => {
        store.dispatch.verify.selectAll(true);
      });

      it('selected should be 10', () => {
        expect(store.getState().verify.treeImagesSelected).toHaveLength(10);
      });

      describe('selectAll(false)', () => {
        //{{{
        beforeEach(() => {
          store.dispatch.verify.selectAll(false);
        });

        it('selected should be 0', () => {
          expect(store.getState().verify.treeImagesSelected).toHaveLength(0);
        });

        //}}}
      });
      //}}}
    });

    describe('clickTree(7)', () => {
      //{{{
      beforeEach(() => {
        //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
        store.dispatch.verify.clickTree({ treeId: 7 });
      });

      it('treeImagesSelected should be [7]', () => {
        expect(store.getState().verify.treeImagesSelected).toMatchObject([7]);
      });

      it('treeImageAnchor should be 7', () => {
        expect(store.getState().verify.treeImageAnchor).toBe(7);
      });

      describe('clickTree(5)', () => {
        //{{{
        beforeEach(() => {
          //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
          store.dispatch.verify.clickTree({ treeId: 5 });
        });

        it('treeImagesSelected should be [5]', () => {
          expect(store.getState().verify.treeImagesSelected).toMatchObject([5]);
        });
        //}}}
      });

      describe('clickTree(5, isShift)', () => {
        //{{{
        beforeEach(() => {
          //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
          store.dispatch.verify.clickTree({ treeId: 5, isShift: true });
        });

        it('treeImagesSelected should be [7, 6, 5]', () => {
          //9, 8, [7, 6, 5], 4, 3, 2, 1, 0
          expect(store.getState().verify.treeImagesSelected).toMatchObject([
            7,
            6,
            5,
          ]);
        });

        describe('approveAll()', () => {
          //{{{
          let approveAction = {
            morphology: 'seedling',
            age: 'new_tree',
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

          it('tree images should be 7', () => {
            console.error('tree:', store.getState().verify.treeImages);
            expect(store.getState().verify.treeImages).toHaveLength(7);
          });

          it('isApproveAllProcessing === false', () => {
            expect(store.getState().verify.isApproveAllProcessing).toBe(false);
          });

          it('after approveAll, should get an undo list', () => {
            expect(store.getState().verify.treeImagesUndo).toHaveLength(3);
          });

          it('api.approve should be called with ...', () => {
            expect(api.approveTreeImage.mock.calls[0]).toMatchObject([
              7,
              'seedling',
              'new_tree',
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
          //						it('tree list should restore to 10', () => {
          //							expect(store.getState().verify.treeImages).toHaveLength(10)
          //						})
          //
          //						it('isBulkApproving === false', () => {
          //							expect(store.getState().verify.isBulkApproving).toBe(false)
          //						})
          //
          //						it('tree list order should be correct', () => {
          //							expect(store.getState().verify.treeImages.map(tree => tree.id)).toMatchObject(
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
            rejectionReason: 'not_tree',
          };
          beforeEach(async () => {
            await store.dispatch.verify.approveAll({ approveAction });
          });

          it('isBulkApproving === true', () => {
            expect(store.getState().verify.isBulkApproving).toBe(true);
          });

          it('tree images should be 7', () => {
            expect(store.getState().verify.treeImages).toHaveLength(7);
          });

          it('isRejectAllProcessing === false', () => {
            expect(store.getState().verify.isRejectAllProcessing).toBe(false);
          });

          it('after rejectAll, should get an undo list', () => {
            expect(store.getState().verify.treeImagesUndo).toHaveLength(3);
          });

          it('api.approve should be called with ...', () => {
            expect(api.rejectTreeImage.mock.calls[0]).toMatchObject([
              7,
              'not_tree',
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
          //						it('tree list should restore to 10', () => {
          //							expect(store.getState().verify.treeImages).toHaveLength(10)
          //						})
          //
          //						it('tree list order should be correct', () => {
          //							expect(store.getState().verify.treeImages.map(tree => tree.id)).toMatchObject(
          //								[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          //							)
          //						})
          //						//}}}
          //					})
        });

        describe('clickTree(9, isShift)', () => {
          //{{{
          beforeEach(() => {
            store.dispatch.verify.clickTree({ treeId: 9, isShift: true });
          });

          it('treeImagesSelected should be [9,8,7]', () => {
            expect(store.getState().verify.treeImagesSelected).toMatchObject([
              9,
              8,
              7,
            ]);
          });
          //}}}
        });

        describe('clickTree(0)', () => {
          //{{{
          beforeEach(() => {
            store.dispatch.verify.clickTree({ treeId: 0 });
          });

          it('treeImagesSelected should be [0]', () => {
            expect(store.getState().verify.treeImagesSelected).toMatchObject([
              0,
            ]);
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
