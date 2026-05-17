class ReauthenticatePage {
  get reauthAlert() {
    return $('.alert-info .kc-feedback-text');
  }

  get passwordInput() {
    return $('#password');
  }

  get submitButton() {
    return $('#kc-login');
  }

  async isOpen() {
    return this.reauthAlert.isExisting().catch(() => false);
  }

  async waitForPage() {
    await this.reauthAlert.waitForDisplayed({
      timeout: 60000,
      timeoutMsg:
        'Expected Keycloak re-authenticate prompt before update password',
    });
    await this.passwordInput.waitForDisplayed({ timeout: 10000 });
  }

  async enterPassword(password) {
    await this.waitForPage();
    await this.passwordInput.setValue(password);
  }

  async submit() {
    await this.submitButton.waitForDisplayed({ timeout: 10000 });
    await this.submitButton.click();
  }
}

module.exports = new ReauthenticatePage();
