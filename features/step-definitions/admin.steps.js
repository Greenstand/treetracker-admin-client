const { Given, When, Then } = require('@cucumber/cucumber');

const AdminPage = require('../page-objects/AdminPage');
const LoginPage = require('../page-objects/LoginPage');
const VerifyPage = require('../page-objects/VerifyPage');
const { openKeycloakLoginPage } = require('../support/auth');

const USERS_BY_ROLE = {
  'greenstand-admin': {
    username: 'org-manager',
    password: 'fIM1&miRS$Qs0^ST',
  },
};

let currentUser;

Given('I am on the admin login page', async () => {
  await openKeycloakLoginPage();
});

Given('I am the user with role {string}', async (role) => {
  currentUser = USERS_BY_ROLE[role];

  if (!currentUser) {
    throw new Error(`No BDD credentials configured for role: ${role}`);
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

Given('I am on the verify page', async () => {
  await VerifyPage.open();
});

// The slash is escaped because Cucumber expressions read "trees/captures" as
// alternative text rather than a literal slash.
Then('There should be trees\\/captures on the list', async () => {
  await VerifyPage.waitForCaptures();
});

Then('I should be able to verify the first tree', async () => {
  await VerifyPage.verifyFirstCapture();
});
