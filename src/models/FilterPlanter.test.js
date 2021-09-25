import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { AppContext, AppProvider } from '../context/AppContext';
import Filter from './FilterPlanter';

describe.skip('FilterGrower, with initial filter values', () => {
  let filterGrower;

  beforeEach(() => {
    filterGrower = new Filter({
      personId: 1,
      firstName: 'fn',
      lastName: 'ln',
      id: 1,
    });
  });

  it('getWhereObj() should be: ', () => {
    expect(filterGrower.getWhereObj()).toEqual(
      expect.objectContaining({
        firstName: { ilike: 'fn' },
        id: 1,
        lastName: { ilike: 'ln' },
        personId: 1,
      }),
    );
  });
});
