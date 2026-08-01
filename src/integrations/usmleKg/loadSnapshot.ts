/* Build-time loader for a pinned knowledge-graph snapshot (its dist/json
   directory, given by KG_SNAPSHOT_DIR). It reads the manifest, validates
   the contract, verifies SHA-256 checksums, loads the factual bundles,
   rejects duplicate stable IDs and unresolved relationship references,
   and returns integrity-checked indices. Any failure throws SnapshotError
   so a bad snapshot can never be silently imported. */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { verifyChecksums } from './checksums';
import { loadManifest, validateManifest } from './manifest';
import type {
  KgDisease, KgDiseaseTreatment, KgEntityReference, KgPresentation, KgReferenceEntity, KgSnapshot, KgTreatment,
} from './types';

export class SnapshotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SnapshotError';
  }
}

export interface LoadOptions {
  /** verify bundle checksums against the manifest (default true) */
  checkChecksums?: boolean;
  /** throw on any unresolved relationship reference (default true) */
  strictRefs?: boolean;
}

function readJson(dir: string, bundle: string): unknown {
  return JSON.parse(readFileSync(join(dir, bundle), 'utf8'));
}

function assertNoDuplicates(ids: string[], kind: string): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) throw new SnapshotError(`duplicate ${kind} id "${id}" in snapshot`);
    seen.add(id);
  }
}

/** Load and integrity-check a knowledge-graph dist/json snapshot. */
export function loadSnapshot(dir: string, opts: LoadOptions = {}): KgSnapshot {
  const checkChecksums = opts.checkChecksums ?? true;
  const strictRefs = opts.strictRefs ?? true;

  const manifest = loadManifest(dir);
  const mv = validateManifest(manifest);
  if (!mv.ok) throw new SnapshotError(`manifest invalid: ${mv.errors.join('; ')}`);

  if (checkChecksums) {
    const cs = verifyChecksums(dir, manifest);
    if (!cs.ok) {
      const parts = [
        ...cs.missing.map((bundle) => `${bundle}: missing`),
        ...cs.mismatches.map((m) => `${m.bundle}: expected ${m.expected.slice(0, 12)}… got ${m.actual.slice(0, 12)}…`),
      ];
      throw new SnapshotError(`checksum verification failed — ${parts.join('; ')}`);
    }
  }

  const diseases = (readJson(dir, 'diseases.json') as { records: KgDisease[] }).records ?? [];
  const presentations = (readJson(dir, 'presentations.json') as { records: KgPresentation[] }).records ?? [];
  const treatments = (readJson(dir, 'treatments.json') as { records: KgTreatment[] }).records ?? [];
  const entities = (readJson(dir, 'entities.json') as { entities: Record<string, unknown[]> }).entities ?? {};
  const relationships = (readJson(dir, 'relationships.json') as { relationships: Record<string, unknown[]> }).relationships ?? {};

  const references = (entities.references as KgReferenceEntity[] | undefined) ?? [];
  const entityRefs = (relationships.entity_references as KgEntityReference[] | undefined) ?? [];
  const diseaseTreatments = (relationships.disease_treatments as KgDiseaseTreatment[] | undefined) ?? [];

  assertNoDuplicates(diseases.map((d) => d.disease_id), 'disease');
  assertNoDuplicates(references.map((r) => r.reference_id), 'reference');

  const diseaseById = new Map(diseases.map((d) => [d.disease_id, d]));
  const presentationById = new Map(presentations.map((p) => [p.presentation_id, p]));
  const referenceById = new Map(references.map((r) => [r.reference_id, r]));
  const treatmentById = new Map<string, KgTreatment>(treatments.map((t) => [t.treatment_id, t]));

  // ── unresolved relationship references ──
  const unresolved: string[] = [];
  for (const d of diseases) {
    for (const df of d.differentials ?? []) {
      if (df.competing_disease_id && !diseaseById.has(df.competing_disease_id)) {
        unresolved.push(`differential ${df.differential_link_id} → missing disease ${df.competing_disease_id}`);
      }
    }
  }
  for (const er of entityRefs) {
    if (!referenceById.has(er.reference_id)) {
      unresolved.push(`entity_reference ${er.entity_reference_id} → missing reference ${er.reference_id}`);
    }
  }
  if (strictRefs && unresolved.length > 0) {
    throw new SnapshotError(`unresolved relationship references (${unresolved.length}): ${unresolved.slice(0, 5).join('; ')}${unresolved.length > 5 ? ' …' : ''}`);
  }

  // ── verified references per disease (only 'verified' citations are usable) ──
  const verifiedRefsByDisease = new Map<string, KgReferenceEntity[]>();
  for (const er of entityRefs) {
    if (er.entity_type !== 'disease') continue;
    const ref = referenceById.get(er.reference_id);
    if (!ref || ref.verification_status !== 'verified') continue;
    const list = verifiedRefsByDisease.get(er.entity_id) ?? [];
    list.push(ref);
    verifiedRefsByDisease.set(er.entity_id, list);
  }

  const treatmentsByDisease = new Map<string, KgDiseaseTreatment[]>();
  for (const dt of diseaseTreatments) {
    const list = treatmentsByDisease.get(dt.disease_id) ?? [];
    list.push(dt);
    treatmentsByDisease.set(dt.disease_id, list);
  }

  return {
    dir,
    manifest,
    sourceCommit: manifest.git_commit,
    contractVersion: manifest.application_contract_version,
    knowledgeBaseVersion: manifest.knowledge_base_version,
    diseaseById,
    presentationById,
    treatmentById,
    referenceById,
    verifiedRefsByDisease,
    treatmentsByDisease,
  };
}
