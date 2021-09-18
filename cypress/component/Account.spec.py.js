import { mount } from 'cypress-react-unit-test';
import React from 'react';
import Account from '../../src/components/Account';
import theme from '../../src/components/common/theme';
import { ThemeProvider } from '@material-ui/core/styles';

describe('Account', () => {
  it('Account', () => {
    const user = {
      username: 'dadiorchen',
      firstName: 'Dadior',
      lastName: 'Chen',
      email: 'dadiorchen@outlook.com',
      role: [
        {
          id: 1,
          name: 'admin',
        },
        {
          id: 2,
          name: 'Tree Auditor',
        },
      ],
    };
    mount(
      <ThemeProvider theme={theme}>
        <Account user={user} />
      </ThemeProvider>,
    );
    cy.contains(/Dadior/i);
  });
});
