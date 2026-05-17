const { When, Then } = require('@cucumber/cucumber');

const AccountPage = require('../page-objects/AccountPage');
const ReauthenticatePage = require('../page-objects/ReauthenticatePage');
const UpdateAccountPage = require('../page-objects/UpdateAccountPage');

const FIRST_NAME = process.env.BDD_UPDATE_ACCOUNT_FIRST_NAME || 'TreeBDD';
const LAST_NAME = process.env.BDD_UPDATE_ACCOUNT_LAST_NAME || 'TrackerBDD';

When('I open the update account page', async () => {
  await browser.url('/account');
  await AccountPage.openUpdateAccountFlow();

  await browser.waitUntil(
    async () =>
      (await ReauthenticatePage.isOpen()) || (await UpdateAccountPage.isOpen()),
    {
      timeout: 60000,
      interval: 500,
      timeoutMsg:
        'Expected Keycloak re-authenticate prompt or update account form after clicking UPDATE ACCOUNT',
    }
  );
});

When('I fill in updated account details', async () => {
  await UpdateAccountPage.waitForPage();
  await UpdateAccountPage.fillFirstName(FIRST_NAME);
  await UpdateAccountPage.fillLastName(LAST_NAME);
});

When('I submit the update account form', async () => {
  await UpdateAccountPage.submit();
});

Then(
  'I should see a confirmation message that my account has been updated',
  async () => {
    await AccountPage.waitForPage();
    await AccountPage.waitForConfirmation(
      'Your account information has been updated.'
    );
  }
);
