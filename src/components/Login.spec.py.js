import { mount } from 'cypress-react-unit-test'
import React from 'react'
import Login from "./Login";
import theme from './common/theme'
import { ThemeProvider } from '@material-ui/core/styles'

describe("Login", () => {
  it("Login", () => {
    mount(
      <ThemeProvider theme={theme}>
        <Login />
      </ThemeProvider>
    );
    cy.contains(/Login/i);
  });
});
