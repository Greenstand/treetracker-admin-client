import React, { forwardRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import { AppProvider } from '../../context/AppContext';
import { CaptureDetailProvider } from '../../context/CaptureDetailContext';
import CaptureDetailDialog from '../CaptureDetailDialog';
import { CAPTURE, TAG, SPECIES } from './fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/captureDetail.test.js');

describe('captureDetail', () => {
  let api;
  let captureValues;

  beforeEach(() => {
    //mock the api
    api = require('../../api/treeTrackerApi').default;

    api.getCaptureById = (_id) => {
      log.debug('mock getCaptureById:');
      return Promise.resolve(CAPTURE);
    };
    api.getSpeciesById = (_id) => {
      log.debug('mock getSpeciesById');
      return Promise.resolve(SPECIES[0]);
    };
    api.getTagById = (_id) => {
      log.debug('mock getTagById');
      return Promise.resolve(TAG);
    };
  });

  describe('with a default context', () => {
    beforeEach(async () => {
      captureValues = {
        capture: null,
        species: null,
        tags: [],
        getCaptureDetail: () => {},
        getSpecies: () => {},
        getTags: () => {},
        reset: () => {},
      };

      render(
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AppProvider>
              <CaptureDetailProvider>
                <CaptureDetailDialog
                  open={true}
                  onClose={() => {}}
                  capture={{ id: 0 }}
                />
              </CaptureDetailProvider>
            </AppProvider>
          </BrowserRouter>
        </ThemeProvider>
      );

      await act(() => api.getCaptureById());
    });

    afterEach(cleanup);

    describe('query captureDetail', () => {
      beforeEach(async () => {
        // await CapturesContext.getCaptureDetail(0);
      });

      it('loaded captureDetail', () => {
        // screen.logTestingPlaygroundURL();
        expect(screen.getByText(/grower@some.place/i));
        expect(screen.getByText(/new_tree/i));
        expect(screen.getByText(/simple_leaf/i));
      });
    });
  });
});
