/* ══════════════════════════════════════════════════════════════
   Progress — mastery across every topic, grouped by system, with
   bands. Milestones tied to real things, not levels.
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import type { System } from '../types';
import { band, decayedScore } from '../engine/mastery';
import { currentLength } from '../engine/streak';
import { el, esc } from './dom';

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
};

const BAND_LABEL = { shaky: 'shaky', working: 'working', solid: 'solid' } as const;

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

  scroll.appendChild(el(`<div class="figs">
    <div class="fig"><b>${state.totalPoints}</b><span>Points</span></div>
    <div class="fig"><b>${state.sessions.length}</b><span>Sets</span></div>
    <div class="fig"><b>${currentLength(state.streak, now)}</b><span>Day streak</span></div>
  </div>`));

  const topics = Object.values(state.mastery);
  if (topics.length === 0) {
    scroll.appendChild(el(`<div class="card pad" style="margin-top:14px">
      <p class="empty-note">Nothing on the board yet. Run a set and this page starts keeping score.</p>
    </div>`));
    return root;
  }

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
      const b = band(score);
      card.appendChild(el(`<div class="mrow">
        <div class="mtop"><span>${esc(t.topic)}</span><em>${score}% · ${BAND_LABEL[b]}</em></div>
        <div class="mtrack"><div class="mfill ${b === 'working' ? 'mid' : b === 'shaky' ? 'low' : ''}" style="width:${score}%"></div></div>
      </div>`));
    }
    scroll.appendChild(card);
  }

  scroll.appendChild(el('<div style="height:8px"></div>'));
  return root;
}
