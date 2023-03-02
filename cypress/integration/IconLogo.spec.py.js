describe('Icon Logo', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the tests due to uncaught errors
    return false;
  });

  it('Displays the organization logo when the user belongs to an organization', () => {
    cy.visit('http://localhost:3001/login');
    cy.get('#userName').type('test1');
    cy.get('#password').type('EoCAyCPpW0');
    cy.contains(/log/i).click();
    cy.contains(/earnings/i).click();
    cy.wait(100);
    cy.get('img').should('have.attr', 'alt', 'organization logo');
  });
  it('Displays the Greenstand logo when the user does not belongs to an organization', () => {
    cy.visit('http://localhost:3001/login');
    cy.get('#userName').type('admin');
    cy.get('#password').type('8pzPdcZAG6&Q');
    cy.contains(/log/i).click();
    cy.contains(/earnings/i).click();
    cy.wait(100);
    cy.get('img').should('have.attr', 'alt', 'greenstand logo');
  });
});
