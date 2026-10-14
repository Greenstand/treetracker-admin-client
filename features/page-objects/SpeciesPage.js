class SpeciesPage {
  get heading() {
    return $('//h2[normalize-space(.)="Species"]');
  }

  get unauthorizedMessage() {
    return $(
      '//*[contains(normalize-space(.), "You are not authorized to view this page")]'
    );
  }

  async waitForPage() {
    await this.heading.waitForDisplayed({
      timeout: 60000,
      timeoutMsg: 'Expected the species page heading to be visible',
    });
  }

  async waitForUnauthorized() {
    await this.unauthorizedMessage.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the species page to refuse an organization user',
    });
  }
}

module.exports = new SpeciesPage();
