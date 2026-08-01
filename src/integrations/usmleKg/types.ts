/* ══════════════════════════════════════════════════════════════
   usmle-knowledge-graph integration — shared types.

   DxApp treats the knowledge graph as a PINNED, build-time clinical
   substrate consumed from its `dist/json` bundles. Nothing here is
   imported by the app runtime; it is used only by the importer script
   and its tests. See docs/USMLE_KG_INTEGRATION.md.

   Two families of types live here:
   1. `Kg*` — the raw shapes of the graph's dist/json bundles.
   2. DxApp-facing — the crosswalk, provenance, release status, and the
      preview-only candidate shapes the importer emits.
   ══════════════════════════════════════════════════════════════ */

export const KG_REPO = 'Jaberaj/usmle-knowledge-graph';
export const IMPORTER_VERSION = '0.1.0';

/** Application-contract versions this importer knows how to read.
 *  Extend as newer, semantically-accepted snapshots are adopted. */
export const SUPPORTED_CONTRACT_VERSIONS: readonly string[] = ['1.0.0'];

/** Data bundles the importer requires to be present + checksum-clean.
 *  (manifest.json is read separately; game_content.json is hints-only.) */
export const REQUIRED_BUNDLES: readonly string[] = [
  'diseases.json',
  'presentations.json',
  'relationships.json',
  'treatments.json',
  'entities.json',
];

/* ── raw bundle shapes ──────────────────────────────────────────── */

export interface KgManifest {
  application_contract_version: string;
  schema_version: string;
  knowledge_base_version: string;
  git_commit: string;
  build_timestamp: string;
  included_bundles: string[];
  checksums: Record<string, string>;
  record_counts: Record<string, number>;
  compatibility_notes?: string[];
  disclaimer?: string;
}

export interface KgDifferential {
  differential_link_id: string;
  competing_disease_id: string;
  presentation_id?: string;
  distinguishing_features?: string;
  /** "true" | "false" as authored in the graph */
  cannot_miss?: string;
  relative_priority?: string;
  medical_review_status?: string;
  source_review_status?: string;
}

export interface KgDisease {
  disease_id: string;
  canonical_name: string;
  organ_system_primary?: string;
  board_exam_priority?: string;
  concise_definition?: string;
  classic_presentation_summary?: string;
  key_distinguishing_features?: string;
  emergency_red_flags?: string;
  epidemiology_summary?: string;
  time_course?: string;
  differentials?: KgDifferential[];
  diagnostic_ids?: string[];
  treatment_ids?: string[];
  presentation_ids?: string[];
  medical_review_status?: string;
  source_review_status?: string;
  deprecated?: string;
}

export interface KgPresentation {
  presentation_id: string;
  name: string;
  concise_definition?: string;
  common_differential_disease_ids?: string[];
}

export interface KgTreatment {
  treatment_id: string;
  name: string;
  treatment_type?: string;
  emergency_role?: string;
  major_contraindications?: string;
  medical_review_status?: string;
}

export interface KgReferenceEntity {
  reference_id: string;
  title: string;
  organization_or_author?: string;
  publication_year?: string;
  source_type?: string;
  url?: string;
  /** 'verified' means the citation URL was checked; only these are citable. */
  verification_status?: string;
}

export interface KgEntityReference {
  entity_reference_id: string;
  entity_id: string;
  entity_type: string;
  reference_id: string;
  supported_topics?: string;
}

/** A disease→treatment edge with the role/context a tx item requires. */
export interface KgDiseaseTreatment {
  disease_treatment_id: string;
  disease_id: string;
  treatment_id: string;
  role?: string;
  clinical_context?: string;
  sequence_order?: string;
  first_line?: string;
  definitive?: string;
  rescue_or_escalation?: string;
  unstable_patient_only?: string;
  contraindication_notes?: string;
  board_exam_pearl?: string;
  medical_review_status?: string;
}

