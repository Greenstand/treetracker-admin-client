/* eslint-disable */
import { mount } from 'cypress-react-unit-test';
import React from 'react';
import { Provider } from 'react-redux';
import theme from '../../src/components/common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { init } from '@rematch/core';
import api from '../../src/api/planters';

import EditGrower from '../../src/components/EditPlanter';

describe('EditGrower', () => {
  let store;

  beforeEach(() => {
    store = init({
      models: {
        growers: {
          state: {},
          effects: {
            updateGrower(_payload, _state) {},
          },
        },
        organizations: {
          state: {
            organizationList: [
              {
                id: 1,
                name: 'test-org',
              },
            ],
          },
          effects: {
            loadOrganizations(_payload, _state) {},
          },
        },
      },
    });
  });

  it('works', () => {
    mount(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <EditGrower grower={{}} isOpen={true} onClose={() => {}} />
        </ThemeProvider>
      </Provider>,
    );
    cy.contains(/Edit Grower/i);
  });

  describe('with valid grower', () => {
    const grower = {
      id: 12345,
      imageUrl:
        'https://greenstand.org/fileadmin/_processed_/f/e/csm_MVIMG_20200303_103438_be16bc7f80.jpg',
      firstName: 'Teston',
      lastName: 'Blumenfail',
      email: 'test@email.com',
      phone: '+1234567890',
    };

    let growerSelfies;

    beforeEach(() => {
      growerSelfies = [
        'https://greenstand.org/fileadmin/_processed_/d/4/csm_little_Jony_bdf756638d.jpg',
        'https://greenstand.org/fileadmin/_processed_/9/f/csm_2019.08.12.09.54.39_1ca43554-b139-4ae2-bbc9-c9a37c43e645_IMG_20190812_093641_-1471408775_0bb24d7c21.jpg',
        'https://greenstand.org/fileadmin/_processed_/e/3/csm_IMG_0017_3c859de144.jpg',
        'https://greenstand.org/fileadmin/_processed_/9/3/csm_PHOTO-2019-08-05-11-50-37_f0d0281499.jpg',
      ];

      cy.stub(api, 'getGroerSelfies').returns(growerSelfies);
      mount(
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <EditGrower grower={grower} isOpen={true} onClose={() => {}} />
          </ThemeProvider>
        </Provider>,
      );
    });

    it('should display grower details', () => {
      cy.get(`[title="${grower.imageUrl}"]`).should(
        'have.css',
        'background-image',
        `url("${grower.imageUrl}")`,
      );
      cy.get('input#firstName').should('have.value', grower.firstName);
      cy.get('input#lastName').should('have.value', grower.lastName);
      cy.get('input#email').should('have.value', grower.email);
      cy.get('input#phone').should('have.value', grower.phone);
    });

    it('should display all other grower images', () => {
      growerSelfies.forEach((img) => {
        cy.get(`[title="${img}"]`).should(
          'have.css',
          'background-image',
          `url("${img}")`,
        );
      });
    });

    it('should enable Save button when values change', () => {
      cy.get('button#save').should('be.disabled');
      cy.get('input#firstName').type('abc');
      cy.get('button#save').should('be.enabled');
    });

    it('should update the grower when Save is clicked', () => {
      cy.spy(store.dispatch.growers, 'updateGrower');
      cy.get('input#firstName').type('abc');
      cy.get('button#save').then(($button) => {
        $button[0].click();
        expect(store.dispatch.growers.updateGrower).to.be.called;
      });
    });
  });
});
