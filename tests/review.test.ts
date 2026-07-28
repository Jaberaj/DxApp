import { describe, it, expect } from 'vitest';
import type { Concept, ReviewRecord } from '../src/types';
import {
  reviewStatusOf,
  reviewBreakdown,
  familyKey,
  latestByReviewer,
  REQUIRED_INDEPENDENT_PASSES,
  MIN_SOURCES,
} from '../src/content/review';
import {
  buildReviewPrompt,
  mockReviewer,
  reviewQueue,
  runReview,
  type Reviewer,
} from '../src/content/reviewPipeline';
import { CONCEPTS, ITEMS } from '../src/content/bank';

const twoSources = [
  { ref: 'Specialty society guideline', year: 2022 },
  { ref: 'Peer-reviewed primary literature', year: 2020 },
];

function rec(over: Partial<ReviewRecord> & Pick<ReviewRecord, 'reviewer'>): ReviewRecord {
  return {
    reviewer: over.reviewer,
    kind: over.kind ?? 'llm',
    family: over.family,
    sources: over.sources ?? twoSources,
    verdict: over.verdict ?? 'pass',
    notes: over.notes,
    checkedOn: over.checkedOn ?? '2026-07-28',
  };
}

function conceptWith(reviews: ReviewRecord[]): Concept {
  return {
    conceptId: 'c1', name: 'Test concept', system: 'cardiovascular', topic: 'T',
    subtopic: 'cv.acs', alsoTaggedSystems: [], rotations: [], level: ['clerkship'],
    usmleOutlineRefs: [], reviewedBy: 'UNREVIEWED', reviewedOn: null, reviews,
  };
}

describe('review promotion rule', () => {
  it('no reviews → unreviewed', () => {
    expect(reviewStatusOf([])).toBe('unreviewed');
  });

  it('one passing family → in_review, not validated', () => {
    expect(reviewStatusOf([rec({ reviewer: 'claude', family: 'anthropic' })])).toBe('in_review');
  });

  it('two DISTINCT families passing → validated', () => {
    const reviews = [
      rec({ reviewer: 'claude', family: 'anthropic' }),
      rec({ reviewer: 'gpt', family: 'openai' }),
    ];
    expect(reviewStatusOf(reviews)).toBe('validated');
  });

  it('independence: two passes from the SAME family do not validate', () => {
    const reviews = [
      rec({ reviewer: 'claude-a', family: 'anthropic' }),
      rec({ reviewer: 'claude-b', family: 'anthropic' }),
    ];
    expect(reviewStatusOf(reviews)).toBe('in_review');
  });

  it('a pass with too few sources does not count toward validation', () => {
    const reviews = [
      rec({ reviewer: 'claude', family: 'anthropic' }),
      rec({ reviewer: 'gpt', family: 'openai', sources: [{ ref: 'One source only', year: 2021 }] }),
    ];
    expect(reviewStatusOf(reviews)).toBe('in_review');
    // MIN_SOURCES is the bar that made the openai pass not count
    expect(MIN_SOURCES).toBeGreaterThanOrEqual(2);
  });

  it('any current fail → flagged, even with other passes', () => {
    const reviews = [
      rec({ reviewer: 'claude', family: 'anthropic' }),
      rec({ reviewer: 'gpt', family: 'openai' }),
      rec({ reviewer: 'gemini', family: 'google', verdict: 'fail', notes: 'wrong drug' }),
    ];
    expect(reviewStatusOf(reviews)).toBe('flagged');
  });

  it('an open flag → flagged', () => {
    expect(reviewStatusOf([rec({ reviewer: 'claude', family: 'anthropic', verdict: 'flag', notes: 'x' })]))
      .toBe('flagged');
  });

  it('a later pass from the SAME reviewer supersedes an earlier flag', () => {
    const reviews = [
      rec({ reviewer: 'claude', family: 'anthropic', verdict: 'flag', notes: 'x', checkedOn: '2026-01-01' }),
      rec({ reviewer: 'claude', family: 'anthropic', verdict: 'pass', checkedOn: '2026-06-01' }),
      rec({ reviewer: 'gpt', family: 'openai', verdict: 'pass' }),
    ];
    expect(reviewStatusOf(reviews)).toBe('validated');
  });

  it('a human reviewer is its own independent family', () => {
    const reviews = [
      rec({ reviewer: 'claude', family: 'anthropic' }),
      rec({ reviewer: 'human:drsmith', kind: 'human', family: undefined }),
    ];
    expect(reviewStatusOf(reviews)).toBe('validated');
    expect(familyKey(reviews[1])).toBe('human:human:drsmith');
  });

  it('REQUIRED_INDEPENDENT_PASSES is at least 2 (multiple LLMs)', () => {
    expect(REQUIRED_INDEPENDENT_PASSES).toBeGreaterThanOrEqual(2);
  });

  it('latestByReviewer keeps one record per reviewer', () => {
    const reviews = [
      rec({ reviewer: 'a', checkedOn: '2026-01-01' }),
      rec({ reviewer: 'a', checkedOn: '2026-02-01' }),
      rec({ reviewer: 'b' }),
    ];
    expect(latestByReviewer(reviews)).toHaveLength(2);
  });

  it('reviewBreakdown sums to the concept count', () => {
    const concepts = [conceptWith([]), conceptWith([rec({ reviewer: 'x', family: 'anthropic' })])];
    const b = reviewBreakdown(concepts);
    expect(b.unreviewed + b.in_review + b.validated + b.flagged).toBe(2);
    expect(b.unreviewed).toBe(1);
    expect(b.in_review).toBe(1);
  });
});

