import { cleanup, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import Home from './Home';
import { AppContext } from '../../context/AppContext';
import { POLICIES } from '../../models/auth';

jest.mock('axios');

jest.mock('../../api/treeTrackerApi', () => ({
  __esModule: true,
  default: {
    getSpecies: jest.fn(() => Promise.resolve([])),
  },
}));

// Stand in for each card with its own label, so the tests below can tell
// which cards the permission gate let through.
jest.mock('../DashStat.container', () => ({
  DashStatGrowerCount: () => 'Growers',
  DashStatTotalCaptures: () => 'Total Captures',
  DashStatUnprocessedCaptures: () => 'Untagged Captures',
  DashStatVerifiedCaptures: () => 'Verified Captures',
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
  const CARD_LABELS = [
    'Total Captures',
    'Untagged Captures',
    'Verified Captures',
    'Growers',
  ];

  function userWithRole(role, organization) {
    return {
      policy: {
        policies: role ? [{ name: role }] : [],
        organization,
      },
    };
  }

  it('shows all four cards to a greenstand admin', () => {
    const { container } = renderHome({
      userHasOrg: false,
      user: userWithRole(POLICIES.ADMIN, undefined),
    });

    CARD_LABELS.forEach((label) => {
      expect(container.textContent).toContain(label);
    });
  });

  it('shows all four cards to an organization user', () => {
    const { container } = renderHome({
      userHasOrg: true,
      user: userWithRole(POLICIES.ORGANIZATION, { id: 178 }),
    });

    CARD_LABELS.forEach((label) => {
      expect(container.textContent).toContain(label);
    });
  });

  it('shows no cards to a user with no accepted role', () => {
    const { container } = renderHome({
      userHasOrg: false,
      user: userWithRole(undefined, undefined),
    });

    CARD_LABELS.forEach((label) => {
      expect(container.textContent).not.toContain(label);
    });
  });
});
