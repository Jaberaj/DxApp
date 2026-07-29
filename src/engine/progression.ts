/* ══════════════════════════════════════════════════════════════
   Progression — levels, ranks, streak shields, combos, and badges.
   The reward layer from the v5 gamification pass (docs live in the
   design's CADENCE_GAMIFICATION.md). It keeps the app's dry, earned-
   praise voice: every number is derived from real state, nothing is a
   placeholder. Pure and unit-tested — the UI only renders what these
   functions compute, and the store folds the results into state.
   ══════════════════════════════════════════════════════════════ */

import type { AppState, System } from '../types';
import { band, decayedScore } from './mastery';
import { currentLength } from './streak';

/* ── levels & ranks ─────────────────────────────────────────── */

/** Points per level. Level = floor(points / LEVEL_SIZE) + 1, capped. */
export const LEVEL_SIZE = 400;
export const MAX_LEVEL = 20;

/** Rank name by level band (spec §2). */
export function rankForLevel(level: number): string {
  if (level <= 2) return 'Preclinical';
  if (level <= 4) return 'Clerk';
  if (level <= 7) return 'Sub-I';
  if (level <= 11) return 'Acting Intern';
  if (level <= 15) return 'Intern';
  return 'Resident';
}

export interface LevelInfo {
  level: number;
  rank: string;
  /** points accumulated inside the current level (0…LEVEL_SIZE) */
  pointsIntoLevel: number;
  /** points needed to reach the next level (0 at the cap) */
  toNext: number;
  /** 0–1 fraction of the way through the current level (1 at the cap) */
  fraction: number;
  /** the rank the next level unlocks, if it differs; else null */
  nextRank: string | null;
}

export function levelFor(points: number): LevelInfo {
  const raw = Math.floor(Math.max(0, points) / LEVEL_SIZE) + 1;
  const level = Math.min(MAX_LEVEL, raw);
  const rank = rankForLevel(level);
  if (level >= MAX_LEVEL) {
    return { level, rank, pointsIntoLevel: LEVEL_SIZE, toNext: 0, fraction: 1, nextRank: null };
  }
  const floor = (level - 1) * LEVEL_SIZE;
  const pointsIntoLevel = points - floor;
  const nextRank = rankForLevel(level + 1);
  return {
    level,
    rank,
    pointsIntoLevel,
    toNext: level * LEVEL_SIZE - points,
    fraction: Math.max(0, Math.min(1, pointsIntoLevel / LEVEL_SIZE)),
    nextRank: nextRank !== rank ? nextRank : null,
  };
}

/* ── streak milestones & shields ────────────────────────────── */

export const MILESTONES = [3, 7, 14, 30, 60, 100];
export const MAX_SHIELDS = 3;

export interface MilestoneReward {
  day: number;
  points: number;
  shield: number;
  badgeId: string;
}

/** Reward for reaching a streak milestone (spec §2). */
export function milestoneReward(day: number): MilestoneReward {
  return { day, points: Math.min(50 * day, 1500), shield: 1, badgeId: `streak-${day}` };
}

/** The next milestone at or after the current streak, or null past 100. */
export function nextMilestone(streakDays: number): number | null {
  return MILESTONES.find((m) => m > streakDays) ?? null;
}

/** Milestones newly crossed moving from `before` to `after` streak days. */
export function crossedMilestones(before: number, after: number): number[] {
  return MILESTONES.filter((m) => m > before && m <= after);
}

/* ── combo scoring ──────────────────────────────────────────── */

/** Base award per correct item; combo multiplies it. */
export const COMBO_BASE = 45;
/** The multiplier caps here (the combo counter itself can go higher). */
export const COMBO_CAP = 10;

/**
 * Points for a correct answer at the given combo (after incrementing).
 * A wrong answer is 0 and resets the combo elsewhere. The multiplier is
 * capped at COMBO_CAP even though the counter keeps climbing.
 */
export function comboAward(comboAfterCorrect: number): number {
  return COMBO_BASE * Math.min(Math.max(1, comboAfterCorrect), COMBO_CAP);
}

/* ── badges (the shelf) ─────────────────────────────────────── */

export type BadgeGrad = 'green' | 'blue' | 'amber' | 'violet';

export interface Badge {
  id: string;
  name: string;
  /** short glyph shown in the shelf chip, e.g. '5', 'Ca', '✓' */
  glyph: string;
  grad: BadgeGrad;
  test: (c: AwardContext) => boolean;
}

/** Numbers every badge predicate reads — derived once, pure. */
export interface AwardContext {
  points: number;
  level: number;
  sets: number;
  streak: number;
  bestStreak: number;
  bestCombo: number;
  solidTopics: number;
  /** sets finished with zero misses */
  cleanStrips: number;
  /** sets finished 12+ items all correct */
  perfectSets: number;
  /** a set with accuracy ≥ 90% */
  ninetiesSets: number;
  gamesPlayed: number;
  systemsTouched: number;
}

