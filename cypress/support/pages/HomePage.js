class HomePage {
  account_Button = () => cy.get('.MuiListItemText-primary').contains('Account');
}
export default HomePage;
