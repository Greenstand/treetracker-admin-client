class AccountPage {
  get changePasswordButton() {
    return $('//button[normalize-space(.)="CHANGE"]');
  }

  get updateAccountButton() {
    return $('//button[normalize-space(.)="UPDATE ACCOUNT"]');
  }

  get confirmationMessage() {
    return $('.confirm-dialog');
  }

  async waitForConfirmation(expectedText) {
    await this.confirmationMessage.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: `Expected notification "${expectedText}"`,
    });

    await browser.waitUntil(
      async () =>
        (await this.confirmationMessage.getText()).includes(expectedText),
      {
        timeout: 5000,
        interval: 200,
        timeoutMsg: `Expected notification text to include "${expectedText}"`,
      }
    );
  }

  async waitForPage() {
    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl();
        try {
          return new URL(url).pathname === '/account';
        } catch {
          return false;
        }
      },
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: 'Expected to be on /account',
      }
    );

    await this.changePasswordButton.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected CHANGE button on the account page',
    });
  }

  async openChangePasswordFlow() {
    await this.waitForPage();
    await this.changePasswordButton.scrollIntoView();
    await this.changePasswordButton.click();
  }

  async openUpdateAccountFlow() {
    await this.waitForPage();
    await this.updateAccountButton.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Expected UPDATE ACCOUNT button on the account page',
    });
    await this.updateAccountButton.scrollIntoView();
    await this.updateAccountButton.click();
  }
}

module.exports = new AccountPage();