export function awardContext(state: AppState, now: Date): AwardContext {
  const masteries = Object.values(state.mastery);
  const solidTopics = masteries.filter((m) => band(decayedScore(m, now)) === 'solid').length;
  const systemsTouched = new Set<System>(masteries.map((m) => m.system)).size;
  let cleanStrips = 0;
  let perfectSets = 0;
  let ninetiesSets = 0;
  for (const s of state.sessions) {
    const n = s.results.length;
    if (n === 0) continue;
    const correct = s.results.filter((r) => r.correct).length;
    if (correct === n) cleanStrips++;
    if (correct === n && n >= 12) perfectSets++;
    if (correct / n >= 0.9) ninetiesSets++;
  }
  return {
    points: state.totalPoints,
    level: levelFor(state.totalPoints).level,
    sets: state.sessions.length,
    streak: currentLength(state.streak, now),
    bestStreak: state.awards?.bestStreak ?? 0,
    bestCombo: state.awards?.bestCombo ?? 0,
    solidTopics,
    cleanStrips,
    perfectSets,
    ninetiesSets,
    gamesPlayed: new Set(state.sessions.map((s) => s.game)).size,
    systemsTouched,
  };
}

/** The shelf. Milestone badges (streak-N) are added dynamically below. */
export const BADGES: Badge[] = [
  { id: 'first-read', name: 'First read', glyph: '✓', grad: 'green', test: (c) => c.sets >= 1 },
  { id: 'ten-sets', name: 'Ten sets', glyph: '10', grad: 'green', test: (c) => c.sets >= 10 },
  { id: 'century', name: 'Century', glyph: '100', grad: 'green', test: (c) => c.sets >= 100 },

  { id: 'five-combo', name: 'Five in a row', glyph: '5', grad: 'amber', test: (c) => c.bestCombo >= 5 },
  { id: 'ten-combo', name: 'Ten in a row', glyph: '×10', grad: 'amber', test: (c) => c.bestCombo >= 10 },
  { id: 'clean-strip', name: 'Clean strip', glyph: '⌁', grad: 'green', test: (c) => c.cleanStrips >= 1 },
  { id: 'perfect-set', name: 'Perfect set', glyph: '12', grad: 'blue', test: (c) => c.perfectSets >= 1 },
  { id: 'nineties', name: 'Nineties club', glyph: '90', grad: 'blue', test: (c) => c.ninetiesSets >= 1 },

  { id: 'first-solid', name: 'First solid', glyph: 'S', grad: 'green', test: (c) => c.solidTopics >= 1 },
  { id: 'ten-solid', name: 'Consultant', glyph: '10', grad: 'green', test: (c) => c.solidTopics >= 10 },

  { id: 'full-toolkit', name: 'Full toolkit', glyph: '4', grad: 'violet', test: (c) => c.gamesPlayed >= 4 },
  { id: 'explorer', name: 'Board explorer', glyph: '8', grad: 'violet', test: (c) => c.systemsTouched >= 8 },
  { id: 'ten-k', name: '10k club', glyph: '10k', grad: 'amber', test: (c) => c.points >= 10000 },

  { id: 'level-5', name: 'Sub-intern', glyph: 'L5', grad: 'blue', test: (c) => c.level >= 5 },
  { id: 'level-10', name: 'Acting intern', glyph: 'L10', grad: 'blue', test: (c) => c.level >= 10 },
];

/** Milestone badge definitions (earned via claimed streak milestones). */
export function milestoneBadge(day: number): Badge {
  const glyph = day >= 100 ? '100' : String(day);
  return {
    id: `streak-${day}`,
    name: day >= 30 ? `${day}-day streak` : day === 7 ? 'Full week' : `${day}-day streak`,
    glyph,
    grad: 'amber',
    test: () => false, // awarded explicitly on milestone, not derived
  };
}

/** All badge definitions including milestone badges, for the shelf. */
export function allBadges(): Badge[] {
  return [...BADGES, ...MILESTONES.map(milestoneBadge)];
}

/** Badge ids currently earned from the derived context (non-milestone). */
export function earnedBadgeIds(state: AppState, now: Date): string[] {
  const ctx = awardContext(state, now);
  const derived = BADGES.filter((b) => b.test(ctx)).map((b) => b.id);
  // milestone badges are earned by claiming (recorded in seen), keep them
  const claimed = (state.awards?.claimedMilestones ?? []).map((d) => `streak-${d}`);
  return [...new Set([...derived, ...claimed])];
}

export function badgeById(id: string): Badge | undefined {
  return allBadges().find((b) => b.id === id);
}
