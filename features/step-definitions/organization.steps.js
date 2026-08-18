const { Given, When, Then } = require('@cucumber/cucumber');

const LoginPage = require('../page-objects/LoginPage');
const OrganizationPage = require('../page-objects/OrganizationPage');
const VerifyPage = require('../page-objects/VerifyPage');
const { openKeycloakLoginPage } = require('../support/auth');

const USERNAME = 'user-test-treetracker-admin-client';
const PASSWORD = 'LjyxVk4t5^yx&!Gl';

function buildOrganizationDetails() {
  const timestamp = Date.now();

  return {
    name: `Organization BDD ${timestamp}`,
    email: `organization-bdd-${timestamp}@example.com`,
    phone: '+23270000000',
    website: `https://example.com/organization-bdd-${timestamp}`,
    logoUrl: 'https://example.com/logo.png',
    mapName: `freetown-${timestamp}`,
  };
}

Given('I am registered user', async () => {
  await openKeycloakLoginPage();
  await LoginPage.login(USERNAME, PASSWORD);
  await LoginPage.waitForSuccessfulRedirect();
});

Given('I am on the organization application page', async () => {
  await browser.url('/organization/apply');
  await OrganizationPage.waitForPage();
});

When('I fill in the organization details', async () => {
  organizationDetails = buildOrganizationDetails();
  await OrganizationPage.fillOrganizationDetails(organizationDetails);
});

When('I submit the form', async () => {
  await OrganizationPage.submit();
});

Then('I should see a confirmation message', async () => {
  await OrganizationPage.waitForConfirmation();
});

Then('Go the home page', async () => {
  await OrganizationPage.waitForHomeRedirect();
});

Then(
  'I should see the `verify` menu item on the menu bar on the top left',
  async () => {
    await OrganizationPage.waitForVerifyMenuItem();
  }
);

When('I click `vierfy`', async () => {
  await VerifyPage.open();
});

Then('I see the verify page with no tree on the list', async () => {
  await VerifyPage.waitForNoCaptures();
});
