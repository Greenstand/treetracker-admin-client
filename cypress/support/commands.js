// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
//import "cypress-localstorage-commands";

/*
 * using html attr "for" to find the input described by the label
 */
Cypress.Commands.add("findInputByLabel", (labelText) => {
    return cy.contains("label", labelText)
      .then(element => {
        return cy.get("#" + element.attr("for"));
      });
});

/*
 * To find a role which contain the given text
 */
Cypress.Commands.add("findRoleByText", (role, text) => {
    return cy.contains(text)
      .closest(`[role=${role}]`);
});
