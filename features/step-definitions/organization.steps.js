const { Given, When, Then } = require('@cucumber/cucumber');

const OrganizationPage = require('../page-objects/OrganizationPage');
const { registerNewUser } = require('../support/testUser');

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
  // Registers (and thereby logs in) a fresh unique user for this scenario.
  await registerNewUser();
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
