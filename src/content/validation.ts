/* ══════════════════════════════════════════════════════════════
   Content validation — the build-time guarantee.
   Zod schemas plus cross-reference checks. `validateBank()` returns
   errors (which FAIL the build) and warnings (which don't). The
   scripts/validate-content gate and the content-integrity test
   both call it, so the same rules hold in CI and at build.

   The load-bearing rules for this project's priorities:
   - every concept maps to a real taxonomy subtopic in its own system
   - every vignette cites a source, and NO source may reference a
     commercial question bank (reputable primary sources only)
   - distractor concept references must resolve
   - UNREVIEWED content is counted and surfaced, never silently shipped
   ══════════════════════════════════════════════════════════════ */

import { z } from 'zod';
import type { Concept, Item, ReviewStatus } from '../types';
import { SUBTOPIC_IDS, subtopicById } from './taxonomy';
import { UNREVIEWED } from '../types';
import { reviewStatusOf } from './review';

/**
 * Commercial board-prep / question-bank brands. These are COVERAGE-ONLY:
 * they may inform which topics exist, but must never be copied, scraped,
 * or cited as a factual source. A citation matching any of these fails
 * the build. Cite public primary sources instead (guidelines, agencies,
 * peer-reviewed literature). See docs/CONTENT_POLICY.md.
 */
const SOURCE_DENYLIST = [
  /uworld/i,
  /\bamboss\b/i,
  /\bnbme\b/i,
  /usmle[-\s]?rx/i,
  /\bkaplan\b/i,
  /sketchy/i,
  /pathoma/i,
  /boards?\s*(and|&)\s*beyond/i,
  /onlinemeded/i,
  /first\s*aid\s+for\s+the\s+usmle/i,
  /free[-\s]?120/i,
  /lecturio/i,
  /\bpixorize\b/i,
  /question\s*bank/i,
  /\bqbank\b/i,
];

const boardLevel = z.enum(['step1', 'step2', 'step3']);
const presentation = z.enum(['classic', 'atypical', 'early', 'elderly', 'masked', 'severe', 'mimic']);

const sourceSchema = z.object({
  ref: z.string().min(4),
  year: z.number().int().gte(1990).lte(2100),
});

const reviewSchema = z.object({
  reviewer: z.string().min(1),
  kind: z.enum(['llm', 'human']),
  family: z.string().min(1).optional(),
  sources: z.array(sourceSchema),
  verdict: z.enum(['pass', 'flag', 'fail']),
  notes: z.string().min(1).optional(),
  checkedOn: z.string().min(4),
});

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  correct: z.boolean().optional(),
  whyNot: z.string().min(1).optional(),
});

const itemSchema = z.object({
  itemId: z.string().min(1),
  version: z.number().int().positive(),
  type: z.enum([
    'one_liner', 'discriminator', 'next_step', 'cant_miss', 'build_ddx',
    'tx_next_step', 'tx_contraindication', 'tx_sequencing', 'tx_threshold',
    'ecg', 'association',
  ]),
  conceptId: z.string().min(1),
  stem: z.string(),
  vitals: z.array(z.object({ label: z.string(), value: z.string(), hot: z.boolean().optional() })),
  findings: z.array(z.string()),
  options: z.array(optionSchema).min(2),
  selectCount: z.number().int().positive().optional(),
  ecg: z.unknown().optional(),
  discriminator: z.string().min(20),
  teachingPoint: z.string().optional(),
  tags: z.object({
    system: z.string().min(1),
    complaint: z.string().min(1),
    rotation: z.array(z.string()).min(1),
    level: z.enum(['preclinical', 'clerkship', 'both']),
    boards: z.array(boardLevel).min(1),
  }),
  difficultySeed: z.number().gt(0).lt(1),
  source: z.array(sourceSchema).min(1),
  presentation,
  distractorConceptIds: z.array(z.string()).optional(),
  exposures: z.number().int().gte(0),
  pCorrect: z.number().min(0).max(1).nullable(),
  legacyItemId: z.string().optional(),
});

const conceptSchema = z.object({
  conceptId: z.string().min(1),
  name: z.string().min(1),
  system: z.string().min(1),
  topic: z.string().min(1),
  subtopic: z.string().min(1),
  alsoTaggedSystems: z.array(z.string()),
  rotations: z.array(z.string()),
  level: z.array(z.enum(['preclinical', 'clerkship'])),
  usmleOutlineRefs: z.array(z.string()),
  illnessScript: z
    .object({
      epidemiology: z.string(),
      timeCourse: z.string(),
      keyFindings: z.array(z.string()),
      classicDistractors: z.array(z.string()),
    })
    .optional(),
  reviewedBy: z.string().min(1),
  reviewedOn: z.string().nullable(),
  reviews: z.array(reviewSchema),
});

export interface ValidationReport {
  errors: string[];
  warnings: string[];
  stats: {
    concepts: number;
    items: number;
    unreviewed: number;
    withIllnessScript: number;
    subtopicsCovered: number;
    /** concepts by DERIVED review status (see content/review.ts) */
    reviewStatus: Record<ReviewStatus, number>;
  };
}

