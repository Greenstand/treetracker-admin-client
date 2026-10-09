import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(
  path.join(__dirname, '../../public/app.html'),
  'utf8'
);
const pageScript = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// Runs the page against the current url. jsdom cannot navigate, so the page's
// own redirect is a no-op here and only the urls it builds are asserted.
function links(search) {
  window.history.replaceState({}, '', `/app.html${search}`);
  document.body.innerHTML = '<p id="status"></p>';
  window.eval(pageScript);
  return window.treetrackerLinks;
}

// what the app receives: Play decodes the referrer, then the app parses it
function referrerParams(search) {
  const referrer = new URL(links(search).storeUrl()).searchParams.get(
    'referrer'
  );
  return new URLSearchParams(referrer);
}

describe('app.html', () => {
  // the page redirects on load; jsdom cannot navigate and logs that it did not
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
    jest.clearAllTimers();
  });

  it('opens the app deeplink the app already parses', () => {
    expect(links('?org_id=42&org_name=Acme').appUrl()).toBe(
      'app://mobile.treetracker.org/org?id=42&name=Acme'
    );
  });

  it('falls back to the play listing for the right package', () => {
    const url = new URL(links('?org_id=42&org_name=Acme').storeUrl());
    expect(url.origin + url.pathname).toBe(
      'https://play.google.com/store/apps/details'
    );
    expect(url.searchParams.get('id')).toBe(
      'org.greenstand.android.TreeTracker'
    );
  });

  it('carries the org through the referrer', () => {
    const params = referrerParams('?org_id=42&org_name=Acme%20Trees');
    expect(params.get('org_id')).toBe('42');
    expect(params.get('org_name')).toBe('Acme Trees');
  });

  it('keeps an org name containing & and =', () => {
    const params = referrerParams('?org_id=9&org_name=A%26B%3DC%20Trees');
    expect(params.get('org_id')).toBe('9');
    expect(params.get('org_name')).toBe('A&B=C Trees');
  });

  it('omits the referrer when the link carries no org', () => {
    expect(links('').storeUrl()).not.toContain('referrer');
  });
});
