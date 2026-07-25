/* ══════════════════════════════════════════════════════════════
   Cadence — core types
   The item schema is the contract everything else builds on:
   scoping, review, analytics. Items are structured records, never
   prose. See docs/product-guide.md §V1.2.
   ══════════════════════════════════════════════════════════════ */

/** Item formats. `discriminator` is the flagship type. */
export type ItemType =
  | 'one_liner'      // vignette + vitals → diagnosis
  | 'discriminator'  // two diagnoses named up front: which finding separates them?
  | 'next_step'      // diagnosis given/obvious → what do you order?
  | 'cant_miss'      // which must you exclude before anything else?
  | 'build_ddx';     // multi-select: pick the ones that belong

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
  | 'reproductive';

export type Level = 'preclinical' | 'clerkship' | 'both';

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
  /** ONE sentence. The teach. This is the product. */
  discriminator: string;
  /** optional second sentence, max */
  teachingPoint?: string;
  tags: {
    system: System;
    complaint: string;
    rotation: string[];
    level: Level;
  };
  /**
   * Seed guess 0–1 (p of answering correctly). Overwritten by
   * observed p(correct) once the item has real exposures.
   */
  difficultySeed: number;
  source: { ref: string; year: number }[];
}

export interface Concept {
  conceptId: string;
  name: string;
  system: System;
  /** short mastery-topic label, e.g. "Acute chest pain" */
  topic: string;
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
  results: SessionItemResult[];
  totalPoints: number;
}

export interface AppState {
  version: number;
  focus: FocusState;
  settings: Settings;
  schedules: Record<string, ConceptSchedule>;
  mastery: Record<string, TopicMastery>;
  streak: StreakState;
  sessions: SessionRecord[];
  totalPoints: number;
}
