const { Given, When, Then } = require('@cucumber/cucumber');

const LoginPage = require('../page-objects/LoginPage');
const AccountPage = require('../page-objects/AccountPage');
const ReauthenticatePage = require('../page-objects/ReauthenticatePage');
const UpdatePasswordPage = require('../page-objects/UpdatePasswordPage');

const TEST_USERNAME = 'user-test-treetracker-admin-client';
const CURRENT_PASSWORD = 'LjyxVk4t5^yx&!Gl';

const NEW_PASSWORD = CURRENT_PASSWORD;

Given('I am logged in', async () => {
  await LoginPage.login(TEST_USERNAME, CURRENT_PASSWORD);
  await LoginPage.waitForSuccessfulRedirect();
});

When('I open the change password page', async () => {
  await browser.url('/account');
  await AccountPage.openChangePasswordFlow();

  await browser.waitUntil(
    async () =>
      (await ReauthenticatePage.isOpen()) ||
      (await UpdatePasswordPage.isOpen()),
    {
      timeout: 60000,
      interval: 500,
      timeoutMsg:
        'Expected Keycloak re-authenticate prompt or update password form after clicking CHANGE',
    }
  );
});

When('I fill in my current password', async () => {
  if (await ReauthenticatePage.isOpen()) {
    await ReauthenticatePage.enterPassword(CURRENT_PASSWORD);
    await ReauthenticatePage.submit();
  }
});

When('I fill in a new password', async () => {
  await UpdatePasswordPage.waitForPage();
  await UpdatePasswordPage.fillNewPassword(NEW_PASSWORD);
});

When('I confirm the new password', async () => {
  await UpdatePasswordPage.confirmNewPassword(NEW_PASSWORD);
});

When('I submit the change password form', async () => {
  await UpdatePasswordPage.submit();
});

Then(
  'I should see a confirmation message that my password has been changed',
  async () => {
    await AccountPage.waitForPage();
    await AccountPage.waitForConfirmation('Your password has been changed.');
  }
);
