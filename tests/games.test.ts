import { describe, expect, it } from 'vitest';
import { GAMES, gameById } from '../src/content/games';
import { CONCEPTS, ITEMS } from '../src/content/bank';
import { buildSet } from '../src/engine/session';
import { defaultState } from '../src/state/store';

const NOW = new Date('2026-07-25T12:00:00Z');

describe('games registry', () => {
  it('has unique game ids', () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every item type in the bank is claimed by exactly one game', () => {
    const claimed = new Map<string, number>();
    for (const g of GAMES) for (const t of g.itemTypes) claimed.set(t, (claimed.get(t) ?? 0) + 1);
    for (const item of ITEMS) {
      expect(claimed.get(item.type) ?? 0, item.type).toBeGreaterThan(0);
    }
    // no item type is double-claimed, so a set never mixes games
    for (const [type, n] of claimed) expect(n, type).toBe(1);
  });

  it('each game builds a non-empty set from a fresh state', () => {
    for (const g of GAMES) {
      const set = buildSet(ITEMS, CONCEPTS, defaultState(), NOW, {
        types: g.itemTypes,
        board: 'all',
        setSize: g.setSize,
      });
      expect(set.length, g.id).toBeGreaterThan(0);
      expect(set.length, g.id).toBeLessThanOrEqual(g.setSize);
    }
  });

  it('gameById falls back to the first game for an unknown id', () => {
    // @ts-expect-error deliberately passing an invalid id
    expect(gameById('nope').id).toBe(GAMES[0].id);
  });

  it('Rapid Treatments is a distinct game drawing only tx_* item types', () => {
    const tx = gameById('rapid_tx');
    expect(tx.id).not.toBe('rapid_ddx');
    expect(tx.itemTypes.every((t) => t.startsWith('tx_'))).toBe(true);
    const set = buildSet(ITEMS, CONCEPTS, defaultState(), NOW, {
      types: tx.itemTypes,
      board: 'all',
      setSize: tx.setSize,
    });
    expect(set.length).toBeGreaterThan(0);
    for (const item of set) expect(item.type.startsWith('tx_'), item.itemId).toBe(true);
  });
});
