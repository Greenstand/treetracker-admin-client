import LoginPage from '../support/pages/LoginPage';
import HomePage from '../support/pages/HomePage';
import MessagingPage from '../support/pages/MessagingPage';

describe('Messaging', () => {
  const login_Page = new LoginPage();
  const home_Page = new HomePage();
  const messaging_Page = new MessagingPage();

  beforeEach(() => {
    login_Page.loginAsAnAdmin();
    home_Page.inbox_Button().click();
  });
  describe('renders main messaging page', () => {
    it('renders correctly', () => {
      messaging_Page.renderPage();
    });
  });
  it.only('opens the Send New Message window after clicking the New Message button', () => {
    messaging_Page
      .when()
      .click_NewMessage_Button()
      .then()
      .sendNewMessage_Header_ShouldBe_Displayed();
  });
});
