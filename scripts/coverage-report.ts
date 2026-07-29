/* Coverage map — the computed answer to "where is the bank thin?".
   Text by default; `--html [path]` writes the visual heatmap, and
   `--body [path]` writes body-only HTML (for embedding).

     npm run coverage
     npm run coverage:html            # → coverage-map.html
     tsx scripts/coverage-report.ts --body out.html

   Derived live from the bank against the USMLE-outline taxonomy. */

import { writeFileSync } from 'node:fs';
import { CONCEPTS, ITEMS } from '../src/content/bank';
import {
  computeCoverage, ROTATIONS, TIER_ORDER,
  type CoverageReport, type DepthTier, type SubtopicCoverage,
} from '../src/content/coverage';
import { renderCoverageHtml, renderCoverageBody } from './coverage-html';

const report = computeCoverage(CONCEPTS, ITEMS);

const mode = process.argv[2];
if (mode === '--html' || mode === '--body') {
  const out = process.argv[3] ?? (mode === '--html' ? 'coverage-map.html' : 'coverage-body.html');
  const html = mode === '--html' ? renderCoverageHtml(report) : renderCoverageBody(report);
  writeFileSync(out, html);
  console.log(`wrote ${out} (${report.totals.concepts} concepts, ${report.totals.items} vignettes)`);
} else {
  printText(report);
}

function pad(s: string | number, n: number): string {
  return String(s).padEnd(n);
}

function printText(r: CoverageReport): void {
  const t = r.totals;
  console.log(
    `\nCOVERAGE MAP — ${t.concepts} concepts, ${t.items} vignettes across ` +
      `${t.systems} systems and ${t.subtopics} subtopics\n`,
  );
  console.log(
    `subtopics: ${t.subtopicsCovered}/${t.subtopics} covered, ${t.subtopics - t.subtopicsCovered} empty   ·   ` +
      `variety-floor concepts: ${t.deepConcepts}/${t.concepts}`,
  );
  console.log(
    `tiers:     ` +
      TIER_ORDER.map((tier) => `${tier} ${r.tiers[tier]}`).join('  ·  '),
  );
  console.log(
    `boards:    Step1 ${r.boards.step1.concepts}c/${r.boards.step1.items}i   ` +
      `Step2 ${r.boards.step2.concepts}c/${r.boards.step2.items}i   ` +
      `Step3 ${r.boards.step3.concepts}c/${r.boards.step3.items}i`,
  );
  console.log(
    `rotations: ` +
      ROTATIONS.map((rot) => `${rot} ${r.rotations[rot].items}`).join('  ·  '),
  );
  const rs = r.reviewStatus;
  console.log(
    `review:    ${rs.validated} validated · ${rs.in_review} in review · ` +
      `${rs.unreviewed} unreviewed · ${rs.flagged} flagged`,
  );

  // ── per-system table ──
  console.log(
    `\n${pad('SYSTEM', 26)}${pad('sub cov', 9)}${pad('conc', 6)}${pad('item', 6)}` +
      `${pad('deep', 6)}${pad('S1/S2/S3', 14)}tiers b/s/c/d`,
  );
  console.log('─'.repeat(86));
  for (const s of r.systems) {
    const tierStr = `${s.tiers.bare}/${s.tiers.seed}/${s.tiers.covered}/${s.tiers.deep}`;
    const boardStr = `${s.boards.step1}/${s.boards.step2}/${s.boards.step3}`;
    console.log(
      pad(s.name + (s.crossCutting ? ' *' : ''), 26) +
        pad(`${s.subtopicsCovered}/${s.subtopics}`, 9) +
        pad(s.concepts, 6) +
        pad(s.items, 6) +
        pad(s.deepConcepts, 6) +
        pad(boardStr, 14) +
        tierStr,
    );
  }

  // ── gaps ──
  const byKind = new Map<string, typeof r.gaps>();
  for (const g of r.gaps) {
    const list = byKind.get(g.kind) ?? [];
    list.push(g);
    byKind.set(g.kind, list);
  }
  const empty = byKind.get('empty') ?? [];
  const thin = byKind.get('thin') ?? [];
  const shallow = byKind.get('shallow') ?? [];
  const board = byKind.get('board') ?? [];

  console.log(`\nTOP GAPS  (${r.gaps.length} total)`);
  console.log(
    `  empty subtopics:  ${empty.length}` +
      (empty.length ? `\n    ` + empty.slice(0, 18).map((g) => `[${short(g.system)}] ${g.ref}`).join('\n    ') : ''),
  );
  if (empty.length > 18) console.log(`    …and ${empty.length - 18} more`);
  console.log(`  thin subtopics:   ${thin.length}` +
    (thin.length ? `\n    ` + thin.slice(0, 12).map((g) => `[${short(g.system)}] ${g.ref} — ${g.detail}`).join('\n    ') : ''));
  console.log(`  board gaps:       ${board.length} covered subtopics missing a board level`);
  console.log(`  single-vignette concepts (variety floor): ${shallow.length}`);
  console.log('');
}

function short(system: string): string {
  return system.length > 10 ? system.slice(0, 10) : system;
}

// referenced only to keep the type import meaningful in future edits
export type { SubtopicCoverage, DepthTier };
