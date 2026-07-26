import { describe, expect, it } from 'vitest';
import { Rating } from 'ts-fsrs';
import { CONCEPTS, ITEMS, servesBoard } from '../src/content/bank';
import { gameById } from '../src/content/games';
import { buildSet, inBlock, type SetFilter } from '../src/engine/session';
import { newSchedule, review } from '../src/engine/scheduler';
import { defaultState } from '../src/state/store';
import type { AppState, BoardLevel } from '../src/types';

const NOW = new Date('2026-07-25T12:00:00Z');
const rng = () => 0.42;

function filterFor(id: 'rapid_ddx' | 'rapid_tx' | 'ecg' | 'buzzword', board: BoardLevel | 'all' = 'all'): SetFilter {
  const g = gameById(id);
  return { types: g.itemTypes, board, setSize: g.setSize };
}

/** conceptId → taxonomy subtopic, for asserting the subtopic filter. */
const SUBTOPIC_OF = new Map(CONCEPTS.map((c) => [c.conceptId, c.subtopic]));

describe('session builder — games', () => {
  it('the DDx game builds a full set of unique concepts', () => {
    const set = buildSet(ITEMS, CONCEPTS, defaultState(), NOW, filterFor('rapid_ddx'), rng);
    expect(set.length).toBe(gameById('rapid_ddx').setSize);
    const conceptIds = set.map((i) => i.conceptId);
    expect(new Set(conceptIds).size).toBe(conceptIds.length);
  });

  it('the ECG game serves only ECG items with a rhythm spec', () => {
    const set = buildSet(ITEMS, CONCEPTS, defaultState(), NOW, filterFor('ecg'), rng);
    expect(set.length).toBeGreaterThan(0);
    for (const item of set) {
      expect(item.type, item.itemId).toBe('ecg');
      expect(item.ecg, item.itemId).toBeDefined();
    }
  });

  it('the Buzzword game serves only association items', () => {
    const set = buildSet(ITEMS, CONCEPTS, defaultState(), NOW, filterFor('buzzword'), rng);
    expect(set.length).toBeGreaterThan(0);
    for (const item of set) expect(item.type, item.itemId).toBe('association');
  });
});

describe('session builder — board scope', () => {
  it('narrows every served item to the chosen board level', () => {
    for (const board of ['step1', 'step2', 'step3'] as BoardLevel[]) {
      const set = buildSet(ITEMS, CONCEPTS, defaultState(), NOW, filterFor('rapid_ddx', board), rng);
      expect(set.length, board).toBeGreaterThan(0);
      for (const item of set) expect(servesBoard(item, board), `${item.itemId} @ ${board}`).toBe(true);
    }
  });

  it('relaxes an over-restrictive board scope rather than returning nothing', () => {
    // Buzzword content is Step 1/2; a Step 3 scope has no buzzwords, so
    // the builder should fall back rather than hand back an empty set.
    const set = buildSet(ITEMS, CONCEPTS, defaultState(), NOW, filterFor('buzzword', 'step3'), rng);
    expect(set.length).toBeGreaterThan(0);
  });
});

describe('session builder — subtopic narrowing', () => {
  function courseState(system: string, subtopics: string[]): AppState {
    return {
      ...defaultState(),
      focus: { mode: 'course', id: system, mixPercent: 100, boards: 'all', subtopics },
    };
  }

  it('a single selected subtopic returns only that subtopic\'s concepts', () => {
    const state = courseState('renal', ['renal.aki']);
    const set = buildSet(ITEMS, CONCEPTS, state, NOW, filterFor('rapid_ddx'), rng);
    expect(set.length).toBeGreaterThan(0);
    for (const item of set) {
      expect(SUBTOPIC_OF.get(item.conceptId), item.itemId).toBe('renal.aki');
    }
  });

  it('multiple selected subtopics stay within the selected set (never leak systems)', () => {
    const chosen = ['renal.aki', 'renal.electrolytes'];
    const state = courseState('renal', chosen);
    const set = buildSet(ITEMS, CONCEPTS, state, NOW, filterFor('rapid_ddx'), Math.random);
    for (const item of set) {
      expect(chosen, item.itemId).toContain(SUBTOPIC_OF.get(item.conceptId));
    }
  });

  it('a sparse subtopic yields a short, honest set rather than off-topic padding', () => {
    // pick a subtopic with few concepts; the set must not exceed what exists
    const state = courseState('renal', ['renal.aki']);
    const inSub = CONCEPTS.filter((c) => c.subtopic === 'renal.aki').length;
    const set = buildSet(ITEMS, CONCEPTS, state, NOW, filterFor('rapid_ddx'), rng);
    expect(set.length).toBeLessThanOrEqual(inSub);
  });

  it('no selection = the whole system, as before', () => {
    const state = courseState('neuro', []);
    const set = buildSet(ITEMS, CONCEPTS, state, NOW, filterFor('rapid_ddx'), rng);
    expect(set.length).toBeGreaterThan(0);
    for (const item of set) expect(item.tags.system, item.itemId).toBe('neuro');
  });
});

describe('session builder — focus scoping', () => {
  it('at 100% block, every item is on block for the focus', () => {
    const state: AppState = {
      ...defaultState(),
      focus: { mode: 'course', id: 'pulmonary', mixPercent: 100, boards: 'all', subtopics: [] },
    };
    const set = buildSet(ITEMS, CONCEPTS, state, NOW, filterFor('rapid_ddx'), rng);
    expect(set.length).toBeGreaterThan(0);
    for (const item of set) expect(inBlock(item, state.focus), item.itemId).toBe(true);
  });

  it('the review share draws from previously seen out-of-block concepts', () => {
    const state: AppState = {
      ...defaultState(),
      focus: { mode: 'course', id: 'pulmonary', mixPercent: 75, boards: 'all', subtopics: [] },
    };
    for (const id of ['prerenal-vs-atn', 'hyperk-first']) {
      state.schedules[id] = review(newSchedule(id, NOW), `${id}-x`, true, Rating.Good, new Date('2026-07-01T12:00:00Z'));
    }
    const set = buildSet(ITEMS, CONCEPTS, state, NOW, filterFor('rapid_ddx'), rng);
    const reviewItems = set.filter((i) => !inBlock(i, state.focus));
    expect(reviewItems.length).toBeGreaterThan(0);
    for (const item of reviewItems) {
      expect(['prerenal-vs-atn', 'hyperk-first']).toContain(item.conceptId);
    }
  });

  it('retired variants are skipped so the concept resurfaces through a sibling', () => {
    const state = defaultState();
    state.focus = { mode: 'course', id: 'pulmonary', mixPercent: 100, boards: 'all', subtopics: [] };
    let sched = newSchedule('pe-recognition', NOW);
    sched = review(sched, 'pe-recognition-1', true, Rating.Good, NOW);
    sched = review(sched, 'pe-recognition-1', true, Rating.Good, NOW);
    expect(sched.retiredItems).toContain('pe-recognition-1');
    state.schedules['pe-recognition'] = sched;

    for (let trial = 0; trial < 20; trial++) {
      const set = buildSet(ITEMS, CONCEPTS, state, NOW, filterFor('rapid_ddx'), Math.random);
      const served = set.find((i) => i.conceptId === 'pe-recognition');
      if (served) expect(served.itemId).not.toBe('pe-recognition-1');
    }
  });
});
