import { init } from '@rematch/core';
import * as loglevel from 'loglevel';
import { AppContext } from '../context/Context';
// import FilterTop from '../components/FilterTop';

const log = loglevel.getLogger('../models/organizations.test');

describe('organizations', () => {
  let api;

  beforeEach(() => {
    //mock the api
    api = require('../api/treeTrackerApi').default;

    api.getOrganizations = () => {
      log.debug('mock getOrganizations:');
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

  describe('with context', () => {
    // it('filter top renders', () => {
    //   return (
    //     <AppProvider>
    //       <FilterTop />
    //     </AppProvider>
    //   );
    // });
    describe('load organizations', () => {
      beforeEach(async () => {
        await context.loadOrganizations();
      });

      it('rendered the app', () => {});

      it('loaded 2 organizations', () => {
        expect(AppContext.orgList).toHaveLength(2);
      });
    });

    //}}}
  });

  //}}}
});
