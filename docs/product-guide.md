# Cadence — Product & Feature Guide

*Rapid clinical reasoning drills, and later, a presentation coach.*

---

## The thesis in one paragraph

Two things get you graded in clinical training: whether you can generate a differential fast, and whether you can say it out loud in a way an attending trusts. Question banks train the first badly (slowly, in 90-second blocks, optimized for exam format rather than speed of recall) and nobody trains the second at all. Cadence trains recall speed first because that's the buildable, defensible V1 — then, once there's a habit and an account, adds the thing nobody else has.

**Ship order:** rapid differentials → rapid treatments → accounts and progression as the spine holding both → presentation coach.

---

## Version map

| | Scope | Why here |
|---|---|---|
| **V0** — validation | ~40 items, TestFlight, no accounts, no gamification | Does anyone do a second set unprompted? That's the whole question. |
| **V1** — Rapid Differentials | Item engine, focus scoping, accounts, spaced repetition, streak, mastery | The habit product. Must stand alone commercially. |
| **V1.5** — Rapid Treatments | New item types on the same engine, higher review bar | Doubles content value at low engineering cost. |
| **V2** — Case Presentation Coach | Record, grade, coach | The differentiator and the institutional wedge. |
| **V3** — Institutional | Class codes → cohort dashboards, assigned cases, SSO | Where the actual revenue is. |

---

# V1 — Rapid Differentials

## 1. Item types

A single MCQ format goes stale in about four sessions. Ship at least four of these, and treat #2 as the flagship — it's the actual reasoning skill and almost nobody drills it.

1. **One-liner → diagnosis.** Vignette plus vitals, four options. The workhorse. ~50% of the bank.
2. **Discriminator.** Two plausible diagnoses named up front: *which single finding separates them?* This is clinical reasoning stripped to its core and it is the most valuable item type you can build.
3. **Next best step.** Diagnosis is given or obvious — what do you order, and why not the other thing? (CTPA vs. D-dimer vs. V/Q.)
4. **Can't-miss first.** *Which of these must you exclude before anything else?* Trains the safety reflex rather than the likelihood reflex. These two instincts are different and students routinely conflate them.
5. **Build the differential.** Multi-select: pick the three that belong for this presentation.
6. **Odd one out.** Which diagnosis does *not* belong on this list, and why.
7. **Illness-script match.** Fast, low-stakes, good warm-up and good for the first session of a new system.

Keep a set mixed. Monotony is the churn driver.

## 2. Item schema

Every item is a structured record, not prose. This is what makes scoping, review, and analytics possible later — get it right before you have 400 items.

```
item_id, version
type                    one_liner | discriminator | next_step | cant_miss | ...
stem                    the vignette
vitals[]                structured, so they render as chips and can be varied
findings[]              exam, ECG, imaging
answer                  correct option
distractors[]           each with its own "why not" line
discriminator           ONE sentence. The teach. This is the product.
teaching_point          optional second sentence, max
illness_script_ref      links to the concept, not the item
tags: system            cardiovascular | pulmonary | renal | ...
tags: complaint         chest pain | dyspnea | syncope | ...
tags: rotation[]        IM, EM, surgery ... (an item can serve several)
tags: level             preclinical | clerkship | both
difficulty              CALIBRATED FROM USE, not author guess
source[]                guideline or reference, with year
reviewed_by, reviewed_on
```

Two things people skip and regret:

**Difficulty must be measured, not declared.** Authors are terrible at guessing. Seed with a guess, overwrite with observed p(correct) after ~50 exposures.

**Every distractor carries its own rebuttal.** "Why not pneumonia" is more instructive than "why PE." If a distractor is never chosen by anyone, it's dead weight — replace it.

## 3. Session design

- **Set size: 12 items, 5–7 minutes.** Sized for a bus ride, a coffee line, the gap between two patients. Long enough to feel like something, short enough that starting isn't a decision.
- **Per-item timer: 20s default, adjustable, disableable.**
- **Critical rule: the timer affects bonus points only, never correctness.** Punishing slow-but-right answers teaches guessing, which is the opposite of the skill. You lose the speed bonus, never the point.
- **Feedback is immediate and short.** One sentence on the discriminator, one on the best distractor. If your explanation needs a paragraph, the item is badly written.
- **One miss gets surfaced at the end**, with the reasoning — not all of them. Naming one failure lands; naming four is noise.

