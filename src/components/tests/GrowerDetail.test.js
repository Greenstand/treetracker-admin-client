import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen, cleanup } from '@testing-library/react';
// This repo has no src/setupTests.js registering jest-dom matchers globally
// (see spawned follow-up task), so this file registers them locally.
import '@testing-library/jest-dom';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProvider } from '../../context/AppContext';
import { GrowerProvider } from '../../context/GrowerContext';
import GrowerDetail from '../GrowerDetail';

jest.mock('../../api/growers');
jest.mock('../../api/treeTrackerApi');
jest.mock('../../api/fieldData');

const GROWER = {
  id: 1,
  growerAccountUuid: 'grower-uuid-1',
  firstName: 'testFirstName',
  lastName: 'testLastName',
  email: 'test@gmail.com',
  phone: '123-456-7890',
  personId: null,
  organization: null,
  organizationId: null,
  imageUrl: '',
};

const SESSION = {
  id: 'session-1',
  created_at: '2023-01-01T00:00:00.000Z',
  start_time: '2023-01-01T00:00:00.000Z',
  organization: 'Test Org',
  device_identifier: 'device-1',
  device_configuration_id: 'device-config-1',
  originating_wallet_registration_id: 'wallet-reg-1',
  target_wallet: null,
  check_in_photo_url: 'http://example.com/photo.jpg',
  wallet: 'wallet31',
  grower_account_id: 'grower-uuid-1',
};

const DEVICE_CONFIGURATION = {
  id: 'device-config-1',
  brand: 'Google',
  model: 'Pixel',
  app_version: '2.1.1',
};

const WALLET_REGISTRATION = {
  id: 'wallet-reg-1',
  email: 'grower-wallet@example.com',
  phone: null,
};

function renderGrowerDetail(growerId = 1) {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppProvider value={{}}>
          <GrowerProvider value={{ growers: [] }}>
            <GrowerDetail open growerId={growerId} onClose={() => {}} />
          </GrowerProvider>
        </AppProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

describe('GrowerDetail sessions section', () => {
  let growersApi;
  let treeTrackerApi;
  let fieldDataApi;

  beforeEach(() => {
    growersApi = require('../../api/growers').default;
    treeTrackerApi = require('../../api/treeTrackerApi').default;
    fieldDataApi = require('../../api/fieldData').default;

    growersApi.getGrower = jest.fn().mockResolvedValue(GROWER);
    growersApi.getGrowers = jest.fn().mockResolvedValue([GROWER]);
    growersApi.getCount = jest.fn().mockResolvedValue({ count: 1 });
    growersApi.getGrowerRegistrations = jest.fn().mockResolvedValue([]);

    treeTrackerApi.getCaptureCount = jest.fn().mockResolvedValue({ count: 0 });

    fieldDataApi.getSessionsForGrower = jest.fn().mockResolvedValue([SESSION]);
    fieldDataApi.getDeviceConfiguration = jest
      .fn()
      .mockResolvedValue(DEVICE_CONFIGURATION);
    fieldDataApi.getWalletRegistration = jest
      .fn()
      .mockResolvedValue(WALLET_REGISTRATION);
  });

  afterEach(cleanup);

  it("loads and displays the grower's sessions, device and wallet info", async () => {
    renderGrowerDetail();

    expect(await screen.findByText(/Sessions \(1\)/i)).toBeInTheDocument();
    expect(fieldDataApi.getSessionsForGrower).toHaveBeenCalledWith({
      growerAccountUuid: 'grower-uuid-1',
      email: 'test@gmail.com',
      phone: '123-456-7890',
    });
    expect(fieldDataApi.getDeviceConfiguration).toHaveBeenCalledWith(
      'device-config-1'
    );
    expect(fieldDataApi.getWalletRegistration).toHaveBeenCalledWith(
      'wallet-reg-1'
    );
    expect(screen.getByText(/Organization: Test Org/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Pixel/i)).toBeInTheDocument();
    expect(screen.getByText(/grower-wallet@example.com/i)).toBeInTheDocument();
  });

  it('shows a placeholder when the grower has no sessions', async () => {
    fieldDataApi.getSessionsForGrower = jest.fn().mockResolvedValue([]);

    renderGrowerDetail();

    await act(async () => {
      await Promise.resolve();
    });

    expect(await screen.findByText(/^Sessions$/i)).toBeInTheDocument();
  });
});
