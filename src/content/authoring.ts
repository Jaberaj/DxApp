/* ══════════════════════════════════════════════════════════════
   Shared authoring shapes for content files.
   `RawItem`/`RawConcept` are the ergonomic authoring types (board
   tags and enrichment fields optional); bank.ts normalizes them into
   the full Item/Concept contract. Kept in their own module so
   content can be split across files without circular imports.
   ══════════════════════════════════════════════════════════════ */

import type { BoardLevel, Concept, Item, PresentationType, System, Vital } from '../types';

/** Vital chip helper. */
export const v = (label: string, value: string, hot = false): Vital => ({ label, value, hot });

/** Authoring shape for a vignette. */
export type RawItem = Omit<Item, 'tags' | 'presentation' | 'exposures' | 'pCorrect'> & {
  tags: Omit<Item['tags'], 'boards'> & { boards?: BoardLevel[] };
  presentation?: PresentationType;
  exposures?: number;
  pCorrect?: number | null;
};

/** Authoring shape for a concept. */
export type RawConcept = Pick<Concept, 'conceptId' | 'name' | 'system' | 'topic'> &
  Partial<Pick<Concept, 'alsoTaggedSystems' | 'illnessScript' | 'reviewedBy' | 'reviewedOn'>>;

/** A content module: concepts, their taxonomy placement, and vignettes. */
export interface ContentModule {
  concepts: RawConcept[];
  /** conceptId → taxonomy subtopic id */
  subtopics: Record<string, string>;
  /** conceptId → extra systems it also belongs to */
  alsoSystems?: Record<string, System[]>;
  items: RawItem[];
}
