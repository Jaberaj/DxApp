# REFACTOR PLAN — Cadence content engine

> **How to use this file:** commit it to the repo root as `REFACTOR_PLAN.md`. Work through the PRs **in order**. Each is self-contained, each has acceptance criteria, each must ship green tests before the next begins. Do not batch them.

---

## Root cause

Almost every reported defect traces to one architectural mistake: **the item is the unit of content, when the concept should be the unit of content.**

Right now an "item" is presumably a self-contained object with a stem, four options, and a system tag. That single decision produces, downstream:

| Symptom | Cause |
|---|---|
| Differentials repeat often | Nothing to select *between* — one item per concept means seeing the concept twice means seeing the identical vignette twice |
| Not many differentials | Each concept costs a whole hand-authored item, so the bank grows linearly and slowly |
| Not all systems represented | No coverage matrix exists to make the gaps visible |
| Filters don't filter well | Single-valued `system` / `rotation` strings + a silent fallback when the filtered pool is too small |
| No subtopic filtering | No taxonomy layer between "system" and "item" |
| No coverage tracker | Nothing stable to track *against* — item IDs churn, concept IDs don't |
| Patients all present the same way | Presentation variance is a property of the concept, and there's no concept |

So: **PR 1 is the whole game.** Everything after it is comparatively mechanical. Do not start PR 3 before PR 1 is merged and green.

---

## PR 1 — Concept/variant data model

### The model

```ts
// A Concept is a diagnosis or a management decision. It is the unit of
// mastery, the unit of scheduling, and the unit of coverage reporting.
// Concept IDs are PERMANENT. Never renumber them; they are the join key
// for every piece of learner state in the app.
interface Concept {
  id: string;                    // "pulm.vte.pe" — stable forever
  name: string;                  // "Pulmonary embolism"
  system: SystemId;              // primary system
  subtopic: SubtopicId;          // "pulm.vte"
  alsoTaggedSystems: SystemId[]; // PE is also cardiovascular
  rotations: RotationId[];       // ["im","em","surg"] — MANY, not one
  level: ("preclinical" | "clerkship")[];
  usmleOutlineRefs: string[];    // public USMLE Content Outline codes
  discriminator: string;         // ONE sentence. The teaching payload.
  illnessScript: {
    epidemiology: string;
    timeCourse: string;
    keyFindings: string[];
    classicDistractors: ConceptId[];  // what it's confused with
  };
  reviewedBy: string;
  reviewedOn: string;            // ISO date
}

// A Vignette is ONE WAY a concept can present. Multiple per concept.
interface Vignette {
  id: string;                    // "pulm.vte.pe.v3"
  conceptId: string;
  presentation: PresentationType;
  stem: string;
  vitals: Vital[];               // structured, rendered as chips
  findings: Finding[];
  distractorConceptIds: string[];// references, NOT free text
  difficulty: number;            // seeded 0-1, OVERWRITTEN by observed data
  exposures: number;             // populated from telemetry
  pCorrect: number | null;       // null until n >= 30
}

type PresentationType =
  | "classic"        // the textbook case
  | "atypical"       // the one that gets missed
  | "early"          // before the classic findings appear
  | "elderly"        // afebrile, confused, no pain
  | "masked"         // comorbidity or medication hides the signal
  | "severe"         // decompensated
  | "mimic";         // looks like this concept, ISN'T — answer is a distractor
```

`mimic` is the highest-value type and the easiest to forget. A vignette that looks like PE but is actually pericarditis teaches more than three more classic PEs.

### Taxonomy

Create `src/content/taxonomy.ts` as the single source of truth. Three levels: system → subtopic → concept. Example:

```
cardiovascular
  ├── cv.ischemia      (stable angina, NSTEMI, STEMI, Prinzmetal…)
  ├── cv.heart-failure (HFrEF, HFpEF, acute decompensated, cardiogenic shock…)
  ├── cv.arrhythmia    (AF, SVT, VT, AV blocks…)
  ├── cv.valvular
  ├── cv.pericardial
  ├── cv.vascular      (aortic dissection, PAD, AAA…)
  └── cv.congenital
```

Do all 12 systems: cardiovascular, pulmonary, renal/GU, GI/hepatobiliary, endocrine, neurology, heme/onc, infectious disease, MSK/rheum, dermatology, psychiatry, reproductive. Plus two cross-cutting: `multisystem` (sepsis, shock, acid–base) and `pediatrics`.

