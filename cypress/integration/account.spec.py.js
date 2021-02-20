

describe("Account", () => {
  before(() => {
    cy.visit("/");
    cy.contains(/Login/i);
    cy.findInputByLabel("username")
      .type("amdin");
    cy.findInputByLabel("password")
      .type("amdin");
    cy.contains(/login/i)
      .click();
    cy.contains(/Welcome/i);
  });

  it("Account", () => {
    cy.contains(/account/i)
      .click();
    cy.contains(/log out/i)
      .click();
    cy.contains(/login/i);
  });

});
