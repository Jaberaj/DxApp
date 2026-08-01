/* Dry-run importer for the usmle-knowledge-graph pilot.

   Reads a PINNED snapshot from KG_SNAPSHOT_DIR (the graph's dist/json),
   crosswalks ten existing DxApp Neurology concepts, and produces
   PREVIEW-ONLY candidates + an import report. Nothing here is added to
   the production bank (src/content/bank.ts). See docs/USMLE_KG_INTEGRATION.md.

     KG_SNAPSHOT_DIR=/path/to/usmle-knowledge-graph/dist/json \
       npx tsx scripts/import-usmle-kg.ts
*/

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSnapshot } from '../src/integrations/usmleKg/loadSnapshot';
import { PILOT_CROSSWALK } from '../src/integrations/usmleKg/crosswalk';
import { transformConcept } from '../src/integrations/usmleKg/transformConcept';
import { transformItems } from '../src/integrations/usmleKg/transformItems';
import { STATUS_CAPABILITY } from '../src/integrations/usmleKg/releasePolicy';
import { IMPORTER_VERSION } from '../src/integrations/usmleKg/types';
import type {
  ConceptCandidate, ImportReport, ItemCandidate, KnowledgeGraphProvenance, SkippedCandidate,
} from '../src/integrations/usmleKg/types';

const dir = process.env.KG_SNAPSHOT_DIR;
if (!dir) {
  console.error('KG_SNAPSHOT_DIR is required (point it at the knowledge graph dist/json).');
  process.exit(2);
}

const OUT = join(process.cwd(), 'generated', 'usmle-kg');
const now = new Date().toISOString();

const snapshot = loadSnapshot(dir);

const conceptCandidates: ConceptCandidate[] = [];
const itemCandidates: ItemCandidate[] = [];
const provenance: KnowledgeGraphProvenance[] = [];
const skipped: SkippedCandidate[] = [];
let matched = 0, ambiguous = 0, unmatched = 0, missingReferences = 0;
const sourceStatusCounts: Record<string, number> = {};
const blockedModules = new Set<string>();

for (const x of PILOT_CROSSWALK) {
  const disease = snapshot.diseaseById.get(x.kgDiseaseId);
  if (!disease) { unmatched++; skipped.push({ kgDiseaseId: x.kgDiseaseId, dxAppConceptId: x.dxAppConceptId, intendedType: 'concept', reason: 'crosswalk-unresolved' }); continue; }
  if (x.matchStatus === 'confirmed') matched++;
  else if (x.matchStatus === 'candidate') ambiguous++;
  else unmatched++;

  const cc = transformConcept(x, snapshot, now);
  conceptCandidates.push(cc);
  provenance.push(cc.provenance);
  sourceStatusCounts[cc.importStatus] = (sourceStatusCounts[cc.importStatus] ?? 0) + 1;
  if (cc.resolvedSources.length === 0) missingReferences++;
  if (cc.importStatus === 'blocked') blockedModules.add(disease.organ_system_primary ?? 'Unknown');

  const { candidates, skipped: sk } = transformItems(x, snapshot, now);
  itemCandidates.push(...candidates);
  skipped.push(...sk);
}

// Nothing may reach the production bank in this task.
const productionEligible = [...conceptCandidates, ...itemCandidates].filter(
  (c) => STATUS_CAPABILITY[c.importStatus].productionEligible,
);
const addedToProductionBank = 0;

const skipReasons: Record<string, number> = {};
for (const s of skipped) skipReasons[s.reason] = (skipReasons[s.reason] ?? 0) + 1;

