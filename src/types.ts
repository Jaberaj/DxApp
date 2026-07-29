/* ══════════════════════════════════════════════════════════════
   Cadence — core types
   The item schema is the contract everything else builds on:
   scoping, review, analytics. Items are structured records, never
   prose. See docs/product-guide.md §V1.2.
   ══════════════════════════════════════════════════════════════ */

/** Item formats. `discriminator` is the flagship diagnostic type. */
export type ItemType =
  // ── Rapid Differentials ──
  | 'one_liner'          // vignette + vitals → diagnosis
  | 'discriminator'      // two diagnoses named up front: which finding separates them?
  | 'next_step'          // diagnosis given/obvious → what do you order?
  | 'cant_miss'          // which must you exclude before anything else?
  | 'build_ddx'          // multi-select: pick the ones that belong
  // ── Rapid Treatments (higher safety bar) ──
  | 'tx_next_step'       // diagnosis given → what do you do now, and why not the others
  | 'tx_contraindication'// which of these must you NOT give? (highest-value tx type)
  | 'tx_sequencing'      // what comes first
  | 'tx_threshold'       // when do you actually treat
  // ── other games ──
  | 'ecg'                // read the rhythm strip
  | 'association';       // buzzword / gene / finding → diagnosis

/** Treatment item types share a higher review bar and cite a guideline. */
export const TREATMENT_TYPES: ItemType[] = [
  'tx_next_step',
  'tx_contraindication',
  'tx_sequencing',
  'tx_threshold',
];

/**
 * Board levels the content maps to. An item can serve several:
 *   Step 1 — mechanism, basic science, buzzword pattern-recognition
 *   Step 2 CK — clinical diagnosis and next best step on the wards
 *   Step 3 — management, thresholds, sequencing, outpatient
 */
export type BoardLevel = 'step1' | 'step2' | 'step3';

/** The mini-games. Each draws a distinct slice of the item bank. */
export type GameId = 'rapid_ddx' | 'rapid_tx' | 'ecg' | 'buzzword';

export type System =
  | 'cardiovascular'
  | 'pulmonary'
  | 'renal'
  | 'gi'
  | 'endocrine'
  | 'neuro'
  | 'heme_onc'
  | 'infectious'
  | 'msk_rheum'
  | 'reproductive'
  | 'dermatology'
  | 'psychiatry'
  | 'multisystem'   // cross-cutting: shock, tox, allergy, preventive
  | 'pediatrics';   // cross-cutting

export type Level = 'preclinical' | 'clerkship' | 'both';

/**
 * One way a concept can present. A vignette carries exactly one.
 * `mimic` — looks like this concept but the answer is a distractor —
 * is the highest-value and easiest-to-forget type.
 */
export type PresentationType =
  | 'classic'
  | 'atypical'
  | 'early'
  | 'elderly'
  | 'masked'
  | 'severe'
  | 'mimic';

/**
 * Sentinel for concepts that have not yet had physician review.
 * LLM-drafted clinical content is plausible-but-sometimes-wrong; the
 * build warns while this is set and no such content should reach a
 * learner as validated.
 */
export const UNREVIEWED = 'UNREVIEWED';

/**
 * A single reviewer's verdict on a concept's clinical accuracy,
 * checked against external PUBLIC sources. Review is done by several
 * reviewers — multiple LLMs (ideally distinct model families, for
 * independence) and, later, humans — and a concept is only promoted
 * to `validated` when enough independent reviewers agree (see
 * content/review.ts). Reviews accrue over time and are stored apart
 * from the content itself (content/reviews.ts).
 */
export type ReviewVerdict = 'pass' | 'flag' | 'fail';

export interface ReviewRecord {
  /** model id ('claude-opus-4-8', 'gpt-5', …) or 'human:<name>' */
  reviewer: string;
  kind: 'llm' | 'human';
  /**
   * Model family for independence checks — two passes from the same
   * family don't count as independent. Omit for humans.
   * e.g. 'anthropic', 'openai', 'google'.
   */
  family?: string;
  /** the PUBLIC sources this reviewer checked the claim against */
  sources: { ref: string; year: number }[];
  verdict: ReviewVerdict;
  /** required for flag/fail: what is wrong, or exactly what was verified */
  notes?: string;
  /** ISO date */
  checkedOn: string;
}

