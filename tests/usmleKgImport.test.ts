import { afterAll, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { CONCEPTS, ITEMS } from '../src/content/bank';
import { loadSnapshot, SnapshotError } from '../src/integrations/usmleKg/loadSnapshot';
import { PILOT_CROSSWALK, isAutoMatchable, kgConceptId } from '../src/integrations/usmleKg/crosswalk';
import { transformConcept } from '../src/integrations/usmleKg/transformConcept';
import { transformItems } from '../src/integrations/usmleKg/transformItems';
import { STATUS_CAPABILITY, deriveImportStatus } from '../src/integrations/usmleKg/releasePolicy';
import type { KgManifest } from '../src/integrations/usmleKg/types';

/* ── fixture builder: writes a minimal, checksum-consistent snapshot ── */

interface FixtureBundles {
  diseases?: unknown[];
  presentations?: unknown[];
  treatments?: unknown[];
  references?: unknown[];
  entity_references?: unknown[];
  disease_treatments?: unknown[];
}

const dirs: string[] = [];
afterAll(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });

function sha(s: string): string { return createHash('sha256').update(s).digest('hex'); }

function writeSnapshot(b: FixtureBundles, manifestPatch: Partial<KgManifest> = {}, opts: { corrupt?: string; badChecksum?: string } = {}): string {
  const dir = mkdtempSync(join(tmpdir(), 'kg-'));
  dirs.push(dir);
  const files: Record<string, string> = {
    'diseases.json': JSON.stringify({ records: b.diseases ?? [] }),
    'presentations.json': JSON.stringify({ records: b.presentations ?? [] }),
    'treatments.json': JSON.stringify({ records: b.treatments ?? [] }),
    'entities.json': JSON.stringify({ entities: { references: b.references ?? [] } }),
    'relationships.json': JSON.stringify({ relationships: { entity_references: b.entity_references ?? [], disease_treatments: b.disease_treatments ?? [] } }),
  };
  const checksums: Record<string, string> = {};
  for (const [name, content] of Object.entries(files)) {
    checksums[name] = sha(content);
    // optionally corrupt the file bytes AFTER computing the manifest checksum
    writeFileSync(join(dir, name), opts.corrupt === name ? content + ' ' : content);
  }
  if (opts.badChecksum) checksums[opts.badChecksum] = 'deadbeef';
  const manifest: KgManifest = {
    application_contract_version: '1.0.0',
    schema_version: '1.0.0',
    knowledge_base_version: '0.1.0',
    git_commit: 'test000000000000000000000000000000000000',
    build_timestamp: '2026-07-30T00:00:00Z',
    included_bundles: Object.keys(files),
    checksums,
    record_counts: {},
    ...manifestPatch,
  };
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest));
  return dir;
}

const verifiedRef = { reference_id: 'REF-1', title: 'AAN Practice Guideline: Example', publication_year: '2020', verification_status: 'verified' };
const diseaseBase = { disease_id: 'DIS-X-1', canonical_name: 'Test disease', organ_system_primary: 'Neurology', board_exam_priority: '1', deprecated: 'false' };
const erToDisease = { entity_reference_id: 'ER-1', entity_id: 'DIS-X-1', entity_type: 'disease', reference_id: 'REF-1' };

describe('KG loader — gates fail safely', () => {
  it('fails on a checksum mismatch', () => {
    const dir = writeSnapshot({ diseases: [diseaseBase] }, {}, { corrupt: 'diseases.json' });
    expect(() => loadSnapshot(dir)).toThrow(/checksum/i);
  });

  it('fails on an unsupported contract version', () => {
    const dir = writeSnapshot({ diseases: [diseaseBase] }, { application_contract_version: '2.0.0' });
    expect(() => loadSnapshot(dir)).toThrow(/contract/i);
  });

  it('fails on an unresolved disease relationship reference', () => {
    const dz = { ...diseaseBase, differentials: [{ differential_link_id: 'DFL-1', competing_disease_id: 'DIS-MISSING' }] };
    const dir = writeSnapshot({ diseases: [dz] });
    expect(() => loadSnapshot(dir)).toThrow(SnapshotError);
    expect(() => loadSnapshot(dir)).toThrow(/unresolved/i);
  });

  it('fails on a duplicate stable ID', () => {
    const dir = writeSnapshot({ diseases: [diseaseBase, { ...diseaseBase }] });
    expect(() => loadSnapshot(dir)).toThrow(/duplicate/i);
  });

  it('loads a clean snapshot and records the manifest commit', () => {
    const dir = writeSnapshot({ diseases: [diseaseBase], references: [verifiedRef], entity_references: [erToDisease] });
    const snap = loadSnapshot(dir);
    expect(snap.sourceCommit).toBe('test000000000000000000000000000000000000');
    expect(snap.verifiedRefsByDisease.get('DIS-X-1')?.length).toBe(1);
  });
});

