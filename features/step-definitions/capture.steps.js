const { Then } = require('@cucumber/cucumber');

const CapturePage = require('../page-objects/CapturePage');

const ORGANIZATION_SCOPED = /\/organization\/\d+\/trees/;

Then('I can see the capture page', async () => {
  await CapturePage.waitForPage();
});

Then('the capture request covers the whole platform', async () => {
  const urls = await CapturePage.captureRequestUrls();
  const scoped = urls.filter((url) => ORGANIZATION_SCOPED.test(url));

  if (scoped.length > 0) {
    throw new Error(
      `Expected no organization scoped request, got ${scoped.join(', ')}`
    );
  }
});

Then('the capture request is scoped to my organization', async () => {
  const urls = await CapturePage.captureRequestUrls();

  if (!urls.some((url) => ORGANIZATION_SCOPED.test(url))) {
    throw new Error(
      `Expected an organization scoped request, got ${urls.join(', ')}`
    );
  }
});
