import React from 'react';
import ReactDOM from 'react-dom';
import {
  act,
  render,
  screen,
  within,
  cleanup,
  waitFor,
} from '@testing-library/react';
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

    api.getOrganizations = jest.fn(() => {
      // log.debug('mock getOrganizations:');
      return Promise.resolve(ORGS);
    });
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

      it('renders text "Token Status" ', () => {
        expect(screen.getByText('Token Status')).toBeInTheDocument();
      });

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

      it('renders default orgList when dropdown clicked ', async () => {
        const dropdown = await screen.findByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();

        const button = within(dropdown).getByRole('button', {
          name: /all/i,
        });

        userEvent.click(button);

        // the actual list of orgs is displayed in a popup that is not part of CaptureFilter
        // this list is the default list
        const orglist = await screen.findByRole('listbox');
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

      it('renders default orgList when dropdown clicked ', async () => {
        const dropdown = await screen.findByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();

        const button = within(dropdown).getByRole('button', { name: /all/i });

        userEvent.click(button);

        // screen.logTestingPlaygroundURL();

        // the actual list of orgs is displayed in a popup that is not part of CaptureFilter
        const orglist = await screen.findByRole('listbox');
        const orgs = within(orglist).getAllByTestId('org-item');
        const listItems = orgs.map((org) => org.textContent);
        log.debug('default orgList', listItems);

        // two default options + two orgs
        expect(orgs).toHaveLength(4);
      });

      it('api loaded 2 organizations', async () => {
        await waitFor(async () => {
          const orgs = await api.getOrganizations.mock.results[0].value;
          // log.debug('MOCK CALLS --->', orgs);
          expect(orgs).toHaveLength(2);
          expect(orgs[0].name).toBe('Dummy Org');
        });
      });
    });

    describe.skip('context data renders in child', () => {
      beforeEach(async () => {
        render(
          <AppProvider>
            {(value) => (
              <div>
                Received:{' '}
                {value.orgList.map((org) => (
                  <p>{org.name}</p>
                ))}
              </div>
            )}
          </AppProvider>
        );

        await act(() => api.getOrganizations());
      });

      it('renders text "Dummy Org" ', async () => {
        await waitFor(async () => {
          screen.logTestingPlaygroundURL();
          expect(screen.getByText('Received:')).toBeInTheDocument();
          expect(screen.getByText('Dummy Org')).toBeInTheDocument();
        });
      });
    });
  });
});
