# Cadence — V1: Rapid Clinical Reasoning

Fast clinical reasoning drills for medical trainees, built as a small suite of
**mini-games**. Short sets, sized for a bus ride or the gap between two
patients; every item teaches one discriminator sentence — the reason it's
*this* diagnosis and not the other one.

All patients are synthetic. Educational use only, never clinical guidance.

Grounded in [docs/product-guide.md](docs/product-guide.md) (interface study in
[docs/mockup-v3.html](docs/mockup-v3.html)). V1 is the habit product: the
differentials engine plus the games that share its spine. The case-presentation
coach is deliberately deferred to a later release and is not part of this build.

## Run it

```sh
npm install
npm run dev        # local dev server
npm test           # engine + content-bank unit tests (vitest)
npm run build      # type-check + production bundle (dist/)
npm run test:e2e   # all three games, headless Chromium (after build)
```

No backend. The app is a static bundle; learner state lives in
`localStorage` (guest-first — accounts and sync attach to the same JSON
payload later).

## The mini-games

All three run on one engine, one scoring model, one FSRS schedule, and one
mastery/streak spine — only the content slice and the prompt presentation
differ (`src/content/games.ts`).

- **Rapid Differentials** — the workhorse. One-liner → diagnosis, the flagship
  *discriminator* type, next best step, can't-miss-first, build-the-differential
  (multi-select), and first-line *management* items.
- **ECG Rhythms** — read the strip. A parametric renderer
  (`src/ui/ecgRenderer.ts`) draws rate, rhythm, P-wave behaviour, PR/QRS,
  ST shift, T-wave shape, delta waves, and the arrest morphologies (torsades,
  VF, asystole) on ECG graph paper. Covers STEMI, VT, AF, flutter, complete and
  first-degree block, hyperkalemia, WPW, torsades, and VF.
- **Buzzword Blitz** — snap a gene, antibody, or classic finding to its
  diagnosis (JAK2 → polycythemia vera, anti-CCP → RA, Reed–Sternberg → Hodgkin,
  the TTP pentad, rib notching → coarctation, and more). Fast Step 1/2 pattern
  recognition.

## What's implemented

- **Item engine** — eight item types across the three games; structured schema
  with per-distractor rebuttals, tags, dated sources, seed difficulty, and an
  optional parametric ECG spec (`src/types.ts`, `src/content/bank.ts`).
- **Board-level scoping (Step 1 / Step 2 CK / Step 3)** — every item is tagged
  with the levels it serves, and a Focus control narrows both differentials and
  treatments to the chosen level. An over-restrictive scope relaxes gracefully
  rather than handing back an empty set (`servesBoard`, `buildSet`).
- **A single diagnosis, tested many ways** — a concept's variants span several
  item types (e.g. STEMI as a one-liner, a can't-miss, an ECG read, and a
  reperfusion decision), and variant rotation surfaces them across sessions.
- **Session engine** — game-scoped sets; selection prioritises FSRS-due
  concepts, then weak topics (mastery drives the queue); the focus mix slider
  splits block vs review (`src/engine/session.ts`).
- **The timer rule** — 20s default, adjustable, disableable; it affects
  **bonus points only, never correctness** (`src/engine/scoring.ts`).
- **Spaced repetition** — FSRS (`ts-fsrs`) scheduled at the **concept** level;
  an item retires for a user after two consecutive correct answers and the
  concept resurfaces through a sibling variant (`src/engine/scheduler.ts`).
- **Mastery** — per-topic 0–100, decaying without practice, three bands
  (shaky / working / solid) (`src/engine/mastery.ts`).
- **Streak with repair** — one free repair per week bridges a single missed
  day; daily goal includes a post-call setting where one set counts.
- **Focus scoping** — systems-course vs rotation modes with different defaults
  (timer off vs on), board level, and the honest 75/25 mix default.
- **Screens** — Today (games hub, rhythm strip, mastery), Focus, Drill (renders
  vignettes, rhythm strips, or buzzword prompts as needed), Set Complete
  (rhythm-strip trace with a flatline per miss, one named miss with its
  reasoning), Progress.
