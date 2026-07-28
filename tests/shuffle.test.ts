import { describe, expect, it } from 'vitest';
import { shuffleOptions } from '../src/engine/shuffle';
import type { ItemOption } from '../src/types';

const opts: ItemOption[] = [
  { id: 'a', text: 'Correct', correct: true },
  { id: 'b', text: 'B', whyNot: 'x' },
  { id: 'c', text: 'C', whyNot: 'y' },
  { id: 'd', text: 'D', whyNot: 'z' },
];

describe('answer randomization', () => {
  it('keeps the same set of options, never adding or dropping one', () => {
    const out = shuffleOptions(opts);
    expect(out).toHaveLength(opts.length);
    expect(new Set(out.map((o) => o.id))).toEqual(new Set(['a', 'b', 'c', 'd']));
  });

  it('does not mutate the input array', () => {
    const snapshot = opts.map((o) => o.id);
    shuffleOptions(opts);
    expect(opts.map((o) => o.id)).toEqual(snapshot);
  });

  it('lands the correct answer in every position over many shuffles', () => {
    const positions = new Map<number, number>();
    for (let i = 0; i < 4000; i++) {
      const out = shuffleOptions(opts);
      const pos = out.findIndex((o) => o.correct);
      positions.set(pos, (positions.get(pos) ?? 0) + 1);
    }
    // every one of the four positions is used, and roughly uniformly
    for (let p = 0; p < 4; p++) {
      expect(positions.get(p) ?? 0, `position ${p}`).toBeGreaterThan(4000 * 0.15);
    }
  });

  it('is deterministic under a seeded rng (for reproducible tests)', () => {
    const rng = () => 0.42;
    expect(shuffleOptions(opts, rng).map((o) => o.id)).toEqual(
      shuffleOptions(opts, rng).map((o) => o.id),
    );
  });
});
