/* ══════════════════════════════════════════════════════════════
   Reward-layer render helpers (v5 gamification).
   Level ring, streak hero, daily goal, level/identity cards, census,
   and the badge shelf — the visual reward layer shared across Today,
   Progress and Profile. Every number is derived from real state; the
   voice stays dry and earned. Motion is CSS (styles.css) and respects
   prefers-reduced-motion.
   ══════════════════════════════════════════════════════════════ */

import type { Account, AppState } from '../types';
import { el, esc } from './dom';
import { ecgPath } from './ecg';
import { decayedScore } from '../engine/mastery';
import { currentLength, dateKey } from '../engine/streak';
import {
  levelFor,
  nextMilestone,
  milestoneReward,
  allBadges,
  earnedBadgeIds,
  MAX_SHIELDS,
} from '../engine/progression';

const FLAME =
  'M13.5 1.5c.6 3.4-1.3 4.8-2.7 6.2C9.2 9.3 8 10.7 8 13a4 4 0 0 0 1.3 3c-.2-1.9.6-3.3 1.8-4.4 1.5 1.9 1 3.4.4 4.7 1.1-.4 2-1.3 2.5-2.4.7 1 .9 2.2.5 3.4 1.6-1 2.6-2.9 2.6-5 0-4.6-3.2-6.6-3.6-10.8Z';

const BADGE_GRAD: Record<string, string> = {
  green: 'linear-gradient(140deg,#00C68F,#0E7C5A)',
  blue: 'linear-gradient(140deg,#4B85FF,#1B3A5C)',
  amber: 'linear-gradient(140deg,#F5C542,#D98207)',
  violet: 'linear-gradient(140deg,#A97BFF,#5B21B6)',
};

/** An SVG progress ring with a centred numeral. */
function ring(size: number, sw: number, frac: number, arc: string, track: string, numeral: string, numColor: string, numSize: number): string {
  const r = size / 2 - sw / 2 - 1;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, frac)));
  const cx = size / 2;
  return `<span style="position:relative;width:${size}px;height:${size}px;flex:0 0 ${size}px;display:grid;place-items:center">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;transform:rotate(-90deg)">
      <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}"></circle>
      <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${arc}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" style="transition:stroke-dashoffset .6s cubic-bezier(.22,.9,.3,1)"></circle>
    </svg>
    <span style="font-family:'Archivo',sans-serif;font-size:${numSize}px;font-weight:900;color:${numColor}">${esc(numeral)}</span>
  </span>`;
}

/* ── Today: level pill in the header ────────────────────────── */
export function levelPill(state: AppState, onOpen: () => void): HTMLElement {
  const lv = levelFor(state.totalPoints);
  const pill = el(`<button class="lvpill" type="button" aria-label="Level ${lv.level}, ${esc(lv.rank)}. Open profile.">
    ${ring(32, 3.5, lv.fraction, '#7BE04C', 'rgba(255,255,255,.18)', String(lv.level), '#fff', 13)}
    <span class="lvpill-tx"><span class="lvpill-rank">LEVEL ${lv.level}</span><span class="lvpill-pts">${state.totalPoints.toLocaleString()} pts</span></span>
  </button>`);
  pill.addEventListener('click', onOpen);
  return pill;
}

/* ── Today: streak hero ─────────────────────────────────────── */
function weekDays(state: AppState, now: Date): boolean[] {
  const goal = state.settings.dailyGoal;
  const out: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push((state.streak.history[dateKey(d)] ?? 0) >= goal);
  }
  return out;
}

