const CAPTURE_CARD = '[id^="card_"]';
const CARD_WRAPPER = 'div[class*="cardWrapper"]';
const PLACEHOLDER_WRAPPER = `${CARD_WRAPPER}[class*="placeholderCard"]`;
const REAL_CARD = `${CARD_WRAPPER}:not([class*="placeholderCard"]) > ${CAPTURE_CARD}`;

class VerifyPage {
  get menuItem() {
    return $('a=Verify');
  }

  get captureCountHeading() {
    return $('//h5[contains(., "capture")]');
  }

  get selectedCapturesLabel() {
    return $('//*[contains(text(), "Quantity of selected Captures")]');
  }

  get submitButton() {
    return $('button=SUBMIT');
  }

  captureCards() {
    return $$(REAL_CARD);
  }

  placeholderCards() {
    return $$(PLACEHOLDER_WRAPPER);
  }

  /*
   * A failed approval surfaces as a window.alert. Chromedriver dismisses those
   * by default, so surface the text as a test failure instead of letting the
   * next command blow up with UnexpectedAlertOpenError.
   */
  async assertNoBlockingAlert() {
    const isOpen = await browser.isAlertOpen().catch(() => false);

    if (!isOpen) {
      return;
    }

    const text = await browser.getAlertText().catch(() => 'unknown alert');
    await browser.acceptAlert().catch(() => {});

    throw new Error(`The verify page raised an alert: "${text}"`);
  }

  async open() {
    await this.menuItem.waitForDisplayed({
      timeout: 60000,
      timeoutMsg: 'Expected the Verify menu item to be visible after login',
    });
    await this.menuItem.click();
    await this.waitForPage();
  }

  async waitForPage() {
    const baseUrl = browser.options.baseUrl;

    await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl();

        if (!baseUrl || !currentUrl.startsWith(baseUrl)) {
          return false;
        }

        return new URL(currentUrl).pathname === '/verify';
      },
      {
        timeout: 60000,
        interval: 500,
        timeoutMsg: 'Expected navigation to the verify page',
      }
    );

    await this.captureCountHeading.waitForDisplayed({
      timeout: 60000,
      timeoutMsg: 'Expected the capture count heading on the verify page',
    });
  }

  /*
   * Placeholder cards are rendered while the capture list is loading, so an
   * empty placeholder set means the list has settled.
   */
  async waitForListLoaded() {
    await browser.waitUntil(
      async () => {
        await this.assertNoBlockingAlert();
        const placeholders = await this.placeholderCards();
        return placeholders.length === 0;
      },
      {
        timeout: 60000,
        interval: 500,
        timeoutMsg: 'Expected the capture list to finish loading',
      }
    );
  }

  async waitForCaptures() {
    await this.waitForListLoaded();

    await browser.waitUntil(
      async () => {
        const cards = await this.captureCards();
        return cards.length > 0;
      },
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: 'Expected at least one capture on the verify list',
      }
    );
  }

  async waitForNoCaptures() {
    await this.waitForListLoaded();

    await browser.waitUntil(
      async () => {
        const heading = await this.captureCountHeading.getText();
        return /^0\s+captures$/.test(heading.trim());
      },
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg:
          'Expected the verify page to report 0 captures for this organization',
      }
    );

    const cards = await this.captureCards();

    if (cards.length > 0) {
      throw new Error(
        `Expected an empty verify list but found ${cards.length} capture(s); ` +
          'captures from other organizations are leaking into this list'
      );
    }
  }

  async selectedCapturesCount() {
    const label = await this.selectedCapturesLabel.getText();
    const match = label.match(/:\s*(\d+)\s*\//);
    return match ? Number(match[1]) : 0;
  }

  async selectCapture(card) {
    await card.scrollIntoView();
    await card.click();

    await browser.waitUntil(
      async () => (await this.selectedCapturesCount()) > 0,
      {
        timeout: 10000,
        interval: 250,
        timeoutMsg: 'Expected the clicked capture to be selected',
      }
    );
  }

  async submit() {
    await this.submitButton.waitForDisplayed({ timeout: 10000 });

    await browser.waitUntil(async () => this.submitButton.isEnabled(), {
      timeout: 10000,
      interval: 250,
      timeoutMsg:
        'Expected the SUBMIT button to be enabled once a capture is selected',
    });

    await this.submitButton.click();
  }

  async waitForCaptureApproved(cardId) {
    await browser.waitUntil(
      async () => {
        await this.assertNoBlockingAlert();
        const placeholders = await this.placeholderCards();

        if (placeholders.length > 0) {
          return false;
        }

        return !(await $(`#${cardId}`).isExisting());
      },
      {
        timeout: 120000,
        interval: 1000,
        timeoutMsg: `Expected capture "${cardId}" to leave the verify list after approval`,
      }
    );
  }

  async verifyFirstCapture() {
    await this.waitForCaptures();

    const cards = await this.captureCards();
    const firstCard = cards[0];
    const cardId = await firstCard.getAttribute('id');

    await this.selectCapture(firstCard);
    await this.submit();
    await this.waitForCaptureApproved(cardId);
  }
}

module.exports = new VerifyPage();
