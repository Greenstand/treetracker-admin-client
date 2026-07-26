const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Allure runtime API — used to attach a screenshot when a step fails. Wrapped
// so a missing module (e.g. deps not installed locally) never breaks config load.
let allureReporter = null;
try {
  const allure = require('@wdio/allure-reporter');
  allureReporter = allure.default || allure;
} catch (e) {
  // reporter not available — failure screenshots are simply skipped
}

const SCREENSHOT_DIR = path.resolve('./reports/video/.frames');
const VIDEO_OUTPUT = path.resolve('./reports/video/test-run.mp4');
const CHROMEDRIVER_PATH =
  process.env.CHROMEDRIVER_PATH || path.resolve('./.drivers/chromedriver');
const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';
const HEADLESS = process.env.WDIO_HEADLESS === 'true';
// The screenshot-every-500ms video capture below issues browser commands from a
// timer, outside the test's command flow. That collides with the test's own
// clicks/typing on the single WebDriver session and makes interactions hang, so
// it is OFF by default and opt-in via WDIO_VIDEO=true for local debugging only.
const CAPTURE_VIDEO = process.env.WDIO_VIDEO === 'true';
let screenshotInterval = null;
let frameCount = 0;

function startCapture() {
  frameCount = 0;
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  screenshotInterval = setInterval(async () => {
    try {
      const img = await browser.takeScreenshot();
      const file = path.join(
        SCREENSHOT_DIR,
        `frame-${String(frameCount++).padStart(5, '0')}.png`
      );
      fs.writeFileSync(file, img, 'base64');
    } catch (_) {
      // browser may not be ready yet
    }
  }, 500); // 2 fps
}

function stopCapture() {
  if (screenshotInterval) {
    clearInterval(screenshotInterval);
    screenshotInterval = null;
  }
  if (frameCount === 0) return;
  // stitch frames into mp4
  const result = spawnSync(
    FFMPEG_PATH,
    [
      '-y',
      '-framerate',
      '2',
      '-i',
      path.join(SCREENSHOT_DIR, 'frame-%05d.png'),
      '-vf',
      'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-vcodec',
      'libx264',
      '-preset',
      'fast',
      '-pix_fmt',
      'yuv420p',
      VIDEO_OUTPUT,
    ],
    { stdio: 'pipe' }
  );
  if (result.status === 0) {
    console.log(`\nVideo saved: ${VIDEO_OUTPUT}`);
  } else {
    const details = result.stderr
      ? result.stderr.toString().slice(-300)
      : String(result.error || 'ffmpeg not available');
    console.error('\nffmpeg error:', details);
  }
}

exports.config = {
  runner: 'local',
  specs: ['./features/**/*.feature'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--disable-gpu',
          '--no-sandbox',
          ...(HEADLESS
            ? [
                '--headless=new',
                '--window-size=1920,1080',
                '--disable-dev-shm-usage',
              ]
            : []),
        ],
      },
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost:3001',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [
    [
      'chromedriver',
      {
        chromedriverCustomPath: CHROMEDRIVER_PATH,
      },
    ],
  ],
  framework: '@wdio/cucumber-framework',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: './reports/allure-results',
        disableWebdriverStepsReporting: true,
        useCucumberStepReporter: true,
      },
    ],
  ],
  before() {
    if (CAPTURE_VIDEO) startCapture();
  },
  async after() {
    if (!CAPTURE_VIDEO) return;
    // hold capture for 3s so the final page state (e.g. post-login redirect) is recorded
    await new Promise((resolve) => setTimeout(resolve, 3000));
    stopCapture();
  },
  // Take one screenshot when a step fails and attach it to the Allure report.
  // Runs inside the test flow (not a background timer), so it never competes
  // with the test's own browser commands.
  async afterStep(step, scenario, result) {
    if (result && result.passed) return;
    try {
      const png = await browser.takeScreenshot();
      if (
        allureReporter &&
        typeof allureReporter.addAttachment === 'function'
      ) {
        allureReporter.addAttachment(
          'Screenshot on failure',
          Buffer.from(png, 'base64'),
          'image/png'
        );
      }
    } catch (e) {
      // never let screenshot capture fail the test
    }
  },
  cucumberOpts: {
    require: ['./features/step-definitions/**/*.js'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tags: process.env.WDIO_TAGS || '',
    timeout: 120000,
    ignoreUndefinedDefinitions: false,
  },
};