/** Derived promotion state of a concept — never stored, always computed. */
export type ReviewStatus = 'unreviewed' | 'in_review' | 'validated' | 'flagged';

export interface Vital {
  /** short label, e.g. "HR" */
  label: string;
  /** rendered value, e.g. "118" or "92% RA" */
  value: string;
  /** abnormal values render highlighted */
  hot?: boolean;
}

export interface ItemOption {
  id: string;
  text: string;
  correct?: boolean;
  /** Every distractor carries its own rebuttal — "why not" beats "why". */
  whyNot?: string;
}

/**
 * Parametric description of a rhythm strip. Schematic, not
 * diagnostic-grade — enough to make the teaching morphology
 * unmistakable. Consumed by the ECG renderer.
 */
export interface EcgSpec {
  /** ventricular rate in bpm — controls beat spacing */
  rate: number;
  regularity: 'regular' | 'irregular' | 'irregularly_irregular';
  pWave: 'normal' | 'absent' | 'dissociated' | 'sawtooth' | 'fibrillatory';
  /** PR interval in ms; > 200 draws a long segment (block) */
  prMs?: number;
  qrsWide?: boolean;
  /** ST-segment shift as a fraction of R amplitude, + up / − down */
  stShift?: number;
  tWave?: 'normal' | 'peaked' | 'inverted' | 'flat';
  /** WPW slurred upstroke */
  delta?: boolean;
  /** whole-strip special morphologies that ignore the beat model */
  special?: 'torsades' | 'vfib' | 'asystole';
  /** lead label, e.g. "Lead II" */
  lead?: string;
}

export interface Item {
  itemId: string;
  version: number;
  type: ItemType;
  /**
   * Concept this item is a variant of. Scheduling happens at the
   * concept level: repeat the same item and students memorise the
   * vignette, not the reasoning.
   */
  conceptId: string;
  stem: string;
  vitals: Vital[];
  /** exam, ECG, imaging — one short line each */
  findings: string[];
  options: ItemOption[];
  /** For build_ddx: how many options must be selected. */
  selectCount?: number;
  /** Present on ecg items: the rhythm strip to render as the prompt. */
  ecg?: EcgSpec;
  /** ONE sentence. The teach. This is the product. */
  discriminator: string;
  /** optional second sentence, max */
  teachingPoint?: string;
  tags: {
    system: System;
    complaint: string;
    rotation: string[];
    level: Level;
    /** board levels this item is appropriate for */
    boards: BoardLevel[];
  };
  /**
   * Seed guess 0–1 (p of answering correctly). Overwritten by
   * observed p(correct) once the item has real exposures.
   */
  difficultySeed: number;
  source: { ref: string; year: number }[];

  /* ── enriched by normalization (see content/bank.ts) ── */
  /** ONE way the concept presents. Defaults to 'classic' when unset. */
  presentation: PresentationType;
  /**
   * Distractors as concept references, when available. Every id here
   * must resolve to a real concept — checked at build time. Prose
   * options in `options` remain the rendered source of truth.
   */
  distractorConceptIds?: string[];
  /** observed exposures, from session history (0 until telemetry runs) */
  exposures: number;
  /** observed p(correct); null until enough exposures (n ≥ 30) */
  pCorrect: number | null;
  /** provenance — the original itemId, so no learner state is orphaned */
  legacyItemId?: string;
}

/**
 * A diagnosis or management decision. The unit of mastery,
 * scheduling, and coverage. `conceptId` is a PERMANENT join key.
 */
export interface Concept {
  conceptId: string;
  name: string;
  system: System;
  /** short mastery-topic label, e.g. "Acute chest pain" */
  topic: string;

  /* ── enriched by normalization (see content/bank.ts) ── */
  /** taxonomy subtopic id, e.g. "pulm.vte" — must resolve in taxonomy.ts */
  subtopic: string;
  /** additional systems this concept legitimately belongs to (PE is also CV) */
  alsoTaggedSystems: System[];
  /** rotations this concept appears on, unioned from its vignettes */
  rotations: string[];
  /** training levels — many, not one */
  level: ('preclinical' | 'clerkship')[];
  /** public USMLE Content Outline references */
  usmleOutlineRefs: string[];
  /** structured teaching payload; optional until authored */
  illnessScript?: IllnessScript;
  /** physician who signed off, or the UNREVIEWED sentinel */
  reviewedBy: string;
  /** ISO date of review, or null while UNREVIEWED */
  reviewedOn: string | null;
  /**
   * Accrued reviewer verdicts (merged from content/reviews.ts during
   * normalization). The concept's promotion state is DERIVED from these
   * via reviewStatus() — this array is the source of truth, not the
   * `reviewedBy` summary above.
   */
  reviews: ReviewRecord[];
}

