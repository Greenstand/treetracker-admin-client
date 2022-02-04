import LoginPage from '../support/pages/LoginPage';
import HomePage from '../support/pages/HomePage';
import GrowersPage from '../support/pages/GrowersPage';

describe('Growers Filter', () => {
  const login_Page = new LoginPage();
  const home_Page = new HomePage();
  const growers_Page = new GrowersPage();

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
});
