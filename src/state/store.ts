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
import { completeSet, newStreak, type StreakUpdate } from '../engine/streak';
import {
  earnedIds,
  tierForPoints,
  type Achievement,
  ACHIEVEMENTS,
  type Tier,
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
    awards: { seen: [] },
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
      awards: parsed.awards ?? { seen: [] },
    };
    // Grandfather existing progress: a payload from before rewards
    // shouldn't dump every already-earned achievement at once — mark
    // what's already true as "seen" so only FUTURE unlocks celebrate.
    if (!parsed.awards) {
      merged.awards = { seen: earnedIds(merged, new Date()) };
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
  /** achievements unlocked by this set (not previously celebrated) */
  newAwards: Achievement[];
  /** the tier just reached, if this set crossed a rank boundary */
  promotedTo: Tier | null;
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

  const streakUpdate = completeSet(state.streak, state.settings.dailyGoal, now);

  const masteryMoves = Object.entries(before).map(([topic, b]) => ({
    topic,
    before: b,
    after: Math.round(mastery[topic].score),
  }));

  const newTotal = state.totalPoints + totalPoints;
  const nextState: AppState = {
    ...state,
    schedules,
    mastery,
    streak: streakUpdate.streak,
    sessions: [...state.sessions, record].slice(-200),
    totalPoints: newTotal,
  };

  // rewards: which achievements are newly true, and did we cross a rank?
  const seen = new Set(state.awards?.seen ?? []);
  const newAwards = ACHIEVEMENTS.filter((a) => !seen.has(a.id)).filter((a) =>
    earnedIds(nextState, now).includes(a.id),
  );
  for (const a of newAwards) seen.add(a.id);
  nextState.awards = { seen: [...seen] };

  const beforeTier = tierForPoints(state.totalPoints).tier;
  const afterTier = tierForPoints(newTotal).tier;
  const promotedTo = afterTier.id !== beforeTier.id ? afterTier : null;

  return { state: nextState, streakUpdate, masteryMoves, newAwards, promotedTo };
}
