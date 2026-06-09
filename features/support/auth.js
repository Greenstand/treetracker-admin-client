const LoginPage = require('../page-objects/LoginPage');

const LOG_OUT_BUTTON = 'button=LOG OUT';

async function navigate(path) {
  await browser.url(path, { wait: 'none' });
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
  // Delete cookies first — no page load needed.
  await browser.deleteCookies();

  // Navigate to the app origin so browser.execute() can access localStorage
  // on that origin. Use waitForExist on body to avoid waiting for the full
  // React app to hydrate (which can take 30-45s on a cold dev server).
  await browser.url('/');
  await $('body').waitForExist({ timeout: 10000 });

  await browser.execute(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await openKeycloakLoginPage();
}

module.exports = { navigate, openKeycloakLoginPage, ensureLoggedOut };
