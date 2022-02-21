class MessagingPage {
  renderPage = () => cy.get('#Messaging').should('exist');
  newMessage_Button = () => cy.get('button').contains('New Message');
  sendNewMessage_Header = () => cy.get('h3').contains('Send New Message');
  when = () => this;
  and = () => this;
  then = () => this;

  click_NewMessage_Button() {
    this.newMessage_Button().click();
    return this;
  }
  sendNewMessage_Header_ShouldBe_Displayed() {
    this.sendNewMessage_Header().should('have.length', 1);
    return this;
  }
}

export default MessagingPage;
