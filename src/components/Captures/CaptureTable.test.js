import React from 'react';
import { act, render, screen, within, cleanup } from '@testing-library/react';
import axios from 'axios';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { SpeciesContext } from '../../context/SpeciesContext';
import { TagsContext } from '../../context/TagsContext';
import {
  CapturesContext,
  CapturesProvider,
} from '../../context/CapturesContext';

import CaptureTable from './CaptureTable';
import FilterModel from '../../models/Filter';
import * as loglevel from 'loglevel';
import {
  CAPTURES,
  CAPTURE_TAGS,
  capturesValues,
  speciesValues,
  tagsValues,
} from '../tests/fixtures';

const log = loglevel.getLogger('../models/captures.test');

jest.mock('axios');

describe('Captures', () => {
  let component;
  let data = CAPTURES;

  // mock the treeTrackerApi
  const captureApi = require('../../api/treeTrackerApi').default;

  captureApi.getCaptureTags = () => {
    log.debug(`mock getCaptureTags: ${CAPTURE_TAGS}`);
    return Promise.resolve(CAPTURE_TAGS);
  };

  describe('CapturesTable renders properly', () => {
    beforeEach(async () => {
      component = (
        <ThemeProvider theme={theme}>
          <CapturesContext.Provider value={capturesValues}>
            <SpeciesContext.Provider value={speciesValues}>
              <TagsContext.Provider value={tagsValues}>
                <CaptureTable
                  setShowGallery={false}
                  handleShowCaptureDetail={() => {}}
                  handleShowGrowerDetail={() => {}}
                />
              </TagsContext.Provider>
            </SpeciesContext.Provider>
          </CapturesContext.Provider>
        </ThemeProvider>
      );

      render(component);
    });

    afterEach(cleanup);

    it('api loaded 4 captures', () => {
      // screen.logTestingPlaygroundURL();
      expect(capturesValues.captures).toHaveLength(4);
    });

    it('should show rows per page at top and bottom', () => {
      const pageNums = screen.getAllByRole('button', {
        name: /rows per page: 24/i,
      });
      expect(pageNums).toHaveLength(2);
    });

    it('should show page # and capture count', () => {
      const counts = Array.from(
        document.querySelectorAll('.MuiTablePagination-caption')
      );
      const arr = counts.map((count) => count.firstChild.textContent);
      expect(arr[1]).toBe('1-4 of 4');
    });

    it('should have 10 headers', () => {
      const table = screen.getByRole(/table/i);
      const headers = within(table).getAllByRole(/columnheader/i);
      const arr = headers.map((header) => header.textContent);
      expect(arr).toHaveLength(10);
    });

    it('renders headers for captures table', () => {
      const table = screen.getByRole(/table/i);
      let item = screen.getAllByText(/Captures/i)[0];
      expect(item).toBeInTheDocument();
      item = within(table).getByText(/Capture ID/i);
      expect(item).toBeInTheDocument();
      item = within(table).getByText(/Grower ID/i);
      expect(item).toBeInTheDocument();
      item = within(table).getByText(/Device Identifier/i);
      expect(item).toBeInTheDocument();
      item = within(table).getByText(/Planter Identifier/i);
      expect(item).toBeInTheDocument();
      item = within(table).getByText(/Verification Status/i);
      expect(item).toBeInTheDocument();
      item = within(table).getByText(/Species/i);
      expect(item).toBeInTheDocument();
      item = within(table).getByText(/Token Status/i);
      expect(item).toBeInTheDocument();
      item = within(table).getByText(/Capture Tags/i);
      expect(item).toBeInTheDocument();
      item = within(table).getByText(/Created/i);
      expect(item).toBeInTheDocument();
    });

    it('renders 4 rows ', () => {
      const table = screen.getAllByRole(/rowgroup/i);
      const rows = within(table[1]).getAllByRole(/row/i);
      const arr = rows.map((link) => link.textContent);
      expect(rows).toHaveLength(4);
    });

    it('renders map links for capture and grower ids', () => {
      const table = screen.getByTestId('captures-table-body');
      const links = within(table).getAllByRole('link');
      const arr = links.map((link) => link.textContent);
      expect(arr.includes('Map')).toBeTruthy();
      expect(arr).toHaveLength(8); // 2 for each row
    });

    it('renders capture detail buttons for capture ids', () => {
      const table = screen.getByTestId('captures-table-body');
      const captureDetailBtns = within(table).getAllByRole('button', {
        name: /view\/edit capture details/i,
      });
      const arr = captureDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });

    it('renders grower detail buttons for grower ids', () => {
      const table = screen.getByTestId('captures-table-body');
      const growerDetailBtns = within(table).getAllByRole('button', {
        name: /view\/edit grower details/i,
      });
      const arr = growerDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });

    it('displays captures data', () => {
      const table = screen.getByTestId('captures-table-body');
      // screen.logTestingPlaygroundURL(table);
      // screen.debug(table);
      const status = within(table).getAllByText(/approved/i);
      expect(status).toHaveLength(2);
      const tokens = within(table).getAllByText(/not tokenized/i);
      expect(tokens).toHaveLength(4);
      const device = within(table).getAllByText(/1-abcdef123456/i);
      expect(device).toHaveLength(1);
      const captureTag = within(table).getAllByText(/tag_c/i);
      expect(captureTag).toHaveLength(4);
    });
  });

  describe.skip('makes api requests correctly', () => {
    const context = {
      isLoading: true,
      captures: [],
      captureCount: 4,
      selected: [],
      capture: {},
      numSelected: 0,
      page: 0,
      rowsPerPage: 24,
      order: 'asc',
      orderBy: 'id',
      allIds: [],
      byId: {},
      filter: new FilterModel(),
      // queryCapturesApi: jest.fn(),
      queryCapturesApi: () => {},
      getCaptureCount: () => {},
      getCaptures: () => {},
      getCaptureById: () => {},
    };

    // Mock the API

    // WORKS TO MAKE REQUESTS
    // axios.get
    //   .mockReturnValueOnce({
    //     data: { count: data.length },
    //   })
    //   .mockReturnValueOnce({ data });

    // PASSES TESTS BUT STILL DOESN'T RETURN DATA
    context.queryCapturesApi = jest.fn(() => {
      console.log('mock queryCapturesApi');
      // return Promise.resolve({ data });
      return axios.get
        .mockReturnValueOnce({
          data: { count: data.length },
        })
        .mockReturnValueOnce({ data });
    });

    context.queryCapturesApi = jest.fn(() => {
      console.log('mock queryCapturesApi');
      // return Promise.resolve({ data });
      return axios.get
        .mockReturnValueOnce({
          data: { count: data.length },
        })
        .mockReturnValueOnce({ data });
    });

    beforeEach(async () => {
      component = (
        <ThemeProvider theme={theme}>
          <CapturesProvider value={context}>
            <CaptureTable />
          </CapturesProvider>
        </ThemeProvider>
      );

      render(component);
      act(() => axios.get());
      act(() => context.queryCapturesApi()); //passes tests
      // await act(async () => await context.queryCapturesApi()); //stops data errors
    });

    afterEach(cleanup);

    it('should make a request for capture count', () => {
      expect(axios.get).toHaveBeenCalled();
      // console.log(axios.get.mock.calls);
      expect(axios.get.mock.calls[1][0]).toContain(`trees/count?`);
    });

    it('should call captures API with a valid filter', () => {
      const filter = JSON.stringify({
        where: { approved: true, active: true },
        order: ['id asc'],
        limit: 24,
        skip: 0,
        fields: {
          id: true,
          timeCreated: true,
          status: true,
          active: true,
          approved: true,
          planterId: true,
          planterIdentifier: true,
          deviceIdentifier: true,
          speciesId: true,
          tokenId: true,
          age: true,
          morphology: true,
          captureApprovalTag: true,
          rejectionReason: true,
          uuid: true,
          imageUrl: true,
          lat: true,
          lon: true,
          timeUpdated: true,
          note: true,
        },
      });

      expect(axios.get).toHaveBeenCalled();
      expect(axios.get.mock.calls[0][0]).toContain(`/trees?filter=${filter}`);
    });
  });
});
