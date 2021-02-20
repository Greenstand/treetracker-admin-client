
describe("Admin", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains(/Log in/i);
    cy.findInputByLabel("Username")
      .type("admin");
    cy.findInputByLabel("Password")
      .type("admin");
    cy.contains(/log in/i)
      .click();
    cy.contains(/Greenstand admin panel/i);
  });

  it("verify", () => {
    cy.contains(/verify/i)
      .click();
  });

  it("planter", () => {
    cy.contains(/planter/i)
      .click();
  });
});
