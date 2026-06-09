class AccountPage {
  get changePasswordButton() {
    return $('//button[normalize-space(.)="CHANGE"]');
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
}

module.exports = new AccountPage();
