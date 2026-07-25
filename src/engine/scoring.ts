/* ══════════════════════════════════════════════════════════════
   Scoring.
   The critical rule: the timer affects BONUS POINTS ONLY, never
   correctness. Punishing slow-but-right answers teaches guessing,
   which is the opposite of the skill. You lose the speed bonus,
   never the point.
   ══════════════════════════════════════════════════════════════ */

export const BASE_POINTS = 30;
export const MAX_SPEED_BONUS = 15;

/**
 * @param correct     whether the answer was right (timer plays no part)
 * @param elapsedMs   time from item shown to answer locked
 * @param timerSeconds  configured per-item timer; 0 = timer off
 */
export function pointsFor(correct: boolean, elapsedMs: number, timerSeconds: number): number {
  if (!correct) return 0;
  if (timerSeconds <= 0) return BASE_POINTS;
  const remaining = Math.max(0, 1 - elapsedMs / (timerSeconds * 1000));
  return BASE_POINTS + Math.round(MAX_SPEED_BONUS * remaining);
}
