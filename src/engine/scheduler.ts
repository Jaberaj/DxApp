/* ══════════════════════════════════════════════════════════════
   Concept-level spaced repetition on FSRS (ts-fsrs).

   Scheduling happens per CONCEPT, never per item: repeat the same
   vignette and students memorise the woman with the knee
   replacement, not the reasoning. Individual items retire for a
   user after two consecutive correct answers; the concept then
   resurfaces through a sibling variant.
   ══════════════════════════════════════════════════════════════ */

import { createEmptyCard, fsrs, Rating, type Card, type Grade } from 'ts-fsrs';
import type { ConceptSchedule } from '../types';

const scheduler = fsrs({ enable_fuzz: false });

/** Consecutive correct answers after which an item retires. */
export const RETIRE_AFTER = 2;

export function newSchedule(conceptId: string, now: Date = new Date()): ConceptSchedule {
  return {
    conceptId,
    card: serializeCard(createEmptyCard(now)),
    retiredItems: [],
    correctStreak: {},
    lastSeen: null,
  };
}

function serializeCard(card: Card): Record<string, unknown> {
  return {
    ...card,
    due: card.due.toISOString(),
    last_review: card.last_review ? card.last_review.toISOString() : undefined,
  };
}

function reviveCard(raw: Record<string, unknown>): Card {
  return {
    ...(raw as unknown as Card),
    due: new Date(raw.due as string),
    last_review: raw.last_review ? new Date(raw.last_review as string) : undefined,
  };
}

/**
 * Map an answer to an FSRS grade. Timer state never affects
 * correctness — a slow correct answer is still correct, it just
 * grades as harder recall.
 */
export function gradeFor(correct: boolean, elapsedMs: number, timerSeconds: number): Grade {
  if (!correct) return Rating.Again;
  if (timerSeconds > 0) {
    const frac = elapsedMs / (timerSeconds * 1000);
    if (frac <= 0.4) return Rating.Easy;
    if (frac >= 1) return Rating.Hard;
  }
  return Rating.Good;
}

/** Apply one review to a concept's schedule. Returns a new object. */
export function review(
  schedule: ConceptSchedule,
  itemId: string,
  correct: boolean,
  grade: Grade,
  now: Date,
): ConceptSchedule {
  const card = reviveCard(schedule.card);
  const next = scheduler.next(card, now, grade);

  const correctStreak = { ...schedule.correctStreak };
  let retiredItems = [...schedule.retiredItems];
  if (correct) {
    correctStreak[itemId] = (correctStreak[itemId] ?? 0) + 1;
    if (correctStreak[itemId] >= RETIRE_AFTER && !retiredItems.includes(itemId)) {
      retiredItems.push(itemId);
    }
  } else {
    correctStreak[itemId] = 0;
    // a miss un-retires the item — the vignette clearly isn't memorised
    retiredItems = retiredItems.filter((id) => id !== itemId);
  }

  return {
    ...schedule,
    card: serializeCard(next.card),
    correctStreak,
    retiredItems,
    lastSeen: now.toISOString(),
  };
}

export function isDue(schedule: ConceptSchedule, now: Date): boolean {
  return new Date(schedule.card.due as string).getTime() <= now.getTime();
}

/** Days until due; negative when overdue. */
export function daysUntilDue(schedule: ConceptSchedule, now: Date): number {
  return (new Date(schedule.card.due as string).getTime() - now.getTime()) / 86_400_000;
}
