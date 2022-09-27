import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  act,
  render,
  screen,
  within,
  cleanup,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../context/AppContext';
import { RegionProvider } from '../../context/RegionContext';
import RegionsView from '../../views/RegionsView';
import FilterRegion from '../../models/FilterRegion';
import Regions from '../Regions';
import { REGIONS, REGION_COLLECTIONS, ORGS } from './fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/regions.test');

describe('region management', () => {
  let treeTrackerApi;
  let regionsApi;
  let regionValues;

  beforeEach(() => {
    regionsApi = require('../../api/regions').default;
    treeTrackerApi = require('../../api/treeTrackerApi').default;

    regionsApi.getRegions = jest.fn(() => {
      return Promise.resolve({
        query: {
          count: REGIONS.length,
        },
        regions: REGIONS,
      });
    });

    regionsApi.getRegion = jest.fn((id) => {
      const region = REGIONS.find((reg) => id === reg.id);
      return Promise.resolve({ region });
    });

    regionsApi.getCollections = jest.fn(() => {
      return Promise.resolve({
        query: {
          count: REGION_COLLECTIONS.length,
        },
        collections: REGION_COLLECTIONS,
      });
    });

    regionsApi.getCollection = jest.fn((id) => {
      const collection = REGION_COLLECTIONS.find((coll) => id === coll.id);
      return Promise.resolve({ collection });
    });

    regionsApi.upload = jest.fn(() => {
      return Promise.resolve(REGIONS[0]);
    });

    regionsApi.updateRegion = jest.fn(() => {
      return Promise.resolve(REGIONS[0]);
    });

    regionsApi.updateCollection = jest.fn(() => {
      return Promise.resolve(REGION_COLLECTIONS[0]);
    });

    treeTrackerApi.getOrganizations = jest.fn(() => {
      return Promise.resolve(ORGS);
    });

    regionValues = {
      regions: REGIONS,
      collections: REGION_COLLECTIONS,
      pageSize: 25,
      regionCount: null,
      collectionCount: null,
      currentPage: 0,
      filter: new FilterRegion(),
      isLoading: false,
      showCollections: false,
      changePageSize: () => {},
      changeCurrentPage: () => {},
      changeSort: () => {},
      setShowCollections: () => {},
      loadRegions: () => {},
      loadCollections: () => {},
      getRegion: () => {},
      upload: () => {},
      updateRegion: () => {},
      updateCollection: () => {},
      updateFilter: () => {},
      deleteRegion: () => {},
      deleteCollection: () => {},
    };
  });

  afterEach(cleanup);

  describe('<Regions /> renders page', () => {
    beforeEach(async () => {
      render(
        <BrowserRouter>
          <AppProvider value={{ orgList: ORGS }}>
            <RegionProvider value={regionValues}>
              <RegionsView />
            </RegionProvider>
          </AppProvider>
        </BrowserRouter>
      );
      await act(() => regionsApi.getRegions());
    });

    afterEach(cleanup);

    describe('it shows main page elements', () => {
      it('then shows "Upload" button', () => {
        expect(screen.getByText(/Upload/i)).toBeTruthy();
      });

      it('species list should be 2', () => {
        expect(regionValues.regions).toHaveLength(2);
      });

      // shows a table with headers
      // shows navigation menu
    });

    describe('when the "Upload" button is clicked', () => {
      beforeEach(() => {
        userEvent.click(screen.getByText(/Upload/i));
      });

      it('see popup with upload region or collection form', async () => {
        expect(
          await screen.findByText(/Upload New Region or Collection/i)
        ).toBeTruthy();
      });

      it('has inputs for owner and region name property', async () => {
        const dialog = await screen.findByRole(/dialog/i);
        expect(within(dialog).getByLabelText(/owner/i)).toBeTruthy();
        expect(
          within(dialog).getByLabelText(/region name property/i)
        ).toBeTruthy();
      });

      it('has buttons to upload and cancel', async () => {
        const dialog = await screen.findByRole(/dialog/i);
        expect(
          within(dialog).getByRole('button', { name: /upload/i })
        ).toBeTruthy();
      });
    });

    describe('regions table', () => {
      it('shows the table header', () => {
        const table = screen.getByRole(/table/i);
        expect(within(table).getByText(/name/i)).toBeTruthy();
        expect(within(table).getByText(/owner/i)).toBeTruthy();
        expect(within(table).getByText(/collection/i)).toBeTruthy();
        expect(within(table).getByText(/properties/i)).toBeTruthy();
        expect(within(table).getByText(/shown on org map/i)).toBeTruthy();
        expect(within(table).getByText(/statistics calculated/i)).toBeTruthy();
      });

      it('shows a region record', () => {
        const table = screen.getByRole(/table/i);
        expect(within(table).getByText(REGIONS[0].name)).toBeTruthy();
        expect(within(table).getAllByText(ORGS[0].name)).toBeTruthy();
        expect(
          within(table).getAllByText(REGION_COLLECTIONS[0].name)
        ).toBeTruthy();
        expect(within(table).getByText(REGIONS[0].properties.Id)).toBeTruthy();
      });
    });
  });
});
