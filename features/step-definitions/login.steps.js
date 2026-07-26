const { Before, Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../page-objects/LoginPage');
const { openKeycloakLoginPage, ensureLoggedOut } = require('../support/auth');
const {
  registerNewUser,
  resetRegisteredUser,
  getRegisteredUser,
} = require('../support/testUser');

Before(async () => {
  resetRegisteredUser();
  await ensureLoggedOut();
});

Given('I am on the login page', async () => {
  await openKeycloakLoginPage();
});

Given('I am registered as a new user', async () => {
  await registerNewUser();
});

Given('I am logged out', async () => {
  await ensureLoggedOut();
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

When('I login with the registered account', async () => {
  const user = getRegisteredUser();
  await LoginPage.login(user.username, user.password);
});

Then('I should see an error message', async () => {
  await LoginPage.waitForInvalidCredentials();
});

Then('I should be redirected away from the login page', async () => {
  await LoginPage.waitForSuccessfulRedirect();
});