## 4. Focus scoping

The feature from the mockup, spelled out.

**Two modes, not one dropdown.** Systems course and rotation are different products wearing the same content:

| | Systems course (preclinical) | Rotation (clerkship) |
|---|---|---|
| Timer | Off by default | On |
| Explanations | Full illness script revealed | Discriminator only, script on tap |
| Content weighting | Mechanism-forward | Management-forward |
| Presentation coach (V2) | Locked, with an explainer | Core |

**The mix slider.** Defaults to 75% current block / 25% review. Students will drag it to 100% and arrive at the shelf having lost renal. Keep the default honest and put one plain sentence under it explaining why. This is the correct amount of paternalism for a study tool.

**Multi-select for boards season.** Around Step 2 prep they want everything. Allow "all systems," weighted by weakness.

## 5. Spaced repetition — with one important caveat

Use FSRS (better than SM-2, actively maintained, open implementations exist).

**Schedule at the concept level, not the item level.** If you repeat the same item, students memorize the vignette — the woman with the knee replacement — rather than the reasoning. You need **2–4 item variants per concept**: same discriminator, different patient, different distractor set. Retire an individual item for a user after two correct answers and resurface the concept through a sibling.

This roughly doubles your content requirement. Plan for it from the first authoring sprint rather than discovering it at item 300.

## 6. Mastery, not just points

Points are the reward loop. **Mastery is the product.**

- Per-topic score 0–100, decaying over time without practice.
- Visible on Today, moves visibly after each set.
- **Mastery drives the queue.** Weak topics resurface more. This is the thing that makes it feel like a coach instead of a quiz.
- Three bands: *shaky / working / solid*. Numbers alone invite grinding; bands invite moving on.

---

# V1.5 — Rapid Treatments

Same engine, new item types, **a materially higher safety bar.**

**Item types:**
- First-line management for a given diagnosis
- Next step *after* the diagnosis is made
- **Contraindication spotting** — "which of these must you not give?" (the highest-value type here; it maps directly to real error)
- Sequencing under time pressure — what comes first
- Guideline thresholds — when do you actually treat

**Non-negotiables for treatment content:**

1. **Every item cites a named guideline with a year.** Visible in the app, not buried.
2. **Every item shows a `last reviewed` date.** Users should be able to see that a treatment item was checked in the last twelve months.
3. **Tag items by the guideline they depend on.** When the ACC/AHA heart failure guideline updates, you need to run one query and get the list of affected items. Without this tag you will be manually re-reading your entire bank, and you won't, and the bank will rot.
4. **Two-clinician review** for anything involving a dose, a threshold, or a contraindication.
5. **Avoid bare dose memorization.** Doses without context are the least educational and highest-liability content you can write. Prefer thresholds, sequences, and contraindications.
6. **Persistent, unmissable framing:** educational use, synthetic patients, not clinical guidance.

---

# Accounts, sync, and data

## Sign-in

- **Sign in with Apple, Google, and email magic link.** No passwords — password reset flows are pure churn.
- Apple requires Sign in with Apple if you offer any other social sign-in on iOS. Build it.
- **Let people do one full set before signing up.** Guest state, then convert with "save your progress." This meaningfully outperforms a sign-up wall, and the first set is where you win or lose them.
- **Class codes, not SSO, for V1.** A six-character code joins a student to a cohort. It gets you the institutional wedge for roughly none of the engineering cost of SAML. Save real SSO for when a school is actually paying.

## What syncs

Mastery state, SR schedule, focus setting, streak and repairs, session history, settings, entitlements. Small enough to sync as JSON; don't over-engineer.

## Data posture — and why it's a selling point

**You never touch PHI, and you should say so loudly.** All patients are synthetic. That single fact keeps you out of HIPAA, out of most institutional security review, and out of the hardest conversations in health-tech sales. Protect it:

- Never ask users to enter real patient details anywhere.
- In V2, an explicit warning before the first recording, and a hard rule that audio is transcribed and discarded unless the user saves the take.
- Consider processing-on-device or a no-retention mode as a paid institutional option.

Collect the minimum: email, display name, training level, optional institution, focus setting. Ship account deletion and data export from day one — App Store requires the first and institutional buyers will ask for the second.

---

# Progression and the game layer

## Keep

