import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen, cleanup, waitFor } from '@testing-library/react';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProvider } from '../../context/AppContext';
import { GrowerProvider } from '../../context/GrowerContext';
import Growers from '../Growers/Growers';
import { GROWER, GROWERS, ORGS, growerValues } from './fixtures';

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
  });

  describe('with a default context', () => {
    beforeEach(async () => {
      render(
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AppProvider value={{ orgId: null, orgList: ORGS }}>
              <GrowerProvider value={growerValues}>
                <Growers />
              </GrowerProvider>
            </AppProvider>
          </BrowserRouter>
        </ThemeProvider>
      );

      await act(() => api.getGrowers());
      await act(() => api.getCount());
    });

    afterEach(cleanup);

    it('renders grower page', async () => {
      await waitFor(() => {
        expect(
          screen.getByText(/testFirstName testLastName/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/testFirstName2 testLastName2/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/testFirstName3 testLastName3/i)
        ).toBeInTheDocument();

        const ids = screen.getAllByText(/ID:/i);
        expect(ids).toHaveLength(3);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();

        const pageSize = screen.getAllByText(/growers per page:/i);
        expect(pageSize).toHaveLength(2);
      });
    });
  });
});

// describe.skip('planter', () => {
//   //{{{
//   let store;
//   let planter = {
//     name: 'OK',
//   };
//   let filter;

//   beforeEach(() => {});

//   describe('with a default store', () => {
//     //{{{
//     beforeEach(async () => {
//       store = init({
//         models: {
//           planters,
//         },
//       });
//       //set page size
//       expect(store.getState().planters.pageSize).toBe(24);
//       await store.dispatch.planters.changePageSize({ pageSize: 1 });
//       expect(store.getState().planters.pageSize).toBe(1);
//     });

//     it('check initial state', () => {
//       expect(store.getState().planters.planters).toBeInstanceOf(Array);
//       expect(store.getState().planters.planters).toHaveLength(0);
//       expect(store.getState().planters.filter).toBeInstanceOf(FilterPlanter);
//     });

//     describe('load(0) ', () => {
//       beforeEach(async () => {
//         api.getPlanters.mockReturnValue([planter]);
//         filter = new FilterPlanter({
//           personId: 1,
//         });
//         const result = await store.dispatch.planters.load({
//           pageNumber: 0,
//           filter,
//         });
//         expect(result).toBe(true);
//       });

//       it('should get some planters', () => {
//         expect(store.getState().planters.planters).toHaveLength(1);
//       });

//       it('should call api with param: skip = 0', () => {
//         expect(api.getPlanters).toHaveBeenCalledWith({
//           skip: 0,
//           rowsPerPage: 1,
//           filter: filter,
//         });
//       });

//       it('currentPage should be 0', () => {
//         expect(store.getState().planters.currentPage).toBe(0);
//       });

//       it('Sould have filter be set to store', () => {
//         expect(store.getState().planters.filter).toBe(filter);
//       });

//       describe('load(1)', () => {
//         beforeEach(async () => {
//           api.getPlanters.mockReturnValue([planter]);
//           const result = await store.dispatch.planters.load({
//             pageNumber: 1,
//             filter,
//           });
//           expect(result).toBe(true);
//         });

//         it('should get some planters', () => {
//           expect(store.getState().planters.planters).toHaveLength(1);
//         });

//         it('should call api with param: skip = 1', () => {
//           expect(api.getPlanters).toHaveBeenCalledWith({
//             skip: 1,
//             rowsPerPage: 1,
//             filter,
//           });
//         });
//       });

//       describe('count()', () => {
//         beforeEach(async () => {
//           api.getCount.mockReturnValue({ count: 2 });
//           expect(await store.dispatch.planters.count()).toBe(true);
//         });

//         it('should call getCount api with param: filter', () => {
//           expect(api.getCount).toHaveBeenCalledWith({
//             filter,
//           });
//         });

//         it('Should get count = 2', async () => {
//           expect(store.getState().planters.count).toBe(2);
//         });
//       });
//     });
//   });
// });
