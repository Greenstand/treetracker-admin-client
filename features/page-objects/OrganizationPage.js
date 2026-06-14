class OrganizationPage {
  get nameInput() {
    return $('#organization-name');
  }

  get emailInput() {
    return $('#organization-email');
  }

  get phoneInput() {
    return $('#organization-phone');
  }

  get websiteInput() {
    return $('#organization-website');
  }

  get logoUrlInput() {
    return $('#organization-logo-url');
  }

  get mapNameInput() {
    return $('#organization-map-name');
  }

  get submitButton() {
    return $('button[type="submit"]');
  }

  get successAlert() {
    return $('div=Organization created successfully.');
  }

  get verifyMenuItem() {
    return $('a=Verify');
  }

  async waitForPage() {
    await this.nameInput.waitForDisplayed({ timeout: 10000 });
    await this.emailInput.waitForDisplayed({ timeout: 10000 });
  }

  async fillOrganizationDetails(details) {
    await this.waitForPage();

    await this.nameInput.setValue(details.name);
    await this.emailInput.setValue(details.email);
    await this.phoneInput.setValue(details.phone);
    await this.websiteInput.setValue(details.website);
    await this.logoUrlInput.setValue(details.logoUrl);
    await this.mapNameInput.setValue(details.mapName);
  }

  async submit() {
    await this.submitButton.waitForDisplayed({ timeout: 10000 });
    await this.submitButton.click();
  }

  async waitForConfirmation() {
    await this.successAlert.waitForDisplayed({
      timeout: 60000,
      timeoutMsg:
        'Expected a confirmation message after submitting organization details',
    });
  }

  async waitForHomeRedirect() {
    const baseUrl = browser.options.baseUrl;

    await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl();

        if (!baseUrl || !currentUrl.startsWith(baseUrl)) {
          return false;
        }

        return new URL(currentUrl).pathname === '/';
      },
      {
        timeout: 60000,
        interval: 500,
        timeoutMsg:
          'Expected organization submit flow to return to the home page',
      }
    );
  }

  async waitForVerifyMenuItem() {
    await this.verifyMenuItem.waitForDisplayed({
      timeout: 60000,
      timeoutMsg:
        'Expected the Verify menu item to be visible after onboarding',
    });
  }
}

module.exports = new OrganizationPage();