export function streakHero(state: AppState, now: Date): HTMLElement {
  const len = currentLength(state.streak, now);
  const shields = state.awards?.shields ?? 0;
  const best = state.awards?.bestStreak ?? len;
  const nm = nextMilestone(len);
  const days = weekDays(state, now);
  const doneCount = days.filter(Boolean).length;
  const W = 300;
  const solid = ecgPath(0, (W * doneCount) / 7, 32, Math.max(1, doneCount), { amp: 0.85 });
  const pendingStart = (W * doneCount) / 7;
  const headline = len === 0 ? 'Start a streak' : len === 1 ? 'Day 1 · keep it' : `${len} days`;
  const sub =
    len === 0
      ? 'Finish one set to light it up'
      : len === 1
        ? 'One more set today and tomorrow makes it a streak'
        : nm
          ? `${nm - len} day${nm - len === 1 ? '' : 's'} to the next milestone`
          : 'Past every milestone — the habit is yours';
  const next = nm ? `NEXT: DAY ${nm} → +${milestoneReward(nm).points}` : 'ALL MILESTONES MET';

  return el(`<div class="streakhero">
    <span class="sh-shine"></span>
    <div class="sh-top">
      <span class="sh-flame"><svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="${FLAME}"></path></svg></span>
      <span class="sh-tx"><span class="sh-head">${esc(headline)}</span><span class="sh-sub">${esc(sub)}</span></span>
    </div>
    <svg viewBox="0 0 ${W} 32" preserveAspectRatio="none" class="sh-week" aria-hidden="true">
      <path d="${solid}" fill="none" stroke="rgba(255,255,255,.92)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"></path>
      <path d="M ${pendingStart} 16 L ${W} 16" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-dasharray="3 4"></path>
    </svg>
    <div class="sh-foot">
      <span class="sh-chips"><span class="sh-chip">${shields} SHIELD${shields === 1 ? '' : 'S'}</span><span class="sh-chip">BEST ${best}</span></span>
      <span class="sh-next">${esc(next)}</span>
    </div>
  </div>`);
}

/* ── Today: daily goal ring card ────────────────────────────── */
function todayCount(state: AppState, now: Date): { sets: number; points: number } {
  const key = dateKey(now);
  let sets = 0;
  let points = 0;
  for (const s of state.sessions) {
    if (dateKey(new Date(s.finishedAt)) === key) {
      sets++;
      points += s.totalPoints;
    }
  }
  return { sets, points };
}

export function dailyGoalCard(state: AppState, now: Date): HTMLElement {
  const goal = Math.max(1, state.settings.dailyGoal);
  const { sets, points } = todayCount(state, now);
  const frac = Math.min(1, sets / goal);
  const left = Math.max(0, goal - sets);
  const line =
    left === 0
      ? `Goal met · ${points} pts today`
      : `${left} set${left === 1 ? '' : 's'} to go · ${points} pts today`;
  const r = 21;
  const c = 2 * Math.PI * r;
  const off = c * (1 - frac);
  return el(`<div class="card pad goalcard">
    <span class="goal-ring">
      <svg width="50" height="50" viewBox="0 0 50 50" style="position:absolute;transform:rotate(-90deg)">
        <circle cx="25" cy="25" r="${r}" fill="none" stroke="var(--seg-track)" stroke-width="6"></circle>
        <circle cx="25" cy="25" r="${r}" fill="none" stroke="var(--green)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" style="transition:stroke-dashoffset .6s cubic-bezier(.22,.9,.3,1)"></circle>
      </svg>
      <b class="goal-num">${sets}<i>/${goal}</i></b>
    </span>
    <div class="goal-tx"><b>Daily goal</b><span>${esc(line)}</span></div>
  </div>`);
}

/* ── Progress / Profile: level card ─────────────────────────── */
export function levelCard(state: AppState): HTMLElement {
  const lv = levelFor(state.totalPoints);
  const sub = lv.nextRank
    ? `${lv.toNext.toLocaleString()} to ${lv.nextRank}`
    : lv.toNext > 0
      ? `${lv.toNext.toLocaleString()} to level ${lv.level + 1}`
      : 'Top of the ladder';
  return el(`<div class="levelcard">
    ${ring(66, 6, lv.fraction, '#7BE04C', 'rgba(255,255,255,.15)', String(lv.level), '#fff', 20)}
    <div class="lc-tx">
      <span class="lc-lab">LEVEL ${lv.level} · ${state.totalPoints.toLocaleString()} POINTS</span>
      <b>${esc(lv.rank)}</b>
      <span class="lc-sub">${esc(sub)}</span>
    </div>
  </div>`);
}

