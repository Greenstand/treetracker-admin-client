class GrowersPage {
  grower_Card = () => cy.get('div[id^="card_"]');
  grower_Image = () => this.grower_Card().get('div > img', { timeout: 30000 });
  grower_Name = () => this.grower_Card().get('p:nth-child(1)');
  grower_ID = () => this.grower_Card().get('p:nth-child(2)>a');
  grower_OrganizationName = () => this.grower_Card().get('p:nth-child(3)');
  pagination = () => this.grower_Image().get('div.MuiTablePagination-root');
  previousPage_Button = () => cy.get('button[title="Previous page"]');
  nextPage_Button = () => cy.get('button[title="Next page"]');
  growersPerPage = () => cy.get('.MuiTablePagination-root div[role="button"]');
  apply_Button = () => cy.get('#submit');
  filter_Button = () => cy.get('button').contains('Filter');
  filter_Form = () => cy.get('div>form');
  growerID_TextField = () => cy.get('input[id="Grower ID"]');
  firstName_TextField = () => cy.get('input[id="First Name"]');
  lastName_TextField = () => cy.get('input[id="Last Name"]');
  email_TextField = () => cy.get('input[id="Email"]');
  phoneNumber_TextField = () => cy.get('input[id="Phone Number"]');
  organization_DropdownMenu = () => cy.get('#Organization');
  growerDetail_Email = () => cy.get('div').contains('Email address').next();
  growerDetail_PhoneNumber = () =>
    cy.get('div').contains('Phone number').next();
  when = () => this;
  and = () => this;
  then = () => this;

  goTo_NextPage() {
    this.grower_Image().should('be.visible');
    this.nextPage_Button().first().click();
  }
  numberOfDisplayed_GrowerCardsPerPage_ShouldBe(numberOfGrowers) {
    this.grower_Image().should('be.visible');
    this.grower_Card().should('have.length', numberOfGrowers);
    return this;
  }
  growersPerPage_DropdownMenu_SetTo(numberOfGrowers) {
    this.grower_Image().should('be.visible');
    this.growersPerPage()
      .first()
      .click()
      .get('ul>li')
      .contains(numberOfGrowers)
      .click();
    return this;
  }
  click_Button_Filter() {
    this.filter_Button().click();
    return this;
  }
  filterForm_ShouldBe_Visible() {
    this.filter_Form().should('be.visible');
    return this;
  }
  filterForm_Should_Not_Exist() {
    this.filter_Form().should('not.exist');
    return this;
  }
  enterInto_GrowerID_TextField(growerID) {
    this.growerID_TextField().type(growerID);
    return this;
  }
  click_Button_Apply() {
    this.apply_Button().click();
    return this;
  }
  single_GrowerCard_ShouldBe_Displayed() {
    for (let i = 0; i < 9; i++) {
      this.grower_Card().then((e) => {
        if (e.length > 1) {
          cy.wait(1000);
        }
      });
    }
    this.grower_Card().should('have.length', 1);
    return this;
  }
  growerCard_ShouldContain_ID(growerID) {
    this.grower_ID().should('contain.text', growerID);
    return this;
  }
  from_Organization_DropdownMenu_Select(organizationName) {
    this.organization_DropdownMenu()
      .click()
      .get('ul > li')
      .contains(organizationName)
      .click();
    return this;
  }
  growerCards_OrganizationName_ShouldContain(organizationName) {
    let name = true;
    this.grower_OrganizationName()
      .each((e) => {
        if (e.text().includes(organizationName)) {
          cy.log(`✔️ _'${e.text()}' contains '${organizationName}'_`);
        } else {
          name = false;
          cy.log(`❌ **'${e.text()}' should contain '${organizationName}'**`);
        }
      })
      .then(() => {
        if (name === false) {
          this.grower_OrganizationName().each((e) => {
            expect(e.text()).to.contain(organizationName);
          });
        }
      });
    return this;
  }
  enterInto_FirstName_TextField(firstName) {
    this.firstName_TextField().type(firstName);
    return this;
  }
  growerCards_FirstName_ShouldContain(firstName) {
    let name = true;
    this.grower_Name()
      .should('be.visible')
      .each((e) => {
        if (e.text().startsWith(firstName.toLowerCase())) {
          cy.log(`✔️ _'${e.text()}' starts with '${firstName.toLowerCase()}'_`);
        } else {
          name = false;
          cy.log(
            `❌ **'${e.text()}' should start with '${firstName.toLowerCase()}'**`
          );
        }
      })
      .then(() => {
        if (name === false) {
          this.grower_Name().each((e) => {
            expect(e.text()).to.match(new RegExp(`^${firstName}`, 'i'));
          });
        }
      });
    return this;
  }
  enterInto_LastName_TextField(lastName) {
    this.lastName_TextField().type(lastName);
    return this;
  }
  growerCards_LastName_ShouldContain(lastName) {
    let name = true;
    this.grower_Name()
      .should('be.visible')
      .each((e) => {
        if (e.text().endsWith(lastName.toLowerCase())) {
          cy.log(`✔️ _'${e.text()}' ends with '${lastName.toLowerCase()}'_`);
        } else {
          name = false;
          cy.log(
            `❌ **'${e.text()}' should end with '${lastName.toLowerCase()}'**`
          );
        }
      })
      .then(() => {
        if (name === false) {
          this.grower_Name().each((e) => {
            expect(e.text()).to.match(new RegExp(`${lastName}$`, 'i'));
          });
        }
      });
    return this;
  }
  open_GrowerDetail_Card(growerID) {
    cy.get(`div[id^="card_${growerID}"]`).click();
    return this;
  }
  close_GrowerDetail_Card() {
    cy.get('div[role="presentation"]').click();
    return this;
  }
  enterInto_Email_TextField(emailAddress) {
    this.email_TextField().type(emailAddress);
    return this;
  }
  growerDetailCards_EmailAddress_ShouldContain(email) {
    let name = true;
    this.grower_Name().should('be.visible');
    this.grower_ID()
      .each((e) => {
        this.open_GrowerDetail_Card(e.text())
          .growerDetail_Email()
          .then((e) => {
            if (e.text().includes(email)) {
              cy.log(`✔️ _'${e.text()}' contains '${email}'_`);
            } else {
              name = false;
              cy.log(`❌ **'${e.text()}' should contain '${email}'**`);
            }
          });
        this.close_GrowerDetail_Card();
      })
      .then(() => {
        if (name === false) {
          this.grower_ID().each((e) => {
            this.open_GrowerDetail_Card(e.text())
              .growerDetail_Email()
              .then((e) => {
                expect(e.text()).to.contain(email);
              });
            this.close_GrowerDetail_Card();
          });
        }
      });
    return this;
  }
  enterInto_PhoneNumber_TextField(phoneNumber) {
    this.phoneNumber_TextField().type(phoneNumber);
    return this;
  }
  growerDetailCards_PhoneNumber_ShouldContain(phoneNumber) {
    let name = true;
    this.grower_Name().should('be.visible');
    this.grower_ID()
      .each((e) => {
        this.open_GrowerDetail_Card(e.text())
          .growerDetail_PhoneNumber()
          .then((e) => {
            if (e.text().includes(phoneNumber)) {
              cy.log(`✔️ _'${e.text()}' contains '${phoneNumber}'_`);
            } else {
              name = false;
              cy.log(`❌ **'${e.text()}' should contain '${phoneNumber}'**`);
            }
          });
        this.close_GrowerDetail_Card();
      })
      .then(() => {
        if (name === false) {
          this.grower_ID().each((e) => {
            this.open_GrowerDetail_Card(e.text())
              .growerDetail_PhoneNumber()
              .then((e) => {
                expect(e.text()).to.contain(phoneNumber);
              });
            this.close_GrowerDetail_Card();
          });
        }
      });
    return this;
  }
}
export default GrowersPage;
