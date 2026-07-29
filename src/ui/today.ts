/* ══════════════════════════════════════════════════════════════
   Today — the home screen. Focus bar, the mini-games, the rhythm
   strip, and where you stand. (V1: differentials and drills only —
   the case-presentation coach is a later chapter.)
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import { el, esc } from './dom';
import { ecgPath } from './ecg';
import { focusOption } from '../engine/session';
import { band, decayedScore } from '../engine/mastery';
import { currentLength, dateKey } from '../engine/streak';
import { CONCEPTS, ITEMS, BOARD_LEVELS } from '../content/bank';
import { GAMES } from '../content/games';
import { inBlock } from '../engine/session';
import { rankCard } from './awards';

const PULSE_ICON =
  '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2.5-7 4 14L15 12h7"/></svg>';
const CHEVRON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4l8 8-8 8"/></svg>';

const ACCENT_BG: Record<string, string> = {
  pulse: 'var(--pulse-l)',
  depth: 'var(--depth-l)',
  plum: 'var(--plum-l)',
  clay: 'var(--clay-l)',
};
const ACCENT_STROKE: Record<string, string> = {
  pulse: 'var(--pulse)',
  depth: 'var(--depth)',
  plum: 'var(--plum)',
  clay: 'var(--clay)',
};

function boardLabel(id: string): string {
  return BOARD_LEVELS.find((b) => b.id === id)?.label ?? 'All levels';
}

export function renderToday(ctx: Ctx): HTMLElement {
  const { state } = ctx;
  const now = new Date();
  const opt = focusOption(state.focus);
  const streakLen = currentLength(state.streak, now);
  const dateLine = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  const root = el(`<div class="flex-col">
    <div class="topbar">
      <div class="ttl">
        <h2 class="big">Today</h2>
        <p>${esc(dateLine)}</p>
      </div>
      <span class="streak-chip">${PULSE_ICON}${streakLen}</span>
    </div>
    <div class="scroll"></div>
  </div>`);

  const scroll = root.querySelector('.scroll')!;

  // ── rank, points, and progress to the next tier ──
  scroll.appendChild(rankCard(state, () => ctx.go('profile')));

  // ── guest → sign-in nudge (once there's progress worth keeping) ──
  if (ctx.account.kind === 'guest' && state.sessions.length >= 1) {
    const gb = el(`<button class="guestbar" type="button">
      <span class="gb-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></span>
      <span class="gb-tx"><b>Save your progress</b><span>Create a profile so your points and memory aren't lost</span></span>
      ${CHEVRON}
    </button>`);
    gb.addEventListener('click', () => ctx.go('profile'));
    scroll.appendChild(gb);
  }

  // ── focus bar ──
  const subN = state.focus.subtopics.length;
  const scopeLine =
    (state.focus.mode === 'rotation' ? 'Rotation' : 'Systems course') +
    ` · ${boardLabel(state.focus.boards)}` +
    (subN > 0 ? ` · ${subN} subtopic${subN === 1 ? '' : 's'}` : '');
  const focusBar = el(`<button class="focusbar" type="button">
    <span class="swatch" style="background:${state.focus.mode === 'rotation' ? 'var(--depth)' : 'var(--pulse)'}"></span>
    <span class="txt">
      <b>${esc(opt.name)}</b>
      <span>${esc(scopeLine)}</span>
    </span>
    ${CHEVRON}
  </button>`);
  focusBar.addEventListener('click', () => ctx.go('focus'));
  scroll.appendChild(focusBar);

  // ── mini-games ──
  scroll.appendChild(el('<p class="sect">Mini-games</p>'));
  for (const game of GAMES) {
    const card = el(`<button class="task" type="button">
      <span class="ic" style="background:${ACCENT_BG[game.accent]}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${ACCENT_STROKE[game.accent]}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${game.icon}</svg>
      </span>
      <span class="bd">
        <b>${esc(game.name)}</b>
        <span>${esc(game.tagline)}</span>
      </span>
      <span class="go">${CHEVRON}</span>
    </button>`);
    card.addEventListener('click', () => ctx.go('drill', { game: game.id }));
    scroll.appendChild(card);
  }

  // ── rhythm strip: last 7 days ──
  scroll.appendChild(el('<p class="sect">Rhythm</p>'));
  scroll.appendChild(rhythmStrip(ctx, now, streakLen));

  // ── where you stand ──
  scroll.appendChild(el(`<p class="sect">Where you stand — ${esc(opt.name.toLowerCase())}</p>`));
  scroll.appendChild(masteryCard(ctx, now));
  scroll.appendChild(el('<div style="height:8px"></div>'));

  return root;
}

function rhythmStrip(ctx: Ctx, now: Date, streakLen: number): HTMLElement {
  const { streak } = ctx.state;
  const goal = ctx.state.settings.dailyGoal;
  const days: { key: string; label: string; met: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      key: dateKey(d),
      label: d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
      met: (streak.history[dateKey(d)] ?? 0) >= goal,
    });
  }
  const today = days[6];
  const flat = days.map((d, i) => (d.met ? -1 : i)).filter((i) => i >= 0 && i < 6);
  const headline = streakLen === 1 ? '1 day' : `${streakLen} days`;
  const sub = today.met ? 'Today is in' : "Today's still open";

  const strip = el(`<div class="strip">
    <div class="strip-head"><b>${headline}</b><span class="strip-sub">${sub}</span></div>
    <svg viewBox="0 0 320 50" preserveAspectRatio="none" aria-label="The last seven days as a rhythm strip.">
      <path class="trace" d="${ecgPath(0, (320 * 6) / 7, 50, 6, { amp: 0.8, flat })}"></path>
      <path class="trace ${today.met ? '' : 'pending'}" d="${
        today.met
          ? ecgPath((320 * 6) / 7, 320 / 7, 50, 1, { amp: 0.8 })
          : `M ${(320 * 6) / 7} 25 L 320 25`
      }"></path>
    </svg>
    <div class="days">${days
      .map((d, i) => `<span class="${i === 6 ? 'now' : ''}">${d.label}</span>`)
      .join('')}</div>
  </div>`);
  return strip;
}

function masteryCard(ctx: Ctx, now: Date): HTMLElement {
  const { state } = ctx;
  // topics relevant to the current focus: topics of concepts with an in-block item
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
    const b = band(r.score);
    card.appendChild(el(`<div class="mrow">
      <div class="mtop"><span>${esc(r.topic)}</span><em>${r.score}%</em></div>
      <div class="mtrack"><div class="mfill ${b === 'working' ? 'mid' : b === 'shaky' ? 'low' : ''}" style="width:${r.score}%"></div></div>
    </div>`));
  }
  return card;
}
