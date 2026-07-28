# Architecture & roadmap

How Cadence is built, why it's built that way, and the sequenced path from
this repo to a shipped iPhone game. This is the map — read it before a large
change.

---

## 1. The shape of the system

Cadence is **local-first**: a static web bundle whose entire runtime lives in
the browser. There is no server in the request path. A learner can install it,
go offline, and lose nothing. Accounts and cloud sync are a **layer on top** of
that local core, not a dependency of it.

```
                 ┌──────────────────────────────────────────┐
   content/  ──▶ │  bank.ts  (concepts + vignettes, merged   │
   (authoring)   │           from content modules, validated)│
                 └───────────────────┬──────────────────────┘
                                     │  Item[] / Concept[]
                 ┌───────────────────▼──────────────────────┐
   engine/  ────▶│  pure logic, no DOM, fully unit-tested     │
                 │  session · scheduler · mastery · scoring   │
                 │  · streak · shuffle                        │
                 └───────────────────┬──────────────────────┘
                                     │  reads/derives from
                 ┌───────────────────▼──────────────────────┐
   state/   ────▶│  store.ts  (AppState in localStorage,      │
                 │            atomic commitSession)           │
                 └──────┬──────────────────────────┬─────────┘
                        │                           │
          ┌─────────────▼─────────┐   ┌─────────────▼──────────────┐
   ui/ ──▶│ app · drill · today · │   │ sync/  (optional, layered) │
          │ focus · progress ·    │   │ engine · merge · backend · │
          │ profile · ecgRenderer │   │ rest · account             │
          └───────────────────────┘   └────────────────────────────┘
```

**One-way data flow.** The drill collects `SessionItemResult`s and hands them
to a single `commitSession` step that advances FSRS schedules, mastery, streak,
points, and history *together*, then persists once. Nothing else writes learner
progress. This is what makes the engine testable and the sync payload a single
coherent document.

**The layers, and the rule that keeps them honest:**

| Layer | Owns | May import |
|---|---|---|
| `content/` | the material + its taxonomy + the validation gate | types |
| `engine/` | all selection/scheduling/scoring math, pure, no DOM | types, content |
| `state/` | the `AppState` shape + localStorage persistence | types, engine |
| `sync/` | reconciling local state with a backend | types (only) |
| `ui/` | rendering + navigation, the only layer touching the DOM | everything |

`engine/` and `sync/` never touch the DOM, which is why they carry the test
weight (see §5). If a change needs `document` inside `engine/`, the design is
wrong — the input it wants should be passed in.

---

## 2. Invariants (the things a change must not break)

These are load-bearing. Each is enforced by a test, a build gate, or both.

1. **Never plagiarize; keep citations.** Commercial board-prep brands are
   *coverage-only* — usable to know *which topics exist*, never scraped, copied,
   or cited. Every vignette cites a **public** clinical-evidence source. Both
   halves are enforced at build time by a source denylist and a required-source
   check (`content/validation.ts`, run as `prebuild`). This is the product's
   spine, not a nicety — see `docs/CONTENT_POLICY.md`.
2. **No PHI, ever.** Every patient is synthetic. The synced document carries
   only the learner's own progress. This is a deliberate privacy guarantee and a
   selling point.
3. **The timer never affects correctness** — bonus points only. A slow correct
   answer is still correct (`engine/scoring.ts`).
4. **Concept IDs are permanent join keys.** Mastery, scheduling, and coverage
   all key off them. Renaming one is a migration, not an edit.
5. **Coverage is measurable.** Every concept sits at a taxonomy address
   (system → subtopic); an empty subtopic is a *visible, trackable gap*. A test
   asserts full subtopic coverage so a new taxonomy row can't ship empty.
6. **A resurfacing concept shows a different patient.** Spaced repetition means
   a concept comes back; presentation variance + cross-session suppression mean
   it comes back as a different vignette (§4).
7. **Sync preserves progress and never double-counts.** Merge is pure and
   tested; `totalPoints` is recomputed from merged sessions, never summed across
   copies (`sync/merge.ts`).

---

## 3. Content: the coverage-only pipeline

