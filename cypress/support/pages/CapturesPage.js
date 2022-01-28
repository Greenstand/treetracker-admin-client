class CapturesPage {
  captures_TableRows = () => cy.get('tbody>tr', { timeout: 60000 });

  mock_TreesFilter() {
    return cy.route(
      'GET',
      '/api/admin/api/trees?filter={"where":{"or":[{"active":true,"approved":true},{"active":true,"approved":false}]},"order":["timeCreated desc"],"limit":25,"skip":0,"fields":{"id":true,"timeCreated":true,"status":true,"active":true,"approved":true,"planterId":true,"planterIdentifier":true,"deviceIdentifier":true,"speciesId":true,"tokenId":true,"age":true,"morphology":true,"captureApprovalTag":true,"rejectionReason":true,"note":true}}',
      'fixture:treesFilterMock.json'
    );
  }

  and() {
    return this;
  }
  when() {
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
    const listOfVerificationStatus = [].concat(...verificationStatus);
    let status = true;
    this.captures_TableRows()
      .find('td:nth-child(5)')
      .each((e) => {
        if (
          listOfVerificationStatus.some((status) => e.text().includes(status))
        ) {
          cy.log(`✔️ _'${e.text()}' is one of '${listOfVerificationStatus}'_`);
        } else {
          status = false;
          cy.log(
            `❌ **'${e.text()}' should be one of '${listOfVerificationStatus}'**`
          );
        }
      })
      .then(() => {
        if (status === false) {
          cy.get('td:nth-child(5)').each((e) => {
            expect(e.text()).to.be.oneOf(listOfVerificationStatus);
          });
        }
      });
    return this;
  }
  verificationStatus_Column_ShouldContainOnly(verificationStatus) {
    let status = true;
    this.captures_TableRows()
      .find('td:nth-child(5)')
      .each((e) => {
        if (e.text() === verificationStatus) {
          cy.log(`✔️ _'${e.text()}' equals to '${verificationStatus}'_`);
        } else {
          status = false;
          cy.log(
            `❌ **'${e.text()}' should equal to '${verificationStatus}'**`
          );
        }
      })
      .then(() => {
        if (status === false) {
          cy.get('td:nth-child(5)').each((e) => {
            expect(e.text()).to.be.equal(verificationStatus);
          });
        }
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
  enterInto_Tag_TextField(captureTag) {
    cy.get('div[role="combobox"]').type(`${captureTag}{enter}`);
    this.captures_TableRows().should('be.visible');
    return this;
  }
  captureTags_Column_ShouldContain(captureTag) {
    let tag = true;
    this.captures_TableRows()
      .find('td:nth-child(8)')
      .each((e) => {
        if (e.text().includes(captureTag)) {
          cy.log(`✔️ _'${e.text()}' contains '${captureTag}'_`);
        } else {
          tag = false;
          cy.log(`❌ **'${e.text()}' should contain '${captureTag}'**`);
        }
      })
      .then(() => {
        if (tag === false) {
          cy.get('td:nth-child(8)').each((e) => {
            expect(e.text()).to.contain(captureTag);
          });
        }
      });
    return this;
  }
}
export default CapturesPage;
