const { Given, When, Then } = require('@cucumber/cucumber');

const LoginPage = require('../page-objects/LoginPage');
const OrganizationPage = require('../page-objects/OrganizationPage');

const LOG_OUT_BUTTON = 'button=LOG OUT';
const USERNAME = 'user-test-treetracker-admin-client';
const PASSWORD = 'LjyxVk4t5^yx&!Gl';

let organizationDetails;

async function navigate(path) {
  await browser.url(path, { wait: 'none' });
}

async function isExisting(selector) {
  return $(selector)
    .isExisting()
    .catch(() => false);
}

async function openKeycloakLoginPage() {
  await navigate('/login');

  if (await LoginPage.isOpen()) {
    await LoginPage.waitForPage();
    return;
  }

  await navigate('/account');

  try {
    await browser.waitUntil(
      async () =>
        (await LoginPage.isOpen()) || (await isExisting(LOG_OUT_BUTTON)),
      { timeout: 15000, interval: 250 }
    );
  } catch {
    await navigate('/login');
    await LoginPage.waitForPage();
    return;
  }

  if (await LoginPage.isOpen()) {
    await LoginPage.waitForPage();
    return;
  }

  const logoutButton = $(LOG_OUT_BUTTON);
  await logoutButton.waitForDisplayed({ timeout: 10000 });
  await logoutButton.scrollIntoView();
  await logoutButton.click();
  await LoginPage.waitForPage();
}

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
