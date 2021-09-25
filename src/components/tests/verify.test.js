import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import captureApi from '../../api/treeTrackerApi';
import planterApi from '../../api/planters';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProvider } from '../../context/AppContext';
import { VerifyProvider } from '../../context/VerifyContext';
import { PlanterProvider } from '../../context/PlanterContext';
import { SpeciesProvider } from '../../context/SpeciesContext';
import { TagsProvider } from '../../context/TagsContext';
import FilterPlanter from '../../models/FilterPlanter';
import FilterModel from '../../models/Filter';
import Verify from '../Verify';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/verify.test');

jest.setTimeout(7000);
jest.mock('../../api/planters');
jest.mock('../../api/treeTrackerApi');

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

const CAPTURES = [
  {
    id: 10,
    uuid: '11942400-6617-4c6c-bf5e',
    planterId: 10,
    planterIdentifier: 'planter1@some.place',
    deviceIdentifier: '1-abcdef123456',
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
  },
  {
    id: 20,
    uuid: '11942400-6617-4c6c-bf5e',
    planterId: 11,
    planterIdentifier: 'planter2@some.place',
    deviceIdentifier: '2-abcdef123456',
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
  },
  {
    id: 30,
    uuid: '11942400-6617-4c6c-bf5e',
    planterId: 10,
    planterIdentifier: 'planter3@some.place',
    deviceIdentifier: '3-abcdef123456',
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
  },
];

const PLANTER = {
  id: 1,
  firstName: 'testFirstName',
  lastName: 'testLastName',
  email: 'test@gmail.com',
  organization: null,
  phone: '123-456-7890',
  imageUrl:
    'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.11.17.12.45.48_8.42419553_-13.16719857_11d157fb-1bb0-4497-a7d7-7c16ce658158_IMG_20201117_104118_1916638584657622896.jpg',
  personId: null,
  organizationId: 11,
};

const PLANTERS = [
  {
    id: 1,
    firstName: 'testFirstName',
    lastName: 'testLastName',
    email: 'test@gmail.com',
    organization: null,
    phone: '123-456-7890',
    imageUrl:
      'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.11.17.12.45.48_8.42419553_-13.16719857_11d157fb-1bb0-4497-a7d7-7c16ce658158_IMG_20201117_104118_1916638584657622896.jpg',
    personId: null,
    organizationId: 1,
  },
  {
    id: 2,
    firstName: 'testFirstName2',
    lastName: 'testLastName2',
    email: 'test2@gmail.com',
    organization: null,
    phone: '123-456-7890',
    imageUrl: '',
    personId: null,
    organizationId: 11,
  },
  {
    id: 3,
    firstName: 'testFirstName3',
    lastName: 'testLastName3',
    email: 'test3@gmail.com',
    organization: null,
    phone: '123-456-7890',
    imageUrl: '',
    personId: null,
    organizationId: 1,
  },
];

const ORGS = [
  {
    id: 0,
    name: 'Dummy Org',
  },
  {
    id: 1,
    name: 'Another Org',
  },
];

const TAGS = [
  {
    id: 0,
    tagName: 'tag_b',
    public: true,
    active: true,
  },
  {
    id: 1,
    tagName: 'tag_a',
    public: true,
    active: true,
  },
];

const SPECIES = [
  {
    id: 0,
    name: 'Pine',
  },
  {
    id: 1,
    name: 'apple',
  },
];

