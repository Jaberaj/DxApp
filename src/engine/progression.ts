/* ══════════════════════════════════════════════════════════════
   Progression — tiers, ranks, and rewards.
   Cadence keeps score like an instrument, not an arcade: the ladder
   is the medical training path, and rewards are tied to REAL things
   (streaks, clean sets, topics taken solid, breadth), never to
   grinding a currency. Everything here is pure and derived from
   AppState, so it is fully unit-tested and never a second source of
   truth. `awards.seen` (in state) only records what has already been
   celebrated, so a milestone is congratulated once.
   ══════════════════════════════════════════════════════════════ */

import type { AppState, System } from '../types';
import { band, decayedScore } from './mastery';
import { currentLength } from './streak';

/** A rank on the training ladder. Accent maps to a CSS colour token. */
export interface Tier {
  id: string;
  name: string;
  /** cumulative points at which this tier is reached */
  minPoints: number;
  /** colour key: ink | pulse | depth | plum | brass */
  accent: 'ink' | 'pulse' | 'depth' | 'plum' | 'brass';
}

/**
 * The ladder. Thresholds are spaced so a rank means real work — a set
 * is ~250–360 points, so Clerk is a few sets, Attending is a season.
 */
export const TIERS: Tier[] = [
  { id: 'preclinical', name: 'Preclinical', minPoints: 0, accent: 'ink' },
  { id: 'clerk', name: 'Clinical Clerk', minPoints: 500, accent: 'pulse' },
  { id: 'subi', name: 'Sub-Intern', minPoints: 1500, accent: 'pulse' },
  { id: 'intern', name: 'Intern', minPoints: 3500, accent: 'depth' },
  { id: 'resident', name: 'Resident', minPoints: 7000, accent: 'depth' },
  { id: 'senior', name: 'Senior Resident', minPoints: 12000, accent: 'plum' },
  { id: 'chief', name: 'Chief Resident', minPoints: 20000, accent: 'plum' },
  { id: 'fellow', name: 'Fellow', minPoints: 32000, accent: 'brass' },
  { id: 'attending', name: 'Attending', minPoints: 50000, accent: 'brass' },
  { id: 'master', name: 'Master Clinician', minPoints: 80000, accent: 'brass' },
];

export interface TierProgress {
  tier: Tier;
  /** 0-based index into TIERS */
  index: number;
  /** the next tier, or null at the top */
  next: Tier | null;
  /** points still needed to reach `next` (0 at the top) */
  toNext: number;
  /** 0–1 fraction of the way from `tier` to `next` (1 at the top) */
  fraction: number;
}

/** Where a point total sits on the ladder. */
export function tierForPoints(points: number): TierProgress {
  let index = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (points >= TIERS[i].minPoints) index = i;
  }
  const tier = TIERS[index];
  const next = TIERS[index + 1] ?? null;
  if (!next) return { tier, index, next: null, toNext: 0, fraction: 1 };
  const span = next.minPoints - tier.minPoints;
  const into = points - tier.minPoints;
  return {
    tier,
    index,
    next,
    toNext: Math.max(0, next.minPoints - points),
    fraction: Math.max(0, Math.min(1, into / span)),
  };
}

/* ── achievements ───────────────────────────────────────────── */

export type AchievementGroup = 'Milestones' | 'Precision' | 'Consistency' | 'Mastery' | 'Breadth';

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  group: AchievementGroup;
  /** inline SVG path(s) for a 24×24 stroke icon */
  icon: string;
  /** true when earned, given the derived context */
  test: (c: AwardContext) => boolean;
}

/** Numbers every achievement predicate reads — derived once, pure. */
export interface AwardContext {
  points: number;
  sets: number;
  streak: number;
  /** topics currently at the `solid` band */
  solidTopics: number;
  /** sets finished with zero misses */
  cleanStrips: number;
  /** distinct mini-games played */
  gamesPlayed: number;
  /** distinct systems the learner has touched */
  systemsTouched: number;
  /** concepts ever seen (have a schedule) */
  conceptsSeen: number;
}

