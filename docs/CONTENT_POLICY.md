# Content & sourcing policy

Cadence is educational software with synthetic patients. Its value depends on
being **original, sourced, and honest about review status**. This policy is
enforced at build time (`src/content/validation.ts`, run as a `prebuild` gate)
and documented here so the boundary is explicit.

## Two source roles

Adapted from the AtlasMD editorial model; both roles coexist in this repo.

| Role | What it is | May be copied? | May be cited on a vignette? |
|---|---|---|---|
| **coverage-only** | Commercial board-prep products (First Aid, UWorld, AMBOSS, Pathoma, Boards & Beyond, Sketchy, OnlineMedEd, NBME/Free 120) and the public USMLE Content Outline. Used to know **which topics** merit coverage. | **No** — never copy, scrape, screenshot, paraphrase, or reconstruct their questions, tables, images, mnemonics, or explanations. | **No.** |
| **clinical-evidence** | Public agency (CDC, WHO, NIH), specialty-society guidelines (ACC/AHA, IDSA, KDIGO, ADA, ACOG, AAP, Endocrine Society, …), USPSTF, and peer-reviewed literature. | Facts only, in **new language** — never reproduce wording or tables. | **Yes.** |

**A topic list is not copyrightable; a question is.** We may look at what
subjects a board-prep product covers to find our own gaps, then write every
vignette originally and cite a public clinical-evidence source. We never turn
their content into ours.

## Enforced at build time

`npm run build` runs `npm run validate` first and **fails** if any vignette's
`source` cites a coverage-only brand (regex denylist in `validation.ts`). It
also fails on dangling references, malformed content, or a concept outside the
taxonomy. Reputable primary sources only.

## Review status

LLM-drafted clinical content is plausible but sometimes subtly wrong. Every
concept carries `reviewedBy` / `reviewedOn`; all current content is
`UNREVIEWED` and the build **warns** on it. `UNREVIEWED` content must never be
presented to a learner as validated. The intended review is a pass against the
cited public source, marking each concept reviewed once its facts are confirmed
against that source (not against any commercial product).

## Web scraping

Do not scrape commercial board-prep material to generate content. It is
copyright infringement and plagiarism even when paraphrased, and it is
explicitly out of scope here. Public-domain and openly-licensed agency/guideline
material may be read to write original summaries, respecting each source's terms.
