import { describe, expect, it } from 'vitest';
import { Rating } from 'ts-fsrs';
import { gradeFor, isDue, newSchedule, review, RETIRE_AFTER } from '../src/engine/scheduler';

const NOW = new Date('2026-07-25T12:00:00Z');

describe('grade mapping', () => {
  it('wrong is always Again — timer never affects correctness handling', () => {
    expect(gradeFor(false, 100, 20)).toBe(Rating.Again);
    expect(gradeFor(false, 100, 0)).toBe(Rating.Again);
  });

  it('fast correct grades Easy, ordinary correct Good, over-time correct Hard', () => {
    expect(gradeFor(true, 3_000, 20)).toBe(Rating.Easy);
    expect(gradeFor(true, 12_000, 20)).toBe(Rating.Good);
    expect(gradeFor(true, 25_000, 20)).toBe(Rating.Hard);
  });

  it('with the timer off, correct is simply Good', () => {
    expect(gradeFor(true, 60_000, 0)).toBe(Rating.Good);
  });
});

describe('concept scheduling', () => {
  it('a new concept is due immediately', () => {
    expect(isDue(newSchedule('c', NOW), NOW)).toBe(true);
  });

  it('a correct review pushes the due date into the future', () => {
    const s = review(newSchedule('c'), 'item-1', true, Rating.Good, NOW);
    expect(isDue(s, NOW)).toBe(false);
    expect(s.lastSeen).toBe(NOW.toISOString());
  });

  it('items retire after two consecutive correct answers', () => {
    let s = newSchedule('c');
    for (let i = 0; i < RETIRE_AFTER; i++) {
      s = review(s, 'item-1', true, Rating.Good, NOW);
    }
    expect(s.retiredItems).toContain('item-1');
  });

  it('a miss resets the streak and un-retires the item', () => {
    let s = newSchedule('c');
    s = review(s, 'item-1', true, Rating.Good, NOW);
    s = review(s, 'item-1', true, Rating.Good, NOW);
    expect(s.retiredItems).toContain('item-1');
    s = review(s, 'item-1', false, Rating.Again, NOW);
    expect(s.retiredItems).not.toContain('item-1');
    expect(s.correctStreak['item-1']).toBe(0);
  });

  it('schedule state survives a JSON round-trip', () => {
    const s = review(newSchedule('c'), 'item-1', true, Rating.Good, NOW);
    const revived = JSON.parse(JSON.stringify(s));
    const after = review(revived, 'item-1', true, Rating.Good, new Date('2026-07-26T12:00:00Z'));
    expect(after.correctStreak['item-1']).toBe(2);
    expect(isDue(after, new Date('2026-07-26T13:00:00Z'))).toBe(false);
  });
});
