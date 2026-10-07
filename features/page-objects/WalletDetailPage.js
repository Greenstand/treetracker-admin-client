class WalletDetailPage {
  walletNameLink(name) {
    return $(
      `//a[@data-test="wallet-name-link"][normalize-space(.)="${name}"]`
    );
  }

  get heading() {
    return $('[data-test="wallet-detail-title"]');
  }

  get keycloakId() {
    return $('[data-test="wallet-keycloak-id"]');
  }

  get keycloakUser() {
    return $('[data-test="wallet-keycloak-user"]');
  }

  get bindButton() {
    return $('[data-test="bind-keycloak-account"]');
  }

  get dialog() {
    return $('[data-test="bind-keycloak-dialog"]');
  }

  get searchInput() {
    return $('[data-test="keycloak-account-search"]');
  }

  accountOptions() {
    return $$('[data-test="keycloak-account-option"]');
  }

  get submitButton() {
    return $('[data-test="bind-keycloak-submit"]');
  }

  async openWallet(name) {
    const link = this.walletNameLink(name);
    await link.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: `Expected the wallet "${name}" on the wallet list`,
    });
    await link.click();
  }

  async waitForPage(name) {
    await this.heading.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the wallet detail page to open',
    });
    await browser.waitUntil(
      async () => (await this.heading.getText()).trim() === name,
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: `Expected the detail page for "${name}"`,
      }
    );
  }

  async waitForEmptyKeycloakId() {
    // waitForExist, not waitForDisplayed: an empty field has no height, so
    // webdriver reports it as not displayed.
    await this.keycloakId.waitForExist({ timeout: 10000 });
    await browser.waitUntil(
      async () => (await this.keycloakId.getText()).trim() === '',
      {
        timeout: 10000,
        interval: 500,
        timeoutMsg: 'Expected this wallet to carry no keycloak id yet',
      }
    );
  }

  async openBindDialog() {
    await this.bindButton.waitForDisplayed({ timeout: 10000 });
    await this.bindButton.click();
    await this.dialog.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Expected the bind dialog to open',
    });
  }

  async searchAndPickFirst(term) {
    await this.searchInput.waitForDisplayed({ timeout: 10000 });
    await this.searchInput.setValue(term);

    await browser.waitUntil(
      async () => (await this.accountOptions()).length > 0,
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: `Expected a keycloak account matching "${term}"`,
      }
    );

    const [first] = await this.accountOptions();
    await first.click();
    await this.submitButton.click();
  }

  async waitForBoundAccount() {
    await browser.waitUntil(
      async () => (await this.keycloakId.getText()).trim().length > 0,
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: 'Expected the keycloak id to appear after binding',
      }
    );

    await this.keycloakUser.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the keycloak account info beside the id',
    });
  }
}

module.exports = new WalletDetailPage();
