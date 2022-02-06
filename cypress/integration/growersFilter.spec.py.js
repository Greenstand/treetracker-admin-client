import LoginPage from '../support/pages/LoginPage';
import HomePage from '../support/pages/HomePage';
import GrowersPage from '../support/pages/GrowersPage';

describe('Growers Filter', () => {
  const login_Page = new LoginPage();
  const home_Page = new HomePage();
  const growers_Page = new GrowersPage();

  const growerID = 42;

  beforeEach(() => {
    login_Page.loginAsAnAdmin();
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
    it('displays only grower cards that contains "FCC" as part of their organization name when the "FCC" option in the "Organization" dropdown menu is selected', () => {
      growers_Page
        .when()
        .from_Organization_DropdownMenu_Select('FCC')
        .and()
        .click_Button_Apply()
        .then()
        .growerCards_OrganizationName_ShouldContain('FCC');
    });
  });
  describe('First Name text field', () => {
    it('displays only grower cards that contains "Naruto" as part of their first name when the "Naruto" is entered into the First Name text field', () => {
      growers_Page
        .when()
        .enterInto_FirstName_TextField('Naruto')
        .and()
        .click_Button_Apply()
        .then()
        .growerCards_FirstName_ShouldContain('Naruto');
    });
  });
});
