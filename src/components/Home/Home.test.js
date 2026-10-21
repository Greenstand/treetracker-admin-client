import { cleanup, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import Home from './Home';
import { AppContext } from '../../context/AppContext';
import { getSubscription } from '../../api/subscription';

jest.mock('axios');

jest.mock('../../api/subscription', () => ({
  getSubscription: jest.fn(),
}));

jest.mock('../../api/treeTrackerApi', () => ({
  __esModule: true,
  default: {
    getSpecies: jest.fn(() => Promise.resolve([])),
  },
}));

jest.mock('../DashStat.container', () => ({
  DashStatGrowerCount: () => null,
  DashStatTotalCaptures: () => null,
  DashStatUnprocessedCaptures: () => null,
  DashStatVerifiedCaptures: () => null,
}));

jest.mock('../reportingCards/ReportingCard1', () => () => null);
jest.mock('../reportingCards/ReportingCard2', () => () => null);
jest.mock('../reportingCards/ReportingCard3', () => () => null);
jest.mock('../reportingCards/ReportingCard4', () => () => null);
jest.mock('../reportingCards/ReportingCard5', () => () => null);
jest.mock('../reportingCards/ReportingCard6', () => () => null);
jest.mock('../reportingCards/ReportingCard7', () => () => null);
jest.mock('../reportingCards/ReportingCard8', () => () => null);
jest.mock('../reportingCards/ReportingCard9', () => () => null);
jest.mock('../reportingCards/ReportingCard10', () => () => null);
jest.mock('../reportingCards/ReportingCard12', () => () => null);

describe('Home', () => {
  let queryClient = null;

  function renderHome(appContextValue = {}) {
    return render(
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={appContextValue}>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </AppContext.Provider>
      </QueryClientProvider>
    );
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    queryClient.prefetchQuery = jest.fn(() => Promise.resolve([]));
    axios.mockResolvedValue({
      data: { last_updated_at: new Date().toISOString() },
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('it renders home component', () => {
    const { container } = renderHome({ userHasOrg: false });

    expect(
      container.textContent.includes(
        'Apply to become a Greenstand associated organization'
      )
    ).toBe(true);
  });

  it('hides organization apply link when user already belongs to an organization', () => {
    const { container } = renderHome({
      userHasOrg: true,
      user: {
        policy: {
          policies: [],
          organization: {
            id: 178,
          },
        },
      },
    });

    expect(
      container.textContent.includes(
        'Apply to become a Greenstand associated organization'
      )
    ).toBe(false);
  });

  it('offers Upgrade to an organization without a subscription', async () => {
    getSubscription.mockResolvedValue({
      status: 'none',
      currentPeriodEnd: null,
    });

    const { findByTestId } = renderHome({
      userHasOrg: true,
      user: {
        policy: { policies: [], organization: { id: 178 } },
      },
    });

    expect(await findByTestId('home-upgrade')).toBeTruthy();
  });

  it('states the premium membership once subscribed', async () => {
    getSubscription.mockResolvedValue({
      status: 'active',
      currentPeriodEnd: '2026-11-14T00:00:00.000Z',
    });

    const { findByTestId } = renderHome({
      userHasOrg: true,
      user: {
        policy: { policies: [], organization: { id: 178 } },
      },
    });

    const banner = await findByTestId('home-subscription-active');
    expect(banner.textContent).toContain(
      'You are now subscribed to our organization premium'
    );
  });

  it('shows organization apply link when userHasOrg is false', () => {
    const { container } = renderHome({
      userHasOrg: false,
      user: {
        policy: {
          policies: [],
          organization: undefined,
        },
      },
    });

    expect(
      container.textContent.includes(
        'Apply to become a Greenstand associated organization'
      )
    ).toBe(true);
  });
});
