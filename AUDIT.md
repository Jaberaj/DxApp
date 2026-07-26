# AUDIT — codebase vs REFACTOR_PLAN.md

*Session 0. Audit only — no code was changed. Line numbers refer to the tree at
commit `31d835a`.*

## Headline: the plan's root-cause premise does not match this codebase

REFACTOR_PLAN.md assumes "the item is the unit of content, when the concept
should be the unit of content." **That is not true here.** The concept/variant
model has existed since the first commit:

- `Concept` is a first-class record (`src/types.ts:124`), and every `Item`
  carries a `conceptId` (`src/types.ts:94`).
- Scheduling is **per concept** via FSRS (`src/engine/scheduler.ts`), not per
  item.
- Variant rotation exists: an item retires for a user after two consecutive
  correct answers and the concept resurfaces through a sibling
  (`scheduler.ts:17`, `session.ts:149`). Seven concepts already have 2–3
  variants.
- One-concept-per-set is structurally guaranteed (candidates are unique
  concepts), so "same vignette twice in one session" is impossible today.

What PR 1 specifies and this codebase **lacks**: the subtopic taxonomy layer,
`alsoTaggedSystems`, `PresentationType` on variants, structured
`illnessScript`, `usmleOutlineRefs`, `reviewedBy/reviewedOn`, Zod build-time
validation, distractors as concept references, and telemetry fields
(`exposures`, `pCorrect`). PR 1's real scope is **additive re-shaping, not a
rescue migration** — see "Recommended plan revisions" at the end.

Two whole subsystems the plan doesn't know about and every PR must preserve:

