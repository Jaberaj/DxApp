/* Transform a crosswalked KG disease into a PREVIEW-ONLY DxApp concept
   candidate: the resolved public sources, an illness-script enrichment
   proposal built only from NON-placeholder fields, and a gap list of what
   the graph still needs to populate. Never invents clinical facts. */

import { deriveImportStatus, isPlaceholderProse } from './releasePolicy';
import type {
  CandidateSource, ConceptCandidate, KgConceptCrosswalk, KgDisease, KgSnapshot,
  KnowledgeGraphProvenance,
} from './types';
import { IMPORTER_VERSION, KG_REPO } from './types';

/** Verified references for a disease → DxApp-style {ref, year} sources. */
export function resolveSources(disease: KgDisease, snapshot: KgSnapshot): CandidateSource[] {
  const refs = snapshot.verifiedRefsByDisease.get(disease.disease_id) ?? [];
  const out: CandidateSource[] = [];
  for (const r of refs) {
    const year = Number(r.publication_year);
    if (r.title && r.title.length >= 4 && Number.isInteger(year) && year >= 1990 && year <= 2100) {
      out.push({ ref: r.title, year });
    }
  }
  return out;
}

export function buildProvenance(disease: KgDisease, snapshot: KgSnapshot, now: string): KnowledgeGraphProvenance {
  const refs = snapshot.verifiedRefsByDisease.get(disease.disease_id) ?? [];
  return {
    repository: KG_REPO,
    sourceCommit: snapshot.sourceCommit,
    contractVersion: snapshot.contractVersion,
    knowledgeBaseVersion: snapshot.knowledgeBaseVersion,
    diseaseId: disease.disease_id,
    presentationIds: disease.presentation_ids ?? [],
    relationshipIds: (disease.differentials ?? []).map((d) => d.differential_link_id),
    referenceIds: refs.map((r) => r.reference_id),
    importerVersion: IMPORTER_VERSION,
    generatedAt: now,
  };
}

/** Build a preview-only concept candidate + the gaps blocking real enrichment. */
export function transformConcept(
  crosswalk: KgConceptCrosswalk,
  snapshot: KgSnapshot,
  now: string,
  accepted?: ReadonlySet<string>,
): ConceptCandidate {
  const disease = snapshot.diseaseById.get(crosswalk.kgDiseaseId);
  if (!disease) {
    throw new Error(`crosswalk points at missing disease ${crosswalk.kgDiseaseId}`);
  }
  const importStatus = deriveImportStatus(disease, snapshot, accepted);
  const sources = resolveSources(disease, snapshot);

  const gaps: string[] = [];
  if (isPlaceholderProse(disease.classic_presentation_summary)) gaps.push('classic_presentation_summary is placeholder');
  if (isPlaceholderProse(disease.key_distinguishing_features)) gaps.push('key_distinguishing_features is placeholder');
  if (isPlaceholderProse(disease.epidemiology_summary)) gaps.push('epidemiology_summary is placeholder');
  if (isPlaceholderProse(disease.emergency_red_flags)) gaps.push('emergency_red_flags is placeholder');
  if (sources.length === 0) gaps.push('no verified public reference resolved');
  if (crosswalk.matchStatus !== 'confirmed') gaps.push(`crosswalk is "${crosswalk.matchStatus}" — needs human confirmation`);

  return {
    candidateId: `kgc.${disease.disease_id}.concept`,
    dxAppConceptId: crosswalk.dxAppConceptId,
    kgDiseaseId: disease.disease_id,
    name: disease.canonical_name,
    importStatus,
    previewOnly: true,
    resolvedSources: sources,
    gaps,
    provenance: buildProvenance(disease, snapshot, now),
  };
}