const report: ImportReport = {
  generatedAt: now,
  snapshotDir: dir,
  snapshotCommit: snapshot.sourceCommit,
  contractVersion: snapshot.contractVersion,
  knowledgeBaseVersion: snapshot.knowledgeBaseVersion,
  importerVersion: IMPORTER_VERSION,
  recordsLoaded: snapshot.manifest.record_counts,
  conceptsCrosswalked: PILOT_CROSSWALK.length,
  matched,
  ambiguousMatches: ambiguous,
  unmatched,
  conceptCandidates: conceptCandidates.length,
  itemCandidates: itemCandidates.length,
  skipped: skipped.length,
  skipReasons,
  missingReferences,
  sourceStatusCounts,
  blockedModules: [...blockedModules],
  addedToProductionBank,
};

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'pilot-candidates.json'), JSON.stringify({ conceptCandidates, itemCandidates }, null, 2));
writeFileSync(join(OUT, 'pilot-provenance.json'), JSON.stringify(provenance, null, 2));
writeFileSync(join(OUT, 'import-report.json'), JSON.stringify(report, null, 2));
writeFileSync(join(OUT, 'import-report.md'), renderMarkdown(report, conceptCandidates, skipped));

console.log(`KG pilot: ${matched} confirmed + ${ambiguous} candidate crosswalks; ` +
  `${conceptCandidates.length} concept previews, ${itemCandidates.length} item candidates, ${skipped.length} skipped.`);
console.log(`production-eligible: ${productionEligible.length}; added to bank: ${addedToProductionBank}`);
console.log(`wrote ${OUT}/`);
if (productionEligible.length !== 0 || addedToProductionBank !== 0) {
  console.error('SAFETY VIOLATION: pilot produced production-eligible content'); process.exit(1);
}

function renderMarkdown(r: ImportReport, ccs: ConceptCandidate[], sk: SkippedCandidate[]): string {
  const rows = ccs.map((c) =>
    `| ${c.dxAppConceptId} | ${c.kgDiseaseId} | ${c.name} | ${c.importStatus} | ${c.resolvedSources.length} | ${c.gaps.length} |`,
  ).join('\n');
  const reasons = Object.entries(r.skipReasons).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `- \`${k}\` — ${v}`).join('\n');
  return `# USMLE knowledge-graph import — pilot report (preview only)

_Generated ${r.generatedAt}. **No candidate was added to the production bank.**_

## Snapshot provenance
- Declared source commit (from manifest): \`${r.snapshotCommit}\`
- Application contract version: \`${r.contractVersion}\`
- Knowledge-base version: \`${r.knowledgeBaseVersion}\`
- Importer version: \`${r.importerVersion}\`
- Records loaded: ${Object.entries(r.recordsLoaded).map(([k, v]) => `${k} ${v}`).join(', ')}

> The manifest's declared source commit is recorded independently of the
> checked-out repository HEAD; they are not assumed equal.

## Crosswalk
- Concepts crosswalked: **${r.conceptsCrosswalked}** (confirmed ${r.matched}, candidate ${r.ambiguousMatches}, unmatched ${r.unmatched})

| DxApp concept | KG disease | Name | KG import status | sources | gaps |
|---|---|---|---|---|---|
${rows}

## Candidates
- Concept previews: **${r.conceptCandidates}**
- Item candidates (preview-only): **${r.itemCandidates}**
- Skipped: **${r.skipped}**
- Added to production bank: **${r.addedToProductionBank}**

### Skip reasons
${reasons || '- (none)'}

### Import-status counts
${Object.entries(r.sourceStatusCounts).map(([k, v]) => `- \`${k}\` — ${v}`).join('\n')}

## What this pilot reveals
Neurology is semantically **unaccepted** (Phase 4B), so every candidate is
capped at \`semantic_review_pending\` and is preview-only. The dominant skip
reasons above are the schema gaps the graph must close before its Neurology
content can drive production items — chiefly template/placeholder
\`distinguishing_features\` and presentation prose, and generic treatment
concepts without a disease-specific role. Sources resolved for
${r.conceptsCrosswalked - r.missingReferences}/${r.conceptsCrosswalked} concepts.

_First ${sk.length ? 'skips' : 'items'} traceable in \`import-report.json\` and \`pilot-candidates.json\`._
`;
}
