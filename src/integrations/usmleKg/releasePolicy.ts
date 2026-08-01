/* Release gating for knowledge-graph-sourced content.

   KG import status is SEPARATE from DxApp's own reviewStatus: passing the
   KG gate only makes a source eligible to enter DxApp's independent
   review pipeline — it never sets `validated`.

   Current safety condition (per the KG maintainers' Phase-4B audit):
   Neurology is semantically UNACCEPTED (substantive-template hits,
   diagnostic-context leaks). So no Neurology module is on the acceptance
   allowlist yet, and every Neurology candidate is capped at
   `semantic_review_pending` — preview-only, never in the production bank.

   The graph's dist/json does not yet publish a machine-readable
   content_status bundle, so acceptance is encoded here explicitly rather
   than inferred from human-readable audit reports. */

import type { KgDisease, KgImportStatus, KgSnapshot } from './types';

/**
 * KG organ systems whose content has passed semantic acceptance and may
 * enter DxApp's review pipeline. EMPTY for now — Neurology Phase 4B is
 * unaccepted, so nothing is production-eligible.
 */
export const ACCEPTED_MODULES: ReadonlySet<string> = new Set<string>();

/** What each import status is allowed to produce in DxApp. */
export const STATUS_CAPABILITY: Record<KgImportStatus, {
  productionEligible: boolean;
  previewEligible: boolean;
  mayGenerateFindingItems: boolean;
}> = {
  accepted: { productionEligible: true, previewEligible: true, mayGenerateFindingItems: true },
  semantic_review_pending: { productionEligible: false, previewEligible: true, mayGenerateFindingItems: false },
  migration_pending: { productionEligible: false, previewEligible: true, mayGenerateFindingItems: false },
  source_unverified: { productionEligible: false, previewEligible: false, mayGenerateFindingItems: false },
  blocked: { productionEligible: false, previewEligible: false, mayGenerateFindingItems: false },
};

/**
 * Heuristic detector for the "substantive-template" filler the KG audit
 * flagged — generic differential prose that is not a relationship-specific
 * distinguishing fact and must never become a discriminator.
 */
export function isSubstantiveTemplate(text: string | undefined): boolean {
  if (!text) return true; // no text at all is not substantive
  const t = text.toLowerCase();
  const templates = [
    'is favored by its defining time course',
    'is favored by the competing mechanism',
    'favored by its defining time course, examination localization, and targeted test pattern',
    'directional neurologic differential',
    'draft comparison pending review',
    'draft content pending review',
    'chosen by localization',
    'stabilize airway, breathing, circulation',
    'before mechanism-specific therapy',
    'use syndrome localization and time course',
  ];
  return templates.some((p) => t.includes(p));
}

/** KG review states that clear content for transformation. */
export const REVIEWED_STATUSES: ReadonlySet<string> = new Set([
  'reviewed', 'accepted', 'physician_reviewed', 'clinician_reviewed',
]);

/** True when a KG record's medical review has actually been completed. */
export function isReviewedStatus(status: string | undefined): boolean {
  return !!status && REVIEWED_STATUSES.has(status);
}

/** True when a disease's own illness-script prose is still placeholder. */
export function isPlaceholderProse(text: string | undefined): boolean {
  if (!text) return true;
  const t = text.toLowerCase();
  return t.includes('draft') || t.includes('pending review') || t.includes('review required') || t.trim().length < 12;
}

/**
 * Derive the KG import status for a disease under the current policy.
 *   deprecated                              → blocked
 *   module not on the acceptance list        → semantic_review_pending (preview)
 *   accepted module, no verified reference    → source_unverified
 *   accepted module, but findings are still
 *     template/placeholder (need migration)   → migration_pending
 *   otherwise                                 → accepted
 *
 * `accepted` is injectable so tests can exercise the accepted path while
 * production keeps the empty ACCEPTED_MODULES set (Neurology unaccepted).
 */
export function deriveImportStatus(
  disease: KgDisease,
  snapshot: KgSnapshot,
  accepted: ReadonlySet<string> = ACCEPTED_MODULES,
): KgImportStatus {
  if (disease.deprecated === 'true') return 'blocked';

  const module = disease.organ_system_primary ?? 'Unknown';
  if (!accepted.has(module)) return 'semantic_review_pending';

  const verified = snapshot.verifiedRefsByDisease.get(disease.disease_id) ?? [];
  if (verified.length === 0) return 'source_unverified';

  // findings still need migration if the disease's key-findings prose is
  // still placeholder (per-differential template is caught at item level).
  if (isPlaceholderProse(disease.key_distinguishing_features)) return 'migration_pending';

  return 'accepted';
}
