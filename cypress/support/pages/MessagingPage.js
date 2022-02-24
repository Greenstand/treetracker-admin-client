class MessagingPage {
  renderPage = () => cy.get('#Messaging').should('exist');
  newMessage_Button = () => cy.get('button').contains('New Message');
  announceMessage_Button = () => cy.get('button').contains('Announce Message');
  quickSurvey_Button = () => cy.get('button').contains('Quick Survey');
  sendNewMessage_Header = () => cy.get('h3').contains('Send New Message');
  announceMessage_Header = () => cy.get('h4').contains('Announce Message');
  quickSurveys_Header = () => cy.get('h3').contains('Quick Surveys');
  when = () => this;
  and = () => this;
  then = () => this;

  click_NewMessage_Button() {
    this.newMessage_Button().click();
    return this;
  }
  click_AnnounceMessage_Button() {
    this.announceMessage_Button().click();
    return this;
  }
  click_QuickSurvey_Button() {
    this.quickSurvey_Button().click();
    return this;
  }
  sendNewMessage_Header_ShouldBe_Displayed() {
    this.sendNewMessage_Header().should('have.length', 1);
    return this;
  }
  announceMessage_Header_ShouldBe_Displayed() {
    this.announceMessage_Header().should('have.length', 1);
    return this;
  }
  quickSurveys_Header_ShouldBe_Displayed() {
    this.quickSurveys_Header().should('have.length', 1);
    return this;
  }
}

export default MessagingPage;
