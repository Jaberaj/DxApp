/* ══════════════════════════════════════════════════════════════
   The mini-games.
   Each game draws a distinct slice of the item bank (by item type)
   and runs through the same drill engine, scoring, mastery, and
   FSRS schedule. A single spine, several games — monotony is the
   churn driver, so variety is the product.
   ══════════════════════════════════════════════════════════════ */

import type { GameId, ItemType } from '../types';

export interface GameDef {
  id: GameId;
  name: string;
  tagline: string;
  /** item types this game is built from */
  itemTypes: ItemType[];
  /** accent colour token (maps to a CSS class) */
  accent: 'pulse' | 'depth' | 'plum' | 'clay';
  /** inner SVG for the game icon (24×24 viewBox, stroke: currentColor) */
  icon: string;
  setSize: number;
}

const DDX_TYPES: ItemType[] = [
  'one_liner',
  'discriminator',
  'next_step',
  'cant_miss',
  'build_ddx',
  'management',
];

export const GAMES: GameDef[] = [
  {
    id: 'rapid_ddx',
    name: 'Rapid Differentials',
    tagline: 'One-liners, discriminators, next steps — reasoning at speed',
    itemTypes: DDX_TYPES,
    accent: 'pulse',
    icon: '<path d="M2 12h4l2.5-7 4 14L15 12h7"/>',
    setSize: 12,
  },
  {
    id: 'ecg',
    name: 'ECG Rhythms',
    tagline: 'Read the strip — rate, rhythm, and the one pearl that names it',
    itemTypes: ['ecg'],
    accent: 'depth',
    icon: '<path d="M2 12h3l1.5-4 2.5 8 2-11 2.5 15 2-8 1.5 4H22"/>',
    setSize: 10,
  },
  {
    id: 'buzzword',
    name: 'Buzzword Blitz',
    tagline: 'Genes, findings, and keywords → the diagnosis, fast',
    itemTypes: ['association'],
    accent: 'plum',
    icon: '<path d="M13 2 3 14h7l-1 8 11-13h-7l1-7z"/>',
    setSize: 12,
  },
];

export function gameById(id: GameId): GameDef {
  return GAMES.find((g) => g.id === id) ?? GAMES[0];
}
