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

  loginAsAMockedAdmin() {
    cy.server();
    cy.route(
      'POST',
      '/api/admin/auth/login',
      'fixture:admin_Login_Mock.json'
    ).as('postLogin');

    cy.visit('/');
    this.user_name_Field().type('mocked user name');
    this.password_Field().type('mocked password');
    this.login_Button().click();

    cy.wait('@postLogin').should((xhr) => {
      expect(xhr.requestBody).to.have.property('userName', 'mocked user name');
      expect(xhr.requestBody).to.have.property('password', 'mocked password');
      expect(xhr).to.have.property('status', 200);
    });
  }

  loginAsAMockedFreetownManager() {
    cy.server();
    cy.route(
      'POST',
      '/api/admin/auth/login',
      'fixture:freetownManager_Login_Mock.json'
    ).as('postLogin');

    cy.visit('/');
    this.user_name_Field().type('mocked user name');
    this.password_Field().type('mocked password');
    this.login_Button().click();

    cy.wait('@postLogin').should((xhr) => {
      expect(xhr.requestBody).to.have.property('userName', 'mocked user name');
      expect(xhr.requestBody).to.have.property('password', 'mocked password');
      expect(xhr).to.have.property('status', 200);
    });
  }

  expect_Displayed(error_message) {
    this.error_Message().should('have.text', error_message);
  }
}
export default LoginPage;
