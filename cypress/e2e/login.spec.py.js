import LoginPage from '../support/pages/LoginPage';

describe('Login', () => {
  const loginPage = new LoginPage();

  before(() => cy.fixture('login').then((login) => (globalThis.login = login)));

  it('displays an error message when "incorrect" credentials are entered', () => {
    loginPage.login('incorrectName', 'incorrectPassword');
    loginPage.expect_Displayed(login.error_message);
  });

  it('logs in when "correct" credentials are entered', () => {
    loginPage.login(login.user_name, login.password);
    cy.get('div.Home-menuAside-18').should('contain.text', 'Home');
  });

  it('can uncheck the Remember Me checkbox, which is checked by default', () => {
    cy.visit('/');
    cy.get('input[type="checkbox"]').should('be.checked');
    cy.get('input[type="checkbox"]').click().should('not.be.checked');
  });

  it('until one of the fields, user name or password, is empty, the button LOG IN will remain grayed out', () => {
    cy.visit('/');

    cy.get('input[id="userName"]').type('John');
    cy.get('input[id="userName"]').get('value').should('not.be.empty');
    cy.get('input[id="password"]').should('be.empty');
    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('input[id="userName"]').clear().should('be.empty');
    cy.get('input[id="password"]').type('Secret Password');
    cy.get('input[id="password"]').get('value').should('not.be.empty');
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
