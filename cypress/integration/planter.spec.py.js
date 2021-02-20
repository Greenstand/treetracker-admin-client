describe('Planter', () => {
  const pageSize = 24;

  before(() => {
    cy.visit('/');
    cy.get('button[title=menu]')
      .click();
    cy.contains('Planters')
      .click();
  });

  it('Should get id:xxx', () => {
    cy.contains(/ID:\d+/);
  });

  it('Should show items per page', () => {
    cy.contains(/^1-\d+ of \d+/);
    cy.get('.MuiTablePagination-select')
      .should('contain',pageSize)
      .and('be.visible');
  });

  it('Should show page 1', () => {
    cy.contains(new RegExp(`^1-${pageSize} of \\d+`));
    cy.get('button[title="Previous page"]').should('be.disabled');
  });

  it('Should show a full page of planters', () => {
    cy.get('.MuiCard-root').should('have.length', pageSize);
  });

  describe('Page 2', () => {
    before(() => {
      cy.get('button[title="Next page"]')
        .first()
        .click();
    });

    it('Should show page 2', () => {
      cy.contains(new RegExp(`^${pageSize+1}-\\d+ of \\d+`));
      cy.get('button[title="Previous page"]').should('be.enabled');
    });
  })
});
