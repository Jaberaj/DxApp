/* ══════════════════════════════════════════════════════════════
   Answer-order randomization.
   Authored items always list the correct option first (so the bank
   is easy to read). If we rendered them in that order, "A" would
   always be right — a tell. `shuffleOptions` returns a fresh random
   permutation on every call, so the correct answer lands in every
   position over time. Correctness is decided by option id, never by
   position, so shuffling can never change which answer is right.
   ══════════════════════════════════════════════════════════════ */

import type { ItemOption } from '../types';

/** Fisher–Yates over a copy; rng defaults to Math.random. */
export function shuffleOptions(options: ItemOption[], rng: () => number = Math.random): ItemOption[] {
  const out = options.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
