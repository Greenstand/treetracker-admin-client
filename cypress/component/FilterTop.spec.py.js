/* eslint-disable */
import { mount } from 'cypress-react-unit-test';
import React from 'react';
import theme from '../../src/components/common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { init } from '@rematch/core';

import FilterTop from '../../src/components/FilterTop';
import FilterModel from '../../src/models/Filter';

describe('FilterTop', () => {
  const filterModel = new FilterModel();
  beforeEach(() => {
    store = init({
      models: {
        species: {
          state: {
            speciesList: [],
          },
          effects: {},
        },
        tags: {
          state: {
            tagList: [],
          },
        },
        organizations: {
          state: {
            organizationList: [],
          },
          effects: {
            loadOrganizations(_payload, _state) {},
          },
        },
      },
    });

    mount(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <FilterTop filter={filterModel} isOpen={true} />
        </ThemeProvider>
        ,
      </Provider>
    );
  });

  it('start date picker forward button should be enabled', () => {
    cy.get('#start-date-picker+* button').then(($buttons) => {
      $buttons[0].click();
      // Check forward button is disabled
      cy.get('.MuiPickersCalendarHeader-iconButton.Mui-disabled').should(
        'have.length',
        1
      );
      cy.get('.MuiPickersCalendarHeader-iconButton').then(($headerButtons) => {
        $headerButtons[0].click();
        // Check both buttons are enabled
        cy.get('.MuiPickersCalendarHeader-iconButton.Mui-disabled').should(
          'have.length',
          0
        );
      });
    });
  });

  it('end date picker back button should be enabled', () => {
    cy.get('#end-date-picker+* button').then(($buttons) => {
      $buttons[0].click();
      // Check forward button is disabled
      cy.get('.MuiPickersCalendarHeader-iconButton.Mui-disabled').should(
        'have.length',
        1
      );
      cy.get('.MuiPickersCalendarHeader-iconButton').then(($headerButtons) => {
        $headerButtons[0].click();
        // Check both buttons are enabled
        cy.get('.MuiPickersCalendarHeader-iconButton.Mui-disabled').should(
          'have.length',
          0
        );
      });
    });
  });
});
