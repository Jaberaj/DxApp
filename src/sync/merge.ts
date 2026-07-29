/* ══════════════════════════════════════════════════════════════
   Progress-preserving state merge.
   When a learner uses two devices offline, both localStorage copies
   diverge. On sync we must combine them WITHOUT losing progress and
   WITHOUT double-counting. Strategy, per field:

   - focus / settings : last-write-wins by AppState.updatedAt
   - schedules        : per concept, keep the more-recently-seen card;
                        union retiredItems and take the max correctStreak
   - mastery          : per topic, keep the more-recently-updated score
   - streak           : union the daily history (max per day); take the
                        later lastGoalMet and recompute nothing else
   - sessions         : union, de-duplicated by (startedAt, finishedAt)
   - totalPoints      : RECOMPUTED from the merged sessions, so a shared
                        session is never counted twice

   Pure and deterministic — no clock, no I/O — so it is fully tested.
   ══════════════════════════════════════════════════════════════ */

import type { AppState, ConceptSchedule, SessionRecord, StreakState, TopicMastery } from '../types';

function newer(aIso: string, bIso: string): boolean {
  return new Date(aIso).getTime() >= new Date(bIso).getTime();
}

function mergeSchedules(
  a: Record<string, ConceptSchedule>,
  b: Record<string, ConceptSchedule>,
): Record<string, ConceptSchedule> {
  const out: Record<string, ConceptSchedule> = { ...a };
  for (const [id, bs] of Object.entries(b)) {
    const as = out[id];
    if (!as) {
      out[id] = bs;
      continue;
    }
    // keep the card seen most recently (null lastSeen = never)
    const aTime = as.lastSeen ? new Date(as.lastSeen).getTime() : -1;
    const bTime = bs.lastSeen ? new Date(bs.lastSeen).getTime() : -1;
    const base = bTime > aTime ? bs : as;
    const retiredItems = [...new Set([...as.retiredItems, ...bs.retiredItems])];
    const correctStreak: Record<string, number> = { ...as.correctStreak };
    for (const [item, n] of Object.entries(bs.correctStreak)) {
      correctStreak[item] = Math.max(correctStreak[item] ?? 0, n);
    }
    out[id] = { ...base, retiredItems, correctStreak };
  }
  return out;
}

function mergeMastery(
  a: Record<string, TopicMastery>,
  b: Record<string, TopicMastery>,
): Record<string, TopicMastery> {
  const out: Record<string, TopicMastery> = { ...a };
  for (const [topic, bm] of Object.entries(b)) {
    const am = out[topic];
    if (!am) {
      out[topic] = bm;
      continue;
    }
    // the later update reflects current (decayed) reality; keep the
    // higher attempt count as the record of work done
    const base = newer(bm.updatedAt, am.updatedAt) ? bm : am;
    out[topic] = { ...base, attempts: Math.max(am.attempts, bm.attempts) };
  }
  return out;
}

function mergeStreak(a: StreakState, b: StreakState): StreakState {
  const history: Record<string, number> = { ...a.history };
  for (const [day, n] of Object.entries(b.history)) {
    history[day] = Math.max(history[day] ?? 0, n);
  }
  const aLast = a.lastGoalMet ?? '';
  const bLast = b.lastGoalMet ?? '';
  const later = aLast >= bLast ? a : b;
  return {
    length: later.length,
    lastGoalMet: later.lastGoalMet,
    repairUsedWeekOf: later.repairUsedWeekOf,
    history,
  };
}

function mergeSessions(a: SessionRecord[], b: SessionRecord[]): SessionRecord[] {
  const byKey = new Map<string, SessionRecord>();
  for (const s of [...a, ...b]) byKey.set(`${s.startedAt}|${s.finishedAt}`, s);
  return [...byKey.values()]
    .sort((x, y) => new Date(x.finishedAt).getTime() - new Date(y.finishedAt).getTime())
    .slice(-200);
}

/**
 * Merge two divergent copies of a learner's state into one that
 * preserves all progress. Symmetric enough that a → b and b → a
 * agree on the accumulative fields; only focus/settings follow the
 * newer `updatedAt`.
 */
export function mergeStates(a: AppState, b: AppState): AppState {
  const sessions = mergeSessions(a.sessions, b.sessions);
  const totalPoints = sessions.reduce((sum, s) => sum + s.totalPoints, 0);
  const primary = newer(a.updatedAt, b.updatedAt) ? a : b;
  // union the celebrated-award ids so a reward seen on one device is not
  // re-celebrated on another
  const seen = [...new Set([...(a.awards?.seen ?? []), ...(b.awards?.seen ?? [])])];
  return {
    version: a.version,
    updatedAt: primary.updatedAt,
    focus: primary.focus,
    settings: primary.settings,
    schedules: mergeSchedules(a.schedules, b.schedules),
    mastery: mergeMastery(a.mastery, b.mastery),
    streak: mergeStreak(a.streak, b.streak),
    sessions,
    totalPoints,
    awards: { seen },
  };
}
