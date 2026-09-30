const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const VIDEO_ROOT = path.resolve('./reports/video');
const CHROMEDRIVER_PATH = path.resolve('./.drivers/chromedriver');
const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';
let screenshotInterval = null;
let frameCount = 0;
let framesDir = path.join(VIDEO_ROOT, '.frames');
let videoOutput = path.join(VIDEO_ROOT, 'test-run.mp4');

function specSlug(specPath) {
  if (!specPath) return 'test-run';
  const relative = path
    .relative(path.resolve('./features'), specPath.replace('file://', ''))
    .replace(/\.feature$/, '');
  return relative.split(path.sep).filter(Boolean).join('-') || 'test-run';
}

async function captureFrame() {
  try {
    const img = await browser.takeScreenshot();
    const file = path.join(
      framesDir,
      `frame-${String(frameCount++).padStart(5, '0')}.png`
    );
    fs.writeFileSync(file, img, 'base64');
  } catch (_) {
    // browser may not be ready yet
  }
}

function startCapture(specPath) {
  const slug = specSlug(specPath);
  framesDir = path.join(VIDEO_ROOT, slug, '.frames');
  videoOutput = path.join(VIDEO_ROOT, slug, 'run.mp4');
  frameCount = 0;
  let capturing = false;
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });
  screenshotInterval = setInterval(async () => {
    if (capturing) return;
    capturing = true;
    try {
      await captureFrame();
    } finally {
      capturing = false;
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
      path.join(framesDir, 'frame-%05d.png'),
      '-vf',
      'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-vcodec',
      'libx264',
      '-preset',
      'fast',
      '-pix_fmt',
      'yuv420p',
      videoOutput,
    ],
    { stdio: 'pipe' }
  );
  if (result.status === 0) {
    console.log(`\nVideo saved: ${videoOutput}`);
  } else {
    console.error('\nffmpeg error:', result.stderr.toString().slice(-300));
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
        args: ['--disable-gpu', '--no-sandbox'],
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
        disableWebdriverStepsReporting: false,
        useCucumberStepReporter: true,
      },
    ],
  ],
  before(capabilities, specs) {
    startCapture(specs && specs[0]);
  },
  async afterStep() {
    await captureFrame();
  },
  async after() {
    // hold capture for 3s so the final page state (e.g. post-login redirect) is recorded
    await new Promise((resolve) => setTimeout(resolve, 3000));
    stopCapture();
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
