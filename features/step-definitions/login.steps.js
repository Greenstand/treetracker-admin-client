const { Before, Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../page-objects/LoginPage');

const LOG_OUT_BUTTON = '//button[normalize-space(.)="LOG OUT"]';

async function navigate(path) {
  await browser.url(path, { wait: 'none' });
}

async function clearAppStorage() {
  await navigate('/');

  await browser.execute(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await browser.deleteCookies();
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

async function ensureLoggedOut() {
  await clearAppStorage();

  await openKeycloakLoginPage();
}

async function assertInvalidCredentialFeedback() {
  await LoginPage.waitForInvalidCredentials();
}

Before(async () => {
  await ensureLoggedOut();
});

Given('I am on the login page', async () => {
  await openKeycloakLoginPage();
  await LoginPage.waitForPage();
});

When(
  'I enter username {string} and password {string}',
  async (username, password) => {
    await LoginPage.enterCredentials(username, password);
  }
);

When('I click the login button', async () => {
  await LoginPage.submit();
});

Then('I should see an error message', async () => {
  await assertInvalidCredentialFeedback();
});

Then('I should be redirected away from the login page', async () => {
  await LoginPage.waitForSuccessfulRedirect();
});
