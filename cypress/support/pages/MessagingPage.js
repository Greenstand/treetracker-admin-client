class MessagingPage {
  renderPage = () => cy.get('#Messaging').should('exist');
}

export default MessagingPage;