describe('Verify', () => {
  let planterApi;
  let captureApi;
  let planterValues;
  let verifyValues;
  let speciesValues;
  let tagsValues;

  beforeEach(() => {
    //mock the planters api
    planterApi = require('../../api/planters').default;

    planterApi.getCount = () => {
      log.debug('mock getCount:');
      return Promise.resolve({ count: 2 });
    };
    planterApi.getPlanter = () => {
      log.debug('mock getPlanter:');
      return Promise.resolve(PLANTER);
    };
    planterApi.getPlanterRegistrations = () => {
      log.debug('mock getPlanterRegistrations:');
      return Promise.resolve([]);
    };
    planterApi.getPlanterSelfies = (id) => {
      log.debug('mock getPlanterSelfies:');
      return Promise.resolve([
        { planterPhotoUrl: '' },
        { planterPhotoUrl: '' },
      ]);
    };

    // mock the treeTrackerApi
    captureApi = require('../../api/treeTrackerApi').default;

    captureApi.getCaptureImages = (id) => {
      log.debug('mock getCaptureImages:');
      return Promise.resolve(CAPTURES);
    };
    captureApi.getCaptureCount = (id) => {
      log.debug('mock getCaptureCount:');
      return Promise.resolve({ count: 3 });
    };
    captureApi.getCaptureById = (id) => {
      log.debug('mock getCaptureById:');
      return Promise.resolve(CAPTURE);
    };
    captureApi.getSpecies = () => {
      log.debug('mock getSpeciesById:');
      return Promise.resolve(SPECIES);
    };
    captureApi.getCaptureCountPerSpecies = () => {
      log.debug('mock getCaptureCountPerSpecies:');
      return Promise.resolve({ count: 7 });
    };
    captureApi.getTags = (id) => {
      log.debug('mock getTagById:');
      return Promise.resolve(TAGS);
    };
    captureApi.getOrganizations = () => {
      log.debug('mock getOrganizations:');
      return Promise.resolve(ORGS);
    };
  });

  describe('with default values', () => {
    //{{{
    beforeEach(async () => {
      planterValues = {
        planters: PLANTERS,
        pageSize: 24,
        count: null,
        currentPage: 0,
        filter: new FilterPlanter(),
        isLoading: false,
        totalPlanterCount: null,
        load: () => {},
        getCount: () => {},
        changePageSize: () => {},
        changeCurrentPage: () => {},
        getPlanter: () => {},
        updatePlanter: () => {},
        updatePlanters: () => {},
        updateFilter: () => {},
        getTotalPlanterCount: () => {},
      };
      verifyValues = {
        captureImages: CAPTURES,
        captureImagesSelected: [],
        captureImageAnchor: undefined,
        captureImagesUndo: [],
        isLoading: false,
        isApproveAllProcessing: false,
        approveAllComplete: 0,
        pageSize: 12,
        currentPage: 0,
        filter: new FilterModel({
          approved: false,
          active: true,
        }),
        invalidateCaptureCount: true,
        captureCount: null,
        approve: () => {},
        // undoCaptureImage: () => {},
        loadCaptureImages: () => {},
        approveAll: () => {},
        undoAll: () => {},
        updateFilter: () => {},
        getCaptureCount: () => {},
        clickCapture: () => {},
        setPageSize: () => {},
        setCurrentPage: () => {},
      };
      tagsValues = {
        tagList: TAGS,
        tagInput: [],
        getTags: () => {},
        createTags: () => {},
      };
      speciesValues = {
        speciesList: SPECIES,
        speciesInput: '',
        speciesDesc: '',
        setSpeciesInput: () => {},
        loadSpeciesList: () => {},
        onChange: () => {},
        isNewSpecies: () => {},
        createSpecies: () => {},
        getSpeciesId: () => {},
        editSpecies: () => {},
        deleteSpecies: () => {},
        combineSpecies: () => {},
      };

      render(
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AppProvider value={{ orgList: ORGS }}>
              {/* <PlanterProvider value={planterValues}> */}
              <VerifyProvider value={verifyValues}>
                <SpeciesProvider value={speciesValues}>
                  <TagsProvider value={tagsValues}>
                    <Verify />
                  </TagsProvider>
                </SpeciesProvider>
              </VerifyProvider>
              {/* </PlanterProvider> */}
            </AppProvider>
          </BrowserRouter>
        </ThemeProvider>,
      );

      await act(() => captureApi.getCaptureImages());
      await act(() => captureApi.getCaptureCount());
    });

    afterEach(cleanup);

    it('renders filter top', () => {
      const filter = screen.getByRole('button', { name: /filter/i });
      userEvent.click(filter);
      // screen.logTestingPlaygroundURL();

      const verifyStatus = screen.getByLabelText(/awaiting verification/i);
      expect(verifyStatus).toBeInTheDocument();

      const tokenStatus = screen.getByLabelText(/token status/i);
      expect(tokenStatus).toBeInTheDocument();
    });

    it('renders side panel', () => {
      // screen.logTestingPlaygroundURL();
      // expect(screen.getByText(/planters per page: 24/i));
    });

    it('renders captures gallery', () => {
      // screen.logTestingPlaygroundURL();
      const pageSize = screen.getAllByText(/captures per page:/i);
      expect(pageSize).toHaveLength(2);

      expect(screen.getByText(/3 captures/i));
    });

    it('renders capture details', () => {
      const captureDetails = screen.getAllByRole('button', {
        name: /capture details/i,
      });
      expect(captureDetails).toHaveLength(3);
      userEvent.click(captureDetails[0]);
      // screen.logTestingPlaygroundURL();
      expect(screen.getByText(/capture data/i)).toBeInTheDocument();
      expect(screen.getByText(/planter identifier/i)).toBeInTheDocument();
      expect(screen.getByText(/planter1@some.place/i)).toBeInTheDocument();
      expect(screen.getByText(/device identifier/i)).toBeInTheDocument();
      // expect(screen.getByText(/1 - abcdef123456/i)).toBeInTheDocument();
      expect(screen.getByText(/verification status/i)).toBeInTheDocument();
      expect(screen.getByText(/token status/i)).toBeInTheDocument();
    });

    it('renders planter details', () => {
      const planterDetails = screen.getAllByRole('button', {
        name: /planter details/i,
      });
      expect(planterDetails).toHaveLength(3);
      userEvent.click(planterDetails[0]);
      // screen.logTestingPlaygroundURL();

      expect(screen.getByText(/planter detail/i)).toBeInTheDocument();
      expect(screen.getByText(/ID:/i)).toBeInTheDocument();
      expect(screen.getByText(/email address/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/registered/i)).toBeInTheDocument();
    });

    // it('renders edit planter', () => {
    //   const planterDetails = screen.getAllByRole('button', {
    //     name: /planter details/i,
    //   });
    //   userEvent.click(planterDetails[0]);

    //   screen.logTestingPlaygroundURL();
    //   //
    //   const editPlanter = screen.getByTestId(/edit-planter/i);
    //   expect(editPlanter).toBeInTheDocument();
    //   userEvent.click(editPlanter);
    // });
  });
});

