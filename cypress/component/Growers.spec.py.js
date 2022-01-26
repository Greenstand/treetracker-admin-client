import { mount } from 'cypress-react-unit-test';
import React from 'react';
import { Grower } from '../../src/components/Growers/Growers';

describe('HelloWorld component', () => {
  it('works', () => {
    mount(<Grower grower={{}} />);
    // now use standard Cypress commands
    cy.contains('ID').should('be.visible');
  });
});
