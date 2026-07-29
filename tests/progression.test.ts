import { describe, it, expect } from 'vitest';
import type { AppState, SessionItemResult } from '../src/types';
import {
  LEVEL_SIZE,
  MAX_LEVEL,
  levelFor,
  rankForLevel,
  comboAward,
  COMBO_BASE,
  COMBO_CAP,
  MILESTONES,
  milestoneReward,
  crossedMilestones,
  nextMilestone,
  earnedBadgeIds,
} from '../src/engine/progression';
import { defaultState, commitSession, reconcileShields } from '../src/state/store';
import { mergeStates } from '../src/sync/merge';
import { dateKey } from '../src/engine/streak';
import { ITEMS } from '../src/content/bank';

const now = new Date('2026-07-28T12:00:00Z');
const item = ITEMS[0];
const dayKey = (offset: number) => dateKey(new Date(now.getTime() + offset * 86400000));

function result(over: Partial<SessionItemResult> = {}): SessionItemResult {
  return {
    itemId: over.itemId ?? item.itemId,
    conceptId: over.conceptId ?? item.conceptId,
    correct: over.correct ?? true,
    elapsedMs: 2500,
    chosen: ['a'],
    timedOut: false,
    points: over.points ?? COMBO_BASE,
  };
}

describe('levels & ranks', () => {
  it('0 points is level 1, Preclinical', () => {
    const lv = levelFor(0);
    expect(lv.level).toBe(1);
    expect(lv.rank).toBe('Preclinical');
    expect(lv.fraction).toBe(0);
  });

  it('level rises one per LEVEL_SIZE points', () => {
    expect(levelFor(LEVEL_SIZE).level).toBe(2);
    expect(levelFor(LEVEL_SIZE * 2).level).toBe(3);
    expect(levelFor(LEVEL_SIZE * 4 + 10).level).toBe(5);
  });

  it('rank bands follow the spec', () => {
    expect(rankForLevel(1)).toBe('Preclinical');
    expect(rankForLevel(3)).toBe('Clerk');
    expect(rankForLevel(6)).toBe('Sub-I');
    expect(rankForLevel(9)).toBe('Acting Intern');
    expect(rankForLevel(13)).toBe('Intern');
    expect(rankForLevel(18)).toBe('Resident');
  });

  it('reports points-to-next and a fraction mid-level', () => {
    const lv = levelFor(LEVEL_SIZE + 100); // level 2, 100 into it
    expect(lv.level).toBe(2);
    expect(lv.pointsIntoLevel).toBe(100);
    expect(lv.toNext).toBe(LEVEL_SIZE - 100);
    expect(lv.fraction).toBeCloseTo(100 / LEVEL_SIZE, 5);
  });

  it('caps at MAX_LEVEL', () => {
    const lv = levelFor(LEVEL_SIZE * 100);
    expect(lv.level).toBe(MAX_LEVEL);
    expect(lv.toNext).toBe(0);
    expect(lv.fraction).toBe(1);
  });
});

describe('combo scoring', () => {
  it('is base × combo, multiplier capped at COMBO_CAP', () => {
    expect(comboAward(1)).toBe(COMBO_BASE);
    expect(comboAward(5)).toBe(COMBO_BASE * 5);
    expect(comboAward(COMBO_CAP + 6)).toBe(COMBO_BASE * COMBO_CAP);
  });
});

describe('streak milestones', () => {
  it('rewards 50×day capped at 1500, +1 shield', () => {
    expect(milestoneReward(3)).toEqual({ day: 3, points: 150, shield: 1, badgeId: 'streak-3' });
    expect(milestoneReward(100).points).toBe(1500);
  });

  it('crossedMilestones returns those passed', () => {
    expect(crossedMilestones(2, 3)).toEqual([3]);
    expect(crossedMilestones(6, 8)).toEqual([7]);
    expect(crossedMilestones(3, 3)).toEqual([]);
  });

  it('nextMilestone is the first ahead', () => {
    expect(nextMilestone(0)).toBe(3);
    expect(nextMilestone(7)).toBe(14);
    expect(nextMilestone(100)).toBeNull();
    expect(MILESTONES).toContain(30);
  });
});

