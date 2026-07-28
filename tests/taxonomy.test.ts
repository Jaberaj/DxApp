import { describe, expect, it } from 'vitest';
import { SUBTOPICS, SUBTOPIC_IDS, TAXONOMY, subtopicById } from '../src/content/taxonomy';
import { CONCEPTS } from '../src/content/bank';

describe('taxonomy', () => {
  it('covers all 12 organ systems plus 2 cross-cutting', () => {
    expect(TAXONOMY).toHaveLength(14);
    expect(TAXONOMY.filter((s) => s.crossCutting)).toHaveLength(2);
  });

  it('every system has 6–9 subtopics', () => {
    for (const s of TAXONOMY) {
      expect(s.subtopics.length, s.id).toBeGreaterThanOrEqual(6);
      expect(s.subtopics.length, s.id).toBeLessThanOrEqual(9);
    }
  });

  it('subtopic ids are unique and each declares its parent system', () => {
    expect(SUBTOPIC_IDS.size).toBe(SUBTOPICS.length);
    for (const s of SUBTOPICS) {
      expect(subtopicById(s.id)).toBe(s);
      const parent = TAXONOMY.find((n) => n.subtopics.includes(s))!;
      expect(s.system, s.id).toBe(parent.id);
    }
  });

  it('every subtopic cites a public USMLE outline reference', () => {
    for (const s of SUBTOPICS) {
      expect(s.usmleOutlineRefs.length, s.id).toBeGreaterThan(0);
    }
  });

  it('every subtopic has at least one concept (full coverage)', () => {
    const covered = new Set(CONCEPTS.map((c) => c.subtopic));
    const empty = SUBTOPICS.filter((s) => !covered.has(s.id)).map((s) => s.id);
    expect(empty, `empty subtopics: ${empty.join(', ')}`).toHaveLength(0);
  });
});
