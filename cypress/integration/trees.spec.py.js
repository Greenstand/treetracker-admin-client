describe("Trees", () => {
  before(() => {
    cy.visit("/")
      .wait(1000);
    cy.get("button[title=menu]")
      .click();
    cy.contains("Trees")
      .click();
  });

  beforeEach(() => {});

  it("Test", () => {
    //    cy.visit("/createtask");
    //    cy.contains("Titel").type("Developer from China");
    //    //input
    //    //cy.get("#title").type("Developer from China");
    //    cy.get("#position").click();
    //    cy.get('[data-value="1"]').click();
    //    cy.contains("Arbejdssted").type("Beijing");
    //    cy.get("#budget").type("5000");
    //    cy.get("#description").type("Description");
    //    cy.contains("lav pris").click();
    //    cy.contains("bæredygtighed").click();
    //    cy.get("[data-testid=create-button]").click();
    //
    //    //Jumped to job feed, can get the card with created job
    //    cy.contains("Developer from China");
  });
});
