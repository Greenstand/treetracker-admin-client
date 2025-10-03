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
  const email = 'name@email.com';
  const phoneNumber = '1223';

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
  it('It displays number 6  as a filter count inside the Filter button when 6 filter choices are used', () => {
    growers_Page
      .when()
      .enterInto_GrowerID_TextField(growerID)
      .from_Organization_DropdownMenu_Select(organizationName)
      .enterInto_FirstName_TextField(firstName)
      .enterInto_LastName_TextField(lastName)
      .enterInto_Email_TextField(email)
      .enterInto_PhoneNumber_TextField(phoneNumber)
      .and()
      .click_Button_Apply()
      .then()
      .filterCount_ShouldBe(6);
  });
  it('clears the filter count after clicking the Reset button', () => {
    growers_Page
      .enterInto_FirstName_TextField(firstName)
      .enterInto_LastName_TextField(lastName)
      .click_Button_Apply()
      .filterCount_ShouldBe(2)
      .when()
      .click_Button_Reset()
      .then()
      .filterCount_ShouldNot_Exist();
  });
  it('clears the filter input field after clicking the Reset button', () => {
    growers_Page
      .enterInto_GrowerID_TextField(growerID)
      .growerID_TextField_ShouldContain(growerID)
      .when()
      .click_Button_Reset()
      .then()
      .growerID_TextField_ShouldBe_Empty();
  });
  describe('Grower ID text field', () => {
    it(`displays single grower card with the "${growerID}" when a "${growerID}" is entered into the Grower ID text field`, () => {
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
    it(`displays only grower cards that contains "${organizationName}" as part of their organization name when the "${organizationName}" option in the "Organization" dropdown menu is selected`, () => {
      growers_Page
        .when()
        .from_Organization_DropdownMenu_Select(organizationName)
        .and()
        .click_Button_Apply()
        .then()
        .growerCards_OrganizationName_ShouldContain(organizationName);
    });
    it(`displays only grower cards that have empty organization name when the "Not set" option in the "Organization" dropdown menu is selected`, () => {
      growers_Page
        .when()
        .from_Organization_DropdownMenu_Select('Not set')
        .and()
        .click_Button_Apply()
        .then()
        .growerCards_OrganizationName_ShouldBeEmpty();
    });
  });
  describe('First Name text field', () => {
    it(`displays only grower cards that contains "${firstName}" as part of their first name when the "${firstName}" is entered into the First Name text field`, () => {
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
    it(`displays only grower cards that contains "${lastName}" as part of their last name when the "${lastName}" is entered into the Last Name text field`, () => {
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
    it(`displays only grower cards that contains "${email}" as part of their grower detail card email when the "${email}" is entered into the Email text field`, () => {
      growers_Page
        .when()
        .enterInto_Email_TextField(email)
        .and()
        .click_Button_Apply()
        .then()
        .growerDetailCards_EmailAddress_ShouldContain(email);
    });
  });
  describe('Phone Number text field', () => {
    it(`displays only grower cards that contains "${phoneNumber}" as part of their grower detail card phone number when the "${phoneNumber}" is entered into the Phone Number text field`, () => {
      growers_Page
        .when()
        .enterInto_PhoneNumber_TextField(phoneNumber)
        .and()
        .click_Button_Apply()
        .then()
        .growerDetailCards_PhoneNumber_ShouldContain(phoneNumber);
    });
  });
});
