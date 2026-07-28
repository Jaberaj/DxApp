import { describe, expect, it } from 'vitest';
import { mergeStates } from '../src/sync/merge';
import { MemoryBackend } from '../src/sync/backend';
import { SyncEngine } from '../src/sync/engine';
import { commitSession, defaultState } from '../src/state/store';
import type { AppState, SessionItemResult } from '../src/types';

const at = (iso: string) => (s: AppState): AppState => ({ ...s, updatedAt: iso });

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

/** Play one set on a state at a given wall-clock, returning the new state. */
function play(state: AppState, itemId: string, conceptId: string, when: Date): AppState {
  const now = when;
  const start = new Date(when.getTime() - 60_000);
  const out = commitSession(state, [result({ itemId, conceptId })], 'rapid_ddx', start, now).state;
  return { ...out, updatedAt: now.toISOString() };
}

describe('merge — never loses progress', () => {
  it('unions sessions and recomputes points without double-counting', () => {
    let a = defaultState();
    let b = structuredClone(a);
    // a and b share the guest history, then diverge on two devices
    a = play(a, 'pe-recognition-1', 'pe-recognition', new Date('2026-07-01T10:00:00Z'));
    b = structuredClone(a); // same shared session copied to device b
    a = play(a, 'stemi-1', 'stemi-recognition', new Date('2026-07-02T10:00:00Z'));
    b = play(b, 'ecg-vt-1', 'ecg-vt', new Date('2026-07-02T11:00:00Z'));

    const merged = mergeStates(a, b);
    // three distinct sessions: shared + a's + b's
    expect(merged.sessions).toHaveLength(3);
    // points equal the sum of the three sessions, not a + b (which would double the shared one)
    const expected = merged.sessions.reduce((n, s) => n + s.totalPoints, 0);
    expect(merged.totalPoints).toBe(expected);
    expect(merged.totalPoints).toBeLessThan(a.totalPoints + b.totalPoints);
  });

  it('keeps schedules and mastery from both devices', () => {
    let a = play(defaultState(), 'stemi-1', 'stemi-recognition', new Date('2026-07-02T10:00:00Z'));
    let b = play(defaultState(), 'ecg-vt-1', 'ecg-vt', new Date('2026-07-02T11:00:00Z'));
    const merged = mergeStates(a, b);
    expect(merged.schedules['stemi-recognition']).toBeDefined();
    expect(merged.schedules['ecg-vt']).toBeDefined();
    expect(Object.keys(merged.mastery).length).toBeGreaterThanOrEqual(2);
  });

  it('focus/settings follow the newer updatedAt', () => {
    const older = at('2026-07-01T00:00:00Z')({ ...defaultState(), focus: { ...defaultState().focus, id: 'im' } });
    const newer = at('2026-07-05T00:00:00Z')({ ...defaultState(), focus: { ...defaultState().focus, id: 'pulmonary', mode: 'course' } });
    expect(mergeStates(older, newer).focus.id).toBe('pulmonary');
    expect(mergeStates(newer, older).focus.id).toBe('pulmonary');
  });

  it('merges streak history by max-per-day', () => {
    const a = { ...defaultState(), streak: { ...defaultState().streak, history: { '2026-07-01': 1, '2026-07-02': 2 } } };
    const b = { ...defaultState(), streak: { ...defaultState().streak, history: { '2026-07-02': 1, '2026-07-03': 3 } } };
    const merged = mergeStates(a, b);
    expect(merged.streak.history).toEqual({ '2026-07-01': 1, '2026-07-02': 2, '2026-07-03': 3 });
  });
});

describe('SyncEngine', () => {
  it('first sign-in folds guest progress into an empty account (no clobber)', async () => {
    let local = play(defaultState(), 'pe-recognition-1', 'pe-recognition', new Date('2026-07-01T10:00:00Z'));
    const backend = new MemoryBackend(null); // account has never synced
    const engine = new SyncEngine(backend, { getLocal: () => local, setLocal: (s) => (local = s) });
    await engine.pull();
    expect(local.sessions).toHaveLength(1); // guest progress preserved
    expect(await backend.load()).not.toBeNull(); // and pushed to the account
  });

  it('pull merges a divergent remote into local without losing either', async () => {
    let local = play(defaultState(), 'stemi-1', 'stemi-recognition', new Date('2026-07-02T10:00:00Z'));
    const remote = play(defaultState(), 'ecg-vt-1', 'ecg-vt', new Date('2026-07-02T11:00:00Z'));
    const backend = new MemoryBackend(remote);
    const engine = new SyncEngine(backend, { getLocal: () => local, setLocal: (s) => (local = s) });
    await engine.pull();
    expect(local.schedules['stemi-recognition']).toBeDefined();
    expect(local.schedules['ecg-vt']).toBeDefined();
  });

  it('reports status transitions', async () => {
    const statuses: string[] = [];
    let local = defaultState();
    const engine = new SyncEngine(new MemoryBackend(null), {
      getLocal: () => local,
      setLocal: (s) => (local = s),
      onStatus: (s) => statuses.push(s),
    });
    await engine.pull();
    expect(statuses).toContain('syncing');
    expect(statuses).toContain('synced');
  });
});
