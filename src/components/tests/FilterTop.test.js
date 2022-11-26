import React from 'react';
import ReactDOM from 'react-dom';
import { act, render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../context/AppContext';
import FilterTop from '../FilterTop';
import Verify from '../Verify';
import { ORGS } from './fixtures';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/filtertop.test');

describe('FilterTop organizations', () => {
  let api;

  beforeEach(() => {
    //mock the api
    api = require('../../api/treeTrackerApi').default;

    api.getOrganizations = () => {
      // log.debug('mock getOrganizations:');
      return Promise.resolve(ORGS);
    };
  });

  describe('FilterTop', () => {
    describe('w/o data in context', () => {
      let component;

      beforeEach(async () => {
        component = (
          <AppProvider>
            <FilterTop />
          </AppProvider>
        );
      });

      afterEach(cleanup);

      it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(component, div);
        ReactDOM.unmountComponentAtNode(div);
      });

      it('renders text "Verification Status" ', () => {
        render(component);
        expect(screen.getByText('Verification Status')).toBeInTheDocument();
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

      it.skip('renders Species dropdown ', () => {
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

      it('renders default orgList when dropdown clicked ', () => {
        render(component);
        let dropdown = screen.getByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();

        let button = within(dropdown).getByRole('button', {
          name: /all/i,
        });

        userEvent.click(button);

        // the actual list of orgs is displayed in a popup that is not part of FilterTop
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
      let component;

      beforeEach(async () => {
        orgs = await api.getOrganizations();
        component = (
          <AppProvider value={{ orgList: orgs }}>
            <FilterTop />
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

      it('renders default orgList when dropdown clicked ', () => {
        render(component);
        let dropdown = screen.getByTestId('org-dropdown');
        expect(dropdown).toBeInTheDocument();

        let button = within(dropdown).getByRole('button', { name: /all/i });

        userEvent.click(button);

        // screen.logTestingPlaygroundURL();

        // the actual list of orgs is displayed in a popup that is not part of FilterTop
        const orglist = screen.getByRole('listbox');
        const orgs = within(orglist).getAllByTestId('org-item');
        const listItems = orgs.map((org) => org.textContent);
        log.debug('default orgList', listItems);

        // two default options + two orgs
        expect(orgs).toHaveLength(4);
      });
    });

    // describe('context data renders in child', () => {
    //   let orgs;
    //   let component;

    //   beforeEach(async () => {
    //     component = (
    //       <AppProvider>
    //         <AppContext.Consumer>
    //           {(value) => <p>Received: {value.orgList}</p>}
    //         </AppContext.Consumer>
    //       </AppProvider>
    //     );

    //     render(component);

    //     await act(() => api.getOrganizations());
    //   });

    //   // just tests the mock api, not what's showing on the page
    //   it('api loaded 2 organizations', () => {
    //     expect(orgs).toHaveLength(2);
    //   });

    //   it('renders text "Dummy Org" ', () => {
    //     // screen.debug(); // shows structure in console
    //     screen.logTestingPlaygroundURL();
    //     // expect(screen.getByText(/^Received:/).textContent).toBe('Received: ');
    //     expect(screen.getByText('Dummy Org')).toBeInTheDocument();
    //   });
    // });
  });
});
