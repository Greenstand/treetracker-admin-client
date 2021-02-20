import { mount } from 'cypress-react-unit-test'
import React from 'react'
import {Planter} from "../../src/components/Planters.js";

describe('HelloWorld component', () => {
  it('works', () => {
    mount(<Planter planter={{}} />)
    // now use standard Cypress commands
    cy.contains('ID').should('be.visible')
  })
})
