class CapturePage {
  get heading() {
    return $('//h5[normalize-space(text())="Captures"]');
  }

  get table() {
    return $('[data-testid="captures-table"]');
  }

  get rows() {
    return $$('[data-testid="captures-table-body"] tr');
  }

  get paginationCaptions() {
    return $$('.MuiTablePagination-caption');
  }

  // Login reloads the document, so these entries belong to the current user.
  async captureRequestUrls() {
    return browser.execute(() =>
      performance
        .getEntriesByType('resource')
        .map((entry) => entry.name)
        .filter((name) => name.includes('/trees'))
    );
  }

  // "1-25 of 112058" in the pagination is the only place the page prints the
  // total. The other caption is the rows per page label.
  async total() {
    for (const caption of await this.paginationCaptions) {
      const match = (await caption.getText()).match(/of\s+([\d,]+)/);

      if (match) {
        return Number(match[1].split(',').join(''));
      }
    }

    return null;
  }

  async waitForPage() {
    await this.heading.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the capture page heading',
    });

    await this.table.waitForDisplayed({
      timeout: 30000,
      timeoutMsg: 'Expected the capture table to render',
    });

    // The table paints before the fetches start, and the pagination reads
    // "0-0 of 0" until the count lands, so wait for both requests first.
    await browser.waitUntil(
      async () => {
        const urls = await this.captureRequestUrls();

        return (
          urls.some((url) => url.includes('/trees/count')) &&
          urls.some((url) => !url.includes('/trees/count'))
        );
      },
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: 'Expected the capture page to request captures and a count',
      }
    );

    // Then wait for the table to show the result: rows, or a genuine empty set.
    await browser.waitUntil(
      async () => {
        const total = await this.total();

        if (total === null) {
          return false;
        }

        return total === 0 || (await this.rows).length > 0;
      },
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: 'Expected the capture table to finish loading',
      }
    );
  }
}

module.exports = new CapturePage();
