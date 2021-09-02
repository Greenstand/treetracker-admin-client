import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { AppContext, AppProvider } from '../context/AppContext';
import FilterPlanter from './FilterPlanter';

describe.skip('FilterPlanter, with initial filter values', () => {
  let filterPlanter;

  beforeEach(() => {
    filterPlanter = new FilterPlanter({
      personId: 1,
      firstName: 'fn',
      lastName: 'ln',
      id: 1,
    });
  });

  it('getWhereObj() should be: ', () => {
    expect(filterPlanter.getWhereObj()).toEqual(
      expect.objectContaining({
        firstName: { ilike: 'fn' },
        id: 1,
        lastName: { ilike: 'ln' },
        personId: 1,
      }),
    );
  });
});
