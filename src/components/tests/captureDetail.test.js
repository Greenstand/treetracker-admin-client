import React from 'react';
import { act, render, screen, cleanup } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import axios from 'axios';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { CaptureDetailProvider } from '../../context/CaptureDetailContext';
import CaptureDetailDialog from '../CaptureDetailDialog';
import { CAPTURE, TAG, SPECIES } from './fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/captureDetail.test.js');

jest.mock('axios');

describe('captureDetail', () => {
  let api;
  let context;

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
      context = {
        capture: null,
        species: null,
        tags: [],
        getCaptureDetail: () => {},
        getSpecies: () => {},
        getTags: () => {},
        reset: () => {},
      };

      context.getCaptureDetail = jest.fn(() => {
        log.debug('mock getCaptureDetail');
        return axios.get.mockReturnValueOnce(CAPTURE);
      });

      render(
        <ThemeProvider theme={theme}>
          <CaptureDetailProvider value={context}>
            <CaptureDetailDialog
              open={true}
              onClose={() => {}}
              capture={{ id: 0 }}
            />
          </CaptureDetailProvider>
        </ThemeProvider>
      );

      await act(() => api.getCaptureById());
      await act(() => context.getCaptureDetail());
    });

    afterEach(cleanup);

    describe('query captureDetail', () => {
      it('loaded captureDetail', () => {
        // screen.logTestingPlaygroundURL();
        expect(screen.findByText(/capture data/i));
        expect(screen.findByText(/capture token/i));
        expect(screen.findByText(/grower@some.place/i));
        expect(screen.findByText(/new_tree/i));
        expect(screen.findByText(/simple_leaf/i));
      });
    });
  });
});
