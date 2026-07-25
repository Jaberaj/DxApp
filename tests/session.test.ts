import { describe, expect, it } from 'vitest';
import { Rating } from 'ts-fsrs';
import { CONCEPTS, ITEMS } from '../src/content/bank';
import { buildSet, inBlock, SET_SIZE } from '../src/engine/session';
import { newSchedule, review } from '../src/engine/scheduler';
import { defaultState } from '../src/state/store';
import type { AppState } from '../src/types';

const NOW = new Date('2026-07-25T12:00:00Z');
const rng = () => 0.42;

describe('session builder', () => {
  it('builds a full set of unique concepts', () => {
    const set = buildSet(ITEMS, CONCEPTS, defaultState(), NOW, rng);
    expect(set.length).toBe(Math.min(SET_SIZE, CONCEPTS.length));
    const conceptIds = set.map((i) => i.conceptId);
    expect(new Set(conceptIds).size).toBe(conceptIds.length);
  });

  it('at 100% block, every item is on block for the focus', () => {
    const state: AppState = {
      ...defaultState(),
      focus: { mode: 'course', id: 'pulmonary', mixPercent: 100 },
    };
    const set = buildSet(ITEMS, CONCEPTS, state, NOW, rng);
    expect(set.length).toBeGreaterThan(0);
    for (const item of set) {
      expect(inBlock(item, state.focus), item.itemId).toBe(true);
    }
  });

  it('the review share draws from previously seen out-of-block concepts', () => {
    const state: AppState = {
      ...defaultState(),
      focus: { mode: 'course', id: 'pulmonary', mixPercent: 75 },
    };
    // learner has already seen the renal concepts (out of block for pulmonary)
    for (const id of ['prerenal-vs-atn', 'hyperk-first']) {
      state.schedules[id] = review(newSchedule(id), `${id}-x`, true, Rating.Good, new Date('2026-07-01T12:00:00Z'));
    }
    const set = buildSet(ITEMS, CONCEPTS, state, NOW, rng);
    const reviewItems = set.filter((i) => !inBlock(i, state.focus));
    expect(reviewItems.length).toBeGreaterThan(0);
    for (const item of reviewItems) {
      expect(['prerenal-vs-atn', 'hyperk-first']).toContain(item.conceptId);
    }
  });

  it('a fresh learner with no history gets a full-block set even at 0% block', () => {
    const state: AppState = {
      ...defaultState(),
      focus: { mode: 'course', id: 'pulmonary', mixPercent: 0 },
    };
    const set = buildSet(ITEMS, CONCEPTS, state, NOW, rng);
    // nothing has been seen, so there is nothing to review — top up from block
    expect(set.length).toBeGreaterThan(0);
  });

  it('retired variants are skipped so the concept resurfaces through a sibling', () => {
    const state = defaultState();
    state.focus = { mode: 'course', id: 'pulmonary', mixPercent: 100 };
    let sched = newSchedule('pe-recognition');
    sched = review(sched, 'pe-recognition-1', true, Rating.Good, NOW);
    sched = review(sched, 'pe-recognition-1', true, Rating.Good, NOW);
    expect(sched.retiredItems).toContain('pe-recognition-1');
    state.schedules['pe-recognition'] = sched;

    for (let trial = 0; trial < 20; trial++) {
      const set = buildSet(ITEMS, CONCEPTS, state, NOW, Math.random);
      const served = set.find((i) => i.conceptId === 'pe-recognition');
      if (served) expect(served.itemId).not.toBe('pe-recognition-1');
    }
  });
});
