const CARD_LABELS = [
  'Total Captures',
  'Untagged Captures',
  'Verified Captures',
  'Growers',
];

class HomePage {
  // Each card renders its count in an h3 and its label in the sibling p.
  countFor(label) {
    return $(
      `//p[normalize-space(text())="${label}"]/preceding-sibling::h3[1]`
    );
  }

  get cardLabels() {
    return CARD_LABELS;
  }

  async waitForPage() {
    await this.countFor(CARD_LABELS[0]).waitForExist({
      timeout: 30000,
      timeoutMsg: 'Expected the home page cards to render',
    });
  }

  // The card shows a spinner until its request returns, so wait for a number.
  async readCount(label) {
    const element = this.countFor(label);

    await element.waitForExist({
      timeout: 30000,
      timeoutMsg: `Expected a "${label}" card on the home page`,
    });

    await browser.waitUntil(
      async () => /^[\d,]+$/.test((await element.getText()).trim()),
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: `Expected the "${label}" card to show a count`,
      }
    );

    return Number((await element.getText()).trim().replace(/,/g, ''));
  }

  async readAllCounts() {
    const counts = {};

    for (const label of CARD_LABELS) {
      counts[label] = await this.readCount(label);
    }

    return counts;
  }
}

module.exports = new HomePage();