describe('commit rewards', () => {
  it('sums combo points and levels up on the total', () => {
    const s0 = defaultState();
    const big = Array.from({ length: 12 }, () => result({ points: COMBO_BASE })); // 540
    const out = commitSession(s0, big, 'rapid_ddx', now, now);
    expect(out.state.totalPoints).toBe(540);
    expect(out.leveledUpTo?.level).toBe(2);
  });

  it('records the longest combo run of the set', () => {
    const s0 = defaultState();
    const seq = [true, true, true, false, true, true].map((c) => result({ correct: c }));
    const out = commitSession(s0, seq, 'rapid_ddx', now, now);
    expect(out.setBestCombo).toBe(3);
    expect(out.state.awards.bestCombo).toBe(3);
  });

  it('crossing a streak milestone awards points, a shield, and a badge', () => {
    const s0 = defaultState();
    s0.streak = { length: 2, lastGoalMet: dayKey(-1), repairUsedWeekOf: null, history: { [dayKey(-1)]: 1, [dayKey(-2)]: 1 } };
    const out = commitSession(s0, [result()], 'rapid_ddx', now, now);
    expect(out.milestones.map((m) => m.day)).toContain(3);
    expect(out.state.awards.shields).toBe(1);
    expect(out.state.awards.claimedMilestones).toContain(3);
    expect(out.newBadges.some((b) => b.id === 'streak-3')).toBe(true);
    // the milestone bonus (150) is added on top of the set points
    expect(out.state.totalPoints).toBe(COMBO_BASE + 150);
  });

  it('a first clean set unlocks badges, recorded so they do not repeat', () => {
    const s0 = defaultState();
    const out1 = commitSession(s0, [result(), result()], 'rapid_ddx', now, now);
    const ids = out1.newBadges.map((b) => b.id);
    expect(ids).toContain('first-read');
    expect(ids).toContain('clean-strip');
    const out2 = commitSession(out1.state, [result()], 'rapid_ddx', now, now);
    expect(out2.newBadges.map((b) => b.id)).not.toContain('first-read');
  });
});

describe('shield reconciliation', () => {
  it('spends a shield to bridge exactly one missed day', () => {
    const s: AppState = {
      ...defaultState(),
      streak: { length: 5, lastGoalMet: dayKey(-2), repairUsedWeekOf: null, history: {} },
      awards: { seen: [], shields: 2, bestStreak: 5, bestCombo: 0, claimedMilestones: [] },
    };
    const { state, spentShield } = reconcileShields(s, now);
    expect(spentShield).toBe(true);
    expect(state.awards.shields).toBe(1);
    expect(state.streak.lastGoalMet).toBe(dayKey(-1)); // bridged to yesterday
  });

  it('does nothing when the streak is still alive (gap ≤ 1)', () => {
    const s: AppState = {
      ...defaultState(),
      streak: { length: 5, lastGoalMet: dayKey(-1), repairUsedWeekOf: null, history: {} },
      awards: { seen: [], shields: 2, bestStreak: 5, bestCombo: 0, claimedMilestones: [] },
    };
    expect(reconcileShields(s, now).spentShield).toBe(false);
  });

  it('does nothing without a shield', () => {
    const s: AppState = {
      ...defaultState(),
      streak: { length: 5, lastGoalMet: dayKey(-2), repairUsedWeekOf: null, history: {} },
      awards: { seen: [], shields: 0, bestStreak: 5, bestCombo: 0, claimedMilestones: [] },
    };
    expect(reconcileShields(s, now).spentShield).toBe(false);
  });
});

describe('badges & merge', () => {
  it('a fresh state has no earned badges', () => {
    expect(earnedBadgeIds(defaultState(), now)).toEqual([]);
  });

  it('merge unions celebrated/claimed and keeps the best counters', () => {
    const a: AppState = { ...defaultState(), awards: { seen: ['first-read'], shields: 1, bestStreak: 3, bestCombo: 4, claimedMilestones: [3] } };
    const b: AppState = { ...defaultState(), awards: { seen: ['clean-strip'], shields: 3, bestStreak: 7, bestCombo: 9, claimedMilestones: [3, 7] } };
    const m = mergeStates(a, b).awards;
    expect(m.seen).toEqual(expect.arrayContaining(['first-read', 'clean-strip']));
    expect(m.shields).toBe(3);
    expect(m.bestStreak).toBe(7);
    expect(m.bestCombo).toBe(9);
    expect(m.claimedMilestones).toEqual(expect.arrayContaining([3, 7]));
  });
});
