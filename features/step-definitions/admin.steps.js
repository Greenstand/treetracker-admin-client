const { Given, When, Then } = require('@cucumber/cucumber');

const AdminPage = require('../page-objects/AdminPage');
const LoginPage = require('../page-objects/LoginPage');
const { openKeycloakLoginPage } = require('../support/auth');

const adminUsername = process.env.BDD_GREENSTAND_ADMIN_USERNAME;
const adminPassword = process.env.BDD_GREENSTAND_ADMIN_PASSWORD;

const USERS_BY_ROLE =
  adminUsername && adminPassword
    ? {
        'greenstand-admin': {
          username: adminUsername,
          password: adminPassword,
        },
      }
    : {};

let currentUser;

Given('I am on the admin login page', async () => {
  await openKeycloakLoginPage();
});

Given('I am the user with role {string}', async (role) => {
  currentUser = USERS_BY_ROLE[role];

  if (!currentUser) {
    console.warn(
      `No BDD credentials configured for role "${role}" ` +
        '(set BDD_GREENSTAND_ADMIN_USERNAME / BDD_GREENSTAND_ADMIN_PASSWORD) — skipping scenario'
    );
    return 'skipped';
  }
});

When('I login', async () => {
  await LoginPage.login(currentUser.username, currentUser.password);
  await LoginPage.waitForSuccessfulRedirect();
});

Then(
  'I should be able to see the {string} menu item',
  async (menuItemLabel) => {
    await AdminPage.waitForMenuItem(menuItemLabel);
  }
);

When('I click on the {string} menu item', async (menuItemLabel) => {
  await AdminPage.clickMenuItem(menuItemLabel);
});

Then('I should be able to see the organization list page', async () => {
  await AdminPage.waitForOrganizationListPage();
});

When('I search for organizations with {string}', async (term) => {
  await AdminPage.searchOrganizations(term);
});

Then('I should see organizations matching {string}', async (term) => {
  await AdminPage.waitForSearchResults(term);
});

When('I sort organizations by {string}', async (sortLabel) => {
  await AdminPage.sortOrganizationsBy(sortLabel);
});

Then(
  'the organization list should update with the new sort order',
  async () => {
    await AdminPage.waitForSortApplied();
  }
);
