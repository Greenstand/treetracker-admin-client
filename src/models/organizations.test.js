import * as loglevel from 'loglevel';
import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { AppContext, AppProvider } from '../context/AppContext';
import FilterTop from '../components/FilterTop';

const log = loglevel.getLogger('../models/organizations.test');

describe('Filter Top organizations', () => {
  let api;

  beforeEach(() => {
    //mock the api
    api = require('../api/treeTrackerApi').default;

    api.getOrganizations = () => {
      // log.debug('mock getOrganizations:');
      return Promise.resolve([
        {
          id: 0,
          name: 'Dummy Org',
        },
        {
          id: 1,
          name: 'Another Org',
        },
      ]);
    };
  });

  describe('Filter Top with context', () => {
    describe('load organizations', () => {
      let orgs;
      let component;

      beforeEach(async () => {
        orgs = await api.getOrganizations();
        component = (
          <AppProvider value={{ orgList: orgs }}>
            <FilterTop />
          </AppProvider>
        );
      });

      // just tests the mock api, not what's showing on the page
      it('api loaded 2 organizations', () => {
        expect(orgs).toHaveLength(2);
      });

      it('rendered without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(component, div);
        ReactDOM.unmountComponentAtNode(div);
      });

      it('renders text "Verification Status" ', () => {
        render(component);
        expect(screen.getByText('Verification Status')).toBeInTheDocument();
      });
    });

    //}}}
  });

  //}}}
});
