/* eslint-disable */
import { mount } from 'cypress-react-unit-test'
import React from 'react'
import { Provider } from 'react-redux'
import theme from './common/theme'
import { ThemeProvider } from '@material-ui/core/styles'
import { init } from '@rematch/core'
import api from '../api/planters'

import EditPlanter from './EditPlanter'

describe('EditPlanter', () => {

  let store

  beforeEach(() => {
    store = init({
      models: {
        planters: {
          state: {},
          effects: {
            updatePlanter(_payload, _state) { }
          }
        },
        organizations: {
          state: {
            organizationList: [{
              id: 1,
              name: 'test-org',
            }]
          },
          effects: {
            loadOrganizations(_payload, _state) { }
          }
        }
      }
    })
  })

  it('works', () => {
    mount(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <EditPlanter planter={{}} isOpen={true} onClose={() => {}} />
        </ThemeProvider>
      </Provider>
    )
    cy.contains(/Edit Planter/i)
  })

  describe('with valid planter', () => {

    const planter = {
      id: 12345,
      imageUrl: 'https://greenstand.org/fileadmin/_processed_/f/e/csm_MVIMG_20200303_103438_be16bc7f80.jpg',
      firstName: 'Teston',
      lastName: 'Blumenfail',
      email: 'test@email.com',
      phone: '+1234567890'
    }

    let planterSelfies

    beforeEach(() =>{
      planterSelfies = [
        'https://greenstand.org/fileadmin/_processed_/d/4/csm_little_Jony_bdf756638d.jpg',
        'https://greenstand.org/fileadmin/_processed_/9/f/csm_2019.08.12.09.54.39_1ca43554-b139-4ae2-bbc9-c9a37c43e645_IMG_20190812_093641_-1471408775_0bb24d7c21.jpg',
        'https://greenstand.org/fileadmin/_processed_/e/3/csm_IMG_0017_3c859de144.jpg',
        'https://greenstand.org/fileadmin/_processed_/9/3/csm_PHOTO-2019-08-05-11-50-37_f0d0281499.jpg',
      ]

      cy.stub(api, 'getPlanterSelfies').returns(planterSelfies)
      mount(
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <EditPlanter planter={planter} isOpen={true} onClose={() => {}} />
          </ThemeProvider>
        </Provider>
      )
    })

    it('should display planter details', () => {
      cy.get(`[title="${planter.imageUrl}"]`).should('have.css', 'background-image', `url("${planter.imageUrl}")`)
      cy.get('input#firstName').should('have.value', planter.firstName)
      cy.get('input#lastName').should('have.value', planter.lastName)
      cy.get('input#email').should('have.value', planter.email)
      cy.get('input#phone').should('have.value', planter.phone)
    })

    it('should display all other planter images', () => {
      planterSelfies.forEach((img) => {
        cy.get(`[title="${img}"]`).should('have.css', 'background-image', `url("${img}")`)
      })
    })

    it('should enable Save button when values change', () => {
      cy.get('button#save').should('be.disabled')
      cy.get('input#firstName').type('abc')
      cy.get('button#save').should('be.enabled')
    })

    it('should update the planter when Save is clicked', () => {
      cy.spy(store.dispatch.planters, 'updatePlanter')
      cy.get('input#firstName').type('abc')
      cy.get('button#save').then(($button) => {
        $button[0].click()
        expect(store.dispatch.planters.updatePlanter).to.be.called
      })
    })
  })
})
