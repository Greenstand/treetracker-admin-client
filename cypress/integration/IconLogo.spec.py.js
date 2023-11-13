describe('Icon Logo', () => {
  it('Displays the organization logo when the user belongs to an organization', () => {
    cy.visit('http://localhost:3001/login');
    cy.get('#userName').type(Cypress.env('test_username'));
    cy.get('#password').type(Cypress.env('test_password'));
    cy.contains(/log/i).click();
    cy.contains(/earnings/i).click();
    cy.wait(100);
    cy.get('img').should('have.attr', 'alt', 'organization logo');
  });
  it('Displays the Greenstand logo when the user does not belongs to an organization', () => {
    cy.visit('http://localhost:3001/login');
    cy.get('#userName').type(Cypress.env('admin_username'));
    cy.get('#password').type(Cypress.env('admin_password'));
    cy.contains(/log/i).click();
    cy.contains(/earnings/i).click();
    cy.wait(100);
    cy.get('img').should('have.attr', 'alt', 'greenstand logo');
  });
});
