class LoginPage {
  login(userName, password) {
    cy.visit('/');
    cy.get('#userName').type(userName);
    cy.get('#password').type(password);
    cy.get('[type="submit"]').click();
  }

  expect_Displayed(error_message) {
    cy.get('div h6').should('have.text', error_message);
  }
}
export default LoginPage;
