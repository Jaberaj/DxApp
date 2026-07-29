/* ══════════════════════════════════════════════════════════════
   Cadence — coverage map.
   The single, computed answer to "where is the bank thin?" — derived
   live from CONCEPTS + ITEMS against the USMLE-outline taxonomy, never
   hand-maintained. It scores every subtopic on five axes:

     • depth      — concepts and vignettes present
     • variety    — distinct item TYPES and PRESENTATIONS (a diagnosis
                    drilled several ways, not memorized once)
     • boards     — Step 1 / Step 2 CK / Step 3 reach
     • rotations  — which clerkships the content serves
     • readiness  — review status (validated vs draft)

   From those it derives a DepthTier per subtopic and a PRIORITIZED
   gap list, so the next content pour is aimed, not guessed. Pure and
   deterministic (sorted outputs) — fully unit-tested.
   ══════════════════════════════════════════════════════════════ */

import type {
  BoardLevel,
  Concept,
  Item,
  ItemType,
  PresentationType,
  ReviewStatus,
  System,
} from '../types';
import { SUBTOPICS, TAXONOMY } from './taxonomy';
import { reviewStatusOf } from './review';

/* ── the "variety floor": what makes a concept DEEP ──────────────
   A diagnosis is only drilled well when the same concept is tested
   through several vignettes and more than one reasoning path. */
export const FLOOR_ITEMS = 3; // ≥3 vignettes …
export const FLOOR_TYPES = 2; // … spanning ≥2 distinct item types

/** How well-developed a subtopic is. Ordered worst → best. */
export type DepthTier = 'bare' | 'seed' | 'covered' | 'deep';
export const TIER_ORDER: DepthTier[] = ['bare', 'seed', 'covered', 'deep'];

/** Stable rotation columns (clerkships) the map reports against. */
export const ROTATIONS: string[] = ['im', 'em', 'fm', 'surg', 'peds', 'obgyn', 'neuro', 'psych'];
const BOARDS: BoardLevel[] = ['step1', 'step2', 'step3'];

const emptyBoards = (): Record<BoardLevel, number> => ({ step1: 0, step2: 0, step3: 0 });
const emptyStatus = (): Record<ReviewStatus, number> => ({
  unreviewed: 0,
  in_review: 0,
  validated: 0,
  flagged: 0,
});

export interface SubtopicCoverage {
  id: string;
  name: string;
  system: System;
  usmleOutlineRefs: string[];
  concepts: number;
  items: number;
  /** distinct item types present, in first-seen taxonomy order */
  types: ItemType[];
  /** distinct presentations present */
  presentations: PresentationType[];
  /** vignettes serving each board level */
  boards: Record<BoardLevel, number>;
  /** vignettes tagged for each rotation */
  rotations: Record<string, number>;
  /** concepts by DERIVED review status */
  reviewStatus: Record<ReviewStatus, number>;
  /** concepts meeting the variety floor (≥FLOOR_ITEMS, ≥FLOOR_TYPES) */
  deepConcepts: number;
  tier: DepthTier;
}

export interface SystemCoverage {
  id: System;
  name: string;
  crossCutting: boolean;
  subtopics: number;
  subtopicsCovered: number;
  concepts: number;
  items: number;
  deepConcepts: number;
  boards: Record<BoardLevel, number>;
  reviewStatus: Record<ReviewStatus, number>;
  /** subtopic count in each depth tier */
  tiers: Record<DepthTier, number>;
}

export type GapKind = 'empty' | 'thin' | 'shallow' | 'board' | 'unreviewed';

export interface Gap {
  kind: GapKind;
  /** subtopic id (or concept id for `shallow`) */
  ref: string;
  system: System;
  label: string;
  detail: string;
  /** lower is more urgent */
  priority: number;
}

export interface CoverageReport {
  totals: {
    systems: number;
    subtopics: number;
    subtopicsCovered: number;
    concepts: number;
    items: number;
    deepConcepts: number;
  };
  boards: Record<BoardLevel, { concepts: number; items: number }>;
  rotations: Record<string, { concepts: number; items: number }>;
  reviewStatus: Record<ReviewStatus, number>;
  tiers: Record<DepthTier, number>;
  systems: SystemCoverage[];
  subtopics: SubtopicCoverage[];
  gaps: Gap[];
}

