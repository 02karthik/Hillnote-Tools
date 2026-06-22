#!/usr/bin/env node
// takescreenshot.js — Capture a tool's index.html into screenshots/<folder>.webp
//
// Usage:   node takescreenshot.js <folder-name>
// Example: node takescreenshot.js ambient-sounds
//
// Renders <folder>/index.html in headless Chrome at the catalog's standard
// 800×500 frame and writes (or replaces) screenshots/<folder>.webp.

import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WIDTH = 800;
const HEIGHT = 500;
const QUALITY = 92;

// Candidate browser executables — first one that exists wins.
// Override with CHROME_PATH=/path/to/browser node takescreenshot.js <folder>
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].filter(Boolean);

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    console.error('Could not find Chrome. Set CHROME_PATH to your browser binary and retry.');
    process.exit(1);
  }
  return found;
}

async function main() {
  const folder = process.argv[2];
  if (!folder) {
    console.error('Usage: node takescreenshot.js <folder-name>');
    process.exit(1);
  }

  const htmlPath = join(resolve(__dirname, folder), 'index.html');
  if (!existsSync(htmlPath)) {
    console.error(`No index.html found at ${htmlPath}`);
    process.exit(1);
  }

  const outDir = resolve(__dirname, 'screenshots');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${folder}.webp`);

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
  });

  try {
    const page = await browser.newPage();
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
    // Let web fonts and any entry transitions settle before capturing.
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: outPath,
      type: 'webp',
      quality: QUALITY,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    console.log(`Saved ${outPath} (${WIDTH}×${HEIGHT})`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
