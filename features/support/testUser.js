const LoginPage = require('../page-objects/LoginPage');
const RegistrationPage = require('../page-objects/RegistrationPage');

const DEFAULT_PASSWORD = 'TreeTrackerBdd!12345';

// The test user registered by the current scenario. Reset before each
// scenario (see the global Before hook in login.steps.js).
let currentUser = null;

function buildUniqueUser() {
  const uniqueSuffix = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const username = `treetracker-bdd-${uniqueSuffix}`;

  return {
    firstName: 'Tree',
    lastName: 'TrackerBDD',
    email: `${username}@example.com`,
    username,
    password: DEFAULT_PASSWORD,
  };
}

function setRegisteredUser(user) {
  currentUser = user;
}

function resetRegisteredUser() {
  currentUser = null;
}

function getRegisteredUser() {
  if (!currentUser) {
    throw new Error(
      'No test user has been registered in this scenario yet — ' +
        'register one first (e.g. via registerNewUser())'
    );
  }
  return currentUser;
}

// Register a brand-new unique user through the Keycloak registration page.
// Expects the Keycloak login page to be open (every scenario starts there —
// see ensureLoggedOut in the global Before hook). Keycloak logs the new
// user in automatically after registration.
async function registerNewUser() {
  const user = buildUniqueUser();

  await LoginPage.openRegistrationPage();
  await RegistrationPage.waitForPage();
  await RegistrationPage.fillRegistrationDetails(user);
  await RegistrationPage.submit();
  await LoginPage.waitForSuccessfulRedirect();

  setRegisteredUser(user);
  return user;
}

module.exports = {
  buildUniqueUser,
  registerNewUser,
  setRegisteredUser,
  resetRegisteredUser,
  getRegisteredUser,
};