export interface IllnessScript {
  epidemiology: string;
  timeCourse: string;
  keyFindings: string[];
  /** concepts this is classically confused with — conceptIds */
  classicDistractors: string[];
}

/* ── learner state ─────────────────────────────────────────── */

/** Serialisable FSRS card state, one per concept per user. */
export interface ConceptSchedule {
  conceptId: string;
  /** ts-fsrs Card serialised with ISO date strings */
  card: Record<string, unknown>;
  /** itemIds answered correctly twice — retired for this user */
  retiredItems: string[];
  /** consecutive-correct count per itemId */
  correctStreak: Record<string, number>;
  lastSeen: string | null;
}

export interface TopicMastery {
  topic: string;
  system: System;
  /** 0–100 */
  score: number;
  /** ISO timestamp of last update — decay is computed from here */
  updatedAt: string;
  attempts: number;
}

export type MasteryBand = 'shaky' | 'working' | 'solid';

export interface StreakState {
  /** consecutive days with goal met */
  length: number;
  /** ISO date (YYYY-MM-DD) of the last day the goal was met */
  lastGoalMet: string | null;
  /** ISO date of the start of the week the free repair was last used */
  repairUsedWeekOf: string | null;
  /** sets completed per ISO date, kept for the rhythm strip */
  history: Record<string, number>;
}

export type FocusMode = 'course' | 'rotation';

export interface FocusState {
  mode: FocusMode;
  /** course id (system) or rotation id */
  id: string;
  /** 0–100: percent of the set drawn from the current block */
  mixPercent: number;
  /** board-level scope; 'all' leaves the bank unfiltered */
  boards: BoardLevel | 'all';
  /**
   * Selected taxonomy subtopic ids. Empty = the whole focus scope.
   * When non-empty this is a HARD narrow: the set is drawn only from
   * these subtopics (a short, honest set if fewer than a full set
   * exists), never padded with off-topic items.
   */
  subtopics: string[];
}

export interface Settings {
  /** seconds; 0 = timer off */
  timerSeconds: number;
  /** sets per day to keep the streak; 1 = post-call setting */
  dailyGoal: number;
}

export interface SessionItemResult {
  itemId: string;
  conceptId: string;
  correct: boolean;
  /** ms from item shown to answer locked */
  elapsedMs: number;
  /** ids picked (1 for single-answer, n for build_ddx) */
  chosen: string[];
  timedOut: boolean;
  points: number;
}

export interface SessionRecord {
  startedAt: string;
  finishedAt: string;
  focus: FocusState;
  /** which mini-game produced this set */
  game: GameId;
  results: SessionItemResult[];
  totalPoints: number;
}

export interface AppState {
  version: number;
  /** ISO timestamp of the last local mutation — used for sync merge */
  updatedAt: string;
  focus: FocusState;
  settings: Settings;
  schedules: Record<string, ConceptSchedule>;
  mastery: Record<string, TopicMastery>;
  streak: StreakState;
  sessions: SessionRecord[];
  totalPoints: number;
  /** gamification bookkeeping — reward ids already celebrated */
  awards: Awards;
}

/** What the learner has already been shown, so a reward lands once. */
export interface Awards {
  /** achievement ids already celebrated */
  seen: string[];
}

/* ── account & sync ────────────────────────────────────────── */

export type AuthProvider = 'apple' | 'google' | 'email';

/**
 * Who the learner is. Guest-first: everyone starts as a guest with
 * local-only progress. Signing in converts that guest state into an
 * account whose progress syncs. `local` is an offline profile with a
 * name but no cloud (identity + export/import, no backend).
 */
export interface Account {
  kind: 'guest' | 'local' | 'cloud';
  /** stable id (guest: device id; cloud: backend user id) */
  id: string;
  displayName?: string;
  email?: string;
  provider?: AuthProvider;
  /** bearer token for the sync backend, when cloud */
  token?: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error' | 'disabled';
