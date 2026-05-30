class UpdatePasswordPage {
  get updateForm() {
    return $('#kc-passwd-update-form');
  }

  get newPasswordInput() {
    return $('#password-new');
  }

  get confirmPasswordInput() {
    return $('#password-confirm');
  }

  get submitButton() {
    return $('#kc-passwd-update-form input[type="submit"]');
  }

  async isOpen() {
    return this.updateForm.isExisting().catch(() => false);
  }

  async waitForPage() {
    await this.updateForm.waitForExist({
      timeout: 60000,
      timeoutMsg: 'Expected Keycloak update password page',
    });
    await this.newPasswordInput.waitForDisplayed({ timeout: 10000 });
    await this.confirmPasswordInput.waitForDisplayed({ timeout: 10000 });
  }

  async fillNewPassword(password) {
    await this.waitForPage();
    await this.newPasswordInput.setValue(password);
  }

  async confirmNewPassword(password) {
    await this.confirmPasswordInput.setValue(password);
  }

  async submit() {
    await this.submitButton.waitForDisplayed({ timeout: 10000 });
    await this.submitButton.click();
  }
}

module.exports = new UpdatePasswordPage();
