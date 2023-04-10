import React from 'react';
import ReactDOM from 'react-dom';
import { act, render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../context/AppContext';
import CaptureFilter from '../CaptureFilter';
import Verify from '../Verify';
import { ORGS } from './fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/capturefilter.test');

describe('CaptureFilter organizations', () => {
  const api = require('../../api/treeTrackerApi').default;
  beforeEach(() => {
    //mock the api

    api.getOrganizations = () => {
      // log.debug('mock getOrganizations:');
      return Promise.resolve(ORGS);
    };
  });

  describe('CaptureFilter', () => {
    describe('w/o data in context', () => {
      beforeEach(async () => {
        render(
          <AppProvider>
            <CaptureFilter />
          </AppProvider>
        );
      });

      afterEach(cleanup);

      it('renders "Start Date" input ', () => {
        const input = screen.getByRole('textbox', { name: 'Start Date' });
        expect(input).toBeInTheDocument();
      });

      it('renders "End Date" input ', () => {
        const input = screen.getByRole('textbox', { name: 'End Date' });
        expect(input).toBeInTheDocument();
      });

      it('renders Species dropdown ', () => {
        const dropdown = screen.getByTestId('species-dropdown');
        expect(dropdown).toBeInTheDocument();
      });

      it('renders Tags dropdown ', () => {
        const dropdown = screen.getByTestId('tag-dropdown');
        expect(dropdown).toBeInTheDocument();
      });

      it('renders Organization dropdown ', () => {
        const dropdown = screen.getByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();
      });

      it('renders Wallets dropdown ', () => {
        const dropdown = screen.getByTestId('wallet-dropdown');
        expect(dropdown).toBeInTheDocument();
      });

      it('renders default orgList when dropdown clicked ', () => {
        const dropdown = screen.getByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();

        const button = within(dropdown).getByRole('button', {
          name: /all/i,
        });

        userEvent.click(button);

        // the actual list of orgs is displayed in a popup that is not part of CaptureFilter
        // this list is the default list
        const orglist = screen.getByRole('listbox');
        const orgs = within(orglist).getAllByTestId('org-item');
        const listItems = orgs.map((org) => org.textContent);
        log.debug('default orgList', listItems);

        expect(orgs).toHaveLength(2);
      });
    });

    describe('w/ data in context', () => {
      let orgs;

      beforeEach(async () => {
        orgs = await api.getOrganizations();

        render(
          <AppProvider value={{ orgList: orgs }}>
            <CaptureFilter />
          </AppProvider>
        );
        await act(() => api.getOrganizations());
      });

      afterEach(cleanup);

      it('api loaded 2 organizations', () => {
        expect(orgs).toHaveLength(2);
      });

      it('renders Organization dropdown ', () => {
        const dropdown = screen.getByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();
      });

      it('renders default orgList when dropdown clicked ', () => {
        const dropdown = screen.getByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();

        const button = within(dropdown).getByRole('button', { name: /all/i });

        userEvent.click(button);

        // screen.logTestingPlaygroundURL();

        // the actual list of orgs is displayed in a popup that is not part of CaptureFilter
        const orglist = screen.getByRole('listbox');
        const orgs = within(orglist).getAllByTestId('org-item');
        const listItems = orgs.map((org) => org.textContent);
        log.debug('default orgList', listItems);

        // two default options + two orgs
        expect(orgs).toHaveLength(4);
      });
    });

    describe.skip('context data renders in child', () => {
      beforeEach(async () => {
        render(
          <AppProvider>
            <AppContext.Consumer>
              {(value) => <p>Received: {value.orgList}</p>}
            </AppContext.Consumer>
          </AppProvider>
        );

        await act(() => api.getOrganizations());
      });

      // just tests the mock api, not what's showing on the page
      it('api loaded 2 organizations', () => {
        expect(orgs).toHaveLength(2);
      });

      it('renders text "Dummy Org" ', () => {
        // screen.debug(); // shows structure in console
        // screen.logTestingPlaygroundURL();
        // expect(screen.getByText(/^Received:/).textContent).toBe('Received: ');
        expect(screen.getByText('Dummy Org')).toBeInTheDocument();
      });
    });
  });
});