/** Does a concept clear the variety floor given its own items? */
export function isDeepConcept(items: Item[]): boolean {
  const types = new Set(items.map((i) => i.type));
  return items.length >= FLOOR_ITEMS && types.size >= FLOOR_TYPES;
}

/** Tier a subtopic from its concept/item/variety counts. */
export function tierOf(concepts: number, items: number, distinctTypes: number, deepConcepts: number): DepthTier {
  if (concepts === 0) return 'bare';
  if (concepts >= 3 && items >= 6 && distinctTypes >= 3 && deepConcepts >= 1) return 'deep';
  if (concepts >= 2 && items >= 3) return 'covered';
  return 'seed';
}

/** Compute the full coverage map from the live bank. */
export function computeCoverage(concepts: Concept[], items: Item[]): CoverageReport {
  const itemsByConcept = new Map<string, Item[]>();
  for (const it of items) {
    const list = itemsByConcept.get(it.conceptId) ?? [];
    list.push(it);
    itemsByConcept.set(it.conceptId, list);
  }
  const conceptsBySubtopic = new Map<string, Concept[]>();
  for (const c of concepts) {
    const list = conceptsBySubtopic.get(c.subtopic) ?? [];
    list.push(c);
    conceptsBySubtopic.set(c.subtopic, list);
  }

  const subtopicCov: SubtopicCoverage[] = SUBTOPICS.map((sub) => {
    const subConcepts = conceptsBySubtopic.get(sub.id) ?? [];
    const subItems = subConcepts.flatMap((c) => itemsByConcept.get(c.conceptId) ?? []);
    const types = uniqueInOrder(subItems.map((i) => i.type));
    const presentations = uniqueInOrder(subItems.map((i) => i.presentation));

    const boards = emptyBoards();
    const rotations: Record<string, number> = {};
    for (const r of ROTATIONS) rotations[r] = 0;
    for (const it of subItems) {
      for (const b of it.tags.boards) boards[b]++;
      for (const rot of it.tags.rotation) if (rot in rotations) rotations[rot]++;
    }

    const reviewStatus = emptyStatus();
    for (const c of subConcepts) reviewStatus[reviewStatusOf(c.reviews ?? [])]++;

    const deepConcepts = subConcepts.filter((c) => isDeepConcept(itemsByConcept.get(c.conceptId) ?? [])).length;
    const tier = tierOf(subConcepts.length, subItems.length, types.length, deepConcepts);

    return {
      id: sub.id,
      name: sub.name,
      system: sub.system,
      usmleOutlineRefs: sub.usmleOutlineRefs,
      concepts: subConcepts.length,
      items: subItems.length,
      types,
      presentations,
      boards,
      rotations,
      reviewStatus,
      deepConcepts,
      tier,
    };
  });

  const covByStId = new Map(subtopicCov.map((s) => [s.id, s]));

  const systemCov: SystemCoverage[] = TAXONOMY.map((node) => {
    const subs = node.subtopics.map((s) => covByStId.get(s.id)!);
    const boards = emptyBoards();
    const reviewStatus = emptyStatus();
    const tiers: Record<DepthTier, number> = { bare: 0, seed: 0, covered: 0, deep: 0 };
    let cConcepts = 0, cItems = 0, cDeep = 0, covered = 0;
    for (const s of subs) {
      cConcepts += s.concepts;
      cItems += s.items;
      cDeep += s.deepConcepts;
      if (s.concepts > 0) covered++;
      tiers[s.tier]++;
      for (const b of BOARDS) boards[b] += s.boards[b];
      for (const k of Object.keys(reviewStatus) as ReviewStatus[]) reviewStatus[k] += s.reviewStatus[k];
    }
    return {
      id: node.id,
      name: node.name,
      crossCutting: !!node.crossCutting,
      subtopics: subs.length,
      subtopicsCovered: covered,
      concepts: cConcepts,
      items: cItems,
      deepConcepts: cDeep,
      boards,
      reviewStatus,
      tiers,
    };
  });

  // ── board & rotation rollups at bank scope ──
  const boards: Record<BoardLevel, { concepts: number; items: number }> = {
    step1: { concepts: 0, items: 0 },
    step2: { concepts: 0, items: 0 },
    step3: { concepts: 0, items: 0 },
  };
  const rotations: Record<string, { concepts: number; items: number }> = {};
  for (const r of ROTATIONS) rotations[r] = { concepts: 0, items: 0 };
  const boardConceptSeen: Record<BoardLevel, Set<string>> = { step1: new Set(), step2: new Set(), step3: new Set() };
  const rotConceptSeen: Record<string, Set<string>> = {};
  for (const r of ROTATIONS) rotConceptSeen[r] = new Set();
  for (const it of items) {
    for (const b of it.tags.boards) {
      boards[b].items++;
      boardConceptSeen[b].add(it.conceptId);
    }
    for (const rot of it.tags.rotation) {
      if (!(rot in rotations)) continue;
      rotations[rot].items++;
      rotConceptSeen[rot].add(it.conceptId);
    }
  }
  for (const b of BOARDS) boards[b].concepts = boardConceptSeen[b].size;
  for (const r of ROTATIONS) rotations[r].concepts = rotConceptSeen[r].size;

  const reviewStatus = emptyStatus();
  for (const c of concepts) reviewStatus[reviewStatusOf(c.reviews ?? [])]++;

  const tiers: Record<DepthTier, number> = { bare: 0, seed: 0, covered: 0, deep: 0 };
  for (const s of subtopicCov) tiers[s.tier]++;

  return {
    totals: {
      systems: TAXONOMY.length,
      subtopics: SUBTOPICS.length,
      subtopicsCovered: subtopicCov.filter((s) => s.concepts > 0).length,
      concepts: concepts.length,
      items: items.length,
      deepConcepts: concepts.filter((c) => isDeepConcept(itemsByConcept.get(c.conceptId) ?? [])).length,
    },
    boards,
    rotations,
    reviewStatus,
    tiers,
    systems: systemCov,
    subtopics: subtopicCov,
    gaps: buildGaps(subtopicCov, concepts, itemsByConcept),
  };
}