// describe('verify', () => {
//   //{{{
//   let store;
//   let api;

//   beforeEach(() => {
//     //mock the api
//     api = require('../../api/treeTrackerApi').default;
//     api.getCaptureImages = jest.fn(() => Promise.resolve([{ id: '1' }]));
//     api.approveCaptureImage = jest.fn(() => Promise.resolve(true));
//     api.rejectCaptureImage = jest.fn(() => Promise.resolve(true));
//     api.undoCaptureImage = () => Promise.resolve(true);
//     api.getUnverifiedCaptureCount = () => Promise.resolve({ count: 1 });
//     api.getCaptureCount = () => Promise.resolve({ count: 1 });
//   });

//   describe('with a default store', () => {
//     //{{{
//     beforeEach(() => {
//       store = init({
//         models: {
//           verify,
//         },
//       });
//     });

//     it('check initial state', () => {
//       expect(store.getState().verify.isLoading).toBe(false);
//     });

//     describe('loadCaptureImages() ', () => {
//       //{{{
//       beforeEach(async () => {
//         const result = await store.dispatch.verify.loadCaptureImages();
//         expect(result).toBe(true);
//       });

//       it('should get some captures', () => {
//         expect(store.getState().verify.captureImages).toHaveLength(1);
//       });

//       it('should call api with param: skip = 0', () => {
//         expect(api.getCaptureImages.mock.calls[0][0]).toMatchObject({
//           skip: 0,
//         });
//       });

