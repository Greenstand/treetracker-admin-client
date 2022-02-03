class HomePage {
  account_Button = () => cy.get('.MuiListItemText-primary').contains('Account');
  growers_Button = () => cy.get('.MuiListItemText-primary').contains('Growers');
}
export default HomePage;
