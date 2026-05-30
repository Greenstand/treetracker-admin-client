const { When, Then } = require('@cucumber/cucumber');

const LoginPage = require('../page-objects/LoginPage');
const ForgotPasswordPage = require('../page-objects/ForgotPasswordPage');

function buildResetEmail() {
  const uniqueSuffix = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return `treetracker-bdd-${uniqueSuffix}@example.com`;
}

When('I open the forgot password page', async () => {
  await LoginPage.openForgotPasswordPage();
  await ForgotPasswordPage.waitForPage();
});

When('I fill in my email address', async () => {
  await ForgotPasswordPage.fillEmail(buildResetEmail());
});

When('I submit the forgot password form', async () => {
  await ForgotPasswordPage.submit();
});

Then(
  'I should see a confirmation message that a password reset email has been sent',
  async () => {
    await LoginPage.waitForPasswordResetConfirmation();
  }
);
