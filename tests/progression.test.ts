import { describe, it, expect } from 'vitest';
import type { AppState, SessionItemResult } from '../src/types';
import {
  TIERS,
  tierForPoints,
  awardContext,
  earnedIds,
  ACHIEVEMENTS,
} from '../src/engine/progression';
import { defaultState, commitSession } from '../src/state/store';
import { mergeStates } from '../src/sync/merge';
import { ITEMS } from '../src/content/bank';

const now = new Date('2026-07-28T12:00:00Z');
const item = ITEMS[0];

function result(over: Partial<SessionItemResult> = {}): SessionItemResult {
  return {
    itemId: over.itemId ?? item.itemId,
    conceptId: over.conceptId ?? item.conceptId,
    correct: over.correct ?? true,
    elapsedMs: over.elapsedMs ?? 3000,
    chosen: over.chosen ?? ['a'],
    timedOut: false,
    points: over.points ?? 30,
  };
}

describe('tierForPoints', () => {
  it('starts at Preclinical with 0 points', () => {
    const p = tierForPoints(0);
    expect(p.tier.id).toBe('preclinical');
    expect(p.index).toBe(0);
    expect(p.fraction).toBe(0);
  });

  it('lands on the exact tier at its threshold', () => {
    const clerk = TIERS.find((t) => t.id === 'clerk')!;
    const p = tierForPoints(clerk.minPoints);
    expect(p.tier.id).toBe('clerk');
    expect(p.fraction).toBe(0);
  });

  it('reports a partial fraction and points-to-next between tiers', () => {
    const p = tierForPoints(1000); // between clerk (500) and sub-i (1500)
    expect(p.tier.id).toBe('clerk');
    expect(p.next?.id).toBe('subi');
    expect(p.toNext).toBe(500);
    expect(p.fraction).toBeCloseTo(0.5, 5);
  });

  it('caps at the top tier with no next', () => {
    const p = tierForPoints(9_999_999);
    expect(p.tier.id).toBe('master');
    expect(p.next).toBeNull();
    expect(p.toNext).toBe(0);
    expect(p.fraction).toBe(1);
  });

  it('tier index never decreases as points rise', () => {
    let last = -1;
    for (let pts = 0; pts <= 90000; pts += 250) {
      const idx = tierForPoints(pts).index;
      expect(idx).toBeGreaterThanOrEqual(last);
      last = idx;
    }
  });

  it('every tier threshold is strictly increasing', () => {
    for (let i = 1; i < TIERS.length; i++) {
      expect(TIERS[i].minPoints).toBeGreaterThan(TIERS[i - 1].minPoints);
    }
  });
});

describe('achievement predicates', () => {
  it('a fresh state has earned nothing', () => {
    expect(earnedIds(defaultState(), now)).toEqual([]);
  });

  it('one clean set earns First Read and Clean Strip', () => {
    const s = defaultState();
    s.sessions = [
      { startedAt: '', finishedAt: '', focus: s.focus, game: 'rapid_ddx', results: [result()], totalPoints: 30 },
    ];
    const ctx = awardContext(s, now);
    expect(ctx.sets).toBe(1);
    expect(ctx.cleanStrips).toBe(1);
    const ids = earnedIds(s, now);
    expect(ids).toContain('first-read');
    expect(ids).toContain('clean-strip');
  });

  it('a set with a miss is not a clean strip', () => {
    const s = defaultState();
    s.sessions = [
      { startedAt: '', finishedAt: '', focus: s.focus, game: 'rapid_ddx', results: [result(), result({ correct: false })], totalPoints: 30 },
    ];
    expect(awardContext(s, now).cleanStrips).toBe(0);
  });

  it('Full Toolkit needs all four games', () => {
    const s = defaultState();
    const mk = (g: 'rapid_ddx' | 'rapid_tx' | 'ecg' | 'buzzword') =>
      ({ startedAt: '', finishedAt: '', focus: s.focus, game: g, results: [result()], totalPoints: 30 });
    s.sessions = [mk('rapid_ddx'), mk('rapid_tx'), mk('ecg')];
    expect(earnedIds(s, now)).not.toContain('full-toolkit');
    s.sessions.push(mk('buzzword'));
    expect(earnedIds(s, now)).toContain('full-toolkit');
  });

  it('every achievement has a unique id and a description', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of ACHIEVEMENTS) expect(a.desc.length).toBeGreaterThan(0);
  });
});

describe('commit rewards', () => {
  it('a first set unlocks achievements, recorded so they do not repeat', () => {
    const s0 = defaultState();
    const out1 = commitSession(s0, [result(), result()], 'rapid_ddx', now, now);
    const ids = out1.newAwards.map((a) => a.id);
    expect(ids).toContain('first-read');
    expect(ids).toContain('clean-strip');
    expect(out1.state.awards.seen).toEqual(expect.arrayContaining(ids));

    // a second identical set does not re-award the same ones
    const out2 = commitSession(out1.state, [result(), result()], 'rapid_ddx', now, now);
    expect(out2.newAwards.map((a) => a.id)).not.toContain('first-read');
  });

  it('crossing a points threshold reports a promotion', () => {
    const s0 = defaultState();
    // 600 points in one set crosses Clerk (500)
    const big = Array.from({ length: 20 }, () => result({ points: 30 }));
    const out = commitSession(s0, big, 'rapid_ddx', now, now);
    expect(out.state.totalPoints).toBe(600);
    expect(out.promotedTo?.id).toBe('clerk');
  });

  it('a set that stays within a tier reports no promotion', () => {
    const s0 = defaultState();
    const out = commitSession(s0, [result({ points: 30 })], 'rapid_ddx', now, now);
    expect(out.promotedTo).toBeNull();
  });
});

describe('merge unions celebrated awards', () => {
  it('an award seen on either device is seen on the merge', () => {
    const a: AppState = { ...defaultState(), awards: { seen: ['first-read'] } };
    const b: AppState = { ...defaultState(), awards: { seen: ['on-call'] } };
    const merged = mergeStates(a, b);
    expect(merged.awards.seen).toEqual(expect.arrayContaining(['first-read', 'on-call']));
    expect(merged.awards.seen).toHaveLength(2);
  });
});