| Feature | Note |
|---|---|
| **Streak (the rhythm strip)** | With **freeze/repair** — one free repair per week. A student on night float *will* break it, and a broken streak is a common quit moment. Make it forgivable. |
| **Adjustable daily goal** | Include a *post-call* setting: one set counts. |
| **Mastery per topic, decaying** | The real progress signal. |
| **Set summary with one named miss** | Specific beats comprehensive. |
| **Milestones tied to real things** | "Cardiology at 80%," not "Level 14." |
| **Anonymous cohort percentile** | "Faster than 72% of MS3s on cardiology." Comparison without a name attached. |

## Skip

- **Lives / hearts.** They punish errors, which suppresses guessing, which suppresses information about what the student doesn't know. Duolingo uses them to monetize impatience; you'd be paying for that in learning quality.
- **Gems and virtual currency.** Reads cheap in a professional tool.
- **Public named leaderboards by default.** Med students are competitive past the point of health. Opt-in class leagues for institutional accounts only.
- **Loss-aversion notifications.** No 11pm guilt pushes.

## Notification policy

One a day, maximum. At a user-chosen time. Never guilt-framed. This audience is exhausted and will nuke your notifications permanently on the first offense — and then your retention loop is gone for good.

---

# The mascot

A small stethoscope character — bell for a face, tubing for ears. Useful, but only if disciplined.

## Where it appears

| Surface | Yes/no | Why |
|---|---|---|
| App icon, brand mark | ✅ | Recognition |
| Onboarding and focus setup | ✅ | Warmth where the user is uncommitted |
| Empty states, loading, errors | ✅ | The classic best use — turns dead time friendly |
| Set-complete celebration | ✅ | The reward moment |
| Streak repair / post-call mode | ✅ | "Rough week — I've patched your streak" |
| Coach voice in V2 | ✅ | Blunt feedback lands better from a character than a system panel |
| **Beside a wrong answer** | ❌ | Undercuts the seriousness of the correction |
| **Anywhere in treatment content** | ❌ | Safety-critical surfaces stay sober |
| **Institutional dashboards** | ❌ | Different audience entirely |

**Rule of thumb: the mascot lives in the connective tissue, never on the clinical content itself.**

## Design brief

Flat vector, no gradients, one accent color. Legible at 24px and at 200px. Build 5 poses: neutral, celebrating, thinking, pointing, asleep (post-call). Give it a short name that isn't a pun on a disease.

---

# V2 — Case Presentation Coach

## Flow

Case brief → record → graded report card → present again.

## Grading, in three tiers of decreasing reliability

**Tier 1 — deterministic. Ship first.** Computed from word timestamps, no model judgment, always right: total duration, per-section timing, words per minute, filler-word count and rate, longest pause. This alone is worth shipping. Nobody has ever told a student "your HPI ran 1:52 and your assessment got 22 seconds," and that single sentence changes behavior.

**Tier 2 — structured comparison. Ship with it.** Transcript checked against the case's own answer key: which of the 11 rubric elements were stated, which were missed, what order they came in. Reliable *because you wrote the case* — it's matching against a known key, not open-ended judgment.

**Tier 3 — evaluative. Ship last, carefully.** Was the problem representation crisp? Did the assessment commit or hedge? Was the plan specific? Real value, but this is where consistency breaks. Same take must score the same twice — validate against human-graded presentations before you show a number.

## Rotation-specific rubrics

An IM admission H&P and a surgical post-op update are different artifacts. Grading one against the other's rubric is worse than no feedback:

| Rotation | Target | Shape |
|---|---|---|
| Internal Medicine | 3:00 | Full chronology, pertinent negatives, committed assessment |
| Surgery | 1:30 | POD, overnight events, vitals, I/Os, wound, plan |
| Pediatrics | 3:00 | Birth, feeding, growth, development, immunizations, weight in kg |
| OB/GYN | 2:00 | GTPAL and dating in the first sentence |
| Psychiatry | 4:00 | MSE described not summarized, explicit risk assessment |
| Neurology | 3:00 | Localize before you diagnose; last known well up front |
| Emergency | 1:00 | Disposition first, sick or not sick |
| Family Medicine | 2:00 | Interval history, patient agenda, health maintenance |

Every clerkship director recognizes their own rotation in that table. That recognition is what sells the institutional license.

## Also in V2