//       it('by default, should call capture api with filter: approve=false, active=true', () => {
//         expect(api.getCaptureImages.mock.calls[0][0]).toMatchObject({
//           filter: {
//             approved: false,
//             active: true,
//           },
//         });
//       });

//       describe('getCaptureCount()', () => {
//         beforeEach(async () => {
//           const result = await store.dispatch.verify.getCaptureCount();
//           expect(result).toBe(true);
//         });

//         it('getCaptureCount should be 1', () => {
//           expect(store.getState().verify.captureCount).toBe(1);
//         });
//       });

//       describe('approveCaptureImage(1, {seedling, new_capture, simple_leaf, 6})', () => {
//         let approveAction = {
//           morphology: 'seedling',
//           age: 'new_capture',
//           isApproved: true,
//           captureApprovalTag: 'simple_leaf',
//           speciesId: 6,
//         };
//         beforeEach(async () => {
//           const result = await store.dispatch.verify.approve({
//             id: '1',
//             approveAction,
//           });
//           expect(result).toBe(true);
//         });

//         it('state capture list should remove the capture, so return []', () => {
//           expect(store.getState().verify.captureImages).toEqual(
//             expect.any(Array),
//           );
//           expect(store.getState().verify.captureImages).toHaveLength(0);
//         });

//         it('api.approve should be called by : id, seedling...', () => {
//           console.log(api.approveCaptureImage.mock);
//           expect(api.approveCaptureImage.mock.calls[0]).toMatchObject([
//             '1',
//             'seedling',
//             'new_capture',
//             'simple_leaf',
//             6,
//           ]);
//         });
//       });

//       describe('rejectCaptureImage(1, not_capture)', () => {
//         //{{{
//         let approveAction = {
//           isApproved: false,
//           rejectionReason: 'not_capture',
//         };
//         beforeEach(async () => {
//           const result = await store.dispatch.verify.approve({
//             id: '1',
//             approveAction,
//           });
//           expect(result).toBe(true);
//         });

//         it('state capture list should removed the capture, so, get []', () => {
//           expect(store.getState().verify.captureImages).toHaveLength(0);
//         });

//         it('api.reject should be called by : id, not_capture ...', () => {
//           console.log(api.approveCaptureImage.mock);
//           expect(api.rejectCaptureImage.mock.calls[0]).toMatchObject([
//             '1',
//             'not_capture',
//           ]);
//         });

//         //}}}
//       });

//       describe('loadCaptureImages() load second page', () => {
//         //{{{
//         beforeEach(async () => {
//           api.getCaptureImages.mockClear();
//           await store.dispatch.verify.loadCaptureImages();
//         });

//         it('should call api with param: skip = 1', () => {
//           expect(api.getCaptureImages.mock.calls[0][0]).toMatchObject({
//             skip: 1,
//           });
//         });
//         //}}}
//       });

//       describe('updateFilter({approved:false, active:false}) test filter', () => {
//         //{{{
//         beforeEach(async () => {
//           //clear
//           api.getCaptureImages.mockClear();
//           const filter = new Filter();
//           filter.approved = false;
//           filter.active = false;
//           await store.dispatch.verify.updateFilter(filter);
//         });

//         it('after updateFilter, should call load captures with filter(approved:false, active:false)', () => {
//           expect(api.getCaptureImages.mock.calls[0][0]).toMatchObject({
//             filter: {
//               approved: false,
//               active: false,
//             },
//           });
//         });
//         //}}}
//       });

//       describe('set pageSize', () => {
//         beforeEach(async () => {
//           await store.dispatch.verify.set({ pageSize: 24 });
//         });

