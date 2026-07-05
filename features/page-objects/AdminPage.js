class AdminPage {
  menuItem(label) {
    return $(`a=${label}`);
  }

  get organizationManagementHeading() {
    return $(
      '//*[self::h1 or self::h2 or self::h3 or self::h4][normalize-space(.)="Organization Management"]'
    );
  }

  get searchInput() {
    return $('input[placeholder*="Search by name"]');
  }

  get sortDropdown() {
    return $('[aria-labelledby="org-sort-label"]');
  }

  async waitForMenuItem(label) {
    await this.menuItem(label).waitForDisplayed({
      timeout: 60000,
      timeoutMsg: `Expected the "${label}" menu item to be visible after login`,
    });
  }

  async clickMenuItem(label) {
    await this.waitForMenuItem(label);
    await this.menuItem(label).click();
  }

  async waitForOrganizationListPage() {
    const baseUrl = browser.options.baseUrl;

    await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl();

        if (!baseUrl || !currentUrl.startsWith(baseUrl)) {
          return false;
        }

        return new URL(currentUrl).pathname === '/organization-management';
      },
      {
        timeout: 60000,
        interval: 500,
        timeoutMsg:
          'Expected navigation to the organization management list page',
      }
    );

    await this.organizationManagementHeading.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Expected the Organization Management page heading to appear',
    });
  }

  async searchOrganizations(term) {
    await this.searchInput.waitForDisplayed({ timeout: 10000 });
    await this.searchInput.setValue(term);
  }

  async waitForSearchResults(term) {
    const lowerTerm = term.toLowerCase();
    await browser.waitUntil(
      async () => {
        const cells = await $$(
          `//td[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${lowerTerm}')]`
        );
        return cells.length > 0;
      },
      {
        timeout: 10000,
        interval: 500,
        timeoutMsg: `Expected to see at least one organization matching "${term}"`,
      }
    );
  }

  async sortOrganizationsBy(label) {
    await this.sortDropdown.waitForDisplayed({ timeout: 10000 });
    await this.sortDropdown.click();
    const option = await $(
      `//*[@role="listbox"]//*[normalize-space(.)="${label}"]`
    );
    await option.waitForDisplayed({ timeout: 5000 });
    await option.click();
  }

  async waitForSortApplied() {
    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl();
        return url.includes('sort=');
      },
      {
        timeout: 10000,
        interval: 300,
        timeoutMsg:
          'Expected the URL to contain a sort parameter after sorting',
      }
    );
  }
}

module.exports = new AdminPage();
