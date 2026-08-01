# USMLE knowledge-graph import — pilot report (preview only)

_Generated 2026-08-01T18:24:39.561Z. **No candidate was added to the production bank.**_

## Snapshot provenance
- Declared source commit (from manifest): `529cd13c8f1523ac09e5002ab002a661d40f3a65`
- Application contract version: `1.0.0`
- Knowledge-base version: `0.1.0`
- Importer version: `0.1.0`
- Records loaded: algorithm_steps 870, algorithms 93, diagnostics 30, disease_diagnostics 562, disease_differentials 642, disease_presentations 473, disease_treatments 651, diseases 473, entity_references 385, medications 50, presentations 96, references 15, treatments 79

> The manifest's declared source commit is recorded independently of the
> checked-out repository HEAD; they are not assumed equal.

## Crosswalk
- Concepts crosswalked: **10** (confirmed 9, candidate 1, unmatched 0)

| DxApp concept | KG disease | Name | KG import status | sources | gaps |
|---|---|---|---|---|---|
| guillain-barre | DIS-N-0068 | Guillain-Barre syndrome | semantic_review_pending | 1 | 0 |
| myasthenia-gravis | DIS-N-0067 | Myasthenia gravis | semantic_review_pending | 1 | 0 |
| multiple-sclerosis | DIS-N-0065 | Multiple sclerosis | semantic_review_pending | 1 | 0 |
| parkinson | DIS-N-0066 | Parkinson disease | semantic_review_pending | 1 | 0 |
| status-epilepticus | DIS-N-0062 | Status epilepticus | semantic_review_pending | 1 | 0 |
| sah-thunderclap | DIS-N-0060 | Subarachnoid hemorrhage | semantic_review_pending | 1 | 0 |
| tia | DIS-NEUR-001 | Transient ischemic attack | semantic_review_pending | 1 | 0 |
| wernicke | DIS-NEUR-101 | Wernicke encephalopathy | semantic_review_pending | 1 | 0 |
| bell-palsy | DIS-NEUR-118 | Bell palsy | semantic_review_pending | 1 | 0 |
| migraine | DIS-NEUR-053 | Migraine without aura | semantic_review_pending | 1 | 1 |

## Candidates
- Concept previews: **10**
- Item candidates (preview-only): **0**
- Skipped: **40**
- Added to production bank: **0**

### Skip reasons
- `finding-items-gated-by-status` — 30
- `treatment-edge-unreviewed` — 10

### Import-status counts
- `semantic_review_pending` — 10

## What this pilot reveals
Neurology is semantically **unaccepted** (Phase 4B), so every candidate is
capped at `semantic_review_pending` and is preview-only. The dominant skip
reasons above are the schema gaps the graph must close before its Neurology
content can drive production items — chiefly template/placeholder
`distinguishing_features` and presentation prose, and generic treatment
concepts without a disease-specific role. Sources resolved for
10/10 concepts.

_First skips traceable in `import-report.json` and `pilot-candidates.json`._
