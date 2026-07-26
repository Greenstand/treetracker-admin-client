const { Given, When, Then } = require('@cucumber/cucumber');

const AccountPage = require('../page-objects/AccountPage');
const ReauthenticatePage = require('../page-objects/ReauthenticatePage');
const UpdatePasswordPage = require('../page-objects/UpdatePasswordPage');
const { registerNewUser, getRegisteredUser } = require('../support/testUser');

const NEW_PASSWORD = 'TreeTrackerBdd!54321';

Given('I am logged in', async () => {
  // Registering a new unique user through Keycloak also logs it in,
  // so every scenario runs against its own disposable account.
  await registerNewUser();
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
    await ReauthenticatePage.enterPassword(getRegisteredUser().password);
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