/** Rank the highest-value holes to fill next. */
function buildGaps(
  subs: SubtopicCoverage[],
  concepts: Concept[],
  itemsByConcept: Map<string, Item[]>,
): Gap[] {
  const gaps: Gap[] = [];

  for (const s of subs) {
    if (s.tier === 'bare') {
      gaps.push({
        kind: 'empty', ref: s.id, system: s.system, priority: 0,
        label: `${s.name}`,
        detail: 'no concepts yet — an empty tested subtopic',
      });
    } else if (s.tier === 'seed') {
      gaps.push({
        kind: 'thin', ref: s.id, system: s.system, priority: 1,
        label: `${s.name}`,
        detail: `only ${s.concepts} concept${s.concepts === 1 ? '' : 's'} / ${s.items} vignette${s.items === 1 ? '' : 's'} — needs depth`,
      });
    }
    // a covered/deep subtopic that still can't reach a board level
    if (s.concepts > 0) {
      const missing = BOARDS.filter((b) => s.boards[b] === 0);
      if (missing.length > 0 && s.tier !== 'bare' && s.tier !== 'seed') {
        gaps.push({
          kind: 'board', ref: s.id, system: s.system, priority: 3,
          label: `${s.name}`,
          detail: `no ${missing.map(boardLabel).join(' / ')} vignettes`,
        });
      }
    }
  }

  // single-vignette concepts — the variety-floor holes
  for (const c of concepts) {
    const n = (itemsByConcept.get(c.conceptId) ?? []).length;
    if (n === 1) {
      gaps.push({
        kind: 'shallow', ref: c.conceptId, system: c.system, priority: 2,
        label: c.name,
        detail: 'a single vignette — drill it another way (mimic, next step, treatment)',
      });
    }
  }

  // deterministic order: priority, then system, then ref
  return gaps.sort((a, b) => a.priority - b.priority || a.system.localeCompare(b.system) || a.ref.localeCompare(b.ref));
}

function boardLabel(b: BoardLevel): string {
  return b === 'step1' ? 'Step 1' : b === 'step2' ? 'Step 2 CK' : 'Step 3';
}

function uniqueInOrder<T>(xs: T[]): T[] {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const x of xs) {
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}
