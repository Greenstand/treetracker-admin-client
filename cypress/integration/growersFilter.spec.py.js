import LoginPage from '../support/pages/LoginPage';
import HomePage from '../support/pages/HomePage';
import GrowersPage from '../support/pages/GrowersPage';

describe('Growers Filter', () => {
  const login_Page = new LoginPage();
  const home_Page = new HomePage();
  const growers_Page = new GrowersPage();

  const growerID = 42;
  const organizationName = 'FCC';
  const firstName = 'Naruto';
  const lastName = 'Uzumaki';
  const email = 'at9@test.com'; // name@email.com

  beforeEach(() => {
    login_Page.loginAsAMockedAdmin();
    home_Page.growers_Button().click();
  });

  it('closes the filter after clicking the Filter button', () => {
    growers_Page
      .filterForm_ShouldBe_Visible()
      .when()
      .click_Button_Filter()
      .then()
      .filterForm_Should_Not_Exist();
  });
  describe('Grower ID text field', () => {
    it(`displays single grower card with the ${growerID} when a ${growerID} is entered into the Grower ID text field`, () => {
      growers_Page
        .when()
        .enterInto_GrowerID_TextField(growerID)
        .and()
        .click_Button_Apply()
        .then()
        .single_GrowerCard_ShouldBe_Displayed()
        .and()
        .growerCard_ShouldContain_ID(growerID);
    });
  });
  describe('Organization dropdown menu', () => {
    it(`displays only grower cards that contains ${organizationName} as part of their organization name when the ${organizationName} option in the "Organization" dropdown menu is selected`, () => {
      growers_Page
        .when()
        .from_Organization_DropdownMenu_Select(organizationName)
        .and()
        .click_Button_Apply()
        .then()
        .growerCards_OrganizationName_ShouldContain(organizationName);
    });
  });
  describe('First Name text field', () => {
    it(`displays only grower cards that contains ${firstName} as part of their first name when the ${firstName} is entered into the First Name text field`, () => {
      growers_Page
        .when()
        .enterInto_FirstName_TextField(firstName)
        .and()
        .click_Button_Apply()
        .then()
        .growerCards_FirstName_ShouldContain(firstName);
    });
  });
  describe('Last Name text field', () => {
    it(`displays only grower cards that contains ${lastName} as part of their last name when the ${lastName} is entered into the Last Name text field`, () => {
      growers_Page
        .when()
        .enterInto_LastName_TextField(lastName)
        .and()
        .click_Button_Apply()
        .then()
        .growerCards_LastName_ShouldContain(lastName);
    });
  });
  describe('Email text field', () => {
    it(`displays only grower cards that contains ${email} as part of their email when the ${email} is entered into the Email text field`, () => {
      growers_Page
        .when()
        .enterInto_Email_TextField(email)
        .and()
        .click_Button_Apply()
        .then()
        .growerDetailCards_EmailAddress_ShouldContain(email);
    });
  });
});
