/* The item bank is a structured contract, not prose. These tests
   enforce the authoring rules from the product guide so they can't
   silently rot as the bank grows. */

import { describe, expect, it } from 'vitest';
import { CONCEPTS, ITEMS } from '../src/content/bank';

describe('item bank integrity', () => {
  it('item ids are unique', () => {
    const ids = ITEMS.map((i) => i.itemId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('concept ids are unique and every item points at a real concept', () => {
    const conceptIds = new Set(CONCEPTS.map((c) => c.conceptId));
    expect(conceptIds.size).toBe(CONCEPTS.length);
    for (const item of ITEMS) {
      expect(conceptIds, item.itemId).toContain(item.conceptId);
    }
  });

  it('every concept has at least one item', () => {
    const withItems = new Set(ITEMS.map((i) => i.conceptId));
    for (const c of CONCEPTS) {
      expect(withItems, c.conceptId).toContain(c.conceptId);
    }
  });

  it('single-answer items have exactly one correct option', () => {
    for (const item of ITEMS.filter((i) => i.type !== 'build_ddx')) {
      const correct = item.options.filter((o) => o.correct);
      expect(correct.length, item.itemId).toBe(1);
    }
  });

  it('build_ddx items declare selectCount matching their correct options', () => {
    for (const item of ITEMS.filter((i) => i.type === 'build_ddx')) {
      const correct = item.options.filter((o) => o.correct);
      expect(item.selectCount, item.itemId).toBe(correct.length);
      expect(correct.length, item.itemId).toBeGreaterThan(1);
    }
  });

  it('every distractor carries its own why-not rebuttal', () => {
    for (const item of ITEMS) {
      for (const o of item.options.filter((o) => !o.correct)) {
        expect(o.whyNot, `${item.itemId} option ${o.id}`).toBeTruthy();
      }
    }
  });

  it('every item has a discriminator sentence and a source with a year', () => {
    for (const item of ITEMS) {
      expect(item.discriminator.length, item.itemId).toBeGreaterThan(20);
      expect(item.source.length, item.itemId).toBeGreaterThan(0);
      for (const s of item.source) {
        expect(s.year, item.itemId).toBeGreaterThan(1990);
      }
    }
  });

  it('difficulty seeds are probabilities', () => {
    for (const item of ITEMS) {
      expect(item.difficultySeed, item.itemId).toBeGreaterThan(0);
      expect(item.difficultySeed, item.itemId).toBeLessThan(1);
    }
  });

  it('the flagship discriminator type is well represented', () => {
    const n = ITEMS.filter((i) => i.type === 'discriminator').length;
    expect(n).toBeGreaterThanOrEqual(5);
  });
});
