class ForgotPasswordPage {
  get pageTitle() {
    return $('#kc-page-title');
  }

  get resetForm() {
    return $('#kc-reset-password-form');
  }

  get usernameInput() {
    return $('#username');
  }

  get submitButton() {
    return $('#kc-reset-password-form input[type="submit"]');
  }

  async isOpen() {
    return this.resetForm.isExisting();
  }

  async waitForPage() {
    await this.resetForm.waitForExist({
      timeout: 60000,
      timeoutMsg:
        'Expected to be redirected to the Keycloak forgot password page',
    });

    await this.pageTitle.waitForDisplayed({ timeout: 10000 });
    await this.usernameInput.waitForDisplayed({ timeout: 10000 });
  }

  async fillEmail(email) {
    await this.waitForPage();
    await this.usernameInput.setValue(email);
  }

  async submit() {
    await this.submitButton.waitForDisplayed({ timeout: 10000 });
    await this.submitButton.click();
  }
}

module.exports = new ForgotPasswordPage();
