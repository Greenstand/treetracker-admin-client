const { When } = require('@cucumber/cucumber');

const LoginPage = require('../page-objects/LoginPage');
const RegistrationPage = require('../page-objects/RegistrationPage');
const { buildUniqueUser, setRegisteredUser } = require('../support/testUser');

When('I open the registration page', async () => {
  await LoginPage.openRegistrationPage();
  await RegistrationPage.waitForPage();
});

When('I fill in unique registration details', async () => {
  const user = buildUniqueUser();
  setRegisteredUser(user);
  await RegistrationPage.fillRegistrationDetails(user);
});

When('I submit the registration form', async () => {
  await RegistrationPage.submit();
});
