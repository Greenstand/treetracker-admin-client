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

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/captureDetail.test.js');

describe.skip('captureDetail', () => {
  let api;
  let captureValues;
  // let transition;

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

  const SPECIES = {
    id: 30,
    name: 'fig',
  };

  const TAG = {
    id: 3,
    tagName: 'test',
  };

  beforeEach(() => {
    //mock the api
    api = require('../../api/treeTrackerApi').default;

    api.getCaptureById = (id) => {
      log.debug('mock getCaptureById:');
      return Promise.resolve(CAPTURE);
    };
    api.getSpeciesById = (id) => {
      log.debug('mock getSpeciesById');
      return Promise.resolve(SPECIES);
    };
    api.getTagById = (id) => {
      log.debug('mock getTagById');
      return Promise.resolve(TAG);
    };
    // transition = forwardRef(function Transition(props, ref) {
    //   return <Slide direction="up" ref={ref} {...props} />;
    // });
  });

  describe('with a default context', () => {
    //{{{
    beforeEach(async () => {
      captureValues = {
        capture: null,
        species: null,
        tags: [],
        getCaptureDetail: () => {},
        getCapture: () => {},
        getSpecies: () => {},
        getTags: () => {},
        reset: () => {},
      };

      render(
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AppProvider>
              <CaptureDetailProvider value={captureValues}>
                <CaptureDetailDialog
                  open={true}
                  // TransitionComponent={transition}
                  capture={{ id: 0 }}
                />
              </CaptureDetailProvider>
            </AppProvider>
          </BrowserRouter>
        </ThemeProvider>,
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
        expect(screen.getByText(/planter@some.place/i));
        expect(screen.getByText(/new_tree/i));
        expect(screen.getByText(/simple_leaf/i));
      });
    });
  });
});
