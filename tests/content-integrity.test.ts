import { describe, expect, it } from 'vitest';
import { CONCEPTS, ITEMS } from '../src/content/bank';
import { validateBank } from '../src/content/validation';
import { SUBTOPIC_IDS, subtopicById } from '../src/content/taxonomy';
import type { Concept, Item } from '../src/types';

describe('content integrity — the live bank', () => {
  it('passes validation with zero errors', () => {
    const { errors } = validateBank(CONCEPTS, ITEMS);
    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  it('every concept is placed in a real subtopic in its own system', () => {
    for (const c of CONCEPTS) {
      expect(SUBTOPIC_IDS.has(c.subtopic), c.conceptId).toBe(true);
      expect(subtopicById(c.subtopic)!.system, c.conceptId).toBe(c.system);
    }
  });

  it('every vignette keeps a legacyItemId so no learner state is orphaned', () => {
    for (const it of ITEMS) expect(it.legacyItemId, it.itemId).toBeTruthy();
  });

  it('enrichment is lossless: every vignette resolves to a real concept', () => {
    const ids = new Set(CONCEPTS.map((c) => c.conceptId));
    for (const it of ITEMS) expect(ids.has(it.conceptId), it.itemId).toBe(true);
  });

  it('flags the migrated bank as UNREVIEWED without failing the build', () => {
    const { warnings, stats } = validateBank(CONCEPTS, ITEMS);
    expect(stats.unreviewed).toBe(CONCEPTS.length);
    expect(warnings.some((w) => /UNREVIEWED/.test(w))).toBe(true);
  });
});

/* Negative tests — prove the gate actually fails on bad content, not
   just that today's bank happens to be clean. */

const goodConcept: Concept = {
  conceptId: 'x.test',
  name: 'Test concept',
  system: 'cardiovascular',
  topic: 'Test',
  subtopic: 'cv.ischemia',
  alsoTaggedSystems: [],
  rotations: ['im'],
  level: ['clerkship'],
  usmleOutlineRefs: ['ref'],
  reviewedBy: 'Dr Test',
  reviewedOn: '2026-01-01',
};

const goodItem: Item = {
  itemId: 'x.test.v1',
  version: 1,
  type: 'one_liner',
  conceptId: 'x.test',
  stem: 'A stem.',
  vitals: [],
  findings: [],
  options: [
    { id: 'a', text: 'Right', correct: true },
    { id: 'b', text: 'Wrong', whyNot: 'because' },
  ],
  discriminator: 'A discriminator sentence long enough to pass the check.',
  tags: { system: 'cardiovascular', complaint: 'test', rotation: ['im'], level: 'clerkship', boards: ['step2'] },
  difficultySeed: 0.5,
  source: [{ ref: 'ACC/AHA Guideline', year: 2022 }],
  presentation: 'classic',
  exposures: 0,
  pCorrect: null,
  legacyItemId: 'x.test.v1',
};

describe('content integrity — the gate rejects bad content', () => {
  it('fails a source that cites a commercial question bank', () => {
    const bad = { ...goodItem, source: [{ ref: 'UWorld Step 2 CK', year: 2024 }] };
    const { errors } = validateBank([goodConcept], [bad]);
    expect(errors.some((e) => /question bank/i.test(e))).toBe(true);
  });

  it('rejects every commercial board-prep brand as a source', () => {
    const brands = ['Pathoma', 'Boards and Beyond', 'OnlineMedEd', 'First Aid for the USMLE', 'AMBOSS', 'Sketchy', 'Lecturio', 'USMLE Free 120'];
    for (const ref of brands) {
      const bad = { ...goodItem, source: [{ ref, year: 2023 }] };
      const { errors } = validateBank([goodConcept], [bad]);
      expect(errors.some((e) => /question bank/i.test(e)), ref).toBe(true);
    }
  });

  it('fails a dangling distractor concept reference', () => {
    const bad = { ...goodItem, distractorConceptIds: ['does.not.exist'] };
    const { errors } = validateBank([goodConcept], [bad]);
    expect(errors.some((e) => /dangling distractorConceptId/.test(e))).toBe(true);
  });

  it('fails a concept whose system disagrees with its subtopic', () => {
    const bad = { ...goodConcept, system: 'renal' as const };
    const { errors } = validateBank([bad], []);
    expect(errors.some((e) => /≠ subtopic/.test(e))).toBe(true);
  });

  it('fails a concept pointing at a subtopic outside the taxonomy', () => {
    const bad = { ...goodConcept, subtopic: 'cv.nonsense' };
    const { errors } = validateBank([bad], []);
    expect(errors.some((e) => /not in the taxonomy/.test(e))).toBe(true);
  });

  it('fails a single-answer item without exactly one correct option', () => {
    const bad = { ...goodItem, options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B', whyNot: 'x' }] };
    const { errors } = validateBank([goodConcept], [bad]);
    expect(errors.some((e) => /exactly 1 correct/.test(e))).toBe(true);
  });

  it('fails a distractor missing its why-not rebuttal', () => {
    const bad = { ...goodItem, options: [{ id: 'a', text: 'Right', correct: true }, { id: 'b', text: 'Wrong' }] };
    const { errors } = validateBank([goodConcept], [bad]);
    expect(errors.some((e) => /has no why-not/.test(e))).toBe(true);
  });
});
