/* ══════════════════════════════════════════════════════════════
   Mastery, not just points.
   Per-topic 0–100 score that decays without practice and drives
   the queue: weak topics resurface more. Bands, not bare numbers —
   numbers invite grinding, bands invite moving on.
   ══════════════════════════════════════════════════════════════ */

import type { MasteryBand, System, TopicMastery } from '../types';

/** Days of grace before decay starts. */
const GRACE_DAYS = 3;
/** Half-life of the decaying portion, in days. */
const HALF_LIFE_DAYS = 30;
/** Mastery never decays below this fraction of its peak — you don't fully forget. */
const DECAY_FLOOR_FRAC = 0.35;

const MS_PER_DAY = 86_400_000;

export function newTopicMastery(topic: string, system: System, now: Date): TopicMastery {
  return { topic, system, score: 0, updatedAt: now.toISOString(), attempts: 0 };
}

/** Score after time decay, without mutating stored state. */
export function decayedScore(m: TopicMastery, now: Date): number {
  const days = (now.getTime() - new Date(m.updatedAt).getTime()) / MS_PER_DAY;
  if (days <= GRACE_DAYS) return m.score;
  const floor = m.score * DECAY_FLOOR_FRAC;
  const decaying = m.score - floor;
  return floor + decaying * Math.pow(0.5, (days - GRACE_DAYS) / HALF_LIFE_DAYS);
}

/**
 * Fold one answer into a topic's mastery. Gains shrink as the
 * score climbs; losses shrink as it falls. Both are asymptotic so
 * a single set moves the bar visibly without saturating it.
 */
export function applyResult(m: TopicMastery, correct: boolean, now: Date): TopicMastery {
  const current = decayedScore(m, now);
  const next = correct
    ? current + (100 - current) * 0.12
    : current - current * 0.15;
  return {
    ...m,
    score: clamp(next),
    updatedAt: now.toISOString(),
    attempts: m.attempts + 1,
  };
}

export function band(score: number): MasteryBand {
  if (score >= 75) return 'solid';
  if (score >= 45) return 'working';
  return 'shaky';
}

function clamp(x: number): number {
  return Math.max(0, Math.min(100, x));
}
