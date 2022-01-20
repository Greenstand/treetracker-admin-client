class GrowersPage {
  grower_Card = () => cy.get('div[id^="card_"]');
  grower_Image = () => this.grower_Card().get('div > img', { timeout: 9000 });
  grower_Name = () => this.grower_Card().get('p:nth-child(1)');
  grower_ID = () => this.grower_Card().get('p:nth-child(2)');
  grower_OrganizationName = () => this.grower_Card().get('p:nth-child(3)');
  pagination = () => cy.get('div.MuiTablePagination-root');
  previousPage_Button = () => cy.get('button[title="Previous page"]');
  nextPage_Button = () => cy.get('button[title="Next page"]');
}
export default GrowersPage;
