describe('Organization', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains(/Log in/i);
    cy.findInputByLabel(/Username/i).type('username');
    cy.findInputByLabel(/Password/i).type('password');
    cy.contains(/log in/i).click();
    // cy.contains(/admin panel/i);
  });

  it('verify', () => {
    cy.contains('.MuiMenuItem-root', /verify/i).click();
  });

  it('planter', () => {
    cy.contains('.MuiMenuItem-root', /planter/i).click({ force: true });
  });

  it.only('tree', () => {
    cy.contains('.MuiMenuItem-root', /tree/i).click();
  });
});
