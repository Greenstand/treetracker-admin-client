
describe("Organization", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains(/Log in/i);
    cy.findInputByLabel("Username")
      .type("freetown");
    cy.findInputByLabel("Password")
      .type("admin");
    cy.contains(/log in/i)
      .click();
    cy.contains(/Greenstand admin panel/i);
  });

  it("verify", () => {
    cy.contains(".MuiMenuItem-root", /verify/i)
      .click();
  });

  it("planter", () => {
    cy.contains(".MuiMenuItem-root", /planter/i)
      .click({force:true});
  });

  it.only("tree", () => {
    cy.contains(".MuiMenuItem-root", /tree/i)
      .click();
  });
});
