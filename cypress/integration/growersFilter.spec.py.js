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
  describe(`displays single grower card with the ${growerID} when a ${growerID} is entered into the Grower ID text field`, () => {
    it('Grower ID', () => {
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
});
