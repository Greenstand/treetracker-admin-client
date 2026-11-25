class BindingPage {
  get bindLink() {
    return $('[data-testid="home-bind-organization"]');
  }

  get homePending() {
    return $('[data-testid="home-binding-pending"]');
  }

  get homeMember() {
    return $('[data-testid="home-organization-member"]');
  }

  get pendingMessage() {
    return $('[data-testid="binding-pending"]');
  }

  get rejectedMessage() {
    return $('[data-testid="binding-rejected"]');
  }

  get organizationSelect() {
    return $('[data-testid="binding-organization"]');
  }

  get locationInput() {
    return $('#binding-location');
  }

  get submitButton() {
    return $('[data-testid="binding-submit"]');
  }

  get requestsTable() {
    return $('[data-testid="binding-requests"]');
  }

  get requestsTab() {
    return $('[data-testid="tab-binding-requests"]');
  }

  async waitForBindLink() {
    await this.bindLink.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the bind link on the home page',
    });
  }

  async clickBindLink() {
    await this.waitForBindLink();
    await this.bindLink.click();
  }

  // The select renders its options in a portal, so pick by visible text.
  async chooseOrganization(name) {
    const select = await this.organizationSelect;
    await select.waitForDisplayed({ timeout: 30000 });
    await select.click();

    const option = await $(`li=${name}`);
    await option.waitForDisplayed({ timeout: 30000 });
    await option.click();
  }

  // The country field is an Autocomplete, so Enter commits the typed option.
  async proposeCountry(country) {
    const input = await this.locationInput;
    await input.waitForDisplayed({ timeout: 30000 });
    await input.setValue(country);
    await browser.keys('Enter');
  }

  async submit() {
    await this.submitButton.waitForEnabled({ timeout: 30000 });
    await this.submitButton.click();
  }

  async waitForPending() {
    await this.pendingMessage.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the binding page to report a pending request',
    });
  }

  async waitForRejected() {
    await this.rejectedMessage.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the binding page to report a rejected request',
    });
  }

  async waitForHomePending() {
    await this.homePending.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the pending line on the home page',
    });
  }

  async waitForHomeMember(organizationName) {
    await this.homeMember.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the membership line on the home page',
    });

    await browser.waitUntil(
      async () => (await this.homeMember.getText()).includes(organizationName),
      {
        timeout: 10000,
        timeoutMsg: `Expected the membership line to name ${organizationName}`,
      }
    );
  }

  async openRequestsTab() {
    await this.requestsTab.waitForDisplayed({ timeout: 30000 });
    await this.requestsTab.click();
  }

  async waitForRequestFrom(username) {
    await this.requestsTable.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the binding requests table',
    });

    const row = await $(`[data-testid="binding-user-${username}"]`);
    await row.waitForDisplayed({ timeout: 30000 });
  }

  async waitForProposedChange(username, text) {
    const cell = await $(`[data-testid="binding-changes-${username}"]`);
    await cell.waitForDisplayed({ timeout: 30000 });

    await browser.waitUntil(async () => (await cell.getText()).includes(text), {
      timeout: 10000,
      timeoutMsg: `Expected the request to show "${text}"`,
    });
  }

  async decide(username, approved) {
    const testId = approved
      ? `binding-approve-${username}`
      : `binding-reject-${username}`;
    const button = await $(`[data-testid="${testId}"]`);
    await button.waitForDisplayed({ timeout: 30000 });
    await button.click();
  }
}

module.exports = new BindingPage();
