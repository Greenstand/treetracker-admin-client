class GrowersPage {
  grower_Card = () => cy.get('div[id^="card_"]');
  grower_Image = () => this.grower_Card().get('div > img', { timeout: 30000 });
  grower_Name = () => this.grower_Card().get('p:nth-child(1)');
  grower_ID = () => this.grower_Card().get('p:nth-child(2)');
  grower_OrganizationName = () => this.grower_Card().get('p:nth-child(3)');
  pagination = () => this.grower_Image().get('div.MuiTablePagination-root');
  previousPage_Button = () => cy.get('button[title="Previous page"]');

  when = () => this;
  and = () => this;
  then = () => this;

  goTo_NextPage() {
    this.grower_Image().get('button[title="Next page"]').first().click();
  }
  numberOfDisplayed_GrowerCardsPerPage_ShouldBe(numberOfGrowers) {
    this.grower_Image()
      .get('div.makeStyles-cardWrapper-70')
      .should('have.length', numberOfGrowers);
    return this;
  }
  growersPerPage_DropdownMenu_SetTo(numberOfGrowers) {
    this.grower_Image()
      .get('div.MuiTablePagination-root div[role="button"]')
      .first()
      .click()
      .get('ul>li')
      .contains(numberOfGrowers)
      .click();
    return this;
  }
  click_Button_Filter() {
    cy.get('button').contains('Filter').click();
    return this;
  }
  filterForm_ShouldBe_Visible() {
    cy.get('div>form').should('be.visible');
    return this;
  }
  filterForm_Should_Not_Exist() {
    cy.get('div>form').should('not.exist');
    return this;
  }
}
export default GrowersPage;
