import { describe, expect, it } from 'vitest';
import { applyResult, band, decayedScore, newTopicMastery } from '../src/engine/mastery';

const NOW = new Date('2026-07-25T12:00:00Z');
const daysLater = (n: number) => new Date(NOW.getTime() + n * 86_400_000);

describe('mastery', () => {
  it('correct answers raise the score, misses lower it', () => {
    let m = newTopicMastery('Heart failure', 'cardiovascular', NOW);
    m = applyResult(m, true, NOW);
    expect(m.score).toBeGreaterThan(0);
    const afterCorrect = m.score;
    m = applyResult(m, false, NOW);
    expect(m.score).toBeLessThan(afterCorrect);
  });

  it('gains shrink as the score climbs — no saturation from grinding', () => {
    let low = newTopicMastery('t', 'renal', NOW);
    low = { ...low, score: 20 };
    let high = { ...low, score: 90 };
    const lowGain = applyResult(low, true, NOW).score - 20;
    const highGain = applyResult(high, true, NOW).score - 90;
    expect(lowGain).toBeGreaterThan(highGain);
  });

  it('holds steady inside the grace window, decays after it', () => {
    const m = { ...newTopicMastery('t', 'renal', NOW), score: 80 };
    expect(decayedScore(m, daysLater(2))).toBe(80);
    const after30 = decayedScore(m, daysLater(33));
    expect(after30).toBeLessThan(80);
    expect(after30).toBeGreaterThan(40);
  });

  it('decay never wipes a topic to zero — you do not fully forget', () => {
    const m = { ...newTopicMastery('t', 'renal', NOW), score: 80 };
    expect(decayedScore(m, daysLater(3650))).toBeGreaterThan(25);
  });

  it('bands: shaky / working / solid', () => {
    expect(band(30)).toBe('shaky');
    expect(band(60)).toBe('working');
    expect(band(80)).toBe('solid');
  });
});
