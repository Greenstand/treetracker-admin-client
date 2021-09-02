describe('Admin', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains(/Log in/i);
    cy.findInputByLabel(/Username/i).type('username');
    cy.findInputByLabel(/Password/i).type('password');
    cy.contains(/log in/i).click();
  });

  it('verify menu item', () => {
    // cy.visit('/verify');
    cy.contains(/verify/i);
  });

  it('verify', () => {
    cy.contains(/verify/i).click();
  });

  it('planter', () => {
    cy.contains(/planter/i).click();
  });
});
