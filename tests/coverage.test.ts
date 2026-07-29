import { describe, expect, it } from 'vitest';
import { CONCEPTS, ITEMS } from '../src/content/bank';
import { SUBTOPICS, TAXONOMY } from '../src/content/taxonomy';
import {
  computeCoverage, isDeepConcept, tierOf, FLOOR_ITEMS, FLOOR_TYPES,
} from '../src/content/coverage';
import type { Item } from '../src/types';

const report = computeCoverage(CONCEPTS, ITEMS);

const mkItem = (id: string, conceptId: string, type: Item['type']): Item => ({
  itemId: id, version: 1, type, conceptId, stem: 's', vitals: [], findings: [],
  options: [{ id: 'a', text: 'x', correct: true }, { id: 'b', text: 'y', whyNot: 'n' }],
  discriminator: 'a discriminator long enough to pass',
  tags: { system: 'renal', complaint: 'c', rotation: ['im'], level: 'clerkship', boards: ['step2'] },
  difficultySeed: 0.5, source: [{ ref: 'KDIGO', year: 2020 }], presentation: 'classic',
  exposures: 0, pCorrect: null, legacyItemId: id,
});

describe('coverage map — totals reconcile with the live bank', () => {
  it('counts every concept, vignette, and subtopic', () => {
    expect(report.totals.concepts).toBe(CONCEPTS.length);
    expect(report.totals.items).toBe(ITEMS.length);
    expect(report.totals.subtopics).toBe(SUBTOPICS.length);
    expect(report.totals.systems).toBe(TAXONOMY.length);
  });

  it('every concept lands in exactly one system (subtopic sums = total)', () => {
    const sum = report.systems.reduce((n, s) => n + s.concepts, 0);
    expect(sum).toBe(CONCEPTS.length);
    const items = report.systems.reduce((n, s) => n + s.items, 0);
    expect(items).toBe(ITEMS.length);
  });

  it('subtopicsCovered = subtopics that actually have a concept', () => {
    const covered = report.subtopics.filter((s) => s.concepts > 0).length;
    expect(report.totals.subtopicsCovered).toBe(covered);
    expect(covered).toBe(report.subtopics.filter((s) => s.tier !== 'bare').length);
  });

  it('board rollups match a direct count over items', () => {
    for (const b of ['step1', 'step2', 'step3'] as const) {
      const items = ITEMS.filter((i) => i.tags.boards.includes(b)).length;
      expect(report.boards[b].items, b).toBe(items);
      const concepts = new Set(ITEMS.filter((i) => i.tags.boards.includes(b)).map((i) => i.conceptId)).size;
      expect(report.boards[b].concepts, b).toBe(concepts);
    }
  });

  it('review status rollup matches the bank total', () => {
    const sum = Object.values(report.reviewStatus).reduce((a, b) => a + b, 0);
    expect(sum).toBe(CONCEPTS.length);
  });
});

describe('coverage map — variety floor & tiering', () => {
  it('isDeepConcept needs enough vignettes AND enough distinct types', () => {
    const c = 'x';
    expect(isDeepConcept([mkItem('1', c, 'one_liner'), mkItem('2', c, 'one_liner')])).toBe(false); // 2 items
    expect(isDeepConcept([mkItem('1', c, 'one_liner'), mkItem('2', c, 'one_liner'), mkItem('3', c, 'one_liner')])).toBe(false); // 3 items, 1 type
    expect(isDeepConcept([mkItem('1', c, 'one_liner'), mkItem('2', c, 'discriminator'), mkItem('3', c, 'next_step')])).toBe(true);
  });

  it('the floor constants are what the map advertises', () => {
    expect(FLOOR_ITEMS).toBe(3);
    expect(FLOOR_TYPES).toBe(2);
  });

  it('tierOf climbs bare → seed → covered → deep', () => {
    expect(tierOf(0, 0, 0, 0)).toBe('bare');
    expect(tierOf(1, 1, 1, 0)).toBe('seed');
    expect(tierOf(2, 3, 2, 0)).toBe('covered');
    expect(tierOf(3, 6, 3, 1)).toBe('deep');
    // just short of deep on any axis falls back to covered
    expect(tierOf(3, 6, 2, 1)).toBe('covered');
    expect(tierOf(3, 6, 3, 0)).toBe('covered');
  });

  it('deepConcepts total equals concepts that clear the floor', () => {
    const byConcept = new Map<string, Item[]>();
    for (const it of ITEMS) (byConcept.get(it.conceptId) ?? byConcept.set(it.conceptId, []).get(it.conceptId)!).push(it);
    const deep = CONCEPTS.filter((c) => isDeepConcept(byConcept.get(c.conceptId) ?? [])).length;
    expect(report.totals.deepConcepts).toBe(deep);
  });
});

describe('coverage map — gaps', () => {
  it('every bare subtopic surfaces as an empty gap, every seed as a thin gap', () => {
    const emptyRefs = new Set(report.gaps.filter((g) => g.kind === 'empty').map((g) => g.ref));
    const thinRefs = new Set(report.gaps.filter((g) => g.kind === 'thin').map((g) => g.ref));
    for (const s of report.subtopics) {
      if (s.tier === 'bare') expect(emptyRefs.has(s.id), s.id).toBe(true);
      if (s.tier === 'seed') expect(thinRefs.has(s.id), s.id).toBe(true);
    }
  });

  it('shallow gaps reference real single-vignette concepts', () => {
    const conceptIds = new Set(CONCEPTS.map((c) => c.conceptId));
    const counts = new Map<string, number>();
    for (const it of ITEMS) counts.set(it.conceptId, (counts.get(it.conceptId) ?? 0) + 1);
    for (const g of report.gaps.filter((x) => x.kind === 'shallow')) {
      expect(conceptIds.has(g.ref), g.ref).toBe(true);
      expect(counts.get(g.ref)).toBe(1);
    }
  });

  it('gaps are ordered by priority and the output is deterministic', () => {
    for (let i = 1; i < report.gaps.length; i++) {
      expect(report.gaps[i].priority).toBeGreaterThanOrEqual(report.gaps[i - 1].priority);
    }
    const again = computeCoverage(CONCEPTS, ITEMS);
    expect(JSON.stringify(again)).toBe(JSON.stringify(report));
  });
});