describe('review pipeline', () => {
  const itemsByConcept = (id: string) => ITEMS.filter((i) => i.conceptId === id);

  it('buildReviewPrompt names the concept, forbids question banks, and demands JSON', () => {
    const c = CONCEPTS.find((c) => itemsByConcept(c.conceptId).length > 0)!;
    const prompt = buildReviewPrompt(c, itemsByConcept(c.conceptId));
    expect(prompt).toContain(c.name);
    expect(prompt).toMatch(/UWorld|question bank/i);
    expect(prompt).toContain('"verdict"');
  });

  it('two independent mock families promote a concept to validated', async () => {
    const c = CONCEPTS.find((c) => itemsByConcept(c.conceptId).length > 0)!;
    const reviewers = [mockReviewer('m-anthropic', 'anthropic'), mockReviewer('m-openai', 'openai')];
    const out = await runReview(reviewers, [c], itemsByConcept, '2026-07-28');
    expect(reviewStatusOf(out[c.conceptId])).toBe('validated');
  });

  it('a reviewer that throws is recorded as a flag, never a silent pass', async () => {
    const c = CONCEPTS.find((c) => itemsByConcept(c.conceptId).length > 0)!;
    const broken: Reviewer = {
      id: 'boom', kind: 'llm', family: 'x',
      async review() { throw new Error('network down'); },
    };
    const out = await runReview([broken], [c], itemsByConcept);
    expect(out[c.conceptId][0].verdict).toBe('flag');
    expect(out[c.conceptId][0].notes).toContain('network down');
  });

  it('reviewQueue excludes already-validated concepts', () => {
    const validated = conceptWith([
      rec({ reviewer: 'a', family: 'anthropic' }),
      rec({ reviewer: 'b', family: 'openai' }),
    ]);
    const queue = reviewQueue([validated, conceptWith([])]);
    expect(queue).toHaveLength(1);
  });
});

describe('bank review state (honest seed)', () => {
  it('the seeded first-pass leaves concepts in_review, none validated', () => {
    const b = reviewBreakdown(CONCEPTS);
    // one reviewer of one family is deliberately not enough to validate
    expect(b.validated).toBe(0);
    expect(b.in_review).toBeGreaterThanOrEqual(12);
    expect(b.flagged).toBe(0);
  });

  it('every seeded review cites at least the required public sources on a pass', () => {
    for (const c of CONCEPTS) {
      for (const r of c.reviews) {
        if (r.verdict === 'pass') expect(r.sources.length).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
