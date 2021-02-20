import Menu from "./Menu";
import { mount } from 'cypress-react-unit-test'
import React from 'react'
import theme from './theme'
import { ThemeProvider } from '@material-ui/core/styles'

describe("Menu", () => {
  it("Menu", () => {
    mount(<Menu />);
  });

  it("Menu plain", () => {
    mount(<Menu variant="plain" />);
  });
});
