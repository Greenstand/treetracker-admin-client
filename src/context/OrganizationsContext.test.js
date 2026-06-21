import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import {
  DEFAULT_ROWS_PER_PAGE,
  DEFAULT_SORT,
  OrgQueryProvider,
  useOrgQueryDispatch,
  useOrgQueryState,
} from './OrganizationsContext';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

class ErrorBoundary extends React.Component {
  state = { error: null };

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return <div data-testid="caught-error">{this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

// Reads the current URL search string from the enclosing Router so tests can
// assert on URL sync.
function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.search}</span>;
}

// Renders all state fields as text nodes and exposes one button per action so
// tests can dispatch without extra indirection.
function StateConsumer() {
  const state = useOrgQueryState();
  const dispatch = useOrgQueryDispatch();
  return (
    <div>
      <span data-testid="page">{state.page}</span>
      <span data-testid="rowsPerPage">{state.rowsPerPage}</span>
      <span data-testid="searchInput">{state.searchInput}</span>
      <span data-testid="search">{state.search}</span>
      <span data-testid="sortValue">{state.sortValue}</span>
      <LocationDisplay />
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 3 })}>
        SET_PAGE
      </button>
      <button
        onClick={() => dispatch({ type: 'SET_ROWS_PER_PAGE', payload: 50 })}
      >
        SET_ROWS_PER_PAGE
      </button>
      <button
        onClick={() => dispatch({ type: 'SET_SEARCH_INPUT', payload: 'typed' })}
      >
        SET_SEARCH_INPUT
      </button>
      <button
        onClick={() =>
          dispatch({ type: 'COMMIT_SEARCH', payload: 'committed' })
        }
      >
        COMMIT_SEARCH
      </button>
      <button onClick={() => dispatch({ type: 'COMMIT_SEARCH', payload: '' })}>
        CLEAR_SEARCH
      </button>
      <button onClick={() => dispatch({ type: 'SET_SORT', payload: 'newest' })}>
        SET_SORT
      </button>
    </div>
  );
}

function renderWithRouter(initialUrl = '/') {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <OrgQueryProvider>
        <StateConsumer />
      </OrgQueryProvider>
    </MemoryRouter>
  );
}

afterEach(cleanup);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('OrgQueryProvider — initialization', () => {
  it('starts with default state when URL has no params', () => {
    renderWithRouter('/');

    expect(screen.getByTestId('page').textContent).toBe('0');
    expect(screen.getByTestId('rowsPerPage').textContent).toBe(
      String(DEFAULT_ROWS_PER_PAGE)
    );
    expect(screen.getByTestId('searchInput').textContent).toBe('');
    expect(screen.getByTestId('search').textContent).toBe('');
    expect(screen.getByTestId('sortValue').textContent).toBe(DEFAULT_SORT);
  });

  it('seeds all state fields from URL params on mount', () => {
    renderWithRouter('/?search=trees&sort=newest&page=2&rowsPerPage=50');

    expect(screen.getByTestId('search').textContent).toBe('trees');
    expect(screen.getByTestId('searchInput').textContent).toBe('trees');
    expect(screen.getByTestId('sortValue').textContent).toBe('newest');
    expect(screen.getByTestId('page').textContent).toBe('2');
    expect(screen.getByTestId('rowsPerPage').textContent).toBe('50');
  });
});

describe('OrgQueryProvider — reducer actions', () => {
  it('SET_PAGE updates the current page', async () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByText('SET_PAGE'));

    await waitFor(() =>
      expect(screen.getByTestId('page').textContent).toBe('3')
    );
  });

  it('SET_ROWS_PER_PAGE updates rowsPerPage and resets page to 0', async () => {
    renderWithRouter('/?page=2');

    fireEvent.click(screen.getByText('SET_ROWS_PER_PAGE'));

    await waitFor(() => {
      expect(screen.getByTestId('rowsPerPage').textContent).toBe('50');
      expect(screen.getByTestId('page').textContent).toBe('0');
    });
  });

  it('SET_SEARCH_INPUT updates only searchInput — search and page are unchanged', async () => {
    renderWithRouter('/?page=2');

    fireEvent.click(screen.getByText('SET_SEARCH_INPUT'));

    await waitFor(() =>
      expect(screen.getByTestId('searchInput').textContent).toBe('typed')
    );

    expect(screen.getByTestId('search').textContent).toBe('');
    expect(screen.getByTestId('page').textContent).toBe('2');
  });

  it('COMMIT_SEARCH updates search and resets page to 0', async () => {
    renderWithRouter('/?page=2');

    fireEvent.click(screen.getByText('COMMIT_SEARCH'));

    await waitFor(() => {
      expect(screen.getByTestId('search').textContent).toBe('committed');
      expect(screen.getByTestId('page').textContent).toBe('0');
    });
  });

  it('SET_SORT updates sortValue and resets page to 0', async () => {
    renderWithRouter('/?page=2');

    fireEvent.click(screen.getByText('SET_SORT'));

    await waitFor(() => {
      expect(screen.getByTestId('sortValue').textContent).toBe('newest');
      expect(screen.getByTestId('page').textContent).toBe('0');
    });
  });
});

describe('OrgQueryProvider — URL sync', () => {
  it('omits all params from the URL when state is at defaults', async () => {
    renderWithRouter('/');

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toBe('')
    );
  });

  it('writes search to the URL after COMMIT_SEARCH', async () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByText('COMMIT_SEARCH'));

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toContain(
        'search=committed'
      )
    );
  });

  it('writes sort to the URL when it differs from the default', async () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByText('SET_SORT'));

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toContain(
        'sort=newest'
      )
    );
  });

  it('writes page to the URL when it is greater than 0', async () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByText('SET_PAGE'));

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toContain('page=3')
    );
  });

  it('removes the search param from the URL when search is cleared', async () => {
    renderWithRouter('/?search=trees');

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toContain(
        'search=trees'
      )
    );

    fireEvent.click(screen.getByText('CLEAR_SEARCH'));

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).not.toContain('search')
    );
  });
});

describe('useOrgQueryState', () => {
  it('throws when used outside OrgQueryProvider', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    function Rogue() {
      useOrgQueryState();
      return null;
    }

    render(
      <MemoryRouter>
        <ErrorBoundary>
          <Rogue />
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(await screen.findByTestId('caught-error')).toHaveTextContent(
      'useOrgQueryState must be used within OrgQueryProvider'
    );

    consoleSpy.mockRestore();
  });
});

describe('useOrgQueryDispatch', () => {
  it('throws when used outside OrgQueryProvider', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    function Rogue() {
      useOrgQueryDispatch();
      return null;
    }

    render(
      <MemoryRouter>
        <ErrorBoundary>
          <Rogue />
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(await screen.findByTestId('caught-error')).toHaveTextContent(
      'useOrgQueryDispatch must be used within OrgQueryProvider'
    );

    consoleSpy.mockRestore();
  });
});
