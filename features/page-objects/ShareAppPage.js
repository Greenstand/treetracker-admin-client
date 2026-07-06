class ShareAppPage {
  menuItem(label) {
    return $(`a*=${label}`);
  }

  text(content) {
    return $(`//*[contains(normalize-space(.), "${content}")]`);
  }

  button(label) {
    return $(`button*=${label}`);
  }

  get shareLink() {
    return $('[data-testid="share-app-link"]');
  }

  get qrCode() {
    return $('[data-testid="share-app-qr"] canvas');
  }

  get notification() {
    return $('[data-testid="share-app-notification"]');
  }

  async openMenuItem(label) {
    const item = this.menuItem(label);
    await item.waitForDisplayed({
      timeout: 60000,
      timeoutMsg: `Expected the "${label}" menu item to be visible`,
    });
    await item.click();
  }

  async waitForText(content) {
    await this.text(content).waitForDisplayed({
      timeout: 20000,
      timeoutMsg: `Expected to see the text "${content}"`,
    });
  }

  async waitForShareLink() {
    await this.shareLink.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: 'Expected the share link to be visible',
    });
  }

  async waitForButton(label) {
    await this.button(label).waitForDisplayed({
      timeout: 20000,
      timeoutMsg: `Expected the "${label}" button to be visible`,
    });
  }

  async clickButton(label) {
    const button = this.button(label);
    await button.waitForClickable({
      timeout: 20000,
      timeoutMsg: `Expected the "${label}" button to be clickable`,
    });
    await button.click();
  }

  async waitForQrCode() {
    await this.qrCode.waitForExist({
      timeout: 20000,
      timeoutMsg: 'Expected the QR code to be rendered',
    });
  }

  async waitForNotification(content) {
    await this.notification.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: `Expected the notification "${content}" to appear`,
    });
    await browser.waitUntil(
      async () => (await this.notification.getText()).includes(content),
      {
        timeout: 20000,
        timeoutMsg: `Expected the notification to read "${content}"`,
      }
    );
  }
}

module.exports = new ShareAppPage();
