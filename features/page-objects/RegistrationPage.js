class RegistrationPage {
  get pageTitle() {
    return $('#kc-page-title');
  }

  get registerForm() {
    return $('#kc-register-form');
  }

  get firstNameInput() {
    return $('#firstName');
  }

  get lastNameInput() {
    return $('#lastName');
  }

  get emailInput() {
    return $('#email');
  }

  get usernameInput() {
    return $('#username');
  }

  get passwordInput() {
    return $('#password');
  }

  get passwordConfirmInput() {
    return $('#password-confirm');
  }

  get submitButton() {
    return $('#kc-form-buttons input[type="submit"]');
  }

  async isOpen() {
    return this.registerForm.isExisting();
  }

  async waitForPage() {
    await this.registerForm.waitForExist({
      timeout: 60000,
      timeoutMsg: 'Expected to be redirected to the Keycloak registration page',
    });

    await this.pageTitle.waitForDisplayed({ timeout: 10000 });
    await this.firstNameInput.waitForDisplayed({ timeout: 10000 });
    await this.lastNameInput.waitForDisplayed({ timeout: 10000 });
    await this.emailInput.waitForDisplayed({ timeout: 10000 });
    await this.usernameInput.waitForDisplayed({ timeout: 10000 });
    await this.passwordInput.waitForDisplayed({ timeout: 10000 });
    await this.passwordConfirmInput.waitForDisplayed({ timeout: 10000 });
  }

  async fillRegistrationDetails(details) {
    await this.waitForPage();

    await this.firstNameInput.setValue(details.firstName);
    await this.lastNameInput.setValue(details.lastName);
    await this.emailInput.setValue(details.email);
    await this.usernameInput.setValue(details.username);
    await this.passwordInput.setValue(details.password);
    await this.passwordConfirmInput.setValue(details.password);
  }

  async submit() {
    await this.submitButton.waitForDisplayed({ timeout: 10000 });
    await this.submitButton.click();
  }
}

module.exports = new RegistrationPage();
