import FilterModel from '../../models/Filter';
import FilterGrower from '../../models/FilterGrower';

const CAPTURE = {
  id: 100,
  planterId: 10,
  planterIdentifier: 'grower@some.place',
  deviceIdentifier: 'abcdef123456',
  approved: true,
  active: true,
  status: 'planted',
  speciesId: 0,
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
    id: 100,
    uuid: '11942400-6617-4c6c-bf5e',
    planterId: 10,
    planterIdentifier: 'grower1@some.place',
    deviceIdentifier: '1-abcdef123456',
    approved: true,
    active: true,
    status: 'planted',
    speciesId: 0,
    timeCreated: '2020-07-29T21:46:03.522Z',
    morphology: 'seedling',
    age: 'new_tree',
    captureApprovalTag: 'simple_leaf',
  },
  {
    id: 110,
    uuid: '11942400-6617-4c6c-bf5e',
    planterId: 11,
    planterIdentifier: 'grower2@some.place',
    deviceIdentifier: '2-abcdef123456',
    approved: false,
    active: true,
    status: 'planted',
    speciesId: 0,
    timeCreated: '2020-07-29T21:46:03.522Z',
    morphology: 'seedling',
    age: 'new_tree',
    captureApprovalTag: 'simple_leaf',
  },
  {
    id: 120,
    uuid: '11942400-6617-4c6c-bf5e',
    planterId: 12,
    planterIdentifier: 'grower3@some.place',
    deviceIdentifier: '3-abcdef123456',
    approved: true,
    active: true,
    status: 'planted',
    speciesId: 1,
    timeCreated: '2020-07-29T21:46:03.522Z',
    morphology: 'seedling',
    age: 'new_tree',
    captureApprovalTag: 'simple_leaf',
  },
  {
    id: 101,
    uuid: '11942400-6617-4c6c-bf5e',
    planterId: 10,
    planterIdentifier: 'grower3@some.place',
    deviceIdentifier: '3-abcdef123456',
    approved: false,
    active: false,
    status: 'planted',
    speciesId: 30,
    timeCreated: '2020-07-29T21:46:03.522Z',
    morphology: 'seedling',
    age: 'new_tree',
    captureApprovalTag: 'simple_leaf',
  },
];

const CAPTURE_TAGS = [
  {
    id: 1,
    treeId: 100,
    tagId: 3,
  },
  {
    id: 1,
    treeId: 110,
    tagId: 3,
  },
  {
    id: 1,
    treeId: 120,
    tagId: 3,
  },
  {
    id: 1,
    treeId: 101,
    tagId: 3,
  },
];

const GROWER = {
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

const GROWERS = [
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

const TAG = {
  id: 3,
  tagName: 'test',
};

const TAGS = [
  {
    id: 0,
    tagName: 'tag_a',
    public: true,
    active: true,
  },
  {
    id: 1,
    tagName: 'tag_b',
    public: true,
    active: true,
  },
  {
    id: 3,
    tagName: 'tag_c',
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
  {
    id: 30,
    name: 'fig',
  },
];

const capturesValues = {
  captures: CAPTURES,
  captureCount: 4,
  selected: [],
  capture: {},
  numSelected: 0,
  page: 0,
  rowsPerPage: 25,
  order: 'asc',
  orderBy: 'id',
  allIds: [],
  byId: {},
  filter: new FilterModel(),
  queryCapturesApi: () => {},
  getCaptureCount: () => {},
  getCapturesAsync: () => {},
  getCaptureAsync: () => {},
};
const growerValues = {
  growers: GROWERS,
  pageSize: 24,
  count: null,
  currentPage: 0,
  filter: new FilterGrower(),
  isLoading: false,
  totalGrowerCount: null,
  load: () => {},
  getCount: () => {},
  changePageSize: () => {},
  changeCurrentPage: () => {},
  getGrower: () => {},
  updateGrower: () => {},
  updateGrowers: () => {},
  updateFilter: () => {},
  getTotalGrowerCount: () => {},
};
const verifyValues = {
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
const tagsValues = {
  tagList: TAGS,
  tagInput: [],
  loadTags: () => {},
  createTags: () => {},
  setTagInput: () => {},
};
const speciesValues = {
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

module.exports = {
  CAPTURE,
  CAPTURES,
  CAPTURE_TAGS,
  GROWER,
  GROWERS,
  ORGS,
  TAG,
  TAGS,
  SPECIES,
  capturesValues,
  growerValues,
  verifyValues,
  tagsValues,
  speciesValues,
};
