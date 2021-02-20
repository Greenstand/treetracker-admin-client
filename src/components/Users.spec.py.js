import { mount } from 'cypress-react-unit-test'
import React from 'react'
import Users from "./Users";
import theme from './common/theme'
import { ThemeProvider } from '@material-ui/core/styles'

describe("Users", () => {
  beforeEach("Users", () => {
    mount(
      <ThemeProvider theme={theme}>
        <Users />
      </ThemeProvider>
    );
    cy.contains(/add user/i);
  });

  it("Edit", () => {
    cy.get("button[title=edit]")
      .click();
    cy.contains("User Detail");
    cy.contains(/save/i)
      .click();
    cy.contains("User Detail").should("not.visible");
  });

  it.only("Password", () => {
    cy.get("button[title='generate password']")
      .click();
    cy.contains("Generate Password");
    cy.contains("button", /generate/i)
      .click();
    cy.contains("Generate Password").should("not.visible");
  });
});
