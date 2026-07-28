/* ══════════════════════════════════════════════════════════════
   Content review runner (CLI).

   Drives the multi-reviewer pipeline (src/content/reviewPipeline.ts)
   that validates concepts against external PUBLIC sources. The pipeline
   is provider-agnostic; this CLI wires reviewers to it and prints
   ReviewRecords ready to merge into src/content/reviews.ts.

   Usage:
     npx tsx scripts/review-content.ts            # dry run: show the
                                                  # queue + a sample prompt
     npx tsx scripts/review-content.ts --mock     # run the mock reviewers
                                                  # end-to-end, print records
     npx tsx scripts/review-content.ts --mock --limit 5 --out reviews.json

   Adding REAL reviewers (the point — "multiple LLMs against several
   sources"): implement the `Reviewer` port for each provider and push
   it into `reviewers` below. A sketch for two independent families:

     const anthropic: Reviewer = {
       id: 'claude-opus-4-8', kind: 'llm', family: 'anthropic',
       async review(prompt) {
         const r = await fetch('https://api.anthropic.com/v1/messages', {
           method: 'POST',
           headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY!,
                      'anthropic-version': '2023-06-01',
                      'content-type': 'application/json' },
           body: JSON.stringify({ model: 'claude-opus-4-8', max_tokens: 1024,
             messages: [{ role: 'user', content: prompt }] }),
         });
         return parseVerdict(await r.text()); // extract the JSON block
       },
     };
     const openai: Reviewer = { id: 'gpt-...', family: 'openai', ... };

   Two DISTINCT families each returning "pass" with ≥2 sources promotes
   a concept to `validated` (src/content/review.ts). Same family twice
   does not — independence is the whole point.
   ══════════════════════════════════════════════════════════════ */

import { writeFileSync } from 'node:fs';
import { CONCEPTS, ITEMS } from '../src/content/bank';
import { reviewStatus, reviewStatusOf, reviewBreakdown } from '../src/content/review';
import {
  buildReviewPrompt,
  mockReviewer,
  reviewQueue,
  runReview,
  type Reviewer,
} from '../src/content/reviewPipeline';

const args = process.argv.slice(2);
const useMock = args.includes('--mock');
const limitArg = args.indexOf('--limit');
const limit = limitArg >= 0 ? Number(args[limitArg + 1]) : Infinity;
const outArg = args.indexOf('--out');
const outFile = outArg >= 0 ? args[outArg + 1] : undefined;

const itemsByConcept = (id: string) => ITEMS.filter((i) => i.conceptId === id);

const breakdown = reviewBreakdown(CONCEPTS);
const queue = reviewQueue(CONCEPTS).filter((c) => itemsByConcept(c.conceptId).length > 0);

console.log(
  `review status — validated ${breakdown.validated}, in_review ${breakdown.in_review}, ` +
    `unreviewed ${breakdown.unreviewed}, flagged ${breakdown.flagged}`,
);
console.log(`${queue.length} concept(s) with content are not yet validated.\n`);

// The REAL reviewers go here. Empty by default so a dry run needs no keys.
const realReviewers: Reviewer[] = [];

// Two independent mock families demonstrate a full pass → `validated`.
const reviewers: Reviewer[] = useMock
  ? [mockReviewer('mock-anthropic', 'anthropic'), mockReviewer('mock-openai', 'openai')]
  : realReviewers;

async function main(): Promise<void> {
  if (reviewers.length === 0) {
    // Dry run — show the operator exactly what a reviewer is asked.
    const sample = queue[0];
    if (sample) {
      console.log(`Sample review prompt for "${sample.name}":\n`);
      console.log(buildReviewPrompt(sample, itemsByConcept(sample.conceptId)));
      console.log('\n(run with --mock to execute the pipeline, or wire real reviewers — see the header.)');
    }
    return;
  }

  const batch = queue.slice(0, Number.isFinite(limit) ? limit : queue.length);
  console.log(`Reviewing ${batch.length} concept(s) with: ${reviewers.map((r) => r.id).join(', ')}\n`);
  const records = await runReview(reviewers, batch, itemsByConcept);

  // Report what the new records WOULD do to each concept's status.
  for (const c of batch) {
    const merged = [...(c.reviews ?? []), ...(records[c.conceptId] ?? [])];
    console.log(`  ${c.conceptId}: ${reviewStatus(c)} → ${reviewStatusOf(merged)}`);
  }

  const json = JSON.stringify(records, null, 2);
  if (outFile) {
    writeFileSync(outFile, json);
    console.log(`\nWrote records to ${outFile} — merge into src/content/reviews.ts.`);
  } else {
    console.log(`\nRecords (merge into src/content/reviews.ts):\n${json}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
