import { describe, expect, it } from 'vitest';
import { commitSession, defaultState, loadState, saveState } from '../src/state/store';
import type { SessionItemResult } from '../src/types';

const NOW = new Date('2026-07-25T12:00:00Z');
const START = new Date('2026-07-25T11:54:00Z');

const result = (over: Partial<SessionItemResult>): SessionItemResult => ({
  itemId: 'pe-recognition-1',
  conceptId: 'pe-recognition',
  correct: true,
  elapsedMs: 4000,
  chosen: ['a'],
  timedOut: false,
  points: 40,
  ...over,
});

describe('commitSession', () => {
  it('folds results into schedules, mastery, streak, points, and history atomically', () => {
    const results = [
      result({}),
      result({ itemId: 'vt-vs-svt-1', conceptId: 'vt-vs-svt', correct: false, points: 0 }),
    ];
    const { state, masteryMoves, streakUpdate } = commitSession(defaultState(), results, START, NOW);

    expect(state.schedules['pe-recognition']).toBeDefined();
    expect(state.schedules['vt-vs-svt']).toBeDefined();
    expect(state.mastery['Pulmonary embolism'].score).toBeGreaterThan(0);
    expect(state.mastery['Tachyarrhythmias'].score).toBe(0);
    expect(state.totalPoints).toBe(40);
    expect(state.sessions).toHaveLength(1);
    expect(state.sessions[0].results).toHaveLength(2);
    expect(streakUpdate.goalMet).toBe(true);

    const pe = masteryMoves.find((m) => m.topic === 'Pulmonary embolism');
    expect(pe).toBeDefined();
    expect(pe!.after).toBeGreaterThan(pe!.before);
  });

  it('does not mutate the input state', () => {
    const before = defaultState();
    const snapshot = JSON.stringify(before);
    commitSession(before, [result({})], START, NOW);
    expect(JSON.stringify(before)).toBe(snapshot);
  });
});

describe('persistence', () => {
  it('round-trips through a storage backend', () => {
    const mem = new Map<string, string>();
    const storage = {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
    };
    const { state } = commitSession(defaultState(), [result({})], START, NOW);
    saveState(state, storage);
    const loaded = loadState(storage);
    expect(loaded.totalPoints).toBe(40);
    expect(loaded.schedules['pe-recognition']).toBeDefined();
  });

  it('falls back to defaults on corrupt or missing data', () => {
    expect(loadState({ getItem: () => 'not json{{' }).totalPoints).toBe(0);
    expect(loadState({ getItem: () => null }).focus.mode).toBe('rotation');
  });
});
