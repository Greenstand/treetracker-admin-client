const { Given, When, Then } = require('@cucumber/cucumber');

const AdminPage = require('../page-objects/AdminPage');
const LoginPage = require('../page-objects/LoginPage');
const VerifyPage = require('../page-objects/VerifyPage');
const WalletDetailPage = require('../page-objects/WalletDetailPage');
const { openKeycloakLoginPage } = require('../support/auth');

const USERS_BY_ROLE = {
  'greenstand-admin': {
    username: 'org-manager',
    password: 'fIM1&miRS$Qs0^ST',
  },
  'wallet-admin': {
    username: 'bdd-wallet-admin',
    password: 'bdd@wallet@admin123',
  },
  organization: {
    username: process.env.BDD_ORG_USERNAME,
    password: process.env.BDD_ORG_PASSWORD,
  },
};

// The term the bind dialog searches for. Any account on the realm will do,
// so point it at one that exists in the environment under test.
const KEYCLOAK_ACCOUNT_SEARCH = process.env.BDD_KEYCLOAK_SEARCH || 'bdd';

let currentUser;
let legacyWallet;

Given('I am on the admin login page', async () => {
  await openKeycloakLoginPage();
});

Given('I am the user with role {string}', async (role) => {
  currentUser = USERS_BY_ROLE[role];

  if (!currentUser?.username || !currentUser?.password) {
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

Then('I should be able to see the wallet list page', async () => {
  await AdminPage.waitForWalletListPage();
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

Given('there is a wallet {string} with no keycloak binding', (walletName) => {
  // A fixture of the dev environment, not something the UI can set up.
  legacyWallet = walletName;
});

When('I click the name of the wallet {string}', async (walletName) => {
  await WalletDetailPage.openWallet(walletName || legacyWallet);
});

Then('I should see the wallet detail page for {string}', async (walletName) => {
  await WalletDetailPage.waitForPage(walletName || legacyWallet);
});

Then('the keycloak id is empty', async () => {
  await WalletDetailPage.waitForEmptyKeycloakId();
});

When('I open the bind keycloak account dialog', async () => {
  await WalletDetailPage.openBindDialog();
});

When('I search for a keycloak account and pick the first match', async () => {
  await WalletDetailPage.searchAndPickFirst(KEYCLOAK_ACCOUNT_SEARCH);
});

Then(
  'the detail page shows the keycloak id and the account behind it',
  async () => {
    await WalletDetailPage.waitForBoundAccount();
  }
);
