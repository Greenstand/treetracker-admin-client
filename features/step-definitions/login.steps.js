const { Before, Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../page-objects/LoginPage');
const { openKeycloakLoginPage, ensureLoggedOut } = require('../support/auth');

Before(async () => {
  await ensureLoggedOut();
});

Given('I am on the login page', async () => {
  await openKeycloakLoginPage();
});

When(
  'I enter username {string} and password {string}',
  async (username, password) => {
    await LoginPage.enterCredentials(username, password);
  }
);

When('I click the login button', async () => {
  await LoginPage.submit();
});

Then('I should see an error message', async () => {
  await LoginPage.waitForInvalidCredentials();
});

Then('I should be redirected away from the login page', async () => {
  await LoginPage.waitForSuccessfulRedirect();
});