- **Practicalities** — offline-first app shell (service worker), real dark mode
  (green monitor trace for the ECG game), one-handed layout with primary
  actions in the bottom third, fast cold start.

## Content model, taxonomy & validation

The unit of content is the **concept** (a diagnosis or management decision); a
**vignette** is one way it can present, and a concept can carry several. Concept
IDs are permanent join keys for mastery, scheduling, and coverage.

- **Taxonomy** (`src/content/taxonomy.ts`) — the single source of truth for
  coverage: system → subtopic → concept, spanning the full public USMLE Content
  Outline (12 organ systems + 2 cross-cutting, 108 subtopics). Most subtopics
  are empty on purpose — an empty subtopic is a *visible, trackable gap*, which
  is what makes "cover the tested USMLE topics" measurable. `npm run migrate`
  writes [MIGRATION_REPORT.md](MIGRATION_REPORT.md) listing exactly which
  subtopics still need content.
- **Build-time validation** (`src/content/validation.ts`, Zod) — runs as a
  `prebuild` gate, so `npm run build` **fails** on malformed content, a dangling
  distractor/concept reference, a concept placed outside the taxonomy or in the
  wrong system, or a source that cites a **commercial question bank**. Reputable
  primary sources only (guidelines, standard references); no NBME/UWorld/AMBOSS/
  Kaplan material anywhere.
- **Review discipline** — every concept carries `reviewedBy`/`reviewedOn`.
  LLM-drafted clinical content is plausible-but-sometimes-wrong, so all migrated
  content is marked `UNREVIEWED`; the build *warns* on it and it must not reach a
  learner as validated until a physician signs off.

Current bank: **56 vignettes / 48 concepts / 25 of 108 subtopics**, cardiology-
and pulmonary-heavy, all `UNREVIEWED`. Difficulty seeds are author guesses, to
be overwritten by observed p(correct) once telemetry runs.

## Architecture

```
src/
  types.ts            concept/vignette schema + learner-state types
  content/
    bank.ts           concepts & vignettes; taxonomy + tags normalised on export
    taxonomy.ts       system → subtopic tree (coverage source of truth)
    validation.ts     Zod schemas + source-integrity checks (build gate)
    games.ts          the mini-game registry (id, item types, set size)
  engine/             pure logic, fully unit-tested, no DOM
    session.ts        set builder (game filter, board scope, mix, weakness)
    scheduler.ts      FSRS wrapper, concept-level, variant retirement
    mastery.ts        decaying per-topic score + bands
    scoring.ts        base points + speed bonus (bonus-only timer)
    streak.ts         daily goal, streak, weekly repair
  state/store.ts      localStorage persistence + atomic session commit
  ui/
    app.ts            screen registry, navigation, tab bar
    drill.ts          the one screen every game runs on
    ecgRenderer.ts    parametric rhythm-strip renderer
    today/focus/summary/progress.ts
  content/validation.ts  (build gate; imported by scripts + tests, not the app)
scripts/
  validate-content.ts control content gate (npm run validate / prebuild)
  migrate-to-concepts.ts  enrichment census → MIGRATION_REPORT.md
tests/                vitest suites (bank, engine, ECG, games, taxonomy, integrity)
e2e/smoke.mjs         headless run through all three games
```

State flows one way: the drill collects `SessionItemResult`s and commits them
in a single step (`commitSession`) that updates FSRS schedules, mastery,
streak, points, and history together.

## Adding content

Add a `Concept` and its `Item` variants to `src/content/bank.ts`, then run
`npm test`. The bank tests enforce the authoring rules: unique ids, at least
one variant per concept, exactly one correct option on single-answer types, a
rebuttal on every distractor, a discriminator sentence and a dated source on
every item, a valid board level, and a rhythm spec on every ECG item. Board
tags default sensibly from item type and level when omitted, or can be set
explicitly per item.

## Deliberately not here

Accounts/sync (the state payload is designed for it), the V2 case-presentation
coach, class codes, and the mascot. Also deliberately never: hearts/lives,
virtual currency, public leaderboards, guilt notifications.
