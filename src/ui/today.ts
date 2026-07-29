/* ══════════════════════════════════════════════════════════════
   Today — the home screen (v5 gamified).
   Header carries the level ring; the streak is the hero, directly
   under it, naming the next milestone. A daily-goal ring, the four
   mini-games with identity colours and point values, where you stand,
   and — last, because it should not outrank the product — the
   save-your-progress nudge.
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import { el, esc } from './dom';
import { focusOption } from '../engine/session';
import { decayedScore } from '../engine/mastery';
import { CONCEPTS, ITEMS, BOARD_LEVELS } from '../content/bank';
import { GAMES } from '../content/games';
import { inBlock } from '../engine/session';
import { COMBO_BASE } from '../engine/progression';
import { levelPill, streakHero, dailyGoalCard } from './awards';

const CHEVRON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4l8 8-8 8"/></svg>';

function boardLabel(id: string): string {
  return BOARD_LEVELS.find((b) => b.id === id)?.label ?? 'All levels';
}

export function renderToday(ctx: Ctx): HTMLElement {
  const { state } = ctx;
  const now = new Date();
  const opt = focusOption(state.focus);
  const dateLine = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  const root = el(`<div class="flex-col">
    <div class="topbar today-top">
      <div class="ttl">
        <h2 class="big">Today</h2>
        <p>${esc(dateLine)} · ${esc(opt.name)}</p>
      </div>
      <span id="lvpill"></span>
    </div>
    <div class="scroll"></div>
  </div>`);

  const scroll = root.querySelector('.scroll')!;
  root.querySelector('#lvpill')!.replaceWith(levelPill(state, () => ctx.go('profile')));

  // ── streak hero + daily goal ──
  scroll.appendChild(streakHero(state, now));
  scroll.appendChild(dailyGoalCard(state, now));

  // ── focus scope (kept accessible; folded name is in the header) ──
  const subN = state.focus.subtopics.length;
  const scopeLine =
    (state.focus.mode === 'rotation' ? 'Rotation' : 'Systems course') +
    ` · ${boardLabel(state.focus.boards)}` +
    (subN > 0 ? ` · ${subN} subtopic${subN === 1 ? '' : 's'}` : '');
  const focusBar = el(`<button class="focusbar" type="button">
    <span class="swatch" style="background:${state.focus.mode === 'rotation' ? 'var(--depth)' : 'var(--pulse)'}"></span>
    <span class="txt"><b>${esc(opt.name)}</b><span>${esc(scopeLine)}</span></span>
    ${CHEVRON}
  </button>`);
  focusBar.addEventListener('click', () => ctx.go('focus'));
  scroll.appendChild(focusBar);

  // ── mini-games ──
  scroll.appendChild(el('<p class="sect">Mini-games</p>'));
  for (const game of GAMES) {
    const pts = game.setSize * COMBO_BASE;
    const card = el(`<button class="game" type="button">
      <span class="game-ic" style="background:${game.grad}">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${game.icon}</svg>
      </span>
      <span class="game-bd">
        <b>${esc(game.name)}</b>
        <span>${game.setSize} items · ${esc(oneLine(game.tagline))}</span>
      </span>
      <span class="pchip ${game.pkey}">+${pts}</span>
    </button>`);
    card.addEventListener('click', () => ctx.go('drill', { game: game.id }));
    scroll.appendChild(card);
  }

  // ── where you stand ──
  scroll.appendChild(el(`<p class="sect">Where you stand — ${esc(opt.name.toLowerCase())}</p>`));
  scroll.appendChild(masteryCard(ctx, now));

  // ── guest nudge — LAST, below the product ──
  if (ctx.account.kind === 'guest' && state.sessions.length >= 1) {
    const gb = el(`<button class="guestbar" type="button" style="margin-top:12px">
      <span class="gb-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></span>
      <span class="gb-tx"><b>Save your progress</b><span>Keep your points, streak and shields on a new phone</span></span>
      ${CHEVRON}
    </button>`);
    gb.addEventListener('click', () => ctx.go('profile'));
    scroll.appendChild(gb);
  }
  scroll.appendChild(el('<div style="height:8px"></div>'));

  return root;
}

/** First clause of a tagline, so the row stays one line. */
function oneLine(s: string): string {
  return s.split(/[—·]/)[0].trim();
}

function masteryCard(ctx: Ctx, now: Date): HTMLElement {
  const { state } = ctx;
  const relevantTopics = new Set(
    CONCEPTS.filter((c) =>
      ITEMS.some((i) => i.conceptId === c.conceptId && inBlock(i, state.focus)),
    ).map((c) => c.topic),
  );
  const rows = Object.values(state.mastery)
    .filter((m) => relevantTopics.has(m.topic))
    .map((m) => ({ topic: m.topic, score: Math.round(decayedScore(m, now)) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  if (rows.length === 0) {
    return el(`<div class="card pad">
      <p class="empty-note">No reads yet. Your first set calibrates where you stand — mastery moves visibly after every set, and weak topics resurface more.</p>
    </div>`);
  }

  const card = el('<div class="card pad"></div>');
  for (const r of rows) {
    const tier = r.score >= 70 ? 'solid' : r.score >= 45 ? 'building' : 'shaky';
    card.appendChild(el(`<div class="mrow">
      <div class="mtop"><span>${esc(r.topic)}</span><em class="tier-${tier}">${r.score}% · ${tier}</em></div>
      <div class="mtrack"><div class="mfill tier-${tier}" style="width:${r.score}%"></div></div>
    </div>`));
  }
  return card;
}
