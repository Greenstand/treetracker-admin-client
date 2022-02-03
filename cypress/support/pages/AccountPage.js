class AccountPage {
  logout_Button = () => cy.get('button').contains('LOG OUT');
}
export default AccountPage;