Target 6–9 subtopics per system, 4–10 concepts per subtopic. That framing alone will make the gaps obvious.

### Migration

Write `scripts/migrate-to-concepts.ts`. Every existing item becomes one concept plus one `classic` vignette. Preserve the existing IDs as `legacyItemId` so no learner state is orphaned.

### Acceptance criteria

- [ ] `taxonomy.ts` covers all 12 systems + 2 cross-cutting, every subtopic has an ID
- [ ] Every concept validates against a Zod schema at build time; build **fails** on a malformed concept
- [ ] Every vignette's `distractorConceptIds` resolve to real concepts — CI fails on a dangling reference
- [ ] Migration is lossless: item count in = concept count out, verified by test
- [ ] `npm test` includes a content-integrity suite that runs on every commit

---

## PR 2 — Selection engine

This is where the repeats get fixed. The current selector is almost certainly `filter().sort(() => Math.random() - 0.5)` with no memory. Replace it with an explicit, testable pipeline.

```
1. ELIGIBLE   — vignettes matching the active filter
2. SUPPRESS   — drop vignettes seen in the last N sessions (N=5 default)
                and any vignette of a concept already in THIS session
3. SCORE      — weight each remaining vignette:
                  +++ concept due per FSRS
                  ++  concept mastery below band
                  ++  concept never seen (coverage push)
                  +   presentation type the learner hasn't seen for this concept
                  --  recently seen
4. SAMPLE     — weighted random from the top ~30%, NOT deterministic argmax
                (argmax makes every session feel identical)
5. BACKFILL   — if the pool is short, apply the fallback ladder (see PR 3)
```

**Non-negotiable rule:** if a concept must repeat within a session — it shouldn't, but if the pool forces it — it must be a **different vignette**. Never the same vignette twice in a session. Assert this in a test.

### Acceptance criteria

- [ ] Unit test: 200 consecutive sessions on a 60-concept bank, assert no vignette repeats within a session, and no vignette repeats across a 5-session window
- [ ] Unit test: over 50 sessions, every concept in the filtered pool is seen at least once (coverage push works)
- [ ] Unit test: weak concepts appear at ≥2× the rate of mastered concepts
- [ ] Selection is a pure function of (bank, learnerState, filter, seed) — seedable for tests

---

## PR 3 — Filters that actually filter

### The bug you're seeing

Two things are almost certainly wrong.

**One:** items carry a single `system: string` and a single `rotation: string`, matched by equality. PE belongs to pulmonary *and* cardiovascular, and appears on IM, EM, and surgery. Single-valued tags make every filter wrong in both directions.

**Two — and this is the one users feel:** when the filtered pool is too small, the code silently widens to the full bank. So the user picks "Renal," gets cardiology questions, and concludes the filter is broken. It isn't broken; it's lying.

### The fix: an explicit, visible fallback ladder

```ts
type PoolSource = "exact" | "adjacent-subtopic" | "system-wide" | "review-mix";

// Never widen silently. Every widening is returned in the result and
// surfaced in the UI.
```

Ladder, in order:
1. Exact filter match
2. Same system, adjacent subtopics
3. System-wide
4. Stop. **Do not** cross into other systems.

If after step 3 there still aren't 12 items, **return a short set and say so**: *"Only 7 renal items match your filter — here's a set of 7. More renal content is coming."* A short honest set builds far more trust than 12 items where 5 are off-topic.

### Filter UI

