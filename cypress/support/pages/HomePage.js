class HomePage {
  account_Button = () => cy.get('.MuiListItemText-primary').contains('Account');
  growers_Button = () => cy.get('.MuiListItemText-primary').contains('Growers');
  captures_Button = () =>
    cy.get('.MuiListItemText-primary').contains('Captures');
}
export default HomePage;