The unit of content is the **concept** (a diagnosis or a management decision).
A **vignette** is one way it can present; a concept can carry several.

```
authoring modules  ──merge──▶  bank.ts  ──normalize──▶  Item[] / Concept[]
(expansion*.ts)                (enrich concept w/ taxonomy, default tags)
       │                                    │
       └──────────── validated by ──────────┘
                  content/validation.ts (Zod)
             ▲ runs as `npm run prebuild` — build FAILS on:
             · malformed item · dangling distractor/concept ref
             · concept outside taxonomy / wrong system
             · a citation to a denylisted commercial brand
             · (warns, doesn't fail) UNREVIEWED content
```

**Why modules.** Content is authored in `expansion*.ts` modules and merged in
`bank.ts` (`ContentModule` in `authoring.ts`). This keeps individual files
reviewable and — critically — makes the content **splittable by module** when
we code-split (§6). Adding content is: append a concept + its item variants to a
module, run `npm test`.

**Review discipline (a real pipeline, not a flag).** LLM-drafted clinical
content is plausible-but-sometimes-wrong, so a concept is not *validated* until
it earns it. Review is a **multi-reviewer validation pipeline**
(`docs/REVIEW.md`): several LLMs — ideally distinct model families — and later
humans each check a concept against public sources, and a concept is promoted to
`validated` only with enough **independent** passing reviews (`content/review.ts`
derives the status; `content/reviewPipeline.ts` is the provider-agnostic runner).
Independence is the crux: two passes from the same model family share blind spots
and count once. Reviewer citations pass the **same commercial-source denylist**
as the content. This is the single biggest correctness risk in the product, and
it is now measured (the build reports validated / in-review / unreviewed /
flagged counts) rather than hidden.

**Current state:** 210 concepts / 256 vignettes / 108-of-108 subtopics. Breadth
(every topic present) is done. **Depth** — more presentations per concept — is
the ongoing lever; 38 concepts now carry ≥2 vignettes, and that ratio is the
metric to grow. On review: a genuine single-reviewer first pass has moved 12
concepts to `in_review`; none are `validated` yet, by design — that needs a
second independent model or a human (run the pipeline with more providers).

---

## 4. Selection: how a set is drawn

`engine/session.ts` `buildSet` is the heart of "get a new question on load, but
review what's due." For the chosen game and board scope it builds candidates,
splits them into a **block pool** (current focus) and a **review pool** (seen,
outside the block), then ranks with a three-tier priority key:

```
due review (0)  <  never-seen (300)  <  seen-but-not-due (1000)
                 + soonest-due-first among reviews
                 + weaker-topics-first
                 + staleness penalty (recently-seen concepts sink)
```

The `never-seen (300)` tier is the fix for "no new questions": brand-new
concepts surface *above* the backlog of not-yet-due reviews, while genuinely due
reviews still come first. Selection is then a **weighted sample** from the top
of the ranking (Efraimidis–Spirakis), not a strict argmax, so consecutive sets
don't feel identical. `chooseVariant` prefers a presentation the learner hasn't
seen inside the suppression window, guaranteeing a different patient on
resurface. Answer order is a separate pure Fisher–Yates shuffle
(`engine/shuffle.ts`), tested independently.

---

## 5. Testing strategy

The pure layers carry the weight because they encode the product's promises.
96 tests across 13 suites, and the ones that matter most are **property/
simulation** tests, not example checks:

- **No-repeat guarantee** — a 25-session simulation asserts a multi-variant
  concept never repeats the same vignette back-to-back.
- **Coverage push** — a fresh learner is served unseen content; no concept is
  starved over 40 simulated sessions.
- **Merge correctness** — points don't double-count; a first sign-in folds
  guest progress into the account.
- **Source integrity** — the denylist rejects every commercial brand; every
  vignette has a public source.
- **Full subtopic coverage** — a taxonomy row can't ship empty.

The rule: a behavior the product *promises the user* gets a test that would fail
if we broke the promise, ideally by simulation rather than a single fixture.

---

## 6. Performance & the code-splitting plan

Today the whole app — engine, UI, and **all** content — is one bundle
(~407 KB raw, ~117 KB gzipped). It's fine now; it won't be at 5–10× the
content. The content modules are ~4,500 lines and are the growth vector. The
plan, in priority order:

