const { When, Then } = require('@cucumber/cucumber');

const SubscriptionPage = require('../page-objects/SubscriptionPage');

Then('I should see the upgrade button on the home page', async () => {
  await SubscriptionPage.waitForUpgradeButton();
});

When('I click the upgrade button', async () => {
  await SubscriptionPage.clickUpgrade();
});

When('I pay with the Stripe test card', async () => {
  await SubscriptionPage.payWithTestCard();
});

Then('I should see that the organization is premium', async () => {
  await SubscriptionPage.waitForPremium();
});

When('I open the subscription page', async () => {
  await SubscriptionPage.openFromMenu('Subscription');
});

When('I open the home page', async () => {
  await SubscriptionPage.openFromMenu('Home');
});

Then('I should see the premium line on the home page', async () => {
  await SubscriptionPage.waitForHomePremiumLine();
});
