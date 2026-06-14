class LoginPage {
  get pageTitle() {
    return $('#kc-page-title');
  }

  get loginForm() {
    return $('#kc-form-login');
  }

  get usernameInput() {
    return $('#username');
  }

  get passwordInput() {
    return $('#password');
  }

  get submitButton() {
    return $('#kc-login');
  }

  get registerLink() {
    return $('#kc-registration a');
  }

  get forgotPasswordLink() {
    return $('a[href*="reset-credentials"]');
  }

  get passwordResetSuccessAlert() {
    return $('.alert-success.pf-m-success .kc-feedback-text');
  }

  get invalidCredentialsError() {
    return $('#input-error');
  }

  async isOpen() {
    return this.loginForm.isExisting();
  }

  async waitForPage() {
    await this.loginForm.waitForExist({
      timeout: 60000,
      timeoutMsg: 'Expected to be redirected to the Keycloak sign-in page',
    });

    await this.pageTitle.waitForDisplayed({ timeout: 10000 });
    await this.usernameInput.waitForDisplayed({ timeout: 10000 });
    await this.passwordInput.waitForDisplayed({ timeout: 10000 });
  }

  async enterCredentials(username, password) {
    await this.waitForPage();
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
  }

  async submit() {
    await this.submitButton.waitForDisplayed({ timeout: 10000 });
    await this.submitButton.click();
  }

  async openRegistrationPage() {
    await this.waitForPage();
    await this.registerLink.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Expected register link on the Keycloak sign-in page',
    });
    await this.registerLink.click();
  }

  async openForgotPasswordPage() {
    await this.waitForPage();
    await this.forgotPasswordLink.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Expected forgot password link on the Keycloak sign-in page',
    });
    await this.forgotPasswordLink.click();
  }

  async waitForPasswordResetConfirmation() {
    await this.waitForPage();

    await this.passwordResetSuccessAlert.waitForDisplayed({
      timeout: 10000,
      timeoutMsg:
        'Expected Keycloak to show a password reset confirmation message',
    });
  }

  async login(username, password) {
    await this.enterCredentials(username, password);
    await this.submit();
  }

  async waitForInvalidCredentials() {
    await this.waitForPage();

    await this.invalidCredentialsError.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Expected Keycloak to show invalid credential feedback',
    });
  }

  async waitForSuccessfulRedirect() {
    const baseUrl = browser.options.baseUrl;

    await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl();

        if (!baseUrl || !currentUrl.startsWith(baseUrl)) {
          return false;
        }

        const currentPath = new URL(currentUrl).pathname;
        return currentPath !== '/login' && currentPath !== '/auth/callback';
      },
      {
        timeout: 60000,
        interval: 500,
        timeoutMsg: 'Expected successful login to redirect back to the app',
      }
    );
  }
}

module.exports = new LoginPage();
