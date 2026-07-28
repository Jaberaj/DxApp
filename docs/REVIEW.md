# Content review — multi-reviewer validation

All clinical content in Cadence is LLM-drafted and therefore
**plausible-but-sometimes-wrong**. It is not shown to a learner as
*validated* until it earns that status through independent review. This
doc describes how review works, the rule that promotes content, and how to
run the pipeline.

The design decision (from the product owner): *review is done by several
LLMs validating against several external sources* — with human sign-off
layered on later. So review is an **automated, provider-agnostic pipeline
with a promotion rule**, not a single sign-off.

---

## The four states

A concept's review status is **derived**, never hand-set
(`src/content/review.ts`):

| Status | Meaning |
|---|---|
| `unreviewed` | no reviews yet |
| `in_review` | has reviews, but not enough independent passes to validate |
| `validated` | enough independent reviewers agree it is correct |
| `flagged` | a reviewer currently says `fail`, or raised a `flag` not yet resolved |

## The promotion rule

A concept becomes **`validated`** when both hold:

1. **No open problems** — no reviewer's *current* verdict is `fail` or
   `flag`. (A later `pass` from the same reviewer supersedes their earlier
   flag, so re-review resolves it.)
2. **Enough independent passes** — at least
   `REQUIRED_INDEPENDENT_PASSES` (2) passing reviews from **distinct
   families**, each citing at least `MIN_SOURCES` (2) public sources.

**Independence is the whole point.** Two passes from the *same* model
family are not two opinions — they share the same blind spots — so they
count once. Families are grouped by `family` (`anthropic`, `openai`,
`google`, …); each **human** reviewer is always their own family. This is
why the seeded first pass (one model, one family) leaves content at
`in_review`, not `validated` — see the honesty note below.

Anything with reviews but short of the bar is `in_review`; a `fail` or an
open `flag` makes it `flagged` regardless of how many passes exist.

## What a reviewer is asked

The rubric (`buildReviewPrompt` in `src/content/reviewPipeline.ts`) hands
one concept's vignettes to a reviewer and requires it to check, against
**current public sources**:

1. the keyed-correct answer is actually correct for the stem,
2. the one-sentence discriminator is factually right and the true
   distinguishing point,
3. every distractor is genuinely wrong and its "why-not" is accurate.

It must **cite only public sources it actually used** — never a commercial
question bank — and is told to **prefer `flag` over `pass` when unsure**: a
pass is an assertion that it checked and it's right. Output is strict JSON:

```json
{"verdict":"pass|flag|fail","sources":[{"ref":"...","year":2023}],"notes":"..."}
```

## Source policy (same as the content itself)

Reviewer citations go through the **same denylist** as vignette sources
(`src/content/validation.ts`): a review that cites UWorld, AMBOSS, NBME,
Pathoma, Sketchy, First Aid, etc. **fails the build**. Public
clinical-evidence sources only — specialty-society guidelines,
government/agency guidance (CDC/WHO/USPSTF), or peer-reviewed literature.
See `docs/CONTENT_POLICY.md`. A `flag`/`fail` with no `notes` also fails the
build — a problem report must say what the problem is.

## Running the pipeline

```sh
npm run review                    # dry run: show the queue + a sample prompt
npm run review -- --mock          # run mock reviewers end-to-end
npm run review -- --mock --limit 5 --out reviews.json
```

- **Dry run** (no reviewers wired) prints how many concepts still need
  validation and the exact prompt a reviewer receives.
- **`--mock`** runs two independent mock families so you can watch concepts
  move to `validated` and see the record format.

### Wiring real reviewers ("multiple LLMs against several sources")

A reviewer is a small port (`Reviewer` in `reviewPipeline.ts`):

```ts
interface Reviewer {
  id: string;               // recorded on the review, e.g. 'claude-opus-4-8'
  kind: 'llm' | 'human';
  family?: string;          // 'anthropic' | 'openai' | 'google' — for independence
  review(prompt: string): Promise<{ verdict; sources; notes }>;
}
```

Implement one per provider (each reads its own API key from the
environment), push them into `realReviewers` in
`scripts/review-content.ts`, and run without `--mock`. The header of that
file has a copy-paste Anthropic adapter sketch. Use **at least two distinct
families** so a concordant result actually validates. The runner returns
`ReviewRecord`s to merge into `src/content/reviews.ts`; a reviewer that
throws is recorded as a `flag`, never a silent pass.

## How reviews are stored

Reviews live in `src/content/reviews.ts`, keyed by `conceptId`, **apart**
from the content modules — reviews accrue over time from the pipeline
without touching the vignettes. `bank.ts` merges them onto each concept
during normalization, and `reviewStatus()` derives the state.

## Honesty note on the current seed

The bank ships with a genuine **first-pass** review by a single reviewer
(`claude-opus-4-8`, family `anthropic`) over the 12 concepts most recently
deepened. One reviewer of one family is **deliberately not enough** to
validate anything — those concepts sit at `in_review`. Promotion to
`validated` requires a **second, independent** model (a different family) —
or a human — to agree. Do not hand-edit reviews to force a `validated`
status; run the pipeline with additional providers instead.
