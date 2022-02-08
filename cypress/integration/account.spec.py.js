import LoginPage from '../support/pages/LoginPage';
import HomePage from '../support/pages/HomePage';
import AccountPage from '../support/pages/AccountPage';

describe('Account', () => {
  const login_Page = new LoginPage();
  const home_Page = new HomePage();
  const account_Page = new AccountPage();

  before(() => cy.fixture('login').then((login) => (globalThis.login = login)));

  beforeEach(() => {
    login_Page.login(login.user_name, login.password);
  });

  it('returns to the Login page after clicking the "LOG OUT" button', () => {
    home_Page.account_Button().click();
    account_Page.logout_Button().click();
    login_Page.user_name_Field().should('be.visible');
    login_Page.password_Field().should('be.visible');
  });
});
