const STRIPE_TEST_CARD = '4242424242424242';

class SubscriptionPage {
  get upgradeButton() {
    return $('[data-testid="home-upgrade"]');
  }

  get homePremiumLine() {
    return $('[data-testid="home-subscription-active"]');
  }

  get subscribeButton() {
    return $('[data-testid="subscription-subscribe"]');
  }

  get activeMessage() {
    return $('[data-testid="subscription-active"]');
  }

  async waitForUpgradeButton() {
    await this.upgradeButton.waitForDisplayed({
      timeout: 60000,
      timeoutMsg: 'Expected the upgrade button on the home page',
    });
  }

  async clickUpgrade() {
    await this.waitForUpgradeButton();
    await this.upgradeButton.click();
  }

  async waitForPremium() {
    await this.activeMessage.waitForDisplayed({
      timeout: 60000,
      timeoutMsg: 'Expected the subscription page to report premium',
    });
  }

  async openFromMenu(name) {
    const item = $(`a=${name}`);
    await item.waitForDisplayed({ timeout: 30000 });
    await item.click();
  }

  async waitForHomePremiumLine() {
    await this.homePremiumLine.waitForDisplayed({
      timeout: 60000,
      timeoutMsg: 'Expected the premium line on the home page',
    });
  }

  // Stripe hosts the payment page, so this drives their form, not ours.
  async payWithTestCard() {
    await this.subscribeButton.waitForDisplayed({ timeout: 30000 });
    await this.subscribeButton.click();

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes('stripe.com'),
      { timeout: 60000, timeoutMsg: 'Expected a redirect to Stripe Checkout' }
    );

    const email = await $('#email');
    await email.waitForDisplayed({ timeout: 60000 });
    await email.setValue('bdd-tester@example.com');

    const card = await $('#cardNumber');
    await card.setValue(STRIPE_TEST_CARD);
    await $('#cardExpiry').setValue('1234');
    await $('#cardCvc').setValue('123');

    const name = await $('#billingName');
    if (await name.isExisting()) {
      await name.setValue('BDD Tester');
    }

    const submit = await $('.SubmitButton');
    await submit.scrollIntoView();
    await submit.click().catch(async () => {
      // Stripe's page can overlay the button; click it directly instead.
      await browser.execute((el) => el.click(), submit);
    });
  }
}

module.exports = new SubscriptionPage();
