// build a cypress test for the reporting panel
describe('Reporting Panel', () => {
  it('should be able to open the reporting panel', () => {
    cy.visit('/');

    cy.contains('Top growers');
  });
});