/** A loaded, integrity-checked snapshot with the indices the importer needs. */
export interface KgSnapshot {
  dir: string;
  manifest: KgManifest;
  /** the manifest's DECLARED source commit — not assumed equal to repo HEAD */
  sourceCommit: string;
  contractVersion: string;
  knowledgeBaseVersion: string;
  diseaseById: Map<string, KgDisease>;
  presentationById: Map<string, KgPresentation>;
  treatmentById: Map<string, KgReferenceEntity | KgTreatment>;
  referenceById: Map<string, KgReferenceEntity>;
  /** disease_id → its verified reference entities */
  verifiedRefsByDisease: Map<string, KgReferenceEntity[]>;
  /** disease_id → its disease_treatment edges (role/context/first-line) */
  treatmentsByDisease: Map<string, KgDiseaseTreatment[]>;
}

/* ── DxApp-facing integration types ─────────────────────────────── */

export type KgMatchStatus = 'confirmed' | 'candidate' | 'unmatched';
export type KgMatchMethod = 'manual' | 'exact-name' | 'alias';

/** A permanent link between a DxApp concept and a KG disease. DxApp
 *  conceptIds are NEVER rewritten — they are join keys for FSRS,
 *  mastery, sessions, and coverage. */
export interface KgConceptCrosswalk {
  dxAppConceptId: string;
  kgDiseaseId: string;
  matchStatus: KgMatchStatus;
  matchMethod: KgMatchMethod;
  notes?: string;
}

/**
 * Import status of KG-sourced content — DELIBERATELY separate from
 * DxApp's own `reviewStatus`. Passing the KG gate only makes the source
 * eligible for DxApp's independent review pipeline; it never sets
 * `validated`.
 */
export type KgImportStatus =
  | 'accepted'
  | 'semantic_review_pending'
  | 'migration_pending'
  | 'source_unverified'
  | 'blocked';

export interface KnowledgeGraphProvenance {
  repository: string;
  sourceCommit: string;
  contractVersion: string;
  knowledgeBaseVersion: string;
  diseaseId: string;
  presentationIds: string[];
  relationshipIds: string[];
  referenceIds: string[];
  importerVersion: string;
  generatedAt: string;
}

export interface CandidateSource {
  ref: string;
  year: number;
}

export interface ConceptCandidate {
  candidateId: string;
  dxAppConceptId: string;
  kgDiseaseId: string;
  name: string;
  importStatus: KgImportStatus;
  previewOnly: true;
  /** what the graph could and could NOT supply for this concept */
  resolvedSources: CandidateSource[];
  gaps: string[];
  provenance: KnowledgeGraphProvenance;
}

export interface ItemCandidate {
  candidateId: string;
  dxAppConceptId: string;
  kgDiseaseId: string;
  type: 'one_liner' | 'discriminator' | 'next_step' | 'cant_miss' | 'tx_next_step' | 'association';
  importStatus: KgImportStatus;
  previewOnly: true;
  /** a DRAFT stem/discriminator sketch — never learner-facing as-is */
  draft: Record<string, unknown>;
  source: CandidateSource[];
  provenance: KnowledgeGraphProvenance;
}

export interface SkippedCandidate {
  kgDiseaseId: string;
  dxAppConceptId: string;
  intendedType: string;
  reason: string;
  detail?: string;
}

export interface ImportReport {
  generatedAt: string;
  snapshotDir: string;
  /** manifest's declared source commit */
  snapshotCommit: string;
  contractVersion: string;
  knowledgeBaseVersion: string;
  importerVersion: string;
  recordsLoaded: Record<string, number>;
  conceptsCrosswalked: number;
  matched: number;
  ambiguousMatches: number;
  unmatched: number;
  conceptCandidates: number;
  itemCandidates: number;
  skipped: number;
  skipReasons: Record<string, number>;
  missingReferences: number;
  sourceStatusCounts: Record<string, number>;
  blockedModules: string[];
  addedToProductionBank: number;
}