//         it('pageSize should be 24', () => {
//           expect(store.getState().verify.pageSize).toBe(24);
//         });
//       });

//       describe('set currentPage', () => {
//         beforeEach(async () => {
//           store.dispatch.verify.set({ currentPage: 1 });
//         });

//         it('currentPage should be 1', () => {
//           expect(store.getState().verify.currentPage).toBe(1);
//         });
//       });

//       //}}}
//     });

//     //}}}
//   });

//   describe('a store with 10 captures', () => {
//     //{{{
//     beforeEach(() => {
//       //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
//       const verifyInit = {
//         state: {
//           ...verify.state,
//           captureImages: Array.from(new Array(10)).map((e, i) => {
//             return {
//               id: 9 - i,
//               imageUrl: 'http://' + (9 - i),
//             };
//           }),
//         },
//         reducers: verify.reducers,
//         effects: verify.effects,
//       };
//       store = init({
//         models: {
//           verify: verifyInit,
//         },
//       });
//     });

//     it('the capture images has length 10', () => {
//       log.debug(store.getState().verify.captureImages);
//       expect(store.getState().verify.captureImages).toHaveLength(10);
//     });

//     describe('selectAll(true)', () => {
//       //{{{
//       beforeEach(() => {
//         store.dispatch.verify.selectAll(true);
//       });

//       it('selected should be 10', () => {
//         expect(store.getState().verify.captureImagesSelected).toHaveLength(10);
//       });

//       describe('selectAll(false)', () => {
//         //{{{
//         beforeEach(() => {
//           store.dispatch.verify.selectAll(false);
//         });

//         it('selected should be 0', () => {
//           expect(store.getState().verify.captureImagesSelected).toHaveLength(0);
//         });

//         //}}}
//       });
//       //}}}
//     });

//     describe('clickCapture(7)', () => {
//       //{{{
//       beforeEach(() => {
//         //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
//         store.dispatch.verify.clickCapture({ captureId: 7 });
//       });

//       it('captureImagesSelected should be [7]', () => {
//         expect(store.getState().verify.captureImagesSelected).toMatchObject([
//           7,
//         ]);
//       });

//       it('captureImageAnchor should be 7', () => {
//         expect(store.getState().verify.captureImageAnchor).toBe(7);
//       });

//       describe('clickCapture(5)', () => {
//         //{{{
//         beforeEach(() => {
//           //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
//           store.dispatch.verify.clickCapture({ captureId: 5 });
//         });

//         it('captureImagesSelected should be [5]', () => {
//           expect(store.getState().verify.captureImagesSelected).toMatchObject([
//             5,
//           ]);
//         });
//         //}}}
//       });

//       describe('clickCapture(5, isShift)', () => {
//         //{{{
//         beforeEach(() => {
//           //9, 8, 7, 6, 5, 4, 3, 2, 1, 0
//           store.dispatch.verify.clickCapture({ captureId: 5, isShift: true });
//         });

//         it('captureImagesSelected should be [7, 6, 5]', () => {
//           //9, 8, [7, 6, 5], 4, 3, 2, 1, 0
//           expect(store.getState().verify.captureImagesSelected).toMatchObject([
//             7,
//             6,
//             5,
//           ]);
//         });

//         describe('approveAll()', () => {
//           //{{{
//           let approveAction = {
//             morphology: 'seedling',
//             age: 'new_capture',
//             isApproved: true,
//             captureApprovalTag: 'simple_leaf',
//             speciesId: 6,
//           };
//           beforeEach(async () => {
//             await store.dispatch.verify.approveAll({ approveAction });
//           });

//           it('isBulkApproving === true', () => {
//             expect(store.getState().verify.isBulkApproving).toBe(true);
//           });

//           it('capture images should be 7', () => {
//             console.error('capture:', store.getState().verify.captureImages);
//             expect(store.getState().verify.captureImages).toHaveLength(7);
//           });

