const { Then } = require('@cucumber/cucumber');

const AdminPage = require('../page-objects/AdminPage');
const SpeciesPage = require('../page-objects/SpeciesPage');
const { navigate } = require('../support/auth');

const ALWAYS_VISIBLE_MENU_ITEM = 'Verify';

Then('I should see the species page', async () => {
  await SpeciesPage.waitForPage();
});

Then('I should not see the {string} menu item', async (label) => {
  await AdminPage.expectMenuItemAbsent(label, ALWAYS_VISIBLE_MENU_ITEM);
});

Then('opening the species page directly should be refused', async () => {
  await navigate('/species');
  await SpeciesPage.waitForUnauthorized();
});
