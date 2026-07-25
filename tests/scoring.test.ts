import { describe, expect, it } from 'vitest';
import { BASE_POINTS, MAX_SPEED_BONUS, pointsFor } from '../src/engine/scoring';

describe('scoring', () => {
  it('a wrong answer scores zero regardless of speed', () => {
    expect(pointsFor(false, 100, 20)).toBe(0);
    expect(pointsFor(false, 30_000, 20)).toBe(0);
  });

  it('the timer affects bonus only — a slow correct answer keeps full base points', () => {
    expect(pointsFor(true, 25_000, 20)).toBe(BASE_POINTS);
  });

  it('an instant correct answer earns the full bonus', () => {
    expect(pointsFor(true, 0, 20)).toBe(BASE_POINTS + MAX_SPEED_BONUS);
  });

  it('bonus scales with remaining time', () => {
    const half = pointsFor(true, 10_000, 20);
    expect(half).toBe(BASE_POINTS + Math.round(MAX_SPEED_BONUS / 2));
  });

  it('with the timer off, correct answers earn base points and no bonus', () => {
    expect(pointsFor(true, 500, 0)).toBe(BASE_POINTS);
  });
});