//           it('isApproveAllProcessing === false', () => {
//             expect(store.getState().verify.isApproveAllProcessing).toBe(false);
//           });

//           it('after approveAll, should get an undo list', () => {
//             expect(store.getState().verify.captureImagesUndo).toHaveLength(3);
//           });

//           it('api.approve should be called with ...', () => {
//             expect(api.approveCaptureImage.mock.calls[0]).toMatchObject([
//               7,
//               'seedling',
//               'new_capture',
//               'simple_leaf',
//               6,
//             ]);
//           });

//           //					describe('undoAll()', () => {
//           //						//{{{
//           //						beforeEach(async () => {
//           //							await store.dispatch.verify.undoAll()
//           //						})
//           //
//           //						it('capture list should restore to 10', () => {
//           //							expect(store.getState().verify.captureImages).toHaveLength(10)
//           //						})
//           //
//           //						it('isBulkApproving === false', () => {
//           //							expect(store.getState().verify.isBulkApproving).toBe(false)
//           //						})
//           //
//           //						it('capture list order should be correct', () => {
//           //							expect(store.getState().verify.captureImages.map(capture => capture.id)).toMatchObject(
//           //								[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
//           //							)
//           //						})
//           //						//}}}
//           //					})

//           //}}}
//         });

//         describe('rejectAll()', () => {
//           let approveAction = {
//             isApproved: false,
//             rejectionReason: 'not_capture',
//           };
//           beforeEach(async () => {
//             await store.dispatch.verify.approveAll({ approveAction });
//           });

//           it('isBulkApproving === true', () => {
//             expect(store.getState().verify.isBulkApproving).toBe(true);
//           });

//           it('capture images should be 7', () => {
//             expect(store.getState().verify.captureImages).toHaveLength(7);
//           });

//           it('isRejectAllProcessing === false', () => {
//             expect(store.getState().verify.isRejectAllProcessing).toBe(false);
//           });

//           it('after rejectAll, should get an undo list', () => {
//             expect(store.getState().verify.captureImagesUndo).toHaveLength(3);
//           });

//           it('api.approve should be called with ...', () => {
//             expect(api.rejectCaptureImage.mock.calls[0]).toMatchObject([
//               7,
//               'not_capture',
//             ]);
//           });

//           //					describe('undoAll()', () => {
//           //						//{{{
//           //						beforeEach(async () => {
//           //							await store.dispatch.verify.undoAll()
//           //						})
//           //
//           //						it('isBulkRejecting === false', () => {
//           //							expect(store.getState().verify.isBulkRejecting).toBe(false)
//           //						})
//           //
//           //						it('capture list should restore to 10', () => {
//           //							expect(store.getState().verify.captureImages).toHaveLength(10)
//           //						})
//           //
//           //						it('capture list order should be correct', () => {
//           //							expect(store.getState().verify.captureImages.map(capture => capture.id)).toMatchObject(
//           //								[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
//           //							)
//           //						})
//           //						//}}}
//           //					})
//         });

//         describe('clickCapture(9, isShift)', () => {
//           //{{{
//           beforeEach(() => {
//             store.dispatch.verify.clickCapture({ captureId: 9, isShift: true });
//           });

//           it('captureImagesSelected should be [9,8,7]', () => {
//             expect(
//               store.getState().verify.captureImagesSelected,
//             ).toMatchObject([9, 8, 7]);
//           });
//           //}}}
//         });

//         describe('clickCapture(0)', () => {
//           //{{{
//           beforeEach(() => {
//             store.dispatch.verify.clickCapture({ captureId: 0 });
//           });

//           it('captureImagesSelected should be [0]', () => {
//             expect(
//               store.getState().verify.captureImagesSelected,
//             ).toMatchObject([0]);
//           });
//           //}}}
//         });

//         //}}}
//       });

//       //}}}
//     });

//     //}}}
//   });

//   //}}}
// });
