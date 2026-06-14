const { When } = require('@cucumber/cucumber');

const LoginPage = require('../page-objects/LoginPage');
const RegistrationPage = require('../page-objects/RegistrationPage');

function buildRegistrationDetails() {
  const uniqueSuffix = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const username = `treetracker-bdd-${uniqueSuffix}`;

  return {
    firstName: 'Tree',
    lastName: 'TrackerBDD',
    email: `${username}@example.com`,
    username,
    password: 'TreeTrackerBdd!12345',
  };
}

When('I open the registration page', async () => {
  await LoginPage.openRegistrationPage();
  await RegistrationPage.waitForPage();
});

When('I fill in unique registration details', async () => {
  await RegistrationPage.fillRegistrationDetails(buildRegistrationDetails());
});

When('I submit the registration form', async () => {
  await RegistrationPage.submit();
});
