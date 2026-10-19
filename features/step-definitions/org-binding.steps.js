const { Given, When, Then } = require('@cucumber/cucumber');

const AdminPage = require('../page-objects/AdminPage');
const BindingPage = require('../page-objects/BindingPage');
const { ensureLoggedOut } = require('../support/auth');

// The binding user is always the registered-user role, so the feature does not
// have to name an account that differs per environment.
const bindingUser = () => process.env.BDD_USER_USERNAME;

Then('I should see the request to bind link on the home page', async () => {
  await BindingPage.waitForBindLink();
});

When('I click the request to bind link', async () => {
  await BindingPage.clickBindLink();
});

When('I choose the organization {string} and submit', async (name) => {
  await BindingPage.chooseOrganization(name);
  await BindingPage.submit();
});

Then('I should see that the request is pending', async () => {
  await BindingPage.waitForPending();
});

Then('I should see that the request was rejected', async () => {
  await BindingPage.waitForRejected();
});

Then('I should see the pending line on the home page', async () => {
  await BindingPage.waitForHomePending();
});

Then('I should see that I am a member of {string}', async (name) => {
  await BindingPage.waitForHomeMember(name);
});

Given('I log out', async () => {
  await ensureLoggedOut();
});

When('I open the organization management page', async () => {
  await AdminPage.clickMenuItem('Organizations');
  await BindingPage.openRequestsTab();
});

Then('I should see the binding request from the user', async () => {
  await BindingPage.waitForRequestFrom(bindingUser());
});

When('I approve the binding request', async () => {
  await BindingPage.decide(bindingUser(), true);
});

When('I reject the binding request', async () => {
  await BindingPage.decide(bindingUser(), false);
});
