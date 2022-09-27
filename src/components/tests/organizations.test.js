import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
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
import * as loglevel from 'loglevel';
import { ORGS } from '../tests/fixtures';

const log = loglevel.getLogger('../tests/organizations.test');

describe('CaptureFilter organizations', () => {
  let api;

  beforeEach(() => {
    //mock the api
    api = require('../../api/treeTrackerApi').default;

    api.getOrganizations = jest.fn(() => {
      // log.debug('mock getOrganizations:');
      return Promise.resolve(ORGS);
    });
  });

  describe('CaptureFilter', () => {
    describe('w/o data in context', () => {
      let component;

      beforeEach(async () => {
        component = (
          <AppProvider>
            <CaptureFilter />
          </AppProvider>
        );
      });

      afterEach(cleanup);

      it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(component, div);
        ReactDOM.unmountComponentAtNode(div);
      });

      it('renders "Start Date" input ', () => {
        render(component);
        let input = screen.getByRole('textbox', { name: 'Start Date' });
        expect(input).toBeInTheDocument();
      });

      it('renders "End Date" input ', () => {
        render(component);
        let input = screen.getByRole('textbox', { name: 'End Date' });
        expect(input).toBeInTheDocument();
      });

      it('renders Species dropdown ', () => {
        render(component);
        let dropdown = screen.getByTestId('species-dropdown');
        expect(dropdown).toBeInTheDocument();
      });

      it('renders Tags dropdown ', () => {
        render(component);
        let dropdown = screen.getByTestId('tag-dropdown');
        expect(dropdown).toBeInTheDocument();
      });

      it('renders Organization dropdown ', () => {
        render(component);
        let dropdown = screen.getByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();
      });

      it('renders default orgList when dropdown clicked ', async () => {
        render(component);
        let dropdown = await screen.findByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();

        let button = within(dropdown).getByRole('button', {
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
      let component;

      beforeEach(async () => {
        orgs = await api.getOrganizations();
        component = (
          <AppProvider value={{ orgList: orgs }}>
            <CaptureFilter />
          </AppProvider>
        );
        // render(component);
        await act(() => api.getOrganizations());
      });

      afterEach(cleanup);

      it('api loaded 2 organizations', () => {
        expect(orgs).toHaveLength(2);
      });

      it('renders Organization dropdown ', () => {
        render(component);
        let dropdown = screen.getByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();
      });

      it('renders default orgList when dropdown clicked ', async () => {
        render(component);
        let dropdown = await screen.findByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();

        let button = within(dropdown).getByRole('button', { name: /all/i });

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
  });
});