1. **Mini-games** (`src/content/games.ts`): `rapid_ddx`, `ecg`, `buzzword`.
   The selector filters by game item-types; `ecg` items carry a parametric
   `EcgSpec`, `association` items are buzzword→diagnosis. The plan's
   `ItemType` union omits `ecg`, `association`, and the existing `management`
   type (which is already a first cut of PR 5's `tx_next_step`).
2. **Board-level scoping** (`step1 | step2 | step3 | 'all'` on
   `FocusState.boards`, filtered via `servesBoard`, `bank.ts:1127`). The plan's
   `level: ("preclinical"|"clerkship")[]` overlaps but is not the same axis;
   both exist today (`tags.level`, `tags.boards`).

---

## 1. Current content data model (actual interfaces)

From `src/types.ts` (abridged to the content-bearing parts; full file is 210
lines):

```ts
export type ItemType =
  | 'one_liner' | 'discriminator' | 'next_step' | 'cant_miss' | 'build_ddx'
  | 'management'     // first-line / threshold / contraindication (treatments)
  | 'ecg'            // read the rhythm strip
  | 'association';   // buzzword / gene / finding → diagnosis

export type BoardLevel = 'step1' | 'step2' | 'step3';
export type GameId = 'rapid_ddx' | 'ecg' | 'buzzword';

export interface ItemOption {
  id: string;
  text: string;            // ← free text, NOT a concept reference
  correct?: boolean;
  whyNot?: string;         // per-distractor rebuttal, also free text
}

export interface Item {
  itemId: string;
  version: number;
  type: ItemType;
  conceptId: string;       // ← variants join to a concept
  stem: string;
  vitals: Vital[];         // structured chips
  findings: string[];
  options: ItemOption[];
  selectCount?: number;    // build_ddx only
  ecg?: EcgSpec;           // ecg items only — parametric rhythm spec
  discriminator: string;   // ONE sentence, the teach
  teachingPoint?: string;
  tags: {
    system: System;        // single-valued (plan predicts this correctly)
    complaint: string;
    rotation: string[];    // ← already MANY, not one
    level: Level;          // 'preclinical' | 'clerkship' | 'both'
    boards: BoardLevel[];  // already MANY
  };
  difficultySeed: number;  // author guess; never overwritten (see bug 5)
  source: { ref: string; year: number }[];
}

export interface Concept {
  conceptId: string;       // e.g. "pe-recognition" — flat, no taxonomy path
  name: string;
  system: System;
  topic: string;           // free-text mastery bucket, e.g. "Pulmonary embolism"
}
```

Gaps vs the plan's model: `Concept` has no `subtopic`, no
`alsoTaggedSystems`, no `rotations`/`usmleOutlineRefs`/`illnessScript`, no
`reviewedBy/reviewedOn`. `Item` (the plan's `Vignette`) has no
`presentation` type, no `exposures`/`pCorrect`, and `distractorConceptIds` do
not exist — options are prose. Concept IDs are flat slugs
(`pe-recognition`), not taxonomy paths (`pulm.vte.pe`). No Zod anywhere;
validation is vitest assertions in `tests/bank.test.ts` (runs in CI-style
`npm test`, but a malformed item that type-checks does **not** fail
`npm run build`).

## 2. Bank census

**56 items, 48 concepts** (counted by script from `src/content/bank.ts`).

| System | Items | Concepts |
|---|---|---|
| cardiovascular | 25 | 21 |
| pulmonary | 12 | 8 |
| heme_onc | 6 | 6 |
| renal | 4 | 4 |
| msk_rheum | 4 | 4 |
| infectious | 2 | 2 |
| endocrine | 1 | 1 |
| gi | 1 | 1 |
| neuro | 1 | 1 |
| dermatology, psychiatry, reproductive, GU split, peds, multisystem | 0 | 0 |

| Rotation (items may carry several) | Items |
|---|---|
| im | 55 |
| em | 38 |
| fm | 13 |
| surg | 5 |
| peds | 4 |
| obgyn | 1 |

| Type | Items | | Board | Items |
|---|---|---|---|---|
| association | 15 | | step2 | 56 |
| one_liner | 10 | | step3 | 36 |
| ecg | 10 | | step1 | 35 |
| discriminator | 6 |
| next_step | 5 |
| management | 5 |
| cant_miss | 4 |
| build_ddx | 1 |

Concepts with >1 variant (7): `pe-recognition` ×3, `pe-workup`,
`tension-ptx`, `stemi-recognition`, `stemi-vs-pericarditis`,
`dissection-first`, `vt-vs-svt` ×2 each. The remaining 41 concepts are
single-vignette — the plan's variance concern is real at bank scale.

## 3. The selection code, quoted

`src/engine/session.ts:60` — **not** `sort(() => Math.random() - 0.5)`. It is
already a pure, seedable function of `(items, concepts, state, now, filter,
rng)`:

```ts
export function buildSet(allItems, allConcepts, state, now, filter, rng = Math.random) {
  let candidates = collectCandidates(allItems, allConcepts, state, now, filter);
  // If the board scope emptied the pool but the game has content at
  // other levels, relax the board filter rather than show nothing.
  if (candidates.length === 0 && filter.board !== 'all') {
    candidates = collectCandidates(..., { ...filter, board: 'all' });   // line 72
  }
  const blockPool  = candidates.filter((c) => c.items.some((i) => inBlock(i, state.focus)));
  const reviewPool = candidates.filter((c) => c.seen && !c.items.some((i) => inBlock(i, state.focus)));
  // …mix split, then:
  const chosen = [...pick(blockPool, blockN, rng), ...pick(reviewPool, reviewN, rng)];
  const set = chosen.map((c) => chooseVariant(c, state, rng));
  return shuffle(set, rng);
}
```

Ranking (`session.ts:129`) — ranked slice with jitter, **not** the plan's
weighted-sample-from-top-30%:

```ts
function pick(pool, n, rng) {
  const ranked = pool.map((c) => ({ c, key:
        (c.due ? 0 : 1000)          // due concepts always outrank not-due
      + Math.min(c.dueIn, 365)      // sooner-due first among the not-due
      + (100 - c.weakness) * 0.5    // weaker topics first
      + rng() * 8 }))               // jitter so sets aren't identical
    .sort((a, b) => a.key - b.key);
  return ranked.slice(0, n).map((r) => r.c);
}
```

Variant choice (`session.ts:149`) skips retired items; final order is a
proper seeded Fisher–Yates (`session.ts:164`). One unseeded
`Math.random()` exists at `src/ui/drill.ts:181`, but it only shuffles
**option display order** within an item, not selection.

**What's missing vs PR 2:** no cross-session suppression window (a non-due
concept's same vignette can appear in consecutive sessions — FSRS due-ness
and 2-correct retirement are the only memory), no presentation-type
preference (no presentation types exist), and sampling is top-N-with-jitter
rather than weighted. The 5-stage pipeline maps roughly to: ELIGIBLE =
`collectCandidates`, SCORE+SAMPLE = `pick`, BACKFILL = the mix top-up;
SUPPRESS has no equivalent.

## 4. The filter code, quoted — and yes, it widens silently

Scope filters, `session.ts:38` and `session.ts:56`:

```ts
export function inBlock(item: Item, focus: FocusState): boolean {
  const opt = focusOption(focus);
  if (focus.mode === 'rotation' && opt.rotationTag) {
    return item.tags.rotation.includes(opt.rotationTag);
  }
  return opt.systems.includes(item.tags.system);
}

function eligible(item: Item, filter: SetFilter): boolean {
  return filter.types.includes(item.type) && servesBoard(item, filter.board);
}
```

**When the filtered pool is smaller than a set, what happens?** Three
behaviours, none surfaced to the user as a labelled `PoolSource`:

1. **Board relax — silent widening, confirmed.** `session.ts:68–73` (quoted
   above): an empty pool under a board scope silently retries with
   `board: 'all'`. Deliberate (there's even a test blessing it:
   `tests/session.test.ts` "relaxes an over-restrictive board scope…"), but
   it is exactly the plan's "the filter is lying" pattern.
2. **Short sets do happen** — `target = Math.min(filter.setSize,
   candidates.length)` (`session.ts:81`) — and the drill renders "Item 1 of
   7" — but nothing *tells* the user the set is short or why. No
   "Only 7 renal items match" notice exists. Empty pool after relax → a
   generic empty-state message (`drill.ts:52–56`).
3. **Never crosses into other systems/rotations at the *concept* level** —
   `blockPool`/`reviewPool` respect `inBlock` (`session.ts:75–79`), and unseen out-of-scope
   concepts are never selected. The plan's worst case ("picks Renal, gets
   cardiology") does not occur… at the concept level. But:

**Variant-level filter leak — a real bug the plan didn't predict.**
`chooseVariant` (`session.ts:149`) picks from `cand.items`, which is
filtered by game type + board (`eligible`) but **not** by `inBlock`. A
concept qualifies for the block if *some* variant matches the rotation
(`c.items.some(inBlock)`), then any variant may be served. Concretely: focus
= Surgery rotation → `tension-ptx` qualifies via `tension-ptx-1`
(`['em','surg']`), but `chooseVariant` can serve `tension-ptx-2`
(`['im','em','surg']` — fine) — while focus = IM can be served
`tension-ptx-1`, which is **not** IM-tagged. Seven concepts have variants
that disagree on rotation tags (script-verified): `pe-recognition`,
`pe-workup`, `tension-ptx`, `stemi-recognition`, `stemi-vs-pericarditis`,
`dissection-first`. The existing "at 100% block, every item is on block"
test passes only because it tests **course** mode, where a concept's
variants share one system.

## 5. schemaVersion: exists, but the hardening doesn't

`src/state/store.ts:16,25,41`:

```ts
const STATE_VERSION = 1;
// defaultState(): { version: STATE_VERSION, ... }
if (parsed.version !== STATE_VERSION) return defaultState();   // line 41
```

So the plan's "currently missing, I'd bet money on it" is **wrong on the
field** but **right on everything that matters**: a version mismatch or
corrupt JSON (`catch` at line 46) silently reinitialises — no migration
chain, no `cadence.backup.<timestamp>`, no user notice. And `saveState`
(line 51) is a bare `storage.setItem` with **no try/catch**: a Safari
private-mode or quota throw propagates out of `App.setState` mid-
`finish()` (`drill.ts:312–313`), which would abort the transition to the
summary screen. No mid-session persistence; a backgrounded/killed tab loses
the set in progress. No export/import.

## 6. Distractors: free-text strings

Confirmed. `ItemOption.text` and `whyNot` are prose (`types.ts:53–61`);
there is no `distractorConceptIds` anywhere. No distractor analysis, no
duplicate-distractor detection, no guarantee a distractor is a real
diagnosis in the bank.

## 7. Can the timer mark an answer wrong? No.

`src/engine/scoring.ts:17`:

```ts
export function pointsFor(correct, elapsedMs, timerSeconds) {
  if (!correct) return 0;
  if (timerSeconds <= 0) return BASE_POINTS;
  const remaining = Math.max(0, 1 - elapsedMs / (timerSeconds * 1000));
  return BASE_POINTS + Math.round(MAX_SPEED_BONUS * remaining);
}
```

Timeout (`drill.ts:120`) only sets a flag that zeroes the bonus via
`effectiveElapsed` (`drill.ts:231`); the item stays answerable and a slow
correct answer keeps full base points. Asserted by
`tests/scoring.test.ts` ("the timer affects bonus only…"). The only timer
influence on learning state is FSRS grading: correct-but-timed-out grades
`Hard` instead of `Good` (`scheduler.ts:55`), which is by design and does
not touch correctness.

## 8. The seven predicted bugs

| # | Prediction | Verdict | Where |
|---|---|---|---|
| 1 | Silent filter widening | **Confirmed (two forms)** | Board relax `session.ts:68–73`; variant-level rotation leak `session.ts:149` + pool split at `:75–79`; short sets exist but are never announced |
| 2 | `sort(() => Math.random() - 0.5)` shuffle, stateless | **Not present** as predicted — seeded Fisher–Yates (`session.ts:164`) and ranked pick. **Partially confirmed in spirit:** no cross-session suppression window; only FSRS due-ness + retirement provide memory | `session.ts:129–171` |
| 3 | No `schemaVersion` | **Not present** — field exists (`store.ts:16,25`). **But** no migration chain, no backup, silent reinit on mismatch/corruption, unguarded writes | `store.ts:36–53` |
| 4 | Distractors as strings | **Confirmed** | `types.ts:53–61` |
| 5 | Hand-declared difficulty | **Confirmed** — `difficultySeed` documents the intent to overwrite with observed p(correct), but no telemetry exists: no `exposures`, no `pCorrect`, nothing computes it (session history in `state.sessions` retains raw results, so it is computable later) | `types.ts:118–122` |
| 6 | Off-by-one on set completion | **Not present** — the result is pushed at answer-lock (`drill.ts:234`), before `finish()` commits all results and renders the summary (`drill.ts:310–323`); e2e verifies the "N of M" count | `drill.ts` |
| 7 | Timer marks answers wrong | **Not present** — bonus-only, test-asserted | `scoring.ts:17`, `tests/scoring.test.ts` |

## Recommended plan revisions (for your sign-off — nothing changed yet)

1. **PR 1 shrinks.** The concept/variant split, concept-level FSRS, variant
   retirement, and per-distractor rebuttals already exist. Remaining PR 1
   scope: taxonomy layer (subtopics + stable path IDs), `presentation` types
   on items, `alsoTaggedSystems`/multi-system tags, `distractorConceptIds`,
   review metadata, telemetry fields, Zod validation wired into
   `npm run build` (today only `npm test` guards content), and an ID
   migration **only if** we adopt path-style concept IDs — that migration
   must map existing flat IDs (they are already join keys for any learner
   state in the wild, per the plan's own permanence rule).
2. **PR 2 narrows** to: add a SUPPRESS window (seen-in-last-N-sessions),
   switch `pick` to weighted sampling, add presentation-type preference once
   PR 1 lands. Purity/seedability already done. The 200-session test is
   worth writing regardless.
3. **PR 3 must fix the two real widenings found here**: the board-relax
   fallback and the variant-level rotation leak (`chooseVariant` must filter
   by `inBlock` when the concept was chosen for the block pool). Add
   `PoolSource` + the short-set notice. Note the rotation-mode test gap.
4. **PR 5 partially exists** as the `management` type (5 items, guideline
   sources with years, rendered with no UI special-casing). Remaining: the
   `tx_*` split, `guidelineTag`, two-reviewer enforcement, review-age CI.
5. **The plan must account for the games layer and board scoping** —
   `ItemType` now includes `ecg` and `association`, selection is
   game-filtered, and `boards` is an existing filter axis alongside `level`.
   Decide whether Step 1/2/3 replaces or complements `level` before PR 1
   locks the schema.
6. **Bugs 2/3/6/7 as literally predicted are absent** — don't spend sessions
   hunting them; the real targets are bug 1 (both forms), bug 4, bug 5, and
   PR 7's hardening.
