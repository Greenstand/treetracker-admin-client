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
});
