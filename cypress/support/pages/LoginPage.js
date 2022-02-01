const credentials = require('../../fixtures/login.json');
class LoginPage {
  user_name_Field = () => cy.get('#userName');
  password_Field = () => cy.get('#password');
  login_Button = () => cy.get('[type="submit"]');
  error_Message = () => cy.get('div h6');

  login(userName, password) {
    cy.visit('/');
    this.user_name_Field().type(userName);
    this.password_Field().type(password);
    this.login_Button().click();
  }

  loginAsAnAdmin() {
    cy.visit('/');
    this.user_name_Field().type(credentials.user_name);
    this.password_Field().type(credentials.password);
    this.login_Button().click();
  }

  expect_Displayed(error_message) {
    this.error_Message().should('have.text', error_message);
  }
}
export default LoginPage;
