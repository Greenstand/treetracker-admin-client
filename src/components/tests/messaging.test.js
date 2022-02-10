import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen, cleanup } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import { MessagingProvider } from 'context/MessagingContext';
import MessagingView from 'views/MessagingView';
import Messaging from 'components/Messaging/Messaging';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/grower.test');

jest.mock('../api/messaging');

describe('growers', () => {
  let api;

  beforeEach(() => {
    //mock the api
    api = require('../api/messaging').default;
    api.getAuthors = () => {
      log.debug('mock getAuthors');
      return Promise.resolve([
        { id: '34488a41-6db2-4fc8-977d-b51e33b77603', handle: 'admin' },
      ]);
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
        <AppProvider>
          <MessagingProvider>
            <MessagingView>
              <Messaging />
            </MessagingView>
          </MessagingProvider>
        </AppProvider>
      );

      // await act(() => api.getGrowers());
      // await act(() => api.getCount());
    });

    afterEach(cleanup);

    it('renders messages page', () => {});
  });
});
