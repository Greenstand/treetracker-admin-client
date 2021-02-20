import { mount } from 'cypress-react-unit-test'
import React from 'react'
import Navbar from '../../src/components/Navbar'

import IconButton from '@material-ui/core/IconButton';
import IconFilter from '@material-ui/icons/FilterList';

describe('Navbar component', () => {
  it('should render the Navbar', () => {
    mount(<Navbar />)
    cy.get('header.MuiAppBar-root').should('be.visible')
    cy.get('button[title=menu]').should('be.visible')
  })

  it('should render with buttons', () => {
    mount(<Navbar buttons={
      <IconButton name='filter'>
        <IconFilter/>
      </IconButton>
    }/>)
    cy.get('button[name=filter]').should('be.visible')
  })

  it('should render with children', () => {
    mount(<Navbar>
      <div name='child' style={{height: 100}}/>
    </Navbar>)
    cy.get('div[name=child]',).should('be.visible')
  })

  it('should display the menu', () => {
    mount(<Navbar/>)
    cy.get("button[title=menu]").click();
    cy.get('.MuiMenuItem-root',).should('be.visible')
  })
})
