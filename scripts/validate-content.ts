/* Build gate. Run before `vite build` (see package.json `prebuild`).
   Exits non-zero on any content error so a malformed bank, a dangling
   reference, or a question-bank citation fails the build. Warnings
   (UNREVIEWED content, empty subtopics) are printed but do not fail. */

import { CONCEPTS, ITEMS } from '../src/content/bank';
import { validateBank } from '../src/content/validation';

const { errors, warnings, stats } = validateBank(CONCEPTS, ITEMS);

console.log(
  `content: ${stats.concepts} concepts, ${stats.items} vignettes, ` +
    `${stats.subtopicsCovered} subtopics covered, ` +
    `${stats.withIllnessScript} with illness scripts`,
);
const rs = stats.reviewStatus;
console.log(
  `review:  ${rs.validated} validated, ${rs.in_review} in review, ` +
    `${rs.unreviewed} unreviewed, ${rs.flagged} flagged`,
);

for (const w of warnings) console.warn(`  warn: ${w}`);

if (errors.length > 0) {
  for (const e of errors) console.error(`  ERROR: ${e}`);
  console.error(`\n✗ content validation failed with ${errors.length} error(s)`);
  process.exit(1);
}

console.log('✓ content validation passed');
