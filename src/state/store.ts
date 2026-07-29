/* ══════════════════════════════════════════════════════════════
   State store.
   Guest-first: everything lives in localStorage so a learner can
   do full sets before any account exists. The whole learner state
   is small JSON by design — when accounts arrive (V1 sign-in),
   this exact payload becomes the sync document.
   ══════════════════════════════════════════════════════════════ */

import type { AppState, GameId, SessionItemResult, SessionRecord, Settings } from '../types';
import { conceptById } from '../content/bank';
import { applyResult, newTopicMastery } from '../engine/mastery';
import { gradeFor, newSchedule, review } from '../engine/scheduler';
import { completeSet, dateKey, daysBetween, newStreak, type StreakUpdate } from '../engine/streak';
import {
  earnedBadgeIds,
  levelFor,
  crossedMilestones,
  milestoneReward,
  milestoneBadge,
  badgeById,
  MAX_SHIELDS,
  type Badge,
  type LevelInfo,
  type MilestoneReward,
} from '../engine/progression';

const STORAGE_KEY = 'cadence.v1';
const STATE_VERSION = 1;

export function defaultSettings(mode: 'course' | 'rotation'): Settings {
  // Course mode: timer off by default. Rotation: 20s on.
  return { timerSeconds: mode === 'rotation' ? 20 : 0, dailyGoal: 1 };
}

export function defaultState(): AppState {
  return {
    version: STATE_VERSION,
    updatedAt: new Date().toISOString(),
    focus: { mode: 'rotation', id: 'im', mixPercent: 75, boards: 'all', subtopics: [] },
    settings: defaultSettings('rotation'),
    schedules: {},
    mastery: {},
    streak: newStreak(),
    sessions: [],
    totalPoints: 0,
    awards: { seen: [], shields: 0, bestStreak: 0, bestCombo: 0, claimedMilestones: [] },
  };
}

export function loadState(storage: Pick<Storage, 'getItem'> = localStorage): AppState {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== STATE_VERSION) return defaultState();
    const base = defaultState();
    // deep-merge focus so a payload from before board scoping still
    // gets a valid `boards` default; keep the stored updatedAt if present
    const merged: AppState = {
      ...base,
      ...parsed,
      updatedAt: parsed.updatedAt ?? base.updatedAt,
      focus: { ...base.focus, ...parsed.focus },
      awards: { ...base.awards, ...parsed.awards },
    };
    // Grandfather existing progress: a payload from before rewards
    // shouldn't dump every already-earned badge at once — mark what's
    // already true as "seen" so only FUTURE unlocks celebrate. Also
    // seed bestStreak from the current streak length.
    if (!parsed.awards) {
      merged.awards = {
        seen: earnedBadgeIds(merged, new Date()),
        shields: 0,
        bestStreak: merged.streak.length,
        bestCombo: 0,
        claimedMilestones: [],
      };
    }
    return merged;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState, storage: Pick<Storage, 'setItem'> = localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export interface CommitOutcome {
  state: AppState;
  streakUpdate: StreakUpdate;
  /** per-topic mastery before → after, for the "Moved today" panel */
  masteryMoves: { topic: string; before: number; after: number }[];
  /** badges unlocked by this set (not previously celebrated) */
  newBadges: Badge[];
  /** the level reached, if this set crossed a level boundary */
  leveledUpTo: LevelInfo | null;
  /** streak milestones crossed by this set (usually one, or none) */
  milestones: MilestoneReward[];
  /** longest run of consecutive correct answers within this set */
  setBestCombo: number;
}

/** Longest run of consecutive correct answers in a result list. */
function longestComboRun(results: SessionItemResult[]): number {
  let best = 0;
  let run = 0;
  for (const r of results) {
    run = r.correct ? run + 1 : 0;
    if (run > best) best = run;
  }
  return best;
}

/**
 * Fold a finished session into learner state in one atomic step:
 * FSRS review per concept, mastery per topic, streak, points,
 * session history.
 */
