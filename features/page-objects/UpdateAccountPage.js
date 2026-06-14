class UpdateAccountPage {
  get updateForm() {
    return $('#kc-update-profile-form');
  }

  get emailInput() {
    return $('#email');
  }

  get firstNameInput() {
    return $('#firstName');
  }

  get lastNameInput() {
    return $('#lastName');
  }

  get submitButton() {
    return $('#kc-update-profile-form input[type="submit"]');
  }

  async isOpen() {
    return this.updateForm.isExisting().catch(() => false);
  }

  async waitForPage() {
    await this.updateForm.waitForExist({
      timeout: 60000,
      timeoutMsg: 'Expected Keycloak update account information page',
    });
    await this.firstNameInput.waitForDisplayed({ timeout: 10000 });
    await this.lastNameInput.waitForDisplayed({ timeout: 10000 });
  }

  async fillFirstName(value) {
    await this.firstNameInput.setValue(value);
  }

  async fillLastName(value) {
    await this.lastNameInput.setValue(value);
  }

  async fillEmail(value) {
    await this.emailInput.setValue(value);
  }

  async submit() {
    await this.submitButton.waitForDisplayed({ timeout: 10000 });
    await this.submitButton.click();
  }
}

module.exports = new UpdateAccountPage();
