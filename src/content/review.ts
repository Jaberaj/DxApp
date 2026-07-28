/* ══════════════════════════════════════════════════════════════
   Review promotion rule.
   Clinical content is LLM-drafted and plausible-but-sometimes-wrong,
   so it ships flagged and must earn its way to `validated`. Review is
   done by SEVERAL reviewers — multiple LLMs (ideally distinct model
   families) and, later, humans — each checking a concept against
   external PUBLIC sources and recording a verdict (see ReviewRecord).

   A concept's status is DERIVED from those verdicts, never stored:

     unreviewed → no reviews yet
     flagged    → a reviewer currently says fail, or raised a flag
                  that hasn't been resolved by a later pass
     validated  → no open flags AND enough INDEPENDENT passing reviews:
                  ≥ REQUIRED_INDEPENDENT_PASSES passes from DISTINCT
                  families, each citing ≥ MIN_SOURCES public sources
     in_review  → has reviews but not yet enough to validate

   Independence is the point: two passes from the same model family
   are not two opinions. A human reviewer is always its own family.
   Pure and deterministic — fully unit-tested.
   ══════════════════════════════════════════════════════════════ */

import type { Concept, ReviewRecord, ReviewStatus } from '../types';

/** Distinct passing reviewers of different families needed to validate. */
export const REQUIRED_INDEPENDENT_PASSES = 2;
/** "Several external sources" — each passing review must cite at least this many. */
export const MIN_SOURCES = 2;

/**
 * The family a review counts under for independence. LLMs group by
 * model family (two GPT passes are not independent); each human counts
 * as their own family (identified by reviewer).
 */
export function familyKey(r: ReviewRecord): string {
  if (r.kind === 'human') return `human:${r.reviewer}`;
  return `llm:${r.family ?? r.reviewer}`;
}

/** The latest verdict per reviewer — a re-review supersedes an older one. */
export function latestByReviewer(reviews: ReviewRecord[]): ReviewRecord[] {
  const latest = new Map<string, ReviewRecord>();
  for (const r of reviews) {
    const prev = latest.get(r.reviewer);
    if (!prev || new Date(r.checkedOn).getTime() >= new Date(prev.checkedOn).getTime()) {
      latest.set(r.reviewer, r);
    }
  }
  return [...latest.values()];
}

/** Does this passing review satisfy the "several public sources" bar? */
function passCounts(r: ReviewRecord): boolean {
  return r.verdict === 'pass' && r.sources.length >= MIN_SOURCES;
}

/** Derive a concept's promotion state from its accrued reviews. */
export function reviewStatusOf(reviews: ReviewRecord[]): ReviewStatus {
  if (reviews.length === 0) return 'unreviewed';
  const current = latestByReviewer(reviews);

  // any current fail or open flag blocks promotion outright
  if (current.some((r) => r.verdict === 'fail' || r.verdict === 'flag')) return 'flagged';

  // count independent passes: distinct families, each with enough sources
  const families = new Set<string>();
  for (const r of current) {
    if (passCounts(r)) families.add(familyKey(r));
  }
  if (families.size >= REQUIRED_INDEPENDENT_PASSES) return 'validated';
  return 'in_review';
}

/** Convenience for a whole concept. */
export function reviewStatus(concept: Concept): ReviewStatus {
  return reviewStatusOf(concept.reviews ?? []);
}

/** Roll the whole bank up into a status histogram (for reports/UI). */
export function reviewBreakdown(concepts: Concept[]): Record<ReviewStatus, number> {
  const out: Record<ReviewStatus, number> = {
    unreviewed: 0,
    in_review: 0,
    validated: 0,
    flagged: 0,
  };
  for (const c of concepts) out[reviewStatus(c)]++;
  return out;
}
