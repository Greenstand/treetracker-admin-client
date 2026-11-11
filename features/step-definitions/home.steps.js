const { Given, Then } = require('@cucumber/cucumber');

const HomePage = require('../page-objects/HomePage');
const LoginPage = require('../page-objects/LoginPage');
const { navigate, openKeycloakLoginPage } = require('../support/auth');
const { userForRole } = require('../support/users');

// Carried from the admin scenario into the organization scenario, which is the
// only way to show the organization numbers are a subset of the platform ones.
let platformWideCounts;

function platformWideCountFor(label) {
  if (!platformWideCounts) {
    throw new Error('The greenstand admin scenario must run first');
  }

  return platformWideCounts[label];
}

async function loginAs(role) {
  const user = userForRole(role);

  await openKeycloakLoginPage();
  await LoginPage.login(user.username, user.password);
  await LoginPage.waitForSuccessfulRedirect();
}

Given('I am a greenstand admin user', async () => {
  await loginAs('greenstand-admin');
});

Given('I am an organization user', async () => {
  await loginAs('organization');
});

Given('I am on the home page', async () => {
  await navigate('/');
  await HomePage.waitForPage();
});

Then('I can see the {string} card showing a count', async (label) => {
  await HomePage.readCount(label);
});

Then('I record those counts as the platform wide counts', async () => {
  platformWideCounts = await HomePage.readAllCounts();
});

Then('every count is within the platform wide counts', async () => {
  const counts = await HomePage.readAllCounts();

  for (const label of HomePage.cardLabels) {
    const platformWide = platformWideCountFor(label);

    if (counts[label] > platformWide) {
      throw new Error(
        `Expected "${label}" to be scoped to the organization, but ${counts[label]} exceeds the platform wide ${platformWide}`
      );
    }
  }
});

Then('the Total Captures count is below the platform wide count', async () => {
  const label = 'Total Captures';
  const platformWide = platformWideCountFor(label);
  const count = await HomePage.readCount(label);

  if (count >= platformWide) {
    throw new Error(
      `Expected "${label}" to be below the platform wide ${platformWide}, got ${count}`
    );
  }
});