export function commitSession(
  state: AppState,
  results: SessionItemResult[],
  game: GameId,
  startedAt: Date,
  now: Date,
): CommitOutcome {
  const schedules = { ...state.schedules };
  const mastery = { ...state.mastery };
  const before: Record<string, number> = {};

  for (const r of results) {
    const concept = conceptById(r.conceptId);
    if (!concept) continue;

    const sched = schedules[r.conceptId] ?? newSchedule(r.conceptId, now);
    const grade = gradeFor(r.correct, r.elapsedMs, state.settings.timerSeconds);
    schedules[r.conceptId] = review(sched, r.itemId, r.correct, grade, now);

    const m = mastery[concept.topic] ?? newTopicMastery(concept.topic, concept.system, now);
    if (!(concept.topic in before)) before[concept.topic] = Math.round(m.score);
    mastery[concept.topic] = applyResult(m, r.correct, now);
  }

  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const record: SessionRecord = {
    startedAt: startedAt.toISOString(),
    finishedAt: now.toISOString(),
    focus: { ...state.focus },
    game,
    results,
    totalPoints,
  };

  const beforeStreak = state.streak.length;
  const streakUpdate = completeSet(state.streak, state.settings.dailyGoal, now);
  const afterStreak = streakUpdate.streak.length;

  const masteryMoves = Object.entries(before).map(([topic, b]) => ({
    topic,
    before: b,
    after: Math.round(mastery[topic].score),
  }));

  const awards = { ...(state.awards ?? { seen: [] }) };
  const seen = new Set(awards.seen ?? []);
  const claimed = new Set(awards.claimedMilestones ?? []);
  let shields = awards.shields ?? 0;

  // ── streak milestones crossed by this set ──
  const milestones: MilestoneReward[] = crossedMilestones(beforeStreak, afterStreak)
    .filter((day) => !claimed.has(day))
    .map(milestoneReward);
  let bonusPoints = 0;
  for (const m of milestones) {
    bonusPoints += m.points;
    shields = Math.min(MAX_SHIELDS, shields + m.shield);
    claimed.add(m.day);
    seen.add(m.badgeId); // the milestone celebration IS the badge moment
  }

  const setBestCombo = longestComboRun(results);
  const bestCombo = Math.max(awards.bestCombo ?? 0, setBestCombo);
  const bestStreak = Math.max(awards.bestStreak ?? 0, afterStreak);
  const newTotal = state.totalPoints + totalPoints + bonusPoints;

  const nextState: AppState = {
    ...state,
    schedules,
    mastery,
    streak: streakUpdate.streak,
    sessions: [...state.sessions, record].slice(-200),
    totalPoints: newTotal,
    awards: {
      seen: [...seen],
      shields,
      bestStreak,
      bestCombo,
      claimedMilestones: [...claimed],
    },
  };

  // ── badges newly earned (derived), plus any milestone badges ──
  const earnedNow = earnedBadgeIds(nextState, now);
  const newBadgeIds = earnedNow.filter((id) => !seen.has(id));
  for (const id of newBadgeIds) seen.add(id);
  nextState.awards = { ...nextState.awards, seen: [...seen] };
  const newBadges: Badge[] = [
    ...milestones.map((m) => milestoneBadge(m.day)),
    ...newBadgeIds.map((id) => badgeById(id)).filter((b): b is Badge => !!b),
  ];

  // ── level-up on the FINAL total (including any milestone bonus) ──
  const beforeLevel = levelFor(state.totalPoints).level;
  const afterInfo = levelFor(newTotal);
  const leveledUpTo = afterInfo.level > beforeLevel ? afterInfo : null;

  return { state: nextState, streakUpdate, masteryMoves, newBadges, leveledUpTo, milestones, setBestCombo };
}

/**
 * On app open, spend a shield to cover exactly one missed day so the
 * streak survives. Pure; returns whether a shield was spent so the UI
 * can show a non-blocking toast. A gap of 0/1 day is still alive; a gap
 * of 2 means yesterday was missed — bridge it if a shield is available.
 */
export function reconcileShields(
  state: AppState,
  now: Date,
): { state: AppState; spentShield: boolean } {
  const last = state.streak.lastGoalMet;
  const shields = state.awards?.shields ?? 0;
  if (!last || shields <= 0) return { state, spentShield: false };
  if (daysBetween(last, dateKey(now)) !== 2) return { state, spentShield: false };
  // bridge: mark yesterday as met so the streak stays alive, spend a shield
  const yesterday = dateKey(new Date(now.getTime() - 86400000));
  return {
    state: {
      ...state,
      streak: { ...state.streak, lastGoalMet: yesterday },
      awards: { ...(state.awards ?? { seen: [] }), shields: shields - 1 },
    },
    spentShield: true,
  };
}
