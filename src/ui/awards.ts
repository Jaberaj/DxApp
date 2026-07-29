/* ══════════════════════════════════════════════════════════════
   Awards UI — rank, points, and rewards, rendered in the app's
   instrument aesthetic (no confetti; a rank badge and a clean bar).
   Shared by Today (compact rank card), Profile (rank + wall + ladder)
   and Summary (promotion + newly-unlocked).
   ══════════════════════════════════════════════════════════════ */

import type { AppState } from '../types';
import { el, esc } from './dom';
import {
  ACHIEVEMENTS,
  TIERS,
  earnedAchievements,
  tierForPoints,
  type Achievement,
  type Tier,
} from '../engine/progression';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

function accentVar(accent: Tier['accent']): string {
  return accent === 'ink' ? 'var(--ink-2)' : `var(--${accent})`;
}

function iconSvg(path: string, stroke = 'currentColor'): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

/** The rank emblem: a shield-disc with the tier grade in roman. */
function badge(tier: Tier, index: number, size: 'sm' | 'lg' = 'sm'): string {
  return `<span class="rank-badge ${size}" style="--acc:${accentVar(tier.accent)}">${ROMAN[index] ?? index + 1}</span>`;
}

/** Compact rank card for Today; taps through to the rewards wall. */
export function rankCard(state: AppState, onOpen: () => void): HTMLElement {
  const p = tierForPoints(state.totalPoints);
  const sub = p.next
    ? `${p.toNext.toLocaleString()} pts to ${p.next.name}`
    : 'Top of the ladder';
  const card = el(`<button class="rankcard" type="button">
    ${badge(p.tier, p.index)}
    <span class="rank-body">
      <span class="rank-top"><b>${esc(p.tier.name)}</b><span class="rank-pts">${state.totalPoints.toLocaleString()} pts</span></span>
      <span class="xp-track"><span class="xp-fill" style="width:${Math.round(p.fraction * 100)}%;background:${accentVar(p.tier.accent)}"></span></span>
      <span class="rank-sub">${esc(sub)}</span>
    </span>
  </button>`);
  card.addEventListener('click', onOpen);
  return card;
}

/** Larger rank hero for the Profile screen. */
export function rankHero(state: AppState): HTMLElement {
  const p = tierForPoints(state.totalPoints);
  const sub = p.next
    ? `${p.toNext.toLocaleString()} points to ${p.next.name}`
    : 'You have reached the top of the ladder';
  return el(`<div class="card pad rankhero">
    <div class="rankhero-top">
      ${badge(p.tier, p.index, 'lg')}
      <div class="rankhero-tx">
        <span class="lab">Rank ${ROMAN[p.index] ?? p.index + 1}</span>
        <b>${esc(p.tier.name)}</b>
      </div>
      <span class="rankhero-pts">${state.totalPoints.toLocaleString()}<em>points</em></span>
    </div>
    <div class="xp-track lg"><span class="xp-fill" style="width:${Math.round(p.fraction * 100)}%;background:${accentVar(p.tier.accent)}"></span></div>
    <p class="rank-sub">${esc(sub)}</p>
  </div>`);
}

/** The full ladder, current rank highlighted. */
export function tierLadder(state: AppState): HTMLElement {
  const p = tierForPoints(state.totalPoints);
  const card = el('<div class="card pad ladder"></div>');
  TIERS.forEach((tier, i) => {
    const reached = state.totalPoints >= tier.minPoints;
    const here = i === p.index;
    card.appendChild(el(`<div class="ladder-row ${here ? 'here' : ''} ${reached ? 'reached' : 'locked'}">
      <span class="ladder-badge" style="--acc:${accentVar(tier.accent)}">${ROMAN[i] ?? i + 1}</span>
      <span class="ladder-name">${esc(tier.name)}</span>
      <span class="ladder-min">${tier.minPoints === 0 ? 'Start' : tier.minPoints.toLocaleString()}</span>
    </div>`));
  });
  return card;
}

/** The rewards wall: every achievement, earned or locked, by group. */
export function achievementsWall(state: AppState, now: Date): HTMLElement {
  const earned = new Set(earnedAchievements(state, now).map((a) => a.id));
  const host = el('<div></div>');

  host.appendChild(el(`<p class="sect ach-head">Rewards <span class="ach-count">${earned.size} of ${ACHIEVEMENTS.length}</span></p>`));

  const groups = [...new Set(ACHIEVEMENTS.map((a) => a.group))];
  for (const group of groups) {
    const grid = el('<div class="ach-grid"></div>');
    for (const a of ACHIEVEMENTS.filter((x) => x.group === group)) {
      const got = earned.has(a.id);
      grid.appendChild(el(`<div class="ach ${got ? 'got' : 'locked'}">
        <span class="ach-ic">${iconSvg(a.icon)}</span>
        <span class="ach-tx"><b>${esc(a.name)}</b><span>${esc(a.desc)}</span></span>
        <span class="ach-state">${got ? CHECK : LOCK}</span>
      </div>`));
    }
    host.appendChild(el(`<p class="ach-group">${esc(group)}</p>`));
    host.appendChild(grid);
  }
  return host;
}

/** Summary: a promotion banner, or null if no rank crossed. */
export function promotionBanner(tier: Tier | null): HTMLElement | null {
  if (!tier) return null;
  const index = TIERS.findIndex((t) => t.id === tier.id);
  return el(`<div class="promo" style="--acc:${accentVar(tier.accent)}">
    ${badge(tier, index, 'lg')}
    <div class="promo-tx"><span class="lab">Promoted</span><b>${esc(tier.name)}</b><span class="promo-sub">A new rank on the ladder</span></div>
  </div>`);
}

/** Summary: the achievements unlocked by this set, or null. */
export function newAwardsCard(newly: Achievement[]): HTMLElement | null {
  if (newly.length === 0) return null;
  const host = el('<div id="unlocked"></div>');
  host.appendChild(el(`<p class="sect">${newly.length === 1 ? 'Reward unlocked' : `${newly.length} rewards unlocked`}</p>`));
  const card = el('<div class="card pad"></div>');
  for (const a of newly) {
    card.appendChild(el(`<div class="ach got unlocked-row">
      <span class="ach-ic">${iconSvg(a.icon)}</span>
      <span class="ach-tx"><b>${esc(a.name)}</b><span>${esc(a.desc)}</span></span>
      <span class="ach-state">${CHECK}</span>
    </div>`));
  }
  host.appendChild(card);
  return host;
}
