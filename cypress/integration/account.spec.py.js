describe('Account', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains(/Log in/i);
    cy.findInputByLabel(/Username/i).type('username');
    cy.findInputByLabel(/Password/i).type('password');
    cy.contains(/log in/i).click();
    // cy.contains(/admin panel/i);
  });

  it('Account', () => {
    cy.contains(/account/i).click();
    cy.contains(/log out/i).click();
    cy.contains(/login/i);
  });
});
