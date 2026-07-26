import { describe, expect, it } from 'vitest';
import { Rating } from 'ts-fsrs';
import { CONCEPTS, ITEMS, servesBoard } from '../src/content/bank';
import { gameById } from '../src/content/games';
import { buildSet, inBlock, type SetFilter } from '../src/engine/session';
import { newSchedule, review } from '../src/engine/scheduler';
import { commitSession, defaultState } from '../src/state/store';
import type { AppState, BoardLevel, Item, SessionItemResult } from '../src/types';

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

describe('session builder — repeat suppression', () => {
  // small seeded PRNG so simulations are deterministic
  function mulberry(seed: number): () => number {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const asResults = (set: Item[]): SessionItemResult[] =>
    set.map((it) => ({
      itemId: it.itemId,
      conceptId: it.conceptId,
      correct: false, // keep concepts un-retired so we isolate freshness
      elapsedMs: 1,
      chosen: [],
      timedOut: false,
      points: 0,
    }));

  it('prefers a fresh presentation for a concept seen last session', () => {
    let state: AppState = {
      ...defaultState(),
      focus: { mode: 'course', id: 'pulmonary', mixPercent: 100, boards: 'all', subtopics: [] },
    };
    // mark PE variant #1 as just-seen
    state = {
      ...state,
      sessions: [
        {
          startedAt: NOW.toISOString(),
          finishedAt: NOW.toISOString(),
          focus: state.focus,
          game: 'rapid_ddx',
          results: [asResults([ITEMS.find((i) => i.itemId === 'pe-recognition-1')!])[0]],
          totalPoints: 0,
        },
      ],
    };
    for (let t = 0; t < 15; t++) {
      const set = buildSet(ITEMS, CONCEPTS, state, NOW, filterFor('rapid_ddx'), mulberry(t + 1));
      const pe = set.find((i) => i.conceptId === 'pe-recognition');
      if (pe) expect(pe.itemId, `trial ${t}`).not.toBe('pe-recognition-1');
    }
  });

  it('never serves the same vignette in consecutive sessions for a multi-variant concept', () => {
    let state: AppState = {
      ...defaultState(),
      focus: { mode: 'course', id: 'pulmonary', mixPercent: 100, boards: 'all', subtopics: [] },
    };
    // eligible variant count per concept for the DDx game
    const ddxTypes = new Set(gameById('rapid_ddx').itemTypes);
    const variantCount = new Map<string, number>();
    for (const i of ITEMS) {
      if (ddxTypes.has(i.type)) variantCount.set(i.conceptId, (variantCount.get(i.conceptId) ?? 0) + 1);
    }

    const perConcept = new Map<string, { session: number; itemId: string }[]>();
    const N = 25;
    for (let s = 0; s < N; s++) {
      const set = buildSet(ITEMS, CONCEPTS, state, NOW, filterFor('rapid_ddx'), mulberry(s + 100));
      for (const it of set) {
        const arr = perConcept.get(it.conceptId) ?? [];
        arr.push({ session: s, itemId: it.itemId });
        perConcept.set(it.conceptId, arr);
      }
      state = commitSession(state, asResults(set), 'rapid_ddx', NOW, NOW).state;
    }

    for (const [conceptId, appearances] of perConcept) {
      if ((variantCount.get(conceptId) ?? 1) < 2) continue; // single-variant concepts can't help it
      for (let k = 1; k < appearances.length; k++) {
        if (appearances[k].session === appearances[k - 1].session + 1) {
          expect(
            appearances[k].itemId,
            `${conceptId} repeated in consecutive sessions ${appearances[k - 1].session}→${appearances[k].session}`,
          ).not.toBe(appearances[k - 1].itemId);
        }
      }
    }
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
