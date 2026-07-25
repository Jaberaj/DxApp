# Cadence — V1: Rapid Differentials

Rapid clinical reasoning drills for medical trainees. Twelve-item sets, sized
for a bus ride or the gap between two patients; every item teaches one
discriminator sentence — the reason it's *this* diagnosis and not the other one.

All patients are synthetic. Educational use only, never clinical guidance.

This is the V1 described in [docs/product-guide.md](docs/product-guide.md)
(interface study in [docs/mockup-v3.html](docs/mockup-v3.html)): the habit
product that the later presentation coach builds on.

## Run it

```sh
npm install
npm run dev        # local dev server
npm test           # engine + content-bank unit tests (vitest)
npm run build      # type-check + production bundle (dist/)
npm run test:e2e   # full drill loop in headless Chromium (after build)
```

No backend. The app is a static bundle; learner state lives in
`localStorage` (guest-first — accounts and sync attach to the same JSON
payload later).

## What's implemented

- **Item engine** — five item types: one-liner → diagnosis, discriminator
  (the flagship), next best step, can't-miss-first, build-the-differential
  (multi-select). Structured schema with per-distractor rebuttals, tags,
  sources, and seed difficulty (`src/types.ts`, `src/content/bank.ts`).
- **Seed bank** — 24 items across 18 concepts (cardiovascular, pulmonary,
  renal), centred on chest pain and dyspnea. Concept variants exist so
  drilling repeats the reasoning, never the vignette. Authoring rules are
  enforced by tests (`tests/bank.test.ts`).
- **Session engine** — 12-item sets; selection prioritises FSRS-due
  concepts, then weak topics (mastery drives the queue); the focus mix
  slider splits block vs review (`src/engine/session.ts`).
- **The timer rule** — 20s default, adjustable, disableable; it affects
  **bonus points only, never correctness** (`src/engine/scoring.ts`).
- **Spaced repetition** — FSRS (`ts-fsrs`) scheduled at the **concept**
  level; an item retires for a user after two consecutive correct answers
  and the concept resurfaces through a sibling variant
  (`src/engine/scheduler.ts`).
- **Mastery** — per-topic 0–100, decaying without practice, three bands
  (shaky / working / solid) (`src/engine/mastery.ts`).
- **Streak with repair** — one free repair per week bridges a single missed
  day; daily goal includes a post-call setting where one set counts
  (`src/engine/streak.ts`).
- **Focus scoping** — systems-course vs rotation modes with different
  defaults (timer off vs on), mix slider with the honest 75/25 default.
- **Screens** — Today, Focus, Drill, Set Complete (rhythm-strip trace with a
  flatline per miss, one named miss with its reasoning), Progress. The
  presentation coach appears locked on Today with an explainer (it's V2).
- **Practicalities** — offline-first app shell (service worker), real dark
  mode, one-handed layout with primary actions in the bottom third,
  ~26 KB gzipped JS for fast cold start.

## Architecture

```
src/
  types.ts            item schema + learner-state types (the contract)
  content/bank.ts     seed concepts and items (authoring rules in header)
  engine/             pure logic, fully unit-tested, no DOM
    session.ts        set builder (mix, due-ness, weakness weighting)
    scheduler.ts      FSRS wrapper, concept-level, variant retirement
    mastery.ts        decaying per-topic score + bands
    scoring.ts        base points + speed bonus (bonus-only timer)
    streak.ts         daily goal, streak, weekly repair
  state/store.ts      localStorage persistence + atomic session commit
  ui/                 vanilla-TS screens; design system from the mockup
tests/                vitest suites for engine + bank integrity
e2e/smoke.mjs         headless full-loop smoke test
```

State flows one way: the drill collects `SessionItemResult`s and commits
them in a single step (`commitSession`) that updates FSRS schedules,
mastery, streak, points, and history together.

## Adding content

Add a `Concept` and its `Item` variants to `src/content/bank.ts`, then run
`npm test`. The bank tests enforce the authoring rules: unique ids, at
least one variant per concept, exactly one correct option on single-answer
types, a rebuttal on every distractor, a discriminator sentence and a
dated source on every item. Difficulty seeds are author guesses —
the plan is to overwrite them with observed p(correct) once items have
~50 exposures.

## Deliberately not here (yet)

Accounts/sync (state payload is designed for it), the V1.5 treatment item
types (higher review bar), the V2 presentation coach, class codes, and the
mascot. Also deliberately never: hearts/lives, virtual currency, public
leaderboards, guilt notifications.
