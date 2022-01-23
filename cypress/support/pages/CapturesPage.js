class CapturesPage {
  captures_TableRows = () => cy.get('tbody>tr', { timeout: 15000 });

  and() {
    return this;
  }
  then() {
    return this;
  }
  click_button_Apply() {
    cy.get('body').click();
    cy.get('button#submit').click();
    this.captures_TableRows().should('be.visible');
    return this;
  }
  open_VerificationStatus_DropdownMenu() {
    cy.get('#verification-status').click();
    return this;
  }
  check_VerificationStatus(verificationStatus) {
    cy.get('ul > li')
      .contains(verificationStatus)
      .parent()
      .prev()
      .find('input')
      .check();
    return this;
  }
  uncheck_VerificationStatus(verificationStatus) {
    cy.get('ul > li')
      .contains(verificationStatus)
      .parent()
      .prev()
      .find('input')
      .uncheck();
    return this;
  }
  verificationStatus_Column_ShouldContainOneOf(...verificationStatus) {
    this.captures_TableRows()
      .find('td:nth-child(5)')
      .each((e) => {
        cy.log(e.text());
        expect(e.text()).to.be.oneOf([].concat(...verificationStatus));
      });
    return this;
  }
  verificationStatus_Column_ShouldContainOnly(verificationStatus) {
    this.captures_TableRows()
      .find('td:nth-child(5)')
      .each((e) => {
        cy.log(e.text());
        expect(e.text()).to.be.equal(verificationStatus);
      });
    return this;
  }
  shouldBe_Checked(verificationStatus) {
    cy.get('ul > li')
      .contains(verificationStatus)
      .parent()
      .prev()
      .find('input')
      .should('be.checked');
    return this;
  }
  shouldBe_Unchecked(verificationStatus) {
    cy.get('ul > li')
      .contains(verificationStatus)
      .parent()
      .prev()
      .find('input')
      .should('not.be.checked');
    return this;
  }
}
export default CapturesPage;