/* ── Profile: identity card (level + name) ──────────────────── */
export function identityCard(state: AppState, account: Account): HTMLElement {
  const lv = levelFor(state.totalPoints);
  const name =
    account.displayName ?? (account.kind === 'guest' ? 'Guest' : account.email ?? 'Learner');
  const where =
    account.kind === 'cloud' ? 'synced to your account' : 'saved on this device';
  return el(`<div class="levelcard identity">
    <span class="id-ring">${ring(58, 5, lv.fraction, '#7BE04C', 'rgba(255,255,255,.16)', String(lv.level), '#fff', 19)}</span>
    <div class="lc-tx">
      <span class="lc-lab">LEVEL ${lv.level} · ${esc(lv.rank.toUpperCase())}</span>
      <b>${esc(name)}</b>
      <span class="lc-sub">${state.totalPoints.toLocaleString()} points · ${esc(where)}</span>
    </div>
  </div>`);
}

/* ── Profile: compact streak card ───────────────────────────── */
export function streakCard(state: AppState, now: Date): HTMLElement {
  const len = currentLength(state.streak, now);
  const shields = state.awards?.shields ?? 0;
  const best = state.awards?.bestStreak ?? len;
  return el(`<div class="streakcard">
    <span class="sc-flame"><svg width="21" height="21" viewBox="0 0 24 24" fill="#fff"><path d="${FLAME}"></path></svg></span>
    <span class="sc-tx"><b>${len} day streak</b><span>${shields} shield${shields === 1 ? '' : 's'} in reserve · best ${best}</span></span>
  </div>`);
}

/* ── Progress: solid / building / shaky census ──────────────── */
export function censusRow(state: AppState, now: Date): HTMLElement {
  let solid = 0;
  let building = 0;
  let shaky = 0;
  for (const m of Object.values(state.mastery)) {
    const s = decayedScore(m, now);
    if (s >= 70) solid++;
    else if (s >= 45) building++;
    else shaky++;
  }
  return el(`<div class="census">
    <span class="cx"><b style="color:var(--green-deep)">${solid}</b><span>SOLID</span></span>
    <span class="cx"><b style="color:var(--amber-deep)">${building}</b><span>BUILDING</span></span>
    <span class="cx"><b style="color:var(--crimson)">${shaky}</b><span>SHAKY</span></span>
  </div>`);
}

/* ── Profile: the badge shelf ───────────────────────────────── */
export function badgeShelf(state: AppState, now: Date): HTMLElement {
  const earned = new Set(earnedBadgeIds(state, now));
  const badges = allBadges();
  const host = el('<div></div>');
  host.appendChild(el(`<p class="sect shelf-head">The shelf <span class="shelf-count">${earned.size} of ${badges.length}</span></p>`));
  const grid = el('<div class="shelf"></div>');
  for (const b of badges) {
    const on = earned.has(b.id);
    grid.appendChild(el(`<div class="badge ${on ? 'on' : 'off'}">
      <span class="badge-chip" style="${on ? `background:${BADGE_GRAD[b.grad]}` : ''}">${esc(b.glyph)}</span>
      <b>${esc(b.name)}</b>
    </div>`));
  }
  host.appendChild(grid);
  return host;
}

/** Small inline badge-award card for the drill answered screen. */
export function badgeAwardCard(glyph: string, grad: string, name: string): HTMLElement {
  return el(`<div class="badge-award">
    <span class="ba-chip" style="background:${BADGE_GRAD[grad] ?? BADGE_GRAD.amber}">${esc(glyph)}</span>
    <span class="ba-tx"><span class="ba-lab">BADGE UNLOCKED</span><b>${esc(name)}</b></span>
  </div>`);
}

export { FLAME, BADGE_GRAD, MAX_SHIELDS };
