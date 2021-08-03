/* eslint-disable */
import { mount } from 'cypress-react-unit-test';
import React from 'react';
import theme from './common/theme';
import { ThemeProvider } from '@material-ui/core/styles';

import Filter from './Filter';
import FilterModel from '../models/Filter';

describe('Filter', () => {
  const filterModel = new FilterModel();
  beforeEach(() => {
    mount(
      <ThemeProvider theme={theme}>
        <Filter
          filter={filterModel}
          isOpen={true}
        />
      </ThemeProvider>,
    );
  });

  it('works', () => {
    cy.contains(/Filters/i);
  });

  it('start date picker forward button should be enabled', () => {
    cy.get('#start-date-picker+* button').then(($buttons) => {
      $buttons[0].click();
      cy.get('.MuiPickersCalendarHeader-iconButton.Mui-disabled').should('have.length', 1);
      cy.get('.MuiPickersCalendarHeader-iconButton').then(($headerButtons) => {
        $headerButtons[0].click();
        cy.get('.MuiPickersCalendarHeader-iconButton.Mui-disabled').should('have.length', 0);
      });
    });
  });

  it('end date picker back button should be enabled', () => {
    cy.get('#end-date-picker+* button').then(($buttons) => {
      $buttons[0].click();
      cy.get('.MuiPickersCalendarHeader-iconButton.Mui-disabled').should('have.length', 1);
      cy.get('.MuiPickersCalendarHeader-iconButton').then(($headerButtons) => {
        $headerButtons[1].click();
        cy.get('.MuiPickersCalendarHeader-iconButton.Mui-disabled').should('have.length', 0);
      });
    });
  });
});
