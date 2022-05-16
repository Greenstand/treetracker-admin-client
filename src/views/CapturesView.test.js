import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import theme from '../components/common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProvider } from '../context/AppContext';
import { CapturesContext } from '../context/CapturesContext';
import { GrowerContext } from '../context/GrowerContext';
import { SpeciesContext } from '../context/SpeciesContext';
import { TagsContext } from '../context/TagsContext';
import CaptureView from './CapturesView';
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
} from '../components/tests/fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/verify.test');

jest.setTimeout(7000);
jest.mock('../api/growers');
jest.mock('../api/treeTrackerApi');

describe.skip('Captures View', () => {
  // mock the treeTrackerApi
  let captureApi = require('../api/treeTrackerApi').default;

  const getCaptures = () => {
    return Promise.resolve(CAPTURES);
  };
  const getCaptureCount = () => {
    return Promise.resolve({ count: 4 });
  };
  captureApi.getCaptureById = (_id) => {
    return Promise.resolve(CAPTURE);
  };
  captureApi.getSpecies = () => {
    return Promise.resolve(SPECIES);
  };
  captureApi.getSpeciesById = (_id) => {
    return Promise.resolve(SPECIES[0]);
  };
  captureApi.getCaptureCountPerSpecies = () => {
    return Promise.resolve({ count: 7 });
  };
  captureApi.getTags = () => {
    return Promise.resolve(TAGS);
  };
  captureApi.getTagById = (_id) => {
    return Promise.resolve(TAG);
  };
  captureApi.getOrganizations = () => {
    return Promise.resolve(ORGS);
  };

  describe('render CaptureView with CaptureGallery', () => {
    beforeEach(async () => {
      render(
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AppProvider
              value={{
                orgList: ORGS,
              }}
            >
              <GrowerContext.Provider value={growerValues}>
                <CapturesContext.Provider value={capturesValues}>
                  <SpeciesContext.Provider value={speciesValues}>
                    <TagsContext.Provider value={tagsValues}>
                      <CaptureView />
                    </TagsContext.Provider>
                  </SpeciesContext.Provider>
                </CapturesContext.Provider>
              </GrowerContext.Provider>
            </AppProvider>
          </BrowserRouter>
        </ThemeProvider>
      );

      await act(() => getCaptures());
      await act(() => getCaptureCount());
    });

    afterEach(cleanup);

    it.skip('renders filter', () => {
      screen.logTestingPlaygroundURL();
      const filter = screen.getByRole('button', {
        name: /filter/i,
      });
      userEvent.click(filter);

      const verifyStatus = screen.getByLabelText(/awaiting verification/i);
      expect(verifyStatus).toBeInTheDocument();

      const orgFilter = screen.getByLabelText(/organization/i);
      expect(orgFilter).toBeInTheDocument();
    });

    it.skip('renders number of applied filters', async () => {
      const filter = screen.getByRole('button', {
        name: /filter 1/i,
      });
      userEvent.click(filter);
      expect(screen.getByText(/awaiting verification/i)).toBeInTheDocument();

      // data won't actually be filtered but filters should be selected
      let dropdown = screen.getByTestId('org-dropdown');
      expect(dropdown).toBeInTheDocument();
      let button = within(dropdown).getByRole('button', {
        name: /all/i,
      });
      userEvent.click(button);
      // the actual list of orgs is displayed in a popup that is not part of FilterTop, this list is the default list
      const orglist = screen.getByRole('listbox');

      const orgSelected = screen.getByRole('option', {
        name: /not set/i,
      });

      userEvent.selectOptions(orglist, orgSelected);

      userEvent.click(screen.getByText(/apply/i));
      expect(
        screen.getByRole('button', {
          name: /filter 2/i,
        })
      ).toBeTruthy();
    });

    it('renders gallery view', () => {
      screen.logTestingPlaygroundURL();
      const pageSize = screen.getAllByText(/captures per page:/i);
      expect(pageSize).toHaveLength(2);
      expect(screen.getByText(/4 captures/i));
    });

    it('renders buttons to view table', () => {
      const tableBtns = screen.getAllByText(/table view/i);
      expect(tableBtns).toHaveLength(2);
    });

    it('renders button to view gallery as disabled', () => {
      const galleryBtns = screen.getByText(/gallery view/i);
      expect(galleryBtns).toHaveLength(1);
    });

    it('renders capture details', () => {
      const captureDetails = screen.getAllByRole('button', {
        name: /capture details/i,
      });
      expect(captureDetails).toHaveLength(4);
      userEvent.click(captureDetails[0]);

      expect(screen.getByText(/capture data/i)).toBeInTheDocument();
      expect(screen.getByText(/grower identifier/i)).toBeInTheDocument();
      expect(screen.getByText(/grower1@some.place/i)).toBeInTheDocument();
      expect(screen.getByText(/device identifier/i)).toBeInTheDocument();
      expect(screen.getByText(/verification status/i)).toBeInTheDocument();
      expect(screen.getByText(/token status/i)).toBeInTheDocument();
    });

    it('renders grower details', () => {
      const growerDetails = screen.getAllByRole('button', {
        name: /grower details/i,
      });
      expect(growerDetails).toHaveLength(4);
      userEvent.click(growerDetails[0]);
      screen.logTestingPlaygroundURL();

      expect(screen.getByText(/country/i)).toBeInTheDocument();
      expect(screen.getByText(/organization ID/i)).toBeInTheDocument();
      expect(screen.getByText(/person ID/i)).toBeInTheDocument();
      expect(screen.getByText(/ID:/i)).toBeInTheDocument();
      expect(screen.getByText(/email address/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/registered/i)).toBeInTheDocument();
    });
  });

  describe.skip('render view with CaptureTable', () => {
    beforeEach(async () => {
      render(
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AppProvider value={{ orgList: ORGS }}>
              <GrowerContext.Provider value={growerValues}>
                <CapturesContext.Provider value={capturesValues}>
                  <SpeciesContext.Provider value={speciesValues}>
                    <TagsContext.Provider value={tagsValues}>
                      <CaptureView />
                    </TagsContext.Provider>
                  </SpeciesContext.Provider>
                </CapturesContext.Provider>
              </GrowerContext.Provider>
            </AppProvider>
          </BrowserRouter>
        </ThemeProvider>
      );

      await act(() => getCaptures());
      await act(() => getCaptureCount());
    });

    afterEach(cleanup);

    it('renders table view', () => {
      const pageSize = screen.getAllByText(/rows per page:/i);
      expect(pageSize).toHaveLength(2);
      expect(screen.getByText(/4 captures/i));
    });

    it('renders buttons to view gallery', () => {
      const galleryBtns = screen.getAllByText(/gallery view/i);
      expect(galleryBtns).toBeInTheDocument();
    });

    it('renders button to view table as disabled', () => {
      const tableBtns = screen.getAllByText(/table view/i);
      expect(tableBtns).toHaveLength(1);
    });

    it('renders capture details', () => {
      const captureDetails = screen.getAllByRole('button', {
        name: /capture details/i,
      });
      expect(captureDetails).toHaveLength(4);
      userEvent.click(captureDetails[0]);

      expect(screen.getByText(/capture data/i)).toBeInTheDocument();
      expect(screen.getByText(/grower identifier/i)).toBeInTheDocument();
      expect(screen.getByText(/grower1@some.place/i)).toBeInTheDocument();
      expect(screen.getByText(/device identifier/i)).toBeInTheDocument();
      expect(screen.getByText(/verification status/i)).toBeInTheDocument();
      expect(screen.getByText(/token status/i)).toBeInTheDocument();
    });

    it('renders grower details', () => {
      const growerDetails = screen.getAllByRole('button', {
        name: /grower details/i,
      });
      expect(growerDetails).toHaveLength(4);
      userEvent.click(growerDetails[0]);
      screen.logTestingPlaygroundURL();

      expect(screen.getByText(/country/i)).toBeInTheDocument();
      expect(screen.getByText(/organization ID/i)).toBeInTheDocument();
      expect(screen.getByText(/person ID/i)).toBeInTheDocument();
      expect(screen.getByText(/ID:/i)).toBeInTheDocument();
      expect(screen.getByText(/email address/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/registered/i)).toBeInTheDocument();
    });
  });
});
