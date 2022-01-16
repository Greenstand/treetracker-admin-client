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
import captureApi from '../../api/treeTrackerApi';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProvider } from '../../context/AppContext';
import { CapturesContext } from '../../context/CapturesContext';
import { GrowerContext } from '../../context/GrowerContext';
import { SpeciesContext } from '../../context/SpeciesContext';
import { TagsContext } from '../../context/TagsContext';
import CaptureGallery from './CaptureGallery';
import {
  CAPTURE,
  CAPTURES,
  GROWER,
  ORGS,
  TAG,
  TAGS,
  SPECIES,
  capturesValues,
  growerValues,
  tagsValues,
  speciesValues,
} from '../tests/fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/verify.test');

jest.setTimeout(7000);
jest.mock('../../api/treeTrackerApi');

describe('Captures', () => {
  // mock captures context api methods
  const getCaptures = () => {
    log.debug('mock getCaptures:');
    return Promise.resolve(CAPTURES);
  };
  const getCaptureCount = () => {
    log.debug('mock getCaptureCount:');
    return Promise.resolve({ count: 4 });
  };

  // mock the treeTrackerApi
  // let captureApi = require('../../api/treeTrackerApi').default;

  // captureApi.getCaptureById = (_id) => {
  //   log.debug('mock getCaptureById:');
  //   return Promise.resolve(CAPTURE);
  // };
  // captureApi.getSpecies = () => {
  //   log.debug('mock getSpecies:');
  //   return Promise.resolve(SPECIES);
  // };
  // captureApi.getSpeciesById = (_id) => {
  //   log.debug('mock getSpeciesById:');
  //   return Promise.resolve(SPECIES[0]);
  // };
  // captureApi.getCaptureCountPerSpecies = () => {
  //   log.debug('mock getCaptureCountPerSpecies:');
  //   return Promise.resolve({ count: 7 });
  // };
  // captureApi.getTags = () => {
  //   log.debug('mock getTags:');
  //   return Promise.resolve(TAGS);
  // };
  // captureApi.getTagById = (_id) => {
  //   log.debug('mock getTagById:');
  //   return Promise.resolve(TAG);
  // };
  // captureApi.getOrganizations = () => {
  //   log.debug('mock getOrganizations:');
  //   return Promise.resolve(ORGS);
  // };

  describe('with default values', () => {
    beforeEach(async () => {
      render(
        <ThemeProvider theme={theme}>
          {/* <BrowserRouter> */}
          {/* <AppProvider value={{ orgList: ORGS }}> */}
          {/* <GrowerContext.Provider value={growerValues}> */}
          <CapturesContext.Provider value={capturesValues}>
            <SpeciesContext.Provider value={speciesValues}>
              <TagsContext.Provider value={tagsValues}>
                <CaptureGallery
                  setShowGallery={true}
                  handleShowCaptureDetail={() => {}}
                  handleShowGrowerDetail={() => {}}
                />
              </TagsContext.Provider>
            </SpeciesContext.Provider>
          </CapturesContext.Provider>
          {/* </GrowerContext.Provider> */}
          {/* </AppProvider> */}
          {/* </BrowserRouter> */}
        </ThemeProvider>
      );

      await act(() => getCaptures());
      await act(() => getCaptureCount());
    });

    afterEach(cleanup);

    it('should show captures per page at top and bottom', () => {
      const pageNums = screen.getAllByRole('button', {
        name: /captures per page: 24/i,
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

    it('renders side panel', () => {
      expect(screen.getByText(/approve/i));
      expect(screen.getByText(/reject/i));
      expect(screen.getByText(/morphology/i));
      expect(screen.getByText(/additional tags/i));
    });

    it('renders captures cards', () => {
      const cards = screen.getAllByTestId('capture-card');
      expect(cards).toHaveLength(4);
    });

    it('renders capture detail buttons for each card', () => {
      const gallery = screen.getByTestId('captures-gallery');
      const captureDetailBtns = within(gallery).getAllByRole('button', {
        name: /capture details/i,
      });
      const arr = captureDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });

    it('renders grower detail buttons for each card', () => {
      const gallery = screen.getByTestId('captures-gallery');
      const growerDetailBtns = within(gallery).getAllByRole('button', {
        name: /grower details/i,
      });
      const arr = growerDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });

    it('renders capture location buttons for each card', () => {
      const gallery = screen.getByTestId('captures-gallery');
      const captureDetailBtns = within(gallery).getAllByRole('link', {
        name: /capture location/i,
      });
      const arr = captureDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });

    it('renders grower map buttons for each card', () => {
      const gallery = screen.getByTestId('captures-gallery');
      const growerDetailBtns = within(gallery).getAllByRole('link', {
        name: /grower map/i,
      });
      const arr = growerDetailBtns.map((link) => link.title);
      expect(arr).toHaveLength(4);
    });
  });
});
