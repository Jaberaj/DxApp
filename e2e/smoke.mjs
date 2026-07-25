/* End-to-end smoke: load the app, run a full 12-item set, reach the
   summary, and confirm state survives a reload.
   Run with:  npm run build && npm run test:e2e
   Set CHROMIUM_PATH to use a system Chromium instead of the
   Playwright-managed one. */
import { chromium } from 'playwright';
import { preview } from 'vite';

const server = await preview({ preview: { port: 4173, strictPort: true } });
const BASE = 'http://localhost:4173';

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.focusbar');

  // Focus screen round-trip
  await page.click('.focusbar');
  await page.waitForSelector('#focusGrid .opt-tile');
  await page.click('#saveFocus');
  await page.waitForSelector('.focusbar');

  // A full drill set
  await page.click('.task:not(.locked)');
  for (let i = 0; i < 12; i++) {
    await page.waitForSelector('.opts:not(.locked) .opt');
    const lab = await page.textContent('.item-lab');
    const n = Number(lab.match(/pick (\d+)/)?.[1] ?? 1);
    const opts = page.locator('.opt');
    const count = await opts.count();
    for (let k = 0; k < n; k++) await opts.nth(k % count).click();
    await page.click('#checkBtn'); // Check
    await page.waitForSelector('.result');
    await page.click('#checkBtn'); // Next / Finish
  }

  await page.waitForSelector('.figs');
  const headline = (await page.textContent('h2.big')).trim();
  if (!/^\d+ of 12$/.test(headline)) throw new Error(`bad summary headline: ${headline}`);

  // Streak registered and persists across reload
  await page.click('.btn.quiet');
  await page.waitForSelector('.streak-chip');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.streak-chip');
  const streak = (await page.textContent('.streak-chip')).trim();
  if (streak !== '1') throw new Error(`streak did not persist: ${streak}`);

  if (errors.length) throw new Error(`page errors: ${errors.join('; ')}`);
  console.log(`smoke ok — ${headline}, streak persisted`);
} finally {
  await browser.close();
  await server.close();
}
