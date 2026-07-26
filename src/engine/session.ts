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

  // SUPPRESS: how recently each vignette was seen, from session history.
  // Drives both concept ranking (fresh concepts first) and variant
  // choice (a resurfacing concept shows a patient you haven't just seen).
  const recency = recentItemRanks(state);
  const chosen = [...pick(blockPool, blockN, rng, recency), ...pick(reviewPool, reviewN, rng, recency)];
  const set = chosen.map((c) => chooseVariant(c, state, rng, recency));
  return shuffle(set, rng);
}

/** Sessions looked back over for suppression. */
export const SUPPRESS_WINDOW = 6;

/**
 * itemId → how recently it was seen: 1 = last session, 2 = the one
 * before, up to SUPPRESS_WINDOW. Absent = not seen in the window.
 */
function recentItemRanks(state: AppState): Map<string, number> {
  const recent = state.sessions.slice(-SUPPRESS_WINDOW);
  const ranks = new Map<string, number>();
  for (let k = recent.length - 1; k >= 0; k--) {
    const rank = recent.length - k; // newest → 1
    for (const r of recent[k].results) {
      if (!ranks.has(r.itemId)) ranks.set(r.itemId, rank);
    }
  }
  return ranks;
}

/** Freshness penalty for a concept: 0 if it has an unseen variant, else
 *  larger the more recently its variants were last seen. */
function stalenessPenalty(c: Candidate, recency: Map<string, number>): number {
  let minRank = Infinity;
  for (const i of c.items) {
    if (!recency.has(i.itemId)) return 0; // an unseen variant → fully fresh
    minRank = Math.min(minRank, recency.get(i.itemId)!);
  }
  if (minRank === Infinity) return 0;
  // seen last session (rank 1) → biggest penalty; older → smaller
  return (SUPPRESS_WINDOW + 1 - minRank) * 12;
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

/**
 * Rank a pool (due → weakness → freshness) and pick n. Selection is a
 * WEIGHTED sample from the best-ranked window, not a strict argmax, so
 * consecutive sets don't feel identical (Efraimidis–Spirakis weighted
 * sampling without replacement, deterministic under a fixed rng).
 */
function pick(pool: Candidate[], n: number, rng: () => number, recency: Map<string, number>): Candidate[] {
  if (n <= 0 || pool.length === 0) return [];
  const ranked = pool
    .map((c) => ({
      c,
      key:
        (c.due ? 0 : 1000) + // due concepts always outrank not-due
        Math.min(c.dueIn, 365) + // sooner-due first among the not-due
        (100 - c.weakness) * 0.5 + // weaker topics first
        stalenessPenalty(c, recency), // recently-seen concepts sink
    }))
    .sort((a, b) => a.key - b.key);

  // Sample from a window of the strongest candidates so the same few
  // don't appear every time; the window is at least n, up to ~half.
  const windowSize = Math.min(ranked.length, Math.max(n + 4, Math.ceil(ranked.length * 0.5)));
  const window = ranked.slice(0, windowSize);
  // weight earlier (better-ranked) entries more heavily
  const weighted = window.map((r, idx) => ({
    c: r.c,
    key: Math.pow(rng(), 1 / (windowSize - idx)), // higher weight → larger key
  }));
  weighted.sort((a, b) => b.key - a.key);
  return weighted.slice(0, n).map((w) => w.c);
}

/**
 * Choose which variant of a concept to serve. Never a retired item
 * (answered correctly twice) unless all are retired. Among the rest,
 * prefer a presentation the learner hasn't seen recently — a due
 * concept resurfaces as a *different patient*, which is the point.
 * `cand.items` is already filtered to the game + board scope.
 */
function chooseVariant(
  cand: Candidate,
  state: AppState,
  rng: () => number,
  recency: Map<string, number>,
): Item {
  const sched = state.schedules[cand.concept.conceptId];
  const retired = new Set(sched?.retiredItems ?? []);
  let pool = cand.items.filter((i) => !retired.has(i.itemId));

  if (pool.length === 0) {
    // all variants retired — resurface the least-reinforced sibling
    pool = [...cand.items].sort(
      (a, b) => (sched?.correctStreak[a.itemId] ?? 0) - (sched?.correctStreak[b.itemId] ?? 0),
    );
    return pool[0];
  }

  const unseen = pool.filter((i) => !recency.has(i.itemId));
  if (unseen.length > 0) {
    return unseen[Math.floor(rng() * unseen.length)]; // a fresh presentation
  }
  // every live variant seen recently — serve the one seen longest ago
  return [...pool].sort((a, b) => recency.get(b.itemId)! - recency.get(a.itemId)!)[0];
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