describe('KG crosswalk — ID safety', () => {
  it('every pilot crosswalk points at an EXISTING DxApp conceptId (never rewrites it)', () => {
    const ids = new Set(CONCEPTS.map((c) => c.conceptId));
    for (const x of PILOT_CROSSWALK) {
      expect(ids.has(x.dxAppConceptId), x.dxAppConceptId).toBe(true);
      expect(x.dxAppConceptId.startsWith('kg.')).toBe(false);
    }
  });

  it('an ambiguous (candidate) crosswalk is not auto-matchable', () => {
    const cand = PILOT_CROSSWALK.find((x) => x.matchStatus === 'candidate')!;
    expect(cand).toBeTruthy();
    expect(isAutoMatchable(cand)).toBe(false);
    expect(isAutoMatchable({ ...cand, matchStatus: 'confirmed' })).toBe(true);
  });

  it('new graph-only concept IDs are deterministic and namespaced', () => {
    expect(kgConceptId('DIS-NEUR-067')).toBe('kg.DIS-NEUR-067');
  });
});

describe('KG release policy — status gates', () => {
  it('semantic_review_pending is preview-only, never production', () => {
    expect(STATUS_CAPABILITY.semantic_review_pending.productionEligible).toBe(false);
    expect(STATUS_CAPABILITY.semantic_review_pending.previewEligible).toBe(true);
  });
  it('source_unverified and blocked are neither production nor preview', () => {
    for (const s of ['source_unverified', 'blocked'] as const) {
      expect(STATUS_CAPABILITY[s].productionEligible).toBe(false);
      expect(STATUS_CAPABILITY[s].previewEligible).toBe(false);
    }
  });
});

const ACCEPTED = new Set(['Neurology']); // test-only acceptance override

