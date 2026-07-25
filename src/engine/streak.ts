/* ══════════════════════════════════════════════════════════════
   Streak with repair.
   A student on night float WILL break the streak, and a broken
   streak is a common quit moment. One free repair per week bridges
   a single missed day automatically. Forgivable by design.
   ══════════════════════════════════════════════════════════════ */

import type { StreakState } from '../types';

export function newStreak(): StreakState {
  return { length: 0, lastGoalMet: null, repairUsedWeekOf: null, history: {} };
}

/** YYYY-MM-DD in local time. */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Monday of the week containing d, as a date key. */
export function weekOf(d: Date): string {
  const copy = new Date(d);
  const dow = (copy.getDay() + 6) % 7; // Mon=0 … Sun=6
  copy.setDate(copy.getDate() - dow);
  return dateKey(copy);
}

function daysBetween(aKey: string, bKey: string): number {
  return Math.round((new Date(bKey).getTime() - new Date(aKey).getTime()) / 86_400_000);
}

export interface StreakUpdate {
  streak: StreakState;
  /** the free weekly repair bridged a missed day on this update */
  repaired: boolean;
  /** the daily goal was newly met on this update */
  goalMet: boolean;
}

/**
 * Record one completed set and update the streak.
 * The goal counts sets per day; `dailyGoal` of 1 is the post-call
 * setting — one set counts.
 */
export function completeSet(streak: StreakState, dailyGoal: number, now: Date): StreakUpdate {
  const today = dateKey(now);
  const history = { ...streak.history, [today]: (streak.history[today] ?? 0) + 1 };
  let next: StreakState = { ...streak, history };
  let repaired = false;
  let goalMet = false;

  if (history[today] >= dailyGoal && streak.lastGoalMet !== today) {
    goalMet = true;
    const last = streak.lastGoalMet;
    if (last === null) {
      next.length = 1;
    } else {
      const gap = daysBetween(last, today);
      if (gap === 1) {
        next.length = streak.length + 1;
      } else if (gap === 2 && streak.repairUsedWeekOf !== weekOf(now)) {
        // exactly one missed day and this week's free repair is unused
        next.length = streak.length + 1;
        next.repairUsedWeekOf = weekOf(now);
        repaired = true;
      } else {
        next.length = 1;
      }
    }
    next.lastGoalMet = today;
  }

  return { streak: next, repaired, goalMet };
}

/**
 * The streak the user currently holds. Zero once more than one day
 * has passed without meeting the goal (two, if the weekly repair is
 * still available to bridge yesterday).
 */
export function currentLength(streak: StreakState, now: Date): number {
  if (!streak.lastGoalMet) return 0;
  const gap = daysBetween(streak.lastGoalMet, dateKey(now));
  if (gap <= 1) return streak.length;
  if (gap === 2 && streak.repairUsedWeekOf !== weekOf(now)) return streak.length;
  return 0;
}