export function awardContext(state: AppState, now: Date): AwardContext {
  const masteries = Object.values(state.mastery);
  const solidTopics = masteries.filter((m) => band(decayedScore(m, now)) === 'solid').length;
  const systemsTouched = new Set<System>(masteries.map((m) => m.system)).size;
  const cleanStrips = state.sessions.filter(
    (s) => s.results.length > 0 && s.results.every((r) => r.correct),
  ).length;
  const gamesPlayed = new Set(state.sessions.map((s) => s.game)).size;
  return {
    points: state.totalPoints,
    sets: state.sessions.length,
    streak: currentLength(state.streak, now),
    solidTopics,
    cleanStrips,
    gamesPlayed,
    systemsTouched,
    conceptsSeen: Object.keys(state.schedules).length,
  };
}

// 24×24 stroke icons (match the app's inline-SVG convention)
const IC = {
  flag: '<path d="M5 21V4M5 4c4-2 8 2 12 0v9c-4 2-8-2-12 0"/>',
  stack: '<path d="M12 3l9 5-9 5-9-5 9-5M3 13l9 5 9-5M3 17l9 5 9-5"/>',
  trophy: '<path d="M7 4h10v4a5 5 0 0 1-10 0V4M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M12 14v6"/>',
  pulse: '<path d="M2 12h4l2.5-7 4 14L15 12h7"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  flame: '<path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-1 .5-2 1.5-3 .3 1 1 1.5 1.5 1.5C9 9 10 6 12 3Z"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  shield: '<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3Z"/>',
  layers: '<path d="M12 2l9 5-9 5-9-5 9-5M3 12l9 5 9-5M3 17l9 5 9-5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6 6-2Z"/>',
  toolkit: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  gem: '<path d="M6 3h12l3 6-9 12L3 9l3-6ZM3 9h18M9 3l3 18M15 3l-3 18"/>',
};

/** The reward set. Order is display order within a group. */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-read', name: 'First Read', desc: 'Complete your first set.', group: 'Milestones', icon: IC.flag, test: (c) => c.sets >= 1 },
  { id: 'ten-sets', name: 'Ten Sets', desc: 'Complete ten sets.', group: 'Milestones', icon: IC.stack, test: (c) => c.sets >= 10 },
  { id: 'century', name: 'Century', desc: 'Complete one hundred sets.', group: 'Milestones', icon: IC.trophy, test: (c) => c.sets >= 100 },
  { id: 'ten-k', name: '10k Club', desc: 'Reach 10,000 points.', group: 'Milestones', icon: IC.gem, test: (c) => c.points >= 10000 },

  { id: 'clean-strip', name: 'Clean Strip', desc: 'Finish a set with no misses.', group: 'Precision', icon: IC.pulse, test: (c) => c.cleanStrips >= 1 },
  { id: 'sharpshooter', name: 'Sharpshooter', desc: 'Five clean strips.', group: 'Precision', icon: IC.target, test: (c) => c.cleanStrips >= 5 },

  { id: 'on-call', name: 'On Call', desc: 'A three-day streak.', group: 'Consistency', icon: IC.flame, test: (c) => c.streak >= 3 },
  { id: 'rounding', name: 'Rounding Daily', desc: 'A seven-day streak.', group: 'Consistency', icon: IC.calendar, test: (c) => c.streak >= 7 },
  { id: 'ironman', name: 'Ironman', desc: 'A thirty-day streak.', group: 'Consistency', icon: IC.shield, test: (c) => c.streak >= 30 },

  { id: 'first-solid', name: 'First Solid', desc: 'Take a topic to solid.', group: 'Mastery', icon: IC.layers, test: (c) => c.solidTopics >= 1 },
  { id: 'ten-solid', name: 'Consultant', desc: 'Ten topics at solid.', group: 'Mastery', icon: IC.stack, test: (c) => c.solidTopics >= 10 },

  { id: 'full-toolkit', name: 'Full Toolkit', desc: 'Play all four mini-games.', group: 'Breadth', icon: IC.toolkit, test: (c) => c.gamesPlayed >= 4 },
  { id: 'explorer', name: 'Board Explorer', desc: 'Reach eight body systems.', group: 'Breadth', icon: IC.compass, test: (c) => c.systemsTouched >= 8 },
];

/** Achievement ids currently earned. */
export function earnedIds(state: AppState, now: Date): string[] {
  const ctx = awardContext(state, now);
  return ACHIEVEMENTS.filter((a) => a.test(ctx)).map((a) => a.id);
}

/** Achievement objects currently earned. */
export function earnedAchievements(state: AppState, now: Date): Achievement[] {
  const ctx = awardContext(state, now);
  return ACHIEVEMENTS.filter((a) => a.test(ctx));
}

export function achievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