1. **Split content off the initial route.** The Today hub, focus picker, and
   shell don't need the item bank until a drill starts. Move `bank.ts`'s module
   imports behind a `import()` so the content chunk loads when the first game
   launches, not at cold start. This is the highest-leverage split — it caps
   time-to-interactive independent of content size.
2. **Split content by module/system.** Because content is already authored as
   independent `ContentModule`s, each can become its own dynamically-imported
   chunk keyed by system. A learner drilling Cardiology fetches the cardiology
   chunk; the rest never loads. The merge/validation seam stays put — only the
   *loading* becomes lazy.
3. **Route-level UI splits.** `profile`, `progress`, and the `ecgRenderer` are
   natural `import()` boundaries — the ECG renderer in particular only matters
   for one game.
4. **Precompute the bank at build time.** The Zod validation + normalization
   currently run in-process. They can move to a build step that emits a frozen,
   validated JSON bank, so the client ships data, not an authoring pipeline.

None of this changes the module boundaries in §1 — it changes *when* each
boundary's code loads. Do them in order; measure gzip + TTI after each. Don't
pre-split before there's weight to justify the added indirection.

---

## 7. The road to an iPhone game

Phased, each phase shippable on its own. "Built" = in this repo and tested;
"external" = needs a Mac, an Apple account, or a hosted service.

**Phase A — Platform foundation (this PR). Built.**
Local-first core, all four mini-games, accounts (guest → local → cloud),
progress-preserving sync engine + REST adapter, Profile UI, Capacitor iOS
config, answer randomization hardened, new-vs-review fixed. The hard logic
(merge, selection, scoring) is unit-tested; what remains for cloud is
*configuration*, not code.

**Phase B — Go online.** Stand up one backend that satisfies the two-endpoint
contract in `docs/SYNC_AND_IOS.md` (Supabase recipe included), set
`VITE_SYNC_URL`, wire the OAuth handshake to `applyCloudAccount`. Sync is then
live; nothing in this repo changes.

**Phase C — Ship to iOS.** On a Mac: `npm run ios:add` / `ios:sync` / `ios:open`,
add Sign in with Apple (Apple *requires* it alongside any other social login),
sign, archive, submit. The PWA path (`Add to Home Screen`) is the zero-cost
validation channel to use *before* investing in submission.

**Phase D — Depth & polish.** Grow presentations-per-concept; wire ≥2
independent model families (and then humans) into the review pipeline
(`docs/REVIEW.md`) to move content from `in_review` to `validated`; overwrite
seed difficulties with observed p(correct) once telemetry exists; tune the
gamification loop (§8) against real retention.

---

## 8. Gamification — built, next, and never

**Built:** points (base + speed bonus), streak with one weekly repair, per-topic
mastery bands, daily goal with a post-call setting. The loop is *mastery-shaped*
— you're rewarded for spacing and for weak-topic recovery, not for grinding.

**Next:** concept-level "solid topics" milestones, a shareable (synthetic)
progress summary, opt-in one-a-day nudge (user-timed).

**Never** (design guardrails, not backlog): hearts/lives that block practice,
virtual currency, pay-to-progress, public leaderboards, or guilt notifications.
The product competes on *respecting the learner's time and judgment*; these
mechanics trade that away for short-term engagement and are out of scope
permanently.

---

## 9. Open questions / risk register

- **Content correctness** is the top risk: unreviewed content at scale is a
  liability until reviewers run. The multi-reviewer pipeline (`docs/REVIEW.md`)
  and the measured status counts mitigate it, but it is only *resolved* concept
  by concept as independent reviews land — wiring ≥2 real model families into
  the runner is the highest-value next content task.
- **Backend choice** (Phase B) is deferred by design — the port makes it a late,
  reversible decision. Supabase is the recommended default (Apple/Google auth +
  row-level security out of the box).
- **iOS review**: Apple scrutinizes medical apps; the "educational, synthetic,
  not clinical guidance" framing must be explicit in the listing and in-app.
- **Difficulty seeds** are author guesses until telemetry replaces them.
```
