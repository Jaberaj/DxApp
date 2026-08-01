/* Transform a crosswalked KG disease into PREVIEW-ONLY item candidates,
   applying strict skip rules: a candidate is produced only when the graph
   supplies enough for a defensible item — a relationship-specific
   discriminator (not template), a resolvable competing diagnosis, and a
   verified public source. Missing information SKIPS the candidate with an
   exact reason; it is never filled with generic prose.

   Everything emitted is previewOnly. Finding-derived item types
   (one_liner, discriminator, next_step, cant_miss) are additionally gated
   off unless the disease's module is semantically accepted. */

import { STATUS_CAPABILITY, deriveImportStatus, isPlaceholderProse, isReviewedStatus, isSubstantiveTemplate } from './releasePolicy';
import { buildProvenance, resolveSources } from './transformConcept';
import type {
  ItemCandidate, KgConceptCrosswalk, KgSnapshot, SkippedCandidate,
} from './types';

export interface ItemTransformResult {
  candidates: ItemCandidate[];
  skipped: SkippedCandidate[];
}

/** Item types derived from clinical findings — gated by module acceptance. */
const FINDING_DERIVED = new Set(['one_liner', 'discriminator', 'next_step', 'cant_miss']);

export function transformItems(
  crosswalk: KgConceptCrosswalk,
  snapshot: KgSnapshot,
  now: string,
  accepted?: ReadonlySet<string>,
): ItemTransformResult {
  const candidates: ItemCandidate[] = [];
  const skipped: SkippedCandidate[] = [];
  const disease = snapshot.diseaseById.get(crosswalk.kgDiseaseId);
  if (!disease) {
    skipped.push({ kgDiseaseId: crosswalk.kgDiseaseId, dxAppConceptId: crosswalk.dxAppConceptId, intendedType: 'concept', reason: 'unresolved-disease' });
    return { candidates, skipped };
  }

  const status = deriveImportStatus(disease, snapshot, accepted);
  const cap = STATUS_CAPABILITY[status];
  const sources = resolveSources(disease, snapshot);
  const provenance = buildProvenance(disease, snapshot, now);
  const skip = (intendedType: string, reason: string, detail?: string) =>
    skipped.push({ kgDiseaseId: disease.disease_id, dxAppConceptId: crosswalk.dxAppConceptId, intendedType, reason, detail });

  // A finding-derived item is only allowed once the module is accepted.
  const findingGated = (type: string): boolean => FINDING_DERIVED.has(type) && !cap.mayGenerateFindingItems;

  /* ── one_liner (recognition) ── */
  if (findingGated('one_liner')) {
    skip('one_liner', 'finding-items-gated-by-status', `status=${status}`);
  } else if (isPlaceholderProse(disease.classic_presentation_summary)) {
    skip('one_liner', 'placeholder-presentation');
  } else if (sources.length === 0) {
    skip('one_liner', 'no-verified-source');
  } else {
    candidates.push({
      candidateId: `kgc.${disease.disease_id}.one_liner`,
      dxAppConceptId: crosswalk.dxAppConceptId, kgDiseaseId: disease.disease_id, type: 'one_liner',
      importStatus: status, previewOnly: true,
      draft: { recognitionFrom: disease.classic_presentation_summary, answer: disease.canonical_name },
      source: sources, provenance,
    });
  }

  /* ── discriminator (differential) ── */
  const usableDiff = (disease.differentials ?? []).find(
    (d) => d.competing_disease_id && snapshot.diseaseById.has(d.competing_disease_id) && !isSubstantiveTemplate(d.distinguishing_features),
  );
  if (findingGated('discriminator')) {
    skip('discriminator', 'finding-items-gated-by-status', `status=${status}`);
  } else if (!disease.differentials || disease.differentials.length === 0) {
    skip('discriminator', 'no-differential');
  } else if (!usableDiff) {
    const anyResolvable = (disease.differentials ?? []).some((d) => snapshot.diseaseById.has(d.competing_disease_id));
    skip('discriminator', anyResolvable ? 'template-differential' : 'unresolved-competing-disease');
  } else if (sources.length === 0) {
    skip('discriminator', 'no-verified-source');
  } else {
    const competing = snapshot.diseaseById.get(usableDiff.competing_disease_id)!;
    candidates.push({
      candidateId: `kgc.${disease.disease_id}.discriminator`,
      dxAppConceptId: crosswalk.dxAppConceptId, kgDiseaseId: disease.disease_id, type: 'discriminator',
      importStatus: status, previewOnly: true,
      draft: { target: disease.canonical_name, competing: competing.canonical_name, distinguishingFeature: usableDiff.distinguishing_features },
      source: sources, provenance,
    });
  }

  /* ── cant_miss (red flags) ── */
  if (findingGated('cant_miss')) {
    skip('cant_miss', 'finding-items-gated-by-status', `status=${status}`);
  } else if (isPlaceholderProse(disease.emergency_red_flags)) {
    skip('cant_miss', 'placeholder-red-flags');
  } else if (sources.length === 0) {
    skip('cant_miss', 'no-verified-source');
  } else {
    candidates.push({
      candidateId: `kgc.${disease.disease_id}.cant_miss`,
      dxAppConceptId: crosswalk.dxAppConceptId, kgDiseaseId: disease.disease_id, type: 'cant_miss',
      importStatus: status, previewOnly: true,
      draft: { redFlags: disease.emergency_red_flags, answer: disease.canonical_name },
      source: sources, provenance,
    });
  }

  /* ── tx_next_step (treatment) ──────────────────────────────────
     The spec's higher safety bar: a tx item needs the disease-specific
     disease_treatment EDGE (role/clinical_context/first_line), not just a
     generic treatment concept, plus a dated guideline source. In this
     snapshot those edge fields are placeholder, so every tx candidate
     skips — an accurate reflection of the source not being ready. */
  const txEdges = snapshot.treatmentsByDisease.get(disease.disease_id) ?? [];
  const firstLine = txEdges.find((e) => e.first_line === 'true') ?? txEdges[0];
  const txConcept = firstLine ? snapshot.treatmentById.get(firstLine.treatment_id) : undefined;
  const txName = txConcept && 'name' in txConcept ? (txConcept as { name?: string }).name : undefined;
  const contextSubstantive = firstLine
    ? !isPlaceholderProse(firstLine.clinical_context) && !isSubstantiveTemplate(firstLine.clinical_context)
    : false;
  // role is a short enum token, not prose — presence (non-placeholder word) suffices
  const roleSubstantive = !!firstLine?.role && firstLine.role.trim().length > 0
    && !/draft|pending review|review required/i.test(firstLine.role);
  const nameGeneric = !txName || isPlaceholderProse(txName) || GENERIC_TREATMENTS.has(txName.toLowerCase());

  if (!firstLine) {
    skip('tx_next_step', 'no-treatment-edge');
  } else if (!isReviewedStatus(firstLine.medical_review_status)) {
    skip('tx_next_step', 'treatment-edge-unreviewed', firstLine.medical_review_status);
  } else if (!contextSubstantive || !roleSubstantive) {
    skip('tx_next_step', 'placeholder-treatment-context', txName);
  } else if (nameGeneric) {
    skip('tx_next_step', 'generic-treatment', txName);
  } else if (sources.length === 0) {
    skip('tx_next_step', 'no-verified-source');
  } else {
    candidates.push({
      candidateId: `kgc.${disease.disease_id}.tx_next_step`,
      dxAppConceptId: crosswalk.dxAppConceptId, kgDiseaseId: disease.disease_id, type: 'tx_next_step',
      importStatus: status, previewOnly: true,
      draft: { diagnosis: disease.canonical_name, treatment: txName, role: firstLine.role, context: firstLine.clinical_context },
      source: sources, provenance,
    });
  }

  return { candidates, skipped };
}

/** Generic treatment concepts that cannot anchor a disease-specific tx item. */
const GENERIC_TREATMENTS = new Set([
  'airway assessment', 'supportive care', 'consultation', 'follow-up planning', 'monitoring',
  'nutrition support', 'temperature management', 'immobilization', 'transfer to higher level of care',
  'palliative consultation', 'discharge planning', 'medication reconciliation', 'psychotherapy',
]);
