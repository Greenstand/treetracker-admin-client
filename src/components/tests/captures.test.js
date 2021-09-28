import React from 'react';
import ReactDOM from 'react-dom';
import { act, render, screen, within, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { AppProvider } from '../../context/AppContext';
import {
  CapturesContext,
  CapturesProvider,
} from '../../context/CapturesContext';
import CaptureTable from 'components/CaptureTable';
import FilterModel from '../../models/Filter';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../models/captures.test');

jest.mock('axios');

describe.skip('Captures', () => {
  describe('CapturesTable without api', () => {
    let capturesValues;
    let component;
    let data;
    let queryCapturesApi;
    let getCaptureCount;
    let getCapturesAsync;
    let getCaptureAsync;
    // let setState;

    // queryCapturesApi = jest.fn(() => {
    //   log.debug('mock queryCapturesApi:');
    //   return Promise.resolve(data);
    // });

    // data = [];

    // getCaptureCount = jest.fn();
    // getCaptureCount.mockReturnValueOnce({ data: { count: data.length } });
    // getCapturesAsync = jest.fn();
    // getCapturesAsync.mockReturnValueOnce({ data });
    // getCaptureAsync = jest.fn();
    // getCaptureAsync.mockReturnValueOnce({ id: data[0].id });

    describe('with default context, no captures', () => {
      beforeAll(async () => {
        data = [{ id: '1' }];
        // // Mock the call to captures/count first
        axios.get
          .mockReturnValueOnce({ data: { count: data.length } })
          .mockReturnValueOnce({ data });

        // setState = jest.fn((props) => {
        //   console.log('setState', props);
        //   capturesValues = { ...capturesValues, ...props };
        //   return Promise.resolve();
        // });
        // queryCapturesApi = jest.fn(() => {
        //   log.debug('mock queryCapturesApi:');
        //   return axios.get
        //     .mockReturnValueOnce({
        //       data: {
        //         count: data.length,
        //       },
        //     })
        //     .mockReturnValueOnce({
        //       data,
        //     });
        // });
        // queryCapturesApi = jest.fn(() => {
        //   log.debug('mock queryCapturesApi:');
        //   return Promise.resolve();
        // });
        getCaptureCount = jest.fn(() => {
          console.log('getCaptureCount');
          return Promise.resolve({ data: { count: data.length } });
        });
        // getCaptureCount.mockReturnValueOnce({ data: { count: data.length } });
        getCapturesAsync = jest.fn(() => {
          console.log('getCapturesAsync');
          return Promise.resolve({ data });
        });
        // getCapturesAsync.mockReturnValueOnce({ data });

        capturesValues = {
          captures: [],
          captureCount: 4,
          selected: [],
          capture: {},
          numSelected: 0,
          page: 0,
          rowsPerPage: 25,
          order: 'asc',
          orderBy: 'id',
          allIds: [],
          byId: {},
          filter: new FilterModel(),
          queryCapturesApi,
          getCaptureCount,
          getCapturesAsync,
          getCaptureAsync,
        };
        component = (
          <BrowserRouter>
            <AppProvider>
              <CapturesProvider
                value={{
                  capturesValues,
                }}
              >
                <CaptureTable />
              </CapturesProvider>
            </AppProvider>
          </BrowserRouter>
        );
        // await capturesValues.getCapturesAsync();
        console.log(
          '--------------- with default context, no captures ---------------',
        );
        waitFor(render(component));
        // await act(() => {
        //   render(component);
        //   return Promise.resolve();
        // });
      });

      // just tests the mock api, not what's showing on the page
      it('api loaded 0 captures', () => {
        expect(capturesValues.captures).toHaveLength(0);
      });

      it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(component, div);
        ReactDOM.unmountComponentAtNode(div);
      });

      it('should be on page 0', () => {
        render(component);
        expect(capturesValues.page).toBe(0);
      });

      it('should have 7 headers', async () => {
        render(component);
        // screen.logTestingPlaygroundURL();
        const table = screen.getByRole(/table/i);
        const headers = within(table).getAllByRole(/columnheader/i);

        // screen.logTestingPlaygroundURL();

        const arr = headers.map((header) => header.textContent);
        console.log('headers', arr);
        expect(arr).toHaveLength(7);
      });

      it('renders headers for captures table', () => {
        render(component);
        const table = screen.getByRole(/table/i);
        let item = screen.getByText(/Captures/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Capture ID/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Planter ID/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Payment/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Country/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Species/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Status/i);
        expect(item).toBeInTheDocument();
        item = within(table).getByText(/Created/i);
        expect(item).toBeInTheDocument();
      });
    });
  });

  describe('CapturesTable with data', () => {
    let capturesValues;
    let component;
    // let queryCapturesApi;
    // let getCaptureCount;
    // let getCapturesAsync;
    // let getCaptureAsync;
    // let setState;

    let data = [
      {
        id: 0,
        timeCreated: '2020-09-07T19:22:51.000Z',
        planterId: 1,
        approved: true,
        status: 'planted',
      },
      {
        id: 1,
        timeCreated: '2020-09-07T19:22:51.000Z',
        planterId: 2,
        approved: true,
        status: 'planted',
      },
      {
        id: 2,
        timeCreated: '2020-09-07T19:22:51.000Z',
        planterId: 1,
        approved: false,
        status: 'planted',
      },
      {
        id: 3,
        timeCreated: '',
        planterId: 1,
        approved: true,
        status: '',
      },
    ];

    // Mock the call to captures/count first
    axios.get
      .mockReturnValueOnce({
        data: { count: data.length },
      })
      .mockReturnValueOnce({ data });

    // queryCapturesApi = jest.fn(() => {
    //   log.debug('mock queryCapturesApi:');
    //   return Promise.resolve(data);
    // });

    // getCaptureCount = jest.fn();
    // getCaptureCount.mockReturnValueOnce({ data: { count: data.length } });
    // getCapturesAsync = jest.fn();
    // getCapturesAsync.mockReturnValueOnce({ data });
    // getCaptureAsync = jest.fn();
    // getCaptureAsync.mockReturnValueOnce({ id: data[0].id });

    describe('with pre-loaded captures', () => {
      beforeAll(async () => {
        capturesValues = {
          captures: data,
          captureCount: 0,
          selected: [],
          capture: {},
          numSelected: 0,
          page: 0,
          rowsPerPage: 25,
          order: 'asc',
          orderBy: 'id',
          allIds: [],
          byId: {},
          filter: new FilterModel(),
          queryCapturesApi: () => {},
          getCaptureCount: () => {},
          getCapturesAsync: () => {},
          getCaptureAsync: () => {},
        };

        component = (
          <BrowserRouter>
            <AppProvider>
              <CapturesProvider
                value={{
                  capturesValues,
                }}
              >
                <CaptureTable />
              </CapturesProvider>
            </AppProvider>
          </BrowserRouter>
        );
        console.log('--------------- with pre-loaded captures ---------------');
        // render(component);
        // await act(() => {
        //   render(component);
        //   return Promise.resolve();
        // });
        waitFor(render(component));
        // await act(() => axios.get());
      });

      it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(component, div);
        ReactDOM.unmountComponentAtNode(div);
      });

      it('should have 4 captures', () => {
        console.log('captures', capturesValues.captures);
        expect(capturesValues.captures).toHaveLength(4);
      });

      // THE FULL TABLE DOESN'T SEEM TO RENDER, MAY NEED TO BREAK OUT SOME COMPONENTS TO BETTER ISOLATE IT FOR TESTING

      // it('renders links for 2 planter ids (0 and 1)', () => {
      //   render(component); // doesn't render the table body...
      //   const table = screen.getByTestId('captures-table-body');
      //   screen.logTestingPlaygroundURL(table);
      //   // const links = Array.from(document.querySelectorAll('.MuiLink-root'));
      //   const links = within(table).getAllByRole('link');
      //   const arr = links.map((link) => link.textContent);
      //   console.log('links', links, arr);
      //   expect(arr.includes('1')).toBeTruthy();
      //   // expect(arr.includes('2')).toBeTruthy();
      // });

      // it('renders 4 rows ', () => {
      //   // render(component);
      //   const table = screen.getAllByRole(/rowgroup/i);
      //   const rows = within(table[1]).getAllByRole(/row/i);
      //   screen.debug();

      //   // console.log('rows', table, rows);
      //   // expect(rows).toHaveLength(4);
      // });

      // it('displays captures data -- status: "planted" (3)', () => {
      //   render(component);
      //   screen.logTestingPlaygroundURL();
      //   const table = screen.getByRole(/table/i);
      //   const vals = within(table).getAllByText(/planted/i);
      //   console.log('status planted', vals);
      //   expect(vals).toHaveLength(3);
      // });
    });

    describe('with api data', () => {
      beforeEach(async () => {
        data = [{ id: '1' }];
        // Mock the call to captures/count first
        axios.get
          .mockReturnValueOnce({
            data: {
              count: data.length,
            },
          })
          .mockReturnValueOnce({
            data,
          });

        // setState = jest.fn((props) => {
        //   console.log('setState', props);
        //   capturesValues = {
        //     ...capturesValues,
        //     ...props,
        //   };
        //   return Promise.resolve();
        // });

        // queryCapturesApi = jest.fn(() => {
        //   log.debug('mock queryCapturesApi:');
        //   return Promise.resolve(data);
        // });

        // getCaptureCount = jest.fn();
        // getCaptureCount.mockReturnValueOnce({ data: { count: data.length } });
        // getCapturesAsync = jest.fn();
        // getCapturesAsync.mockReturnValueOnce({ data });
        // getCaptureAsync = jest.fn();
        // getCaptureAsync.mockReturnValueOnce({ id: data[0].id });

        capturesValues = {
          captures: [],
          captureCount: 0,
          selected: [],
          capture: {},
          numSelected: 0,
          page: 0,
          rowsPerPage: 25,
          order: 'asc',
          orderBy: 'id',
          allIds: [],
          byId: {},
          filter: new FilterModel(),
          queryCapturesApi: () => {},
          getCaptureCount: () => {},
          getCapturesAsync: () => {},
          getCaptureAsync: () => {},
        };
        component = (
          <BrowserRouter>
            <AppProvider>
              <CapturesProvider
                value={{
                  capturesValues,
                }}
              >
                <CaptureTable />
              </CapturesProvider>
            </AppProvider>
          </BrowserRouter>
        );

        console.log('--------------- with api data ---------------');
        waitFor(render(component));
      });

      it('should get a capture count', () => {
        // render(component);
        // waitFor(() => axios.toHaveBeenCalledTimes(1));
        const counts = Array.from(
          document.querySelectorAll('.MuiTablePagination-caption'),
        );
        const arr = counts.map((count) => count.firstChild.textContent);
        console.log('counts', arr);
        expect(arr[1]).toBe('1-1 of 1');
      });

      // it('should get some captures', () => {
      //   // act(render(component));
      //   expect(capturesValues.captures).toHaveLength(1);
      // });

      it('should get the capture count first', () => {
        // render(component);
        // console.log(
        //   'mock calls count',
        //   axios.get.mock.calls,
        //   axios.get.mock.calls[0][0],
        // );
        expect(axios.get.mock.calls[0][0]).toContain(`trees/count`);
      });

      it('should call captures API with a valid filter', () => {
        // render(component);
        const filter = JSON.stringify({
          where: { active: true },
          order: ['id asc'],
          limit: 25,
          skip: 0,
          fields: {
            id: true,
            timeCreated: true,
            status: true,
            active: true,
            approved: true,
            planterId: true,
            treeTags: true,
            planterIdentifier: true,
            deviceIdentifier: true,
            speciesId: true,
            tokenId: true,
          },
        });

        // The first arg (URL) should include a stringified default filter object
        expect(axios.get).toHaveBeenCalled();
        const lastCallIdx = axios.get.mock.calls.length - 1;
        // console.log(
        //   'mock calls captures',
        //   axios.get.mock.calls,
        //   axios.get.mock.calls[lastCallIdx][0],
        // );
        expect(axios.get.mock.calls[lastCallIdx][0]).toContain(
          `trees?filter=${filter}`,
        );
      });
    });
  });
});
