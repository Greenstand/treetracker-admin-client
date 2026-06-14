const { Given, When, Then } = require('@cucumber/cucumber');

const AdminPage = require('../page-objects/AdminPage');
const LoginPage = require('../page-objects/LoginPage');
const { openKeycloakLoginPage } = require('../support/auth');

const USERS_BY_ROLE = {
  'greenstand-admin': {
    username: 'org-manager',
    password: '*Szhq#J#8O8w@#gg',
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
    if (menuItemLabel.toLowerCase() !== 'organization management') {
      throw new Error(`Unsupported menu item assertion: ${menuItemLabel}`);
    }

    await AdminPage.waitForOrganizationManagementMenuItem();
  }
);

When('I click on the {string} menu item', async (menuItemLabel) => {
  if (menuItemLabel.toLowerCase() !== 'organization management') {
    throw new Error(`Unsupported menu item click: ${menuItemLabel}`);
  }

  await AdminPage.openOrganizationManagement();
});

Then('I should be able to see the organization list page', async () => {
  await AdminPage.waitForOrganizationListPage();
});
