const CARD_WRAPPER = 'div[class*="cardWrapper"]';
const PLACEHOLDER_WRAPPER = `${CARD_WRAPPER}[class*="placeholderCard"]`;
const REAL_CARD = `${CARD_WRAPPER}:not([class*="placeholderCard"]) > [id^="card_"]`;

class GrowersPage {
  get heading() {
    return $('//h5[normalize-space(.)="Growers"]');
  }

  growerCards() {
    return $$(REAL_CARD);
  }

  placeholderCards() {
    return $$(PLACEHOLDER_WRAPPER);
  }

  async waitForListPage() {
    const baseUrl = browser.options.baseUrl;

    await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl();

        if (!baseUrl || !currentUrl.startsWith(baseUrl)) {
          return false;
        }

        return new URL(currentUrl).pathname === '/growers';
      },
      {
        timeout: 60000,
        interval: 500,
        timeoutMsg: 'Expected navigation to the grower list page',
      }
    );

    await this.heading.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Expected the Growers page heading to appear',
    });

    await browser.waitUntil(
      async () => (await this.placeholderCards()).length === 0,
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: 'Expected the grower list to finish loading',
      }
    );
  }

  async waitForGrower(name) {
    const lowerName = name.toLowerCase();

    await browser.waitUntil(
      async () => {
        const cards = await this.growerCards();
        const names = await Promise.all(
          cards.map((card) => card.getText().catch(() => ''))
        );
        return names.some((text) => text.toLowerCase().includes(lowerName));
      },
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: `Expected the grower "${name}" on the grower list`,
      }
    );
  }
}

module.exports = new GrowersPage();