/** A citation matches a denylisted commercial brand. */
function citesQuestionBank(ref: string): boolean {
  return SOURCE_DENYLIST.some((banned) => banned.test(ref));
}

export function validateBank(concepts: Concept[], items: Item[]): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const conceptIds = new Set(concepts.map((c) => c.conceptId));

  // ── shape ──
  for (const c of concepts) {
    const r = conceptSchema.safeParse(c);
    if (!r.success) errors.push(`concept ${c.conceptId}: ${issues(r.error)}`);
  }
  for (const it of items) {
    const r = itemSchema.safeParse(it);
    if (!r.success) errors.push(`item ${it.itemId}: ${issues(r.error)}`);
  }

  // ── taxonomy placement ──
  for (const c of concepts) {
    if (!SUBTOPIC_IDS.has(c.subtopic)) {
      errors.push(`concept ${c.conceptId}: subtopic "${c.subtopic}" is not in the taxonomy`);
      continue;
    }
    const sub = subtopicById(c.subtopic)!;
    if (sub.system !== c.system) {
      errors.push(
        `concept ${c.conceptId}: system "${c.system}" ≠ subtopic "${c.subtopic}" system "${sub.system}"`,
      );
    }
  }

  // ── referential integrity ──
  for (const it of items) {
    if (!conceptIds.has(it.conceptId)) {
      errors.push(`item ${it.itemId}: dangling conceptId "${it.conceptId}"`);
    }
    for (const d of it.distractorConceptIds ?? []) {
      if (!conceptIds.has(d)) {
        errors.push(`item ${it.itemId}: dangling distractorConceptId "${d}"`);
      }
    }
    // answer-key sanity
    const correct = it.options.filter((o) => o.correct);
    if (it.type === 'build_ddx') {
      if (correct.length < 2) errors.push(`item ${it.itemId}: build_ddx needs ≥2 correct options`);
      if (it.selectCount !== correct.length) {
        errors.push(`item ${it.itemId}: selectCount ${it.selectCount} ≠ ${correct.length} correct`);
      }
    } else if (correct.length !== 1) {
      errors.push(`item ${it.itemId}: expected exactly 1 correct option, found ${correct.length}`);
    }
    if (it.type === 'ecg' && !it.ecg) errors.push(`item ${it.itemId}: ecg item missing rhythm spec`);
    for (const o of it.options) {
      if (!o.correct && !o.whyNot) errors.push(`item ${it.itemId}: distractor "${o.id}" has no why-not`);
    }
    // source integrity — reputable sources only
    for (const s of it.source) {
      if (citesQuestionBank(s.ref)) {
        errors.push(`item ${it.itemId}: source cites a question bank ("${s.ref}") — reputable primary sources only`);
      }
    }
  }

  // ── coverage: concept with no vignette ──
  const withItems = new Set(items.map((i) => i.conceptId));
  for (const c of concepts) {
    if (!withItems.has(c.conceptId)) warnings.push(`concept ${c.conceptId}: no vignettes yet`);
  }

  // ── review pipeline: sources + derived status ──
  const reviewStatus: Record<ReviewStatus, number> = {
    unreviewed: 0,
    in_review: 0,
    validated: 0,
    flagged: 0,
  };
  for (const c of concepts) {
    // reviewers must also cite public sources — never a question bank
    for (const r of c.reviews ?? []) {
      for (const s of r.sources) {
        if (citesQuestionBank(s.ref)) {
          errors.push(`concept ${c.conceptId}: review by ${r.reviewer} cites a question bank ("${s.ref}") — public sources only`);
        }
      }
      if ((r.verdict === 'flag' || r.verdict === 'fail') && !r.notes) {
        errors.push(`concept ${c.conceptId}: review by ${r.reviewer} is a ${r.verdict} with no notes explaining what is wrong`);
      }
    }
    reviewStatus[reviewStatusOf(c.reviews ?? [])]++;
  }

  // A flagged concept must not still claim a validated `reviewedBy` summary.
  for (const c of concepts) {
    if (reviewStatusOf(c.reviews ?? []) === 'flagged' && c.reviewedBy !== UNREVIEWED) {
      errors.push(`concept ${c.conceptId}: has an open flag/fail but reviewedBy is "${c.reviewedBy}" — do not ship flagged content as reviewed`);
    }
  }

  if (reviewStatus.flagged > 0) {
    warnings.push(`${reviewStatus.flagged} concept(s) have an open flag/fail from a reviewer — resolve before shipping`);
  }
  const notValidated = concepts.length - reviewStatus.validated;
  if (notValidated > 0) {
    warnings.push(
      `${notValidated}/${concepts.length} concepts are not yet validated (${reviewStatus.unreviewed} unreviewed, ${reviewStatus.in_review} in review) — drafts pending independent multi-reviewer sign-off, do not ship as validated`,
    );
  }
  const withScript = concepts.filter((c) => c.illnessScript).length;

  return {
    errors,
    warnings,
    stats: {
      concepts: concepts.length,
      items: items.length,
      unreviewed: reviewStatus.unreviewed,
      withIllnessScript: withScript,
      subtopicsCovered: new Set(concepts.map((c) => c.subtopic)).size,
      reviewStatus,
    },
  };
}

function issues(err: z.ZodError): string {
  return err.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ');
}
