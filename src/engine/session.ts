/* ══════════════════════════════════════════════════════════════
   Session builder.
   A set is drawn for one mini-game: only items of that game's types
   are eligible, further narrowed by the board-level scope. Within
   that pool, selection order is:
     1. concepts due for review (FSRS)
     2. weak topics first (mastery drives the queue)
     3. random tie-break
   The mix slider splits the set between the current block and
   review of everything already seen. One item per concept per set;
   retired variants are skipped so the concept resurfaces through a
   sibling — and because a concept's variants span several item
   types, a single diagnosis gets tested in several ways over time.
   ══════════════════════════════════════════════════════════════ */

import type { AppState, BoardLevel, Concept, FocusState, Item, ItemType } from '../types';
import { COURSES, ROTATIONS, servesBoard, type FocusOption } from '../content/bank';
import { decayedScore } from './mastery';
import { daysUntilDue, isDue } from './scheduler';

export const SET_SIZE = 12;

export interface SetFilter {
  /** item types this game draws from */
  types: ItemType[];
  /** board scope; 'all' leaves the bank unfiltered */
  board: BoardLevel | 'all';
  /** items per set */
  setSize: number;
}

export function focusOption(focus: FocusState): FocusOption {
  const pool = focus.mode === 'rotation' ? ROTATIONS : COURSES;
  return pool.find((o) => o.id === focus.id) ?? pool[0];
}

/** Is this item inside the current block for the given focus? */
export function inBlock(item: Item, focus: FocusState): boolean {
  const opt = focusOption(focus);
  if (focus.mode === 'rotation' && opt.rotationTag) {
    return item.tags.rotation.includes(opt.rotationTag);
  }
  return opt.systems.includes(item.tags.system);
}

interface Candidate {
  concept: Concept;
  /** items of this concept eligible for the current game + board scope */
  items: Item[];
  due: boolean;
  dueIn: number;
  weakness: number; // 0–100, higher = weaker
  seen: boolean;
}

function eligible(item: Item, filter: SetFilter): boolean {
  return filter.types.includes(item.type) && servesBoard(item, filter.board);
}

export function buildSet(
  allItems: Item[],
  allConcepts: Concept[],
  state: AppState,
  now: Date,
  filter: SetFilter,
  rng: () => number = Math.random,
): Item[] {
  let candidates = collectCandidates(allItems, allConcepts, state, now, filter);
  // If the board scope emptied the pool but the game has content at
  // other levels, relax the board filter rather than show nothing.
  if (candidates.length === 0 && filter.board !== 'all') {
    candidates = collectCandidates(allItems, allConcepts, state, now, { ...filter, board: 'all' });
  }

  // Subtopic selection is a HARD narrow (unlike the board relax): the
  // set is drawn only from the chosen subtopics. A short set is honest;
  // padding with off-topic items is the "lying filter" we refuse.
  const picked = state.focus.subtopics;
  if (picked.length > 0) {
    candidates = candidates.filter((c) => picked.includes(c.concept.subtopic));
  }

  const blockPool = candidates.filter((c) => c.items.some((i) => inBlock(i, state.focus)));
  // review = anything already seen that is NOT part of the current block
  const reviewPool = candidates.filter(
    (c) => c.seen && !c.items.some((i) => inBlock(i, state.focus)),
  );

  const target = Math.min(filter.setSize, candidates.length);
  let reviewN = Math.min(
    Math.round((target * (100 - state.focus.mixPercent)) / 100),
    reviewPool.length,
  );
  let blockN = Math.min(target - reviewN, blockPool.length);
  // top up from the other pool when one runs short
  reviewN = Math.min(target - blockN, reviewPool.length);

  const chosen = [...pick(blockPool, blockN, rng), ...pick(reviewPool, reviewN, rng)];
  const set = chosen.map((c) => chooseVariant(c, state, rng));
  return shuffle(set, rng);
}

function collectCandidates(
  allItems: Item[],
  allConcepts: Concept[],
  state: AppState,
  now: Date,
  filter: SetFilter,
): Candidate[] {
  const byConcept = new Map<string, Item[]>();
  for (const item of allItems) {
    if (!eligible(item, filter)) continue;
    const list = byConcept.get(item.conceptId) ?? [];
    list.push(item);
    byConcept.set(item.conceptId, list);
  }

  const candidates: Candidate[] = [];
  for (const concept of allConcepts) {
    const items = byConcept.get(concept.conceptId) ?? [];
    if (items.length === 0) continue;
    const sched = state.schedules[concept.conceptId];
    const mastery = state.mastery[concept.topic];
    candidates.push({
      concept,
      items,
      due: sched ? isDue(sched, now) : false,
      dueIn: sched ? daysUntilDue(sched, now) : Infinity,
      weakness: mastery ? 100 - decayedScore(mastery, now) : 100,
      seen: !!sched,
    });
  }
  return candidates;
}

/** Rank a pool (due → weakness → jitter) and take the top n. */
function pick(pool: Candidate[], n: number, rng: () => number): Candidate[] {
  const ranked = pool
    .map((c) => ({
      c,
      key:
        (c.due ? 0 : 1000) + // due concepts always outrank not-due
        Math.min(c.dueIn, 365) + // sooner-due first among the not-due
        (100 - c.weakness) * 0.5 + // weaker topics first
        rng() * 8, // jitter so sets aren't identical
    }))
    .sort((a, b) => a.key - b.key);
  return ranked.slice(0, n).map((r) => r.c);
}

/**
 * Choose which variant of a concept to serve: never a retired item
 * (answered correctly twice) unless every variant is retired, in
 * which case the least-drilled one comes back. `cand.items` is
 * already filtered to the game + board scope.
 */
function chooseVariant(cand: Candidate, state: AppState, rng: () => number): Item {
  const sched = state.schedules[cand.concept.conceptId];
  const retired = new Set(sched?.retiredItems ?? []);
  const live = cand.items.filter((i) => !retired.has(i.itemId));
  const pool = live.length > 0 ? live : cand.items;
  if (live.length === 0 && sched) {
    // all variants retired — resurface the least-reinforced sibling
    pool.sort(
      (a, b) => (sched.correctStreak[a.itemId] ?? 0) - (sched.correctStreak[b.itemId] ?? 0),
    );
    return pool[0];
  }
  return pool[Math.floor(rng() * pool.length)];
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
