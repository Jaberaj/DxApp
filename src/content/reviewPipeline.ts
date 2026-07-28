/* ══════════════════════════════════════════════════════════════
   Multi-reviewer validation pipeline (the machinery).

   The product's plan: have SEVERAL reviewers — multiple LLMs, ideally
   distinct model families, and later humans — independently check each
   concept against external PUBLIC sources, and only promote a concept
   to `validated` when enough of them agree (content/review.ts).

   This module is provider-agnostic, exactly like the sync backend: a
   `Reviewer` is a port. The runner builds a strict clinical-accuracy
   prompt per concept, asks every reviewer, and returns structured
   ReviewRecords. A deterministic MockReviewer lets the whole thing be
   dry-run and unit-tested without any API key or network. Real
   adapters (Anthropic/OpenAI/…) are thin wrappers the operator adds
   — see scripts/review-content.ts and docs/REVIEW.md.

   Pure except for whatever a Reviewer chooses to do inside review().
   ══════════════════════════════════════════════════════════════ */

import type { Concept, Item, ReviewRecord, ReviewVerdict } from '../types';
import { reviewStatus } from './review';

/** What a reviewer must return for one concept. */
export interface ReviewerResponse {
  verdict: ReviewVerdict;
  /** PUBLIC sources actually consulted (never a commercial question bank). */
  sources: { ref: string; year: number }[];
  /** required for flag/fail: what is wrong; optional for a pass. */
  notes?: string;
}

/** A reviewer: a model, or a person, that can judge one concept. */
export interface Reviewer {
  /** stable id recorded on the review, e.g. 'claude-opus-4-8' or 'human:jdoe' */
  id: string;
  kind: 'llm' | 'human';
  /** model family for independence; omit for humans. */
  family?: string;
  review(prompt: string): Promise<ReviewerResponse>;
}

/** Concepts that still need review (anything not yet validated). */
export function reviewQueue(concepts: Concept[]): Concept[] {
  return concepts.filter((c) => reviewStatus(c) !== 'validated');
}

/**
 * The rubric. This exact instruction is what makes an LLM's answer a
 * *review* and not a guess: it must check the keyed answer and the
 * one-sentence discriminator against current public guidance, verify
 * every distractor rebuttal, cite the public sources it actually used,
 * and err toward `flag` when unsure rather than rubber-stamping.
 */
export function buildReviewPrompt(concept: Concept, items: Item[]): string {
  const vignettes = items
    .map((it, n) => {
      const correct = it.options.filter((o) => o.correct).map((o) => o.text).join(' / ');
      const distractors = it.options
        .filter((o) => !o.correct)
        .map((o) => `      - "${o.text}" — why-not: ${o.whyNot ?? '(none)'}`)
        .join('\n');
      return [
        `  Vignette ${n + 1} [${it.type}, ${it.presentation}]:`,
        `    Stem: ${it.stem}`,
        `    Keyed answer: ${correct}`,
        `    Distractors:\n${distractors}`,
        `    Discriminator (the taught rule): ${it.discriminator}`,
      ].join('\n');
    })
    .join('\n\n');

  return [
    `You are a board-certified physician reviewing USMLE-style study content for CLINICAL ACCURACY.`,
    `Concept: "${concept.name}" (system: ${concept.system}).`,
    ``,
    `For EACH vignette below, verify against CURRENT public sources (specialty-society guidelines, government/agency guidance such as CDC/WHO/USPSTF, or peer-reviewed primary literature):`,
    `  1. Is the keyed-correct answer actually correct for that stem?`,
    `  2. Is the one-sentence discriminator factually right and the true distinguishing point?`,
    `  3. Is EACH distractor genuinely wrong, and is its "why-not" rebuttal accurate?`,
    ``,
    `Rules:`,
    `  - Cite ONLY public sources you actually relied on. NEVER cite commercial question banks or board-prep brands (UWorld, AMBOSS, NBME, Kaplan, Pathoma, Sketchy, First Aid, etc.).`,
    `  - Do not copy source text; judge accuracy in your own words.`,
    `  - If ANYTHING is wrong, dangerous, or oversimplified to the point of being misleading, return "fail" (wrong) or "flag" (needs revision) and say exactly what.`,
    `  - If you are not confident it is correct, prefer "flag" over "pass". A pass is an assertion that you checked it and it is right.`,
    ``,
    `Content under review:`,
    vignettes,
    ``,
    `Respond with ONLY this JSON: {"verdict":"pass|flag|fail","sources":[{"ref":"<public source>","year":<year>}],"notes":"<what you verified, or what is wrong>"}`,
    `A "pass" must include at least 2 public sources.`,
  ].join('\n');
}

/**
 * Run every reviewer over the given concepts and collect records.
 * Reviewers run concurrently per concept; a reviewer that throws is
 * recorded as a `flag` (a failed check is not a silent pass).
 */
export async function runReview(
  reviewers: Reviewer[],
  concepts: Concept[],
  itemsByConcept: (conceptId: string) => Item[],
  checkedOn: string = new Date().toISOString().slice(0, 10),
): Promise<Record<string, ReviewRecord[]>> {
  const out: Record<string, ReviewRecord[]> = {};
  for (const concept of concepts) {
    const items = itemsByConcept(concept.conceptId);
    if (items.length === 0) continue;
    const prompt = buildReviewPrompt(concept, items);
    const records = await Promise.all(
      reviewers.map(async (r): Promise<ReviewRecord> => {
        try {
          const res = await r.review(prompt);
          return {
            reviewer: r.id,
            kind: r.kind,
            family: r.family,
            sources: res.sources,
            verdict: res.verdict,
            notes: res.notes,
            checkedOn,
          };
        } catch (err) {
          return {
            reviewer: r.id,
            kind: r.kind,
            family: r.family,
            sources: [],
            verdict: 'flag',
            notes: `reviewer error: ${(err as Error).message}`,
            checkedOn,
          };
        }
      }),
    );
    out[concept.conceptId] = records;
  }
  return out;
}

/**
 * A deterministic mock reviewer for dry-runs and tests: it returns a
 * fixed verdict with placeholder public sources. No network, no keys.
 */
export function mockReviewer(
  id: string,
  family: string,
  verdict: ReviewVerdict = 'pass',
): Reviewer {
  return {
    id,
    kind: 'llm',
    family,
    async review(): Promise<ReviewerResponse> {
      return {
        verdict,
        sources:
          verdict === 'pass'
            ? [
                { ref: 'Specialty society guideline (placeholder)', year: 2023 },
                { ref: 'Peer-reviewed primary literature (placeholder)', year: 2021 },
              ]
            : [],
        notes: verdict === 'pass' ? 'mock: checked, consistent with sources' : 'mock: needs revision',
      };
    },
  };
}
