import { describe, expect, it } from 'vitest';
import { completeSet, currentLength, newStreak } from '../src/engine/streak';

// local-noon timestamps so dateKey is stable regardless of TZ
const day = (d: string) => new Date(`${d}T12:00:00`);

describe('streak', () => {
  it('meeting the daily goal starts and extends the streak', () => {
    let { streak } = completeSet(newStreak(), 1, day('2026-01-05'));
    expect(streak.length).toBe(1);
    ({ streak } = completeSet(streak, 1, day('2026-01-06')));
    expect(streak.length).toBe(2);
  });

  it('a second set on the same day does not double-count', () => {
    let { streak } = completeSet(newStreak(), 1, day('2026-01-05'));
    ({ streak } = completeSet(streak, 1, day('2026-01-05')));
    expect(streak.length).toBe(1);
    expect(streak.history['2026-01-05']).toBe(2);
  });

  it('a daily goal above one requires that many sets', () => {
    const first = completeSet(newStreak(), 2, day('2026-01-05'));
    expect(first.goalMet).toBe(false);
    expect(first.streak.length).toBe(0);
    const second = completeSet(first.streak, 2, day('2026-01-05'));
    expect(second.goalMet).toBe(true);
    expect(second.streak.length).toBe(1);
  });

  it('one missed day is bridged by the free weekly repair', () => {
    let { streak } = completeSet(newStreak(), 1, day('2026-01-05'));
    ({ streak } = completeSet(streak, 1, day('2026-01-06')));
    // skip Jan 7 (night float) — resume Jan 8
    const res = completeSet(streak, 1, day('2026-01-08'));
    expect(res.repaired).toBe(true);
    expect(res.streak.length).toBe(3);
  });

  it('only one repair per week — a second gap resets', () => {
    let { streak } = completeSet(newStreak(), 1, day('2026-01-05'));
    ({ streak } = completeSet(streak, 1, day('2026-01-06')));
    ({ streak } = completeSet(streak, 1, day('2026-01-08'))); // repair used
    // skip Jan 9 — resume Jan 10, same ISO week
    const res = completeSet(streak, 1, day('2026-01-10'));
    expect(res.repaired).toBe(false);
    expect(res.streak.length).toBe(1);
  });

  it('a gap of two or more days always resets', () => {
    let { streak } = completeSet(newStreak(), 1, day('2026-01-05'));
    const res = completeSet(streak, 1, day('2026-01-09'));
    expect(res.streak.length).toBe(1);
  });

  it('currentLength holds through today and one reachable missed day', () => {
    const { streak } = completeSet(newStreak(), 1, day('2026-01-05'));
    expect(currentLength(streak, day('2026-01-05'))).toBe(1);
    expect(currentLength(streak, day('2026-01-06'))).toBe(1);
    // two days later the streak is only alive if the repair could still bridge it
    expect(currentLength(streak, day('2026-01-07'))).toBe(1);
    expect(currentLength(streak, day('2026-01-08'))).toBe(0);
  });
});
