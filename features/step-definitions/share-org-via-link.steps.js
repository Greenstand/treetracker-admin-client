const { Given, When, Then } = require('@cucumber/cucumber');

const ShareAppPage = require('../page-objects/ShareAppPage');
const LoginPage = require('../page-objects/LoginPage');
const { openKeycloakLoginPage } = require('../support/auth');
const { userForRole } = require('../support/users');

Given('I am logged in as an organization', async () => {
  const user = userForRole('organization');

  await openKeycloakLoginPage();
  await LoginPage.login(user.username, user.password);
  await LoginPage.waitForSuccessfulRedirect();
});

When('I open the {string} menu item', async (label) => {
  await ShareAppPage.openMenuItem(label);
});

Then('I should see the text {string}', async (content) => {
  await ShareAppPage.waitForText(content);
});

Then('I should see the share link', async () => {
  await ShareAppPage.waitForShareLink();
});

Then('I should see the {string} button', async (label) => {
  await ShareAppPage.waitForButton(label);
});

When('I click the {string} button', async (label) => {
  await ShareAppPage.clickButton(label);
});

Then('I should see the notification {string}', async (content) => {
  await ShareAppPage.waitForNotification(content);
});

Then('I should see the QR code', async () => {
  await ShareAppPage.waitForQrCode();
});
