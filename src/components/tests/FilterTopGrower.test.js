import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProvider } from '../../context/AppContext';
import { GrowerProvider } from '../../context/GrowerContext';
import FilterTopGrower from '../FilterTopGrower';
// import GrowersFilterHeader from '../GrowersFilterHeader';
import { GROWER, GROWERS, ORGS, WALLETS, growerValues } from './fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/grower.test');

jest.mock('../../api/growers');

describe('growers', () => {
  let api;

  beforeEach(() => {
    //mock the api
    api = require('../../api/growers').default;

    api.getCount = () => {
      log.debug('mock getCount');
      return Promise.resolve({ count: 2 });
    };
    api.getGrower = () => {
      log.debug('mock getGrower');
      return Promise.resolve(GROWER);
    };
    api.getGrowers = () => {
      log.debug('mock load');
      return Promise.resolve(GROWERS);
    };
    api.getWallets = () => {
      log.debug('mock wallets');
      return Promise.resolve(WALLETS);
    };
  });

  describe('with a default context', () => {
    beforeEach(async () => {
      render(
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AppProvider value={{ orgList: ORGS }}>
              <GrowerProvider value={growerValues}>
                <FilterTopGrower />
              </GrowerProvider>
            </AppProvider>
          </BrowserRouter>
        </ThemeProvider>
      );

      await act(() => api.getGrowers());
      // await act(() => api.getCount());
    });

    afterEach(cleanup);

    it('renders subcomponents of filter top grower', () => {
      // screen.logTestingPlaygroundURL();
      // const filter = screen.getByRole('button', { name: /filter/i });
      // userEvent.click(filter);

      expect(screen.getByLabelText(/Grower Account ID/)).toBeInTheDocument();

      expect(screen.getByLabelText(/Person ID/)).toBeInTheDocument();

      expect(screen.getByLabelText(/Device ID/)).toBeInTheDocument();

      expect(screen.getByLabelText(/Organization/)).toBeInTheDocument();

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    });

    it('renders Organization dropdown ', () => {
      let dropdown = screen.getByTestId('org-dropdown');
      expect(dropdown).toBeInTheDocument();
    });

    it('renders default orgList when dropdown clicked ', () => {
      let dropdown = screen.getByTestId('org-dropdown');
      expect(dropdown).toBeInTheDocument();

      // screen.logTestingPlaygroundURL(dropdown);

      let button = within(dropdown).getByRole('button', {
        name: /organization all/i,
      });

      userEvent.click(button);

      // the actual list of orgs is displayed in a popup that is not part of FilterTop
      const orglist = screen.getByRole('listbox');
      const orgs = within(orglist).getAllByTestId('org-item');
      const listItems = orgs.map((org) => org.textContent);
      log.debug('default orgList', listItems);

      // two default options + two orgs
      expect(orgs).toHaveLength(4);
    });
  });
});
