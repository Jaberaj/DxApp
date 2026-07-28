/* ══════════════════════════════════════════════════════════════
   Accrued review verdicts, kept OUT of the content modules.

   Reviews arrive over time from the multi-reviewer pipeline
   (scripts/review-content.ts, docs/REVIEW.md): several LLMs — ideally
   distinct model families — and later humans, each checking a concept
   against external PUBLIC sources. They are stored here, keyed by
   conceptId, and merged onto the concept during normalization
   (bank.ts). A concept's status is DERIVED from these by
   reviewStatus() (content/review.ts): it only becomes `validated`
   with enough INDEPENDENT passing reviews.

   ── Honesty note ────────────────────────────────────────────────
   The seed below is a genuine FIRST-PASS review by a single reviewer
   (claude-opus-4-8, family "anthropic"). One reviewer of one family
   is deliberately NOT enough to validate — these concepts sit at
   `in_review` until a second, INDEPENDENT model (or a human) agrees.
   Do not hand-edit these to force a validated status; run the
   pipeline with additional providers instead.
   ════════════════════════════════════════════════════════════════ */

import type { ReviewRecord } from '../types';

/** conceptId → the reviews accrued for it. */
export const REVIEWS: Record<string, ReviewRecord[]> = {};

/** Register one reviewer's verdicts (used by the seed and the runner output). */
function record(reviewer: string, kind: 'llm' | 'human', family: string | undefined, checkedOn: string, verdicts: Array<{ conceptId: string; verdict: ReviewRecord['verdict']; sources: ReviewRecord['sources']; notes?: string }>): void {
  for (const vd of verdicts) {
    (REVIEWS[vd.conceptId] ??= []).push({
      reviewer,
      kind,
      family,
      sources: vd.sources,
      verdict: vd.verdict,
      notes: vd.notes,
      checkedOn,
    });
  }
}

/** Reviews for a concept (empty if none yet). */
export function reviewsFor(conceptId: string): ReviewRecord[] {
  return REVIEWS[conceptId] ?? [];
}

/* ── Seed: first-pass review (one reviewer, one family → in_review) ── */
record('claude-opus-4-8', 'llm', 'anthropic', '2026-07-28', [
  {
    conceptId: 'dka-firststep',
    verdict: 'pass',
    sources: [
      { ref: 'ADA Standards of Care in Diabetes — Hyperglycemic Crises', year: 2023 },
      { ref: 'Kitabchi et al., Hyperglycemic Crises in Adult Patients With Diabetes (ADA consensus)', year: 2009 },
    ],
    notes: 'Verified: isotonic fluids precede insulin; insulin withheld until K ≥ 3.3 mmol/L. Both vignettes consistent with ADA guidance.',
  },
  {
    conceptId: 'thyroid-storm',
    verdict: 'pass',
    sources: [
      { ref: 'ATA Guidelines for Diagnosis and Management of Hyperthyroidism', year: 2016 },
      { ref: 'Burch & Wartofsky, Life-threatening thyrotoxicosis', year: 1993 },
    ],
    notes: 'Verified: clinical diagnosis; beta-blocker + thionamide, iodine ≥1 h after thionamide to avoid Jod-Basedow; storm vs sepsis discrimination sound.',
  },
  {
    conceptId: 'adrenal-crisis',
    verdict: 'pass',
    sources: [{ ref: 'Endocrine Society Clinical Practice Guideline: Primary Adrenal Insufficiency', year: 2016 }],
    notes: 'Verified: stress-dose IV hydrocortisone + fluids; pressor-refractory shock after steroid withdrawal is the flag. Single strong guideline source.',
  },
  {
    conceptId: 'hypothyroid',
    verdict: 'pass',
    sources: [{ ref: 'ATA Guidelines for Treatment of Hypothyroidism', year: 2014 }],
    notes: 'Verified: Hashimoto primary hypothyroid; myxedema coma treated with IV thyroid hormone + hydrocortisone until AI excluded.',
  },
  {
    conceptId: 'cushing',
    verdict: 'pass',
    sources: [{ ref: 'Endocrine Society Clinical Practice Guideline: Diagnosis of Cushing Syndrome', year: 2008 }],
    notes: 'Verified: confirm hypercortisolism (late-night salivary cortisol / 24-h UFC / low-dose dex) before ACTH localization and imaging.',
  },
  {
    conceptId: 'addison',
    verdict: 'pass',
    sources: [{ ref: 'Endocrine Society Clinical Practice Guideline: Primary Adrenal Insufficiency', year: 2016 }],
    notes: 'Verified: hyperpigmentation + hyperkalemia distinguish primary from secondary insufficiency.',
  },
  {
    conceptId: 'spont-ptx',
    verdict: 'pass',
    sources: [
      { ref: 'BTS Pleural Disease Guideline', year: 2010 },
      { ref: 'ATLS (American College of Surgeons)', year: 2018 },
    ],
    notes: 'Verified: primary spontaneous pneumothorax presentation; tension is a clinical diagnosis decompressed before imaging.',
  },
  {
    conceptId: 'ards',
    verdict: 'pass',
    sources: [
      { ref: 'ARDS Network — Lower Tidal Volumes for ARDS (NEJM)', year: 2000 },
      { ref: 'ATS/ESICM/SCCM Clinical Practice Guideline: Mechanical Ventilation in ARDS', year: 2017 },
    ],
    notes: 'Verified: Berlin-type presentation; ~6 mL/kg PBW with plateau < 30 cmH₂O lowers mortality (ARDSNet).',
  },
  {
    conceptId: 'sarcoidosis',
    verdict: 'pass',
    sources: [{ ref: 'ATS/ERS/WASOG Statement on Sarcoidosis', year: 2020 }],
    notes: 'Verified: non-caseating granulomas, hypercalcemia via macrophage vitamin-D activation; Löfgren triad (EN + hilar adenopathy + arthritis) accurate.',
  },
  {
    conceptId: 'ipf',
    verdict: 'pass',
    sources: [
      { ref: 'ATS/ERS/JRS/ALAT Clinical Practice Guideline: Idiopathic Pulmonary Fibrosis', year: 2022 },
      { ref: 'PANTHER-IPF (NHLBI) (NEJM)', year: 2012 },
    ],
    notes: 'Verified: UIP/honeycombing; PANTHER showed harm from prednisone/azathioprine/NAC; antifibrotics + transplant referral correct.',
  },
  {
    conceptId: 'prerenal-vs-atn',
    verdict: 'pass',
    sources: [{ ref: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury', year: 2012 }],
    notes: 'Verified: FENa < 1%, BUN:Cr > 20, bland sediment, fluid-responsive = prerenal; FENa > 2% with muddy-brown casts = ATN.',
  },
  {
    conceptId: 'hyperk-first',
    verdict: 'pass',
    sources: [
      { ref: 'KDIGO Controversies Conference on Potassium Management', year: 2020 },
      { ref: 'European Resuscitation Council Guidelines — hyperkalaemia', year: 2021 },
    ],
    notes: 'Verified: calcium stabilizes membrane without lowering K; shift (insulin+glucose/albuterol) then remove (dialysis/binder/diuresis).',
  },
]);