- **Playback with section markers** — hear yourself at the exact moment the HPI ran away.
- **Take comparison** — take 1 against take 3, side by side. Enormously motivating and almost free to build.
- **Instructor mode** — assign a case, review a student's take alongside their report card. This is V3's foundation.

## Speech recognition

Apple's on-device recognizer is free and private but mangles drug names. A medical-tuned cloud ASR handles "metoprolol succinate" correctly for a fraction of a cent per minute. Offer on-device as the privacy option, cloud as the default, and be explicit about which is running.

---

# Content pipeline — the real bottleneck

Engineering is not what will hold you up. Content is.

- **Author in a structured editor**, not a Google Doc. The schema above, enforced.
- **LLM drafts, clinician edits and signs.** Never publish unreviewed generated content. Draft-plus-edit runs roughly 3–4× faster than writing from scratch and holds quality if the reviewer is genuinely empowered to reject.
- **Two-person review for treatment items.** One is fine for differentials.
- **Monitor item performance.** Below ~40% correct → the item is broken or the distractor is a trap. Above ~95% → it's not teaching anything. Both get flagged for revision automatically.
- **Realistic V1 target: 400–600 items** across 8–10 systems, accounting for concept variants. At 15–20 items per hour of clinician review, budget **25–40 hours of physician time** for the initial bank, plus ongoing.

---

# Practical constraints specific to this audience

- **Offline-first is not optional.** Hospital basements, radiology suites, and older wards are dead zones. Cache the next 50 items and sync results later. This is the single most-overlooked requirement in clinical apps and a common one-star review.
- **One-handed reach.** They're holding a phone with a coffee and a printed list. Primary actions in the bottom third.
- **Dark mode that's actually dark.** Night float is real and a white screen at 3am is hostile.
- **Fast cold start.** If it takes four seconds to load, it doesn't get used in a two-minute gap.
- **Large tap targets.** People will use this while walking.

---

# Metrics that matter

**Early (V0–V1):**
- D1 / D7 / D30 retention — the only numbers that matter before you have a business
- % of first-set users who start a second set unprompted
- Median sets per active day

**Ongoing:**
- Item-level p(correct), discrimination index, median time-to-answer
- Mastery gain on **held-out** items — can you demonstrate the product teaches? This is your institutional sales asset and almost nobody has one. Build the measurement infrastructure early even if you don't use it for a year.

---

# Monetization

- **Free tier:** one set a day, one system. Enough to build a habit, not enough to prepare for a shelf.
- **Individual:** monthly, with a discount to annual. Price under the big question banks; you're a complement, not a replacement.
- **Institutional (V3, where the money is):** per-seat license with a cohort dashboard. The pitch to a clerkship director is not "my students will know more" — it's *"here is which of your students cannot yet build an assessment, before the OSCE tells you."* No one currently has that visibility.

---

# Deliberately out of scope

Say no to these early and often:

- **AI chat tutor.** Everyone bolts one on, it's undifferentiated, it's expensive, and it dilutes a sharp product into a vague one.
- **Video content.** Different business, different cost structure.
- **Social feed / discussion.** Moderation burden, and med students already have GroupMe.
- **Anki integration.** Tempting, but it makes you a feature of Anki rather than a product.
- **Notes and highlighting.** They have a notes app.

---

# Suggested build sequence

**Phase 0 — validate (4–6 weeks).** 40 items, one system, TestFlight to 20 students. No accounts, no gamification, no streak. Measure one thing: does anyone start a second set without being asked? If not, no amount of design fixes it.

**Phase 1 — V1 (3–4 months).** Accounts, focus scoping, SR, mastery, streak with repair, offline cache, 300+ items across 4–5 systems. Ship to a single school's MS2 and MS3 classes.

**Phase 2 — V1.5 (6 weeks).** Treatment item types, guideline tagging and review workflow, expand to 8–10 systems.

**Phase 3 — V2 (3–4 months).** Presentation coach, tiers 1 and 2 only. Fifteen cases across three rotations. Validate grading consistency against human graders before showing any score.

**Phase 4 — V3.** Class codes → cohort dashboards → institutional pilots.

---

# The one thing to protect

The discriminator sentence. Not the design, not the streak, not the mascot — **the single sentence that explains why this diagnosis and not the other one.** That's what students will remember standing outside a room, and it's the only part of this product that a competitor can't ship in a quarter.

Everything else is scaffolding around getting people to read 500 of those sentences.
