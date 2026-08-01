# USMLE knowledge-graph integration

DxApp treats [`Jaberaj/usmle-knowledge-graph`](https://github.com/Jaberaj/usmle-knowledge-graph)
as a **pinned, build-time, versioned clinical substrate** — not a runtime
dependency and not a ready-made question bank. The graph supplies structured
facts (diseases, presentations, findings, differentials, diagnostics,
treatments, references); DxApp remains the question-authoring layer, game
engine, learner-state system, review pipeline, and UI.

This is the integration **foundation plus a preview-only dry-run pilot**. No
knowledge-graph content is published to learners, and `src/content/bank.ts`
is untouched.

## Hard rules

- **No runtime GitHub fetch.** DxApp is local-first/offline. The graph is
  imported at development/CI time from a pinned snapshot, never from the
  browser.
- **Consume `dist/json` only** — never `data/source`/`data/curation` internals.
- **Never rewrite an existing `conceptId`.** Concept IDs are permanent join
  keys for FSRS scheduling, mastery, session history, and coverage. Linking is
  done through the crosswalk (`src/integrations/usmleKg/crosswalk.ts`); new
  graph-only concepts would take a deterministic `kg.<DISEASE-ID>` id (not added
  in this task).
- **Transform, don't transcribe.** Facts become original vignettes, options,
  discriminators, and rebuttals — one row is never one question.
- **KG acceptance ≠ DxApp `validated`.** Passing the KG gate only makes a source
  eligible for DxApp's independent review pipeline.

## Pipeline

```
KG_SNAPSHOT_DIR=…/usmle-knowledge-graph/dist/json  npm run import:kg
```

1. **`loadSnapshot`** reads `manifest.json`, validates the contract version and
   required bundles, verifies SHA-256 checksums, rejects duplicate stable IDs
   and unresolved relationship references, and builds indices. Any failure
   throws `SnapshotError`. The manifest's declared `git_commit` is recorded
   **separately** from repository HEAD — they are not assumed equal.
2. **`crosswalk`** links ten existing DxApp Neurology concepts to KG diseases by
   hand. Non-exact name matches are `candidate`, never auto-accepted.
3. **`releasePolicy`** derives a `KgImportStatus` (separate from DxApp review
   status) and gates capabilities. A **substantive-template detector** flags the
   generic differential/treatment filler the KG audit found; a **review-status**
   gate blocks unreviewed treatment edges.
4. **`transformConcept` / `transformItems`** emit preview-only candidates —
   producing an item only when the graph supplies a defensible answer, realistic
   distractors, a relationship-specific discriminator, a why-not for each
   distractor, and a verified public source. Otherwise the candidate is
   **skipped with an exact reason** (never filled with generic prose).
5. The importer writes `generated/usmle-kg/{pilot-candidates,pilot-provenance,
   import-report}.json` and `import-report.md`.

## Release gating (`KgImportStatus`)

| status | production | preview | finding items |
|---|---|---|---|
| `accepted` | ✅ | ✅ | ✅ |
| `semantic_review_pending` | ❌ | ✅ | ❌ |
| `migration_pending` | ❌ | ✅ | ❌ |
| `source_unverified` | ❌ | ❌ | ❌ |
| `blocked` | ❌ | ❌ | ❌ |

**Neurology is semantically unaccepted (Phase 4B)**, so `ACCEPTED_MODULES` is
empty and every Neurology candidate is capped at `semantic_review_pending`
(preview-only). When a module is accepted upstream, add it to
`ACCEPTED_MODULES`, regenerate from the same pinned commit, review the diff, and
promote only concepts that also pass DxApp's independent review pipeline —
starting with `one_liner` and `discriminator`, adding treatment/contraindication
items only after diagnostic content is stable.

## Current pilot result (snapshot commit `529cd13c`, contract `1.0.0`)

10 concepts crosswalked (9 confirmed, 1 candidate) · sources resolved 10/10 ·
**0 item candidates, 40 skipped** — 30 `finding-items-gated-by-status`
(Neurology unaccepted) and 10 `treatment-edge-unreviewed`. **0 added to the
production bank.** The skips are the gap list the graph must close for Neurology:
template/placeholder `distinguishing_features` and presentation prose, and
unreviewed, generically-contextualized treatment edges.

## A useful upstream addition

A generated `dist/json/content_status.json` exposing module-level migration and
semantic-acceptance status would let DxApp read release eligibility directly
instead of encoding it in `releasePolicy.ts`.