- System multi-select
- Subtopic multi-select, nested under system, with an item count per subtopic
- Rotation preset (sets a system weighting, doesn't hard-filter)
- Live count: **"142 items match"** updating as they toggle. This single number makes the whole filter comprehensible and is the cheapest trust-building feature in the app.

### Acceptance criteria

- [ ] Selecting one subtopic returns *only* that subtopic's concepts, or fewer items with an explicit notice
- [ ] `PoolSource` is asserted in tests for each rung of the ladder
- [ ] A test asserts that no filter path ever returns a concept from an unselected system
- [ ] Live count matches actual returned pool size (test with 10 random filter combinations)

---

## PR 4 — Coverage tracker

Now possible because concept IDs are stable.

```ts
interface CoverageState {
  [conceptId: string]: {
    seen: number;
    correct: number;
    presentationsSeen: PresentationType[];  // drives "you've only seen the classic case"
    lastSeen: string;
    mastery: number;        // 0-100, decaying
    band: "unseen" | "shaky" | "working" | "solid";
  }
}
```

**UI:** a system → subtopic → concept drill-down. At subtopic level show `14 of 22 concepts seen · 6 solid · 5 working · 3 shaky`. Make unseen concepts tappable to drill them directly — this turns the tracker from a report card into a navigation surface, which is what makes people use it.

Add a per-concept line: **"You've seen the classic presentation only."** That's the nudge that makes learners want the atypical variants, which is exactly the behavior you want.

### Acceptance criteria

- [ ] Coverage survives a schema migration (see PR 7)
- [ ] Percentages computed against the *filtered* denominator, not the whole bank
- [ ] Drilling into an unseen concept starts a set containing it

---

## PR 5 — Treatment item types (the missing mini-game)

Same engine, new item types, **higher safety bar.**

```ts
type ItemType =
  | "dx_one_liner"      // existing
  | "dx_discriminator"  // two named dx, which finding separates them
  | "dx_cant_miss"      // what must you exclude first
  | "tx_next_step"      // ← the missing game
  | "tx_contraindication"
  | "tx_sequencing"
  | "tx_threshold";
```

`tx_next_step` is the flagship: diagnosis given, what do you do *now*, and the explanation says why not the other three. `tx_contraindication` ("which of these must you NOT give?") maps directly onto real clinical error and is the highest-value type in this group.

### Additional required fields on treatment concepts

```ts
interface TreatmentConcept extends Concept {
  guideline: {
    body: string;        // "ACC/AHA"
    title: string;
    year: number;
    url?: string;
  };
  guidelineTag: string;  // "acc-aha-hf-2022" — makes bulk re-review one query
  lastClinicalReview: string;
  reviewedByTwo: [string, string];  // two reviewers, enforced by schema
}
```

`guidelineTag` is the field everyone skips and regrets. When the HF guideline updates you need to run one query and get every affected item. Without it, you re-read the whole bank manually — which means you don't, and the bank rots.

**Build-time guards:**
- Schema rejects a treatment concept with fewer than two reviewers
- Schema rejects `lastClinicalReview` older than 18 months → CI warns, over 24 months → CI fails
- Prefer thresholds, sequences, and contraindications over bare dosing

### Acceptance criteria

- [ ] `tx_next_step` renders, scores, and explains in the existing drill loop with no special-casing in the UI layer
- [ ] Mixed sets interleave dx and tx items
- [ ] Treatment items display their guideline citation and year in the explanation
- [ ] Build fails on a treatment concept missing two reviewers or a guideline tag

---

## PR 6 — Presentation variance

For the top 40 concepts by prevalence, author 3–5 vignettes each across different `presentation` types. Minimum viable spread per concept: `classic`, one of {`atypical`, `elderly`, `masked`}, and one `mimic` where this concept is the *wrong* answer.

Worked example — **pulmonary embolism**:

| Type | Vignette |
|---|---|
| classic | Post-op day 6, pleuritic pain, swollen calf, clear chest |
| atypical | Syncope alone, no chest pain, unexplained sinus tach |
| elderly | 84F, confusion and a fall, RR 24, no pain reported |
| masked | On rate control, HR 78 despite significant clot burden |
| severe | Hypotensive, RV strain on echo — the answer is now management |
| mimic | Post-op pleuritic pain and dyspnea, but fever + focal consolidation → pneumonia |

Add a content-linting test: any concept with `exposures > 200` and only one vignette gets flagged in CI output as a variance gap.

### Acceptance criteria

- [ ] Top 40 concepts have ≥3 vignettes
- [ ] Every concept with ≥3 vignettes includes at least one non-classic presentation
- [ ] Selector prefers unseen presentation types for already-seen concepts
- [ ] CI reports a variance-gap list on every build

---

## PR 7 — Persistence hardening

Ship this before the bank grows or you will lose learner state.

```ts
interface PersistedState {
  schemaVersion: number;   // ← currently missing, I'd bet money on it
  // ...
}
```

- Versioned schema with a migration chain (`v1→v2→v3`), each migration unit-tested
- On unknown/corrupt state: back up to `cadence.backup.<timestamp>`, reinitialize, tell the user — never silently wipe
- Persist mid-session state so a backgrounded tab doesn't lose a set in progress
- Wrap every `localStorage` write in try/catch — Safari private mode throws on write, and iOS Safari evicts localStorage after ~7 days of no visits. **This will bite you in real testing.** Consider IndexedDB for the durable copy.
- Export/import as JSON — free, and it's your account-migration path later

### Acceptance criteria

- [ ] Migration test: a v1 payload loads correctly under current code
- [ ] Corruption test: malformed JSON → backup written, app boots clean
- [ ] Quota-exceeded test: write failure doesn't crash the drill loop

---

## PR 8 — USMLE alignment

### Read this part carefully

**Do not copy, paraphrase, ingest, or train on NBME, UWorld, AMBOSS, or Kaplan items.** They are copyrighted and vigorously enforced. This is both a legal exposure and, if you ever want an institutional sale, a reputational one. Any "validation" that involves scraping a question bank is off the table.

### What legitimate alignment looks like

**1. Map to the public USMLE Content Outline.** The outline (physician tasks × systems) is published by USMLE and free to reference. Add `usmleOutlineRefs: string[]` to every concept, then generate a coverage report against outline sections. That report is the artifact you show a clerkship director — *"we cover 84% of the Step 2 CK cardiovascular outline"* is a defensible, citable claim.

**2. Weight by published prevalence.** The Step 2 CK content weighting is public. If cardiovascular is ~10% of the exam, your bank should approximate that. A coverage report that shows your bank is 40% cardiology because that's what got authored first is exactly the kind of gap this surfaces.

**3. Physician review against primary sources.** Cite the guideline or the primary literature. Never cite a question bank.

**4. Psychometric validation — the real thing.** Once you have exposure data: item difficulty (p-value), discrimination index (do high performers get it right more often?), and distractor analysis. Flag automatically:
   - p < 0.40 → the item is broken or the distractor is a trap
   - p > 0.95 → it isn't teaching anything
   - discrimination < 0.15 → it doesn't separate strong from weak learners
   - any distractor chosen <5% of the time → dead weight, replace it

**5. The claim that actually sells.** Measure mastery gain on **held-out** items the learner hasn't drilled. Almost no study product can demonstrate this. Build the measurement infrastructure now even if you don't use the number for a year — it's your institutional sales asset.

### Acceptance criteria

- [ ] `npm run report:coverage` emits a USMLE outline coverage table
- [ ] `npm run report:psychometrics` emits flagged items by the thresholds above
- [ ] Every concept cites a primary source; CI fails on a concept citing a commercial question bank

---

## Bugs to hunt while you're in there

Predicted from the symptoms; verify each:

1. **Silent filter widening** — grep for a fallback that returns the unfiltered bank. Almost certainly the cause of "filters don't filter well."
2. **Shuffle without memory** — `sort(() => Math.random() - 0.5)` is both a biased shuffle *and* stateless. Both bugs, one line.
3. **No `schemaVersion`** — every future content change risks corrupting saved state.
4. **Distractors as strings** — if distractors aren't concept references, you can't do distractor analysis, can't guarantee a distractor is a real diagnosis, and can't detect the same distractor appearing twice in one set.
5. **Hand-declared difficulty** — authors are bad at this. Seed and overwrite with observed data.
6. **Off-by-one on set completion** — check the last item's result is committed before the summary renders.
7. **Timer affecting correctness** — confirm it only gates the bonus. If a timeout marks an answer wrong, you're training guessing.

---

## Content targets

| Milestone | Concepts | Vignettes | Systems |
|---|---|---|---|
| Current | ? | ? | partial |
| PR 6 done | 150 | 400 | 12 |
| V1 launch | 300 | 800 | 12 + 2 |
| V1.5 (+tx) | 300 dx + 120 tx | 1,100 | 12 + 2 |

At 15–20 concepts per hour of clinician review, V1 is roughly **20–25 hours of physician time**. That is the real schedule driver, not the code.

---

## Order of work

```
PR 1  Concept/variant model      ← blocks everything
PR 2  Selection engine           ← fixes repeats
PR 3  Filter ladder              ← fixes filtering
PR 7  Persistence hardening      ← do early, before the bank grows
PR 4  Coverage tracker
PR 6  Presentation variance      ← content-heavy, parallelizable
PR 5  Treatment items
PR 8  USMLE alignment + reports
```

PR 7 is out of numeric order deliberately. Ship it before the content bank grows or you'll be writing migrations against a moving target.
