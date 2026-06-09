class AdminPage {
  get organizationManagementMenuItem() {
    return $('a=Organization management');
  }

  get organizationManagementHeading() {
    return $(
      '//*[self::h1 or self::h2 or self::h3 or self::h4][normalize-space(.)="Organization Management"]'
    );
  }

  async waitForOrganizationManagementMenuItem() {
    await this.organizationManagementMenuItem.waitForDisplayed({
      timeout: 60000,
      timeoutMsg:
        'Expected the Organization management menu item to be visible after login',
    });
  }

  async openOrganizationManagement() {
    await this.waitForOrganizationManagementMenuItem();
    await this.organizationManagementMenuItem.click();
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
}

module.exports = new AdminPage();
