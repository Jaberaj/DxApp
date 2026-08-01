/* The permanent DxApp-concept ↔ KG-disease crosswalk.

   DxApp conceptIds are STABLE join keys for FSRS scheduling, mastery,
   session history, and coverage. This crosswalk LINKS a concept to a KG
   disease; it never rewrites an existing conceptId. New concepts sourced
   from the graph (not in this task) would take a deterministic id
   (`kgConceptId`), but existing concepts keep theirs forever.

   The ten entries below are the manual pilot crosswalk for Neurology —
   resolved by hand against the pinned snapshot (dist/json). Non-exact
   name matches are marked `candidate`, not `confirmed`, so the importer
   never auto-accepts an ambiguous pairing. */

import type { KgConceptCrosswalk } from './types';

/** Deterministic id for a NEW concept that originates from the graph. */
export function kgConceptId(kgDiseaseId: string): string {
  return `kg.${kgDiseaseId}`;
}

/** The ten-concept Neurology pilot crosswalk (manual). */
export const PILOT_CROSSWALK: KgConceptCrosswalk[] = [
  { dxAppConceptId: 'guillain-barre', kgDiseaseId: 'DIS-N-0068', matchStatus: 'confirmed', matchMethod: 'manual' },
  { dxAppConceptId: 'myasthenia-gravis', kgDiseaseId: 'DIS-N-0067', matchStatus: 'confirmed', matchMethod: 'manual' },
  { dxAppConceptId: 'multiple-sclerosis', kgDiseaseId: 'DIS-N-0065', matchStatus: 'confirmed', matchMethod: 'manual' },
  { dxAppConceptId: 'parkinson', kgDiseaseId: 'DIS-N-0066', matchStatus: 'confirmed', matchMethod: 'manual', notes: 'DxApp "Parkinson disease" ↔ KG "Parkinson disease".' },
  { dxAppConceptId: 'status-epilepticus', kgDiseaseId: 'DIS-N-0062', matchStatus: 'confirmed', matchMethod: 'manual' },
  { dxAppConceptId: 'sah-thunderclap', kgDiseaseId: 'DIS-N-0060', matchStatus: 'confirmed', matchMethod: 'manual', notes: 'DxApp subarachnoid-hemorrhage concept ↔ KG "Subarachnoid hemorrhage".' },
  { dxAppConceptId: 'tia', kgDiseaseId: 'DIS-NEUR-001', matchStatus: 'confirmed', matchMethod: 'manual' },
  { dxAppConceptId: 'wernicke', kgDiseaseId: 'DIS-NEUR-101', matchStatus: 'confirmed', matchMethod: 'manual' },
  { dxAppConceptId: 'bell-palsy', kgDiseaseId: 'DIS-NEUR-118', matchStatus: 'confirmed', matchMethod: 'manual' },
  // Non-exact name: DxApp "Migraine" ↔ KG "Migraine without aura" — flagged candidate, never auto-accepted.
  { dxAppConceptId: 'migraine', kgDiseaseId: 'DIS-NEUR-053', matchStatus: 'candidate', matchMethod: 'manual', notes: 'Name mismatch: DxApp "Migraine" vs KG "Migraine without aura"; needs human confirmation before acceptance.' },
];

/** Only confirmed crosswalks may proceed to acceptance; candidates stay preview. */
export function isAutoMatchable(x: KgConceptCrosswalk): boolean {
  return x.matchStatus === 'confirmed';
}
