import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const DEFAULT_ROWS_PER_PAGE = 25;

export const SORT_OPTIONS = [
  { label: 'Name A→Z', value: 'name_asc', order: ['name ASC'] },
  { label: 'Name Z→A', value: 'name_desc', order: ['name DESC'] },
  { label: 'Newest', value: 'newest', order: ['id DESC'] },
  { label: 'Oldest', value: 'oldest', order: ['id ASC'] },
];

export const DEFAULT_SORT = SORT_OPTIONS[0].value;

const initialState = {
  page: 0,
  rowsPerPage: DEFAULT_ROWS_PER_PAGE,
  searchInput: '', // local typing buffer — never written to URL
  search: '', // debounced value — written to URL
  sortValue: DEFAULT_SORT,
};

function queryReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_ROWS_PER_PAGE':
      return { ...state, rowsPerPage: action.payload, page: 0 };
    case 'SET_SEARCH_INPUT':
      return { ...state, searchInput: action.payload };
    case 'COMMIT_SEARCH':
      return { ...state, search: action.payload, page: 0 };
    case 'SET_SORT':
      return { ...state, sortValue: action.payload, page: 0 };
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

// ---------------------------------------------------------------------------
// Contexts
// ---------------------------------------------------------------------------

const OrgQueryStateContext = createContext(undefined);
const OrgQueryDispatchContext = createContext(undefined);

OrgQueryStateContext.displayName = 'OrgQueryStateContext';
OrgQueryDispatchContext.displayName = 'OrgQueryDispatchContext';

export function OrgQueryProvider({ children }) {
  const history = useHistory();
  const { search: locationSearch } = useLocation();

  // ---------------------------------------------------------------------------
  // Provider — initialises from URL and syncs changes back
  // ---------------------------------------------------------------------------

  const [state, dispatch] = useReducer(queryReducer, undefined, () => {
    const params = new URLSearchParams(locationSearch);
    const search = params.get('search') ?? initialState.search;
    return {
      page: Number(params.get('page') ?? initialState.page),
      rowsPerPage: Number(
        params.get('rowsPerPage') ?? initialState.rowsPerPage
      ),
      searchInput: search,
      search,
      sortValue: params.get('sort') ?? initialState.sortValue,
    };
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (state.page > 0) params.set('page', state.page);
    if (state.rowsPerPage !== DEFAULT_ROWS_PER_PAGE)
      params.set('rowsPerPage', state.rowsPerPage);
    if (state.search) params.set('search', state.search);
    if (state.sortValue !== DEFAULT_SORT) params.set('sort', state.sortValue);
    history.replace({ search: params.toString() });
  }, [state.page, state.rowsPerPage, state.search, state.sortValue]);

  return (
    <OrgQueryStateContext.Provider value={state}>
      <OrgQueryDispatchContext.Provider value={dispatch}>
        {children}
      </OrgQueryDispatchContext.Provider>
    </OrgQueryStateContext.Provider>
  );
}

export function useOrgQueryState() {
  const context = useContext(OrgQueryStateContext);
  if (context === undefined) {
    throw new Error('useOrgQueryState must be used within OrgQueryProvider');
  }
  return context;
}

export function useOrgQueryDispatch() {
  const context = useContext(OrgQueryDispatchContext);
  if (context === undefined) {
    throw new Error('useOrgQueryDispatch must be used within OrgQueryProvider');
  }
  return context;
}
