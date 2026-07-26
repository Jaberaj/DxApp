/* End-to-end smoke: load the app, set a board scope, play all three
   mini-games to completion, and confirm state survives a reload.
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

/** Play one full set, whichever game is open. Returns the "N of M" headline. */
async function playSet() {
  await page.waitForSelector('.opts:not(.locked) .opt');
  // read the set length from the item-lab counter ("Item 1 of 12 · …")
  const firstLab = await page.textContent('.item-lab');
  const total = Number(firstLab.match(/of (\d+)/)?.[1] ?? 0);
  if (!total) throw new Error(`could not read set size from: ${firstLab}`);
  for (let i = 0; i < total; i++) {
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
  return (await page.textContent('h2.big')).trim();
}

try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.focusbar');

  // Focus round-trip: pick a focus and a board level
  await page.click('.focusbar');
  await page.waitForSelector('#focusGrid .opt-tile');
  await page.click('#boardSeg button[data-board="step2"]');
  await page.click('#saveFocus');
  await page.waitForSelector('.focusbar');
  const focusSub = await page.textContent('.focusbar .txt span');
  if (!/Step 2/.test(focusSub)) throw new Error(`board scope not shown: ${focusSub}`);

  // Play each of the four mini-games in turn (incl. Rapid Treatments)
  const gameCount = await page.locator('.task').count();
  if (gameCount < 4) throw new Error(`expected 4 games, saw ${gameCount}`);

  for (let g = 0; g < 4; g++) {
    await page.waitForSelector('.task');
    await page.locator('.task').nth(g).click();
    const headline = await playSet();
    if (!/^\d+ of \d+$/.test(headline)) throw new Error(`bad summary headline: ${headline}`);
    await page.click('.btn.quiet'); // back to today
    await page.waitForSelector('.focusbar');
  }

  // Subtopic filter: course mode → a system → pick a subtopic chip
  await page.click('.focusbar');
  await page.waitForSelector('#modeSeg');
  await page.click('#modeSeg button[data-mode="course"]');
  await page.waitForSelector('#subtopicChips .subchip');
  // pick the first subtopic that has content (not disabled)
  const enabled = page.locator('.subchip:not([disabled])');
  if ((await enabled.count()) === 0) throw new Error('no selectable subtopics');
  await enabled.first().click();
  const match = await page.textContent('#matchCount');
  if (!/\d+ concept/.test(match)) throw new Error(`no match count: ${match}`);
  await page.click('#saveFocus');
  await page.waitForSelector('.focusbar');
  const scope = await page.textContent('.focusbar .txt span');
  if (!/subtopic/.test(scope)) throw new Error(`subtopic scope not shown: ${scope}`);
  // a drill under the narrowed focus still runs
  await page.locator('.task').first().click();
  await playSet();
  await page.click('.btn.quiet');
  await page.waitForSelector('.focusbar');

  // Streak registered and persists across reload
  await page.waitForSelector('.streak-chip');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.streak-chip');
  const streak = (await page.textContent('.streak-chip')).trim();
  if (Number(streak) < 1) throw new Error(`streak did not persist: ${streak}`);

  if (errors.length) throw new Error(`page errors: ${errors.join('; ')}`);
  console.log(`smoke ok — four games + subtopic filter, streak ${streak} persisted`);
} finally {
  await browser.close();
  await server.close();
}
