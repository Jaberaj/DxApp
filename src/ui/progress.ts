/* ══════════════════════════════════════════════════════════════
   Progress — mastery across every topic, grouped by system (v5).
   A level card on top, a solid/building/shaky census, and tier
   colours on every bar: the same data, an order of magnitude less
   demoralising than a wall of crimson.
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import type { System } from '../types';
import { decayedScore } from '../engine/mastery';
import { earnedBadgeIds } from '../engine/progression';
import { el, esc } from './dom';
import { levelCard, censusRow } from './awards';

const SYSTEM_NAMES: Record<System, string> = {
  cardiovascular: 'Cardiovascular',
  pulmonary: 'Pulmonary',
  renal: 'Renal',
  gi: 'GI & Liver',
  endocrine: 'Endocrine',
  neuro: 'Neuroscience',
  heme_onc: 'Heme & Onc',
  infectious: 'Infectious Disease',
  msk_rheum: 'MSK & Rheumatology',
  reproductive: 'Reproductive',
  dermatology: 'Dermatology',
  psychiatry: 'Psychiatry',
  multisystem: 'Multisystem & Critical Care',
  pediatrics: 'Pediatrics',
};

function tierOf(score: number): 'solid' | 'building' | 'shaky' {
  return score >= 70 ? 'solid' : score >= 45 ? 'building' : 'shaky';
}

export function renderProgress(ctx: Ctx): HTMLElement {
  const { state } = ctx;
  const now = new Date();

  const root = el(`<div class="flex-col">
    <div class="topbar">
      <div class="ttl">
        <h2 class="big">Progress</h2>
        <p>Mastery decays without practice — that's the design, not a bug.</p>
      </div>
    </div>
    <div class="scroll"></div>
  </div>`);
  const scroll = root.querySelector('.scroll')!;

  // ── level card + game stats ──
  scroll.appendChild(levelCard(state));

  const bestCombo = state.awards?.bestCombo ?? 0;
  const badges = earnedBadgeIds(state, now).length;
  scroll.appendChild(el(`<div class="pstats">
    <div class="pstat"><b>${state.sessions.length}</b><span>SETS</span></div>
    <div class="pstat flame"><b>×${bestCombo}</b><span>BEST COMBO</span></div>
    <div class="pstat"><b>${badges}</b><span>BADGES</span></div>
  </div>`));

  const topics = Object.values(state.mastery);
  if (topics.length === 0) {
    scroll.appendChild(el(`<div class="card pad" style="margin-top:14px">
      <p class="empty-note">Nothing on the board yet. Run a set and this page starts keeping score.</p>
    </div>`));
    return root;
  }

  scroll.appendChild(censusRow(state, now));

  const bySystem = new Map<System, typeof topics>();
  for (const t of topics) {
    const list = bySystem.get(t.system) ?? [];
    list.push(t);
    bySystem.set(t.system, list);
  }

  for (const [system, list] of bySystem) {
    scroll.appendChild(el(`<p class="sect">${esc(SYSTEM_NAMES[system] ?? system)}</p>`));
    const card = el('<div class="card pad"></div>');
    for (const t of list.sort((a, b) => decayedScore(a, now) - decayedScore(b, now))) {
      const score = Math.round(decayedScore(t, now));
      const tier = tierOf(score);
      card.appendChild(el(`<div class="mrow">
        <div class="mtop"><span>${esc(t.topic)}</span><em class="tier-${tier}">${score}% · ${tier}</em></div>
        <div class="mtrack"><div class="mfill tier-${tier}" style="width:${score}%"></div></div>
      </div>`));
    }
    scroll.appendChild(card);
  }

  scroll.appendChild(el('<div style="height:8px"></div>'));
  return root;
}