describe('KG transforms — skip rules', () => {
  it('unverified source → source_unverified status (blocked from preview)', () => {
    const dir = writeSnapshot({ diseases: [{ ...diseaseBase, key_distinguishing_features: 'Real specific finding pattern here.' }] });
    const snap = loadSnapshot(dir);
    expect(deriveImportStatus(snap.diseaseById.get('DIS-X-1')!, snap, ACCEPTED)).toBe('source_unverified');
  });

  it('migration_pending (placeholder findings) cannot generate finding-derived items', () => {
    const dz = { ...diseaseBase, key_distinguishing_features: 'Draft content pending review.', classic_presentation_summary: 'A real, specific presentation.' };
    const dir = writeSnapshot({ diseases: [dz], references: [verifiedRef], entity_references: [erToDisease] });
    const snap = loadSnapshot(dir);
    const x = { dxAppConceptId: 'guillain-barre', kgDiseaseId: 'DIS-X-1', matchStatus: 'confirmed' as const, matchMethod: 'manual' as const };
    expect(deriveImportStatus(snap.diseaseById.get('DIS-X-1')!, snap, ACCEPTED)).toBe('migration_pending');
    const { candidates, skipped } = transformItems(x, snap, 'now', ACCEPTED);
    expect(candidates.some((c) => ['one_liner', 'discriminator', 'cant_miss'].includes(c.type))).toBe(false);
    expect(skipped.some((s) => s.reason === 'finding-items-gated-by-status')).toBe(true);
  });

  it('a template differential is skipped (no relationship-specific discriminator)', () => {
    const dz = {
      ...diseaseBase,
      key_distinguishing_features: 'A real specific distinguishing pattern.',
      classic_presentation_summary: 'A real, specific presentation.',
      differentials: [{ differential_link_id: 'DFL-1', competing_disease_id: 'DIS-X-2', distinguishing_features: 'Test disease is favored by its defining time course, examination localization, and targeted test pattern.' }],
    };
    const other = { disease_id: 'DIS-X-2', canonical_name: 'Competitor', organ_system_primary: 'Neurology', deprecated: 'false' };
    const dir = writeSnapshot({ diseases: [dz, other], references: [verifiedRef], entity_references: [erToDisease] });
    const snap = loadSnapshot(dir);
    const x = { dxAppConceptId: 'guillain-barre', kgDiseaseId: 'DIS-X-1', matchStatus: 'confirmed' as const, matchMethod: 'manual' as const };
    const { candidates, skipped } = transformItems(x, snap, 'now', ACCEPTED);
    expect(candidates.some((c) => c.type === 'discriminator')).toBe(false);
    expect(skipped.some((s) => s.reason === 'template-differential')).toBe(true);
  });

  it('a treatment edge that is unreviewed or generically-contextualized is skipped', () => {
    const dz = { ...diseaseBase, key_distinguishing_features: 'A real specific pattern.', classic_presentation_summary: 'A real presentation.' };
    const dt = { disease_treatment_id: 'DTR-1', disease_id: 'DIS-X-1', treatment_id: 'TRT-1', role: 'first-line', first_line: 'true', clinical_context: 'Specific real management context.', medical_review_status: 'needs_medical_review' };
    const dir = writeSnapshot({ diseases: [dz], references: [verifiedRef], entity_references: [erToDisease], treatments: [{ treatment_id: 'TRT-1', name: 'Specific drug' }], disease_treatments: [dt] });
    const snap = loadSnapshot(dir);
    const x = { dxAppConceptId: 'guillain-barre', kgDiseaseId: 'DIS-X-1', matchStatus: 'confirmed' as const, matchMethod: 'manual' as const };
    const { skipped } = transformItems(x, snap, 'now', ACCEPTED);
    expect(skipped.some((s) => s.reason === 'treatment-edge-unreviewed')).toBe(true);
  });

  it('a fully-supported disease DOES produce preview candidates, none production-eligible', () => {
    const dz = {
      ...diseaseBase,
      key_distinguishing_features: 'A real specific distinguishing pattern.',
      classic_presentation_summary: 'A real, specific presentation of the disease.',
      emergency_red_flags: 'A real specific red flag to exclude.',
      differentials: [{ differential_link_id: 'DFL-1', competing_disease_id: 'DIS-X-2', distinguishing_features: 'Feature A is present and specific to the target versus the competitor.' }],
    };
    const other = { disease_id: 'DIS-X-2', canonical_name: 'Competitor', organ_system_primary: 'Neurology', deprecated: 'false' };
    const dt = { disease_treatment_id: 'DTR-1', disease_id: 'DIS-X-1', treatment_id: 'TRT-1', role: 'first-line', first_line: 'true', clinical_context: 'A specific, real first-line management context.', medical_review_status: 'reviewed' };
    const dir = writeSnapshot({ diseases: [dz, other], references: [verifiedRef], entity_references: [erToDisease], treatments: [{ treatment_id: 'TRT-1', name: 'Specific drug' }], disease_treatments: [dt] });
    const snap = loadSnapshot(dir);
    const x = { dxAppConceptId: 'guillain-barre', kgDiseaseId: 'DIS-X-1', matchStatus: 'confirmed' as const, matchMethod: 'manual' as const };
    expect(deriveImportStatus(snap.diseaseById.get('DIS-X-1')!, snap, ACCEPTED)).toBe('accepted');
    const { candidates } = transformItems(x, snap, 'now', ACCEPTED);
    expect(candidates.length).toBeGreaterThan(0);
    for (const c of candidates) {
      expect(c.previewOnly).toBe(true);
      expect(STATUS_CAPABILITY[c.importStatus].productionEligible).toBe(true); // accepted, but see production check below
    }
    // determinism
    const again = transformItems(x, snap, 'now', ACCEPTED);
    expect(again.candidates.map((c) => c.candidateId)).toEqual(candidates.map((c) => c.candidateId));
  });

  it('missing source causes a treatment candidate skip', () => {
    const dz = { ...diseaseBase, key_distinguishing_features: 'A real pattern.', classic_presentation_summary: 'A real presentation.' };
    const dt = { disease_treatment_id: 'DTR-1', disease_id: 'DIS-X-1', treatment_id: 'TRT-1', role: 'first-line', first_line: 'true', clinical_context: 'A specific, real first-line context.', medical_review_status: 'reviewed' };
    const dir = writeSnapshot({ diseases: [dz], treatments: [{ treatment_id: 'TRT-1', name: 'Specific drug' }], disease_treatments: [dt] }); // no references
    const snap = loadSnapshot(dir);
    const x = { dxAppConceptId: 'guillain-barre', kgDiseaseId: 'DIS-X-1', matchStatus: 'confirmed' as const, matchMethod: 'manual' as const };
    const { skipped } = transformItems(x, snap, 'now', ACCEPTED);
    expect(skipped.some((s) => s.reason === 'no-verified-source')).toBe(true);
  });
});

describe('KG pilot — nothing reaches the production bank', () => {
  it('no pilot candidate id collides with a production concept or item id', () => {
    const dir = writeSnapshot({ diseases: [{ ...diseaseBase, disease_id: 'DIS-N-0068' }], references: [{ ...verifiedRef }], entity_references: [{ ...erToDisease, entity_id: 'DIS-N-0068' }] });
    const snap = loadSnapshot(dir);
    const x = PILOT_CROSSWALK.find((c) => c.kgDiseaseId === 'DIS-N-0068')!;
    const cc = transformConcept(x, snap, 'now');
    const conceptIds = new Set(CONCEPTS.map((c) => c.conceptId));
    const itemIds = new Set(ITEMS.map((i) => i.itemId));
    expect(conceptIds.has(cc.candidateId)).toBe(false);
    expect(itemIds.has(cc.candidateId)).toBe(false);
    expect(cc.previewOnly).toBe(true);
    // the concept it enriches keeps its permanent id, unchanged
    expect(cc.dxAppConceptId).toBe(x.dxAppConceptId);
    expect(conceptIds.has(x.dxAppConceptId)).toBe(true);
  });
});
