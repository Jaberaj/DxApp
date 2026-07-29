/* ══════════════════════════════════════════════════════════════
   Full-screen celebration overlays — the two big moments.
   A streak milestone (flame, radial red) and a level-up (navy, lime),
   fired after the set that earns them and before the set summary.
   Dismissible only by the CTA. Everything animated collapses under
   prefers-reduced-motion (see styles.css); the overlay still renders
   and is still dismissible.
   ══════════════════════════════════════════════════════════════ */

import type { AppState } from '../types';
import { el, esc } from './dom';
import { FLAME } from './awards';
import { levelFor, type LevelInfo, type MilestoneReward } from '../engine/progression';

export interface Celebration {
  kind: 'milestone' | 'level';
  milestone?: MilestoneReward;
  level?: LevelInfo;
}

/** Total items answered across all sessions — a real, computed number. */
function itemsAnswered(state: AppState): number {
  return state.sessions.reduce((n, s) => n + s.results.length, 0);
}

function sparks(colors: string[]): string {
  let out = '';
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    const r = 120 + ((i * 37) % 110);
    const size = i % 3 ? 6 : 9;
    out += `<span class="spark" style="width:${size}px;height:${size}px;border-radius:${i % 2 ? '50%' : '2px'};background:${colors[i % colors.length]};--dx:${(Math.cos(a) * r).toFixed(0)}px;--dy:${(Math.sin(a) * r * 0.8).toFixed(0)}px;animation-duration:${(1.5 + (i % 5) * 0.22).toFixed(2)}s;animation-delay:${((i % 7) * 0.09).toFixed(2)}s"></span>`;
  }
  return out;
}

const MILESTONE_LINE: Record<number, string> = {
  3: 'Three days running',
  7: 'A full week unbroken',
  14: 'Two weeks unbroken',
  30: 'A month of reps',
  60: 'Sixty days deep',
  100: 'One hundred days',
};

function milestoneNode(reward: MilestoneReward, state: AppState, onDone: () => void): HTMLElement {
  const items = itemsAnswered(state);
  const solid = Object.values(state.mastery).filter((m) => m.score >= 70).length;
  const shields = state.awards?.shields ?? 0;
  const line = MILESTONE_LINE[reward.day] ?? `${reward.day} days unbroken`;
  const summary = `${reward.day} days of reasoning under time — about ${items} items and ${solid} topic${solid === 1 ? '' : 's'} off the shaky list. The habit, not the cram.`;
  const node = el(`<div class="celebrate flame" role="dialog" aria-modal="true" aria-label="Streak milestone">
    <div class="cel-sparks" aria-hidden="true">${sparks(['#FFD166', '#fff', '#FF8A2B', '#FFB4A2'])}</div>
    <span class="cel-emblem">
      <span class="cel-ring"></span><span class="cel-ring d2"></span>
      <span class="cel-tile"><svg width="62" height="62" viewBox="0 0 24 24" fill="#fff" class="cel-flame"><path d="${FLAME}"></path></svg></span>
    </span>
    <h2 class="cel-num">${reward.day}</h2>
    <p class="cel-line">${esc(line)}</p>
    <p class="cel-summary">${esc(summary)}</p>
    <div class="cel-tiles">
      <span class="cel-tile-stat"><b>+${reward.points}</b><span>POINTS</span></span>
      <span class="cel-tile-stat"><b>+${reward.shield}</b><span>SHIELD</span></span>
      <span class="cel-tile-stat"><b>1</b><span>BADGE</span></span>
    </div>
    <button class="cel-cta flame" type="button">Claim and keep going</button>
    <p class="cel-foot">A shield covers one missed day. You have ${shields}.</p>
  </div>`);
  node.querySelector('.cel-cta')!.addEventListener('click', onDone);
  return node;
}

function levelNode(info: LevelInfo, onDone: () => void): HTMLElement {
  const unlocks = info.nextRank
    ? `New rank: ${info.rank}`
    : `Level ${info.level} — ${info.rank}`;
  const node = el(`<div class="celebrate navy" role="dialog" aria-modal="true" aria-label="Level up">
    <div class="cel-sparks" aria-hidden="true">${sparks(['#7BE04C', '#fff', '#4B85FF', '#B8FF9E'])}</div>
    <span class="cel-emblem">
      <span class="cel-ring lime"></span><span class="cel-ring lime d2"></span>
      <span class="cel-tile navy"><b class="cel-lvnum">${info.level}</b></span>
    </span>
    <p class="cel-kicker">LEVEL UP</p>
    <h2 class="cel-rank">${esc(info.rank)}</h2>
    <p class="cel-summary">${esc(unlocks)} · keep the reps coming and the ladder keeps climbing.</p>
    <button class="cel-cta lime" type="button">Continue</button>
  </div>`);
  node.querySelector('.cel-cta')!.addEventListener('click', onDone);
  return node;
}

/**
 * Show a queue of celebrations on top of everything, one at a time,
 * then call `then`. Milestone first, level-up second (spec: never both
 * back to back is handled by the caller ordering; here we just queue).
 */
export function runCelebrations(queue: Celebration[], state: AppState, then: () => void): void {
  const items = [...queue];
  const showNext = (): void => {
    const spec = items.shift();
    if (!spec) {
      then();
      return;
    }
    const done = (): void => {
      node.remove();
      showNext();
    };
    const node =
      spec.kind === 'milestone' && spec.milestone
        ? milestoneNode(spec.milestone, state, done)
        : levelNode(spec.level ?? levelFor(state.totalPoints), done);
    document.body.appendChild(node);
    (node.querySelector('.cel-cta') as HTMLElement)?.focus();
  };
  showNext();
}
