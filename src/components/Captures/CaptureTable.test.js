import React from 'react';
import {
  act,
  render,
  screen,
  within,
  waitFor,
  cleanup,
} from '@testing-library/react';
import axios from 'axios';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { SpeciesContext } from '../../context/SpeciesContext';
import { TagsContext } from '../../context/TagsContext';
import { CapturesContext } from '../../context/CapturesContext';

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

  captureApi.getCaptures = () => {
    log.debug(`mock getCaptures: ${CAPTURES.captures}`);
    return Promise.resolve(CAPTURES.captures);
  };

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
                <CaptureTable />
              </TagsContext.Provider>
            </SpeciesContext.Provider>
          </CapturesContext.Provider>
        </ThemeProvider>
      );

      render(component);
      await act(() => captureApi.getCaptures());
      await act(() => captureApi.getCaptureTags());
    });

    afterEach(cleanup);

    it('api loaded 4 captures', () => {
      // screen.logTestingPlaygroundURL();
      expect(capturesValues.captures).toHaveLength(4);
    });

    it('should show rows per page at top and bottom', () => {
      const pageNums = screen.getAllByRole('button', {
        name: /rows per page: 25/i,
      });
      expect(pageNums).toHaveLength(2);
    });

    it('should show page # and capture count', async () => {
      const counts = Array.from(
        document.querySelectorAll('.MuiTablePagination-caption')
      );
      await waitFor(() => {
        const arr = counts.map((count) => count.firstChild.textContent);
        expect(arr[1]).toBe('1-4 of 4');
      });
    });

    it('should have 13 headers', async () => {
      const table = await screen.findByRole(/table/i);
      await waitFor(() => {
        const headers = within(table).getAllByRole(/columnheader/i);
        const arr = headers.map((header) => header.textContent);
        expect(arr).toHaveLength(13);
      });
    });

    it('renders headers for captures table', async () => {
      const table = await screen.findByRole(/table/i);
      await waitFor(() => {
        // screen.logTestingPlaygroundURL(table);
        // page header
        let item = screen.getAllByText(/Captures/i)[0];
        expect(item).toBeInTheDocument();
        // table headers
        item = within(table).getByText(/Capture ID/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Grower Acct\. ID/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Wallet/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Device Identifier/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Species/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Token Id/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Capture Tags/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Notes/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Created/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Longitude/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Latitude/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Image URL/i);
        expect(item).toBeInTheDocument();
      });
    });

    it('renders 4 rows ', async () => {
      const table = await screen.getAllByRole(/rowgroup/i);
      await waitFor(() => {
        const rows = within(table[1]).getAllByRole(/row/i);
        const arr = rows.map((link) => link.textContent);
        expect(rows).toHaveLength(4);
      });
    });

    it('renders links for planter ids (10-12)', async () => {
      const table = await screen.getByTestId('captures-table-body');
      await waitFor(() => {
        const links = within(table).getAllByRole('link');
        const arr = links.map((link) => link.textContent);
        expect(arr.includes('10')).toBeTruthy();
        expect(arr.includes('11')).toBeTruthy();
        expect(arr.includes('12')).toBeTruthy();
      });
    });

    it('displays captures data', async () => {
      const table = await screen.getByTestId('captures-table-body');
      await waitFor(() => {
        const wallet = within(table).getAllByText(/grower3@some.place/i);
        expect(wallet).toHaveLength(2);
        const device = within(table).getAllByText(/1-abcdef123456/i);
        expect(device).toHaveLength(1);
        // const captureTag = within(table).getAllByText(/tag_c/i);
        // expect(captureTag).toHaveLength(4);
      });
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
      rowsPerPage: 25,
      order: 'asc',
      orderBy: 'id',
      allIds: [],
      byId: {},
      filter: new FilterModel(),
      // getCaptures: jest.fn(),
      getCaptures: () => {},
      getCaptureCount: () => {},
      getCapturesAsync: () => {},
    };

    // Mock the API

    // WORKS TO MAKE REQUESTS
    // axios.get
    //   .mockReturnValueOnce({
    //     data: { count: data.length },
    //   })
    //   .mockReturnValueOnce({ data });

    // PASSES TESTS BUT STILL DOESN'T RETURN DATA
    const captureApi = require('../../api/treeTrackerApi').default;

    captureApi.getCaptures = jest.fn(() => {
      log.debug('mock getCaptures');
      // return Promise.resolve({ data });
      return axios.get
        .mockReturnValueOnce({
          data: { count: data.length, captures: CAPTURES.captures },
        })
        .mockReturnValueOnce({ data });
    });

    // context.getCaptures = jest.fn(() => {
    //  log.debug('mock getCaptures');
    //   // return Promise.resolve({ data });
    //   return axios.get
    //     .mockReturnValueOnce({
    //       data: { count: data.length },
    //     })
    //     .mockReturnValueOnce({ data });
    // });

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
      act(() => captureApi.getCaptures());
    });

    afterEach(cleanup);

    it('should make a request for capture count', () => {
      expect(axios.get).toHaveBeenCalled();
      //log.debug(axios.get.mock.calls);
      expect(axios.get.mock.calls[1][0]).toContain(`trees/count?`);
    });

    it('should call captures API with a valid filter', () => {
      const filter = JSON.stringify({
        status: 'approved',
        limit: 25,
        offset: 0,
      });

      expect(axios.get).toHaveBeenCalled();
      expect(axios.get.mock.calls[0][0]).toContain(`/v2/captures`);
    });
  });
});
