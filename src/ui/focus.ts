/* ══════════════════════════════════════════════════════════════
   Focus — two modes, not one dropdown. Systems course and rotation
   are different products wearing the same content. The mix slider
   defaults to 75/25 with one plain sentence of paternalism.
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import type { FocusMode } from '../types';
import { COURSES, ROTATIONS } from '../content/bank';
import { defaultSettings } from '../state/store';
import { el, esc } from './dom';

const BACK_ICON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4 7 12l8 8"/></svg>';

export function renderFocus(ctx: Ctx): HTMLElement {
  // local draft — nothing persists until Save
  const draft = {
    mode: ctx.state.focus.mode as FocusMode,
    id: ctx.state.focus.id,
    mixPercent: ctx.state.focus.mixPercent,
    timerSeconds: ctx.state.settings.timerSeconds,
    dailyGoal: ctx.state.settings.dailyGoal,
  };

  const root = el(`<div class="flex-col">
    <div class="topbar">
      <button class="iconb" type="button" aria-label="Back">${BACK_ICON}</button>
      <div class="ttl"><h2 class="big">Focus</h2></div>
    </div>
    <div class="scroll">
      <p class="intro">Tell Cadence what you're in the middle of. The differentials and the pace of the drill narrow to match.</p>
      <div class="seg" role="tablist" id="modeSeg">
        <button type="button" role="tab" data-mode="course">Systems course</button>
        <button type="button" role="tab" data-mode="rotation">Rotation</button>
      </div>
      <div class="grid" id="focusGrid"></div>
      <div class="mix">
        <div class="mix-top"><b>Mix</b><em id="mixVal"></em></div>
        <input type="range" id="mix" min="0" max="100" step="5" aria-label="Proportion of items drawn from your current block">
        <div class="mix-ends"><span>Everything I've seen</span><span>Only this block</span></div>
        <p class="mix-note">Keep a little review in the mix. Pure block cramming feels efficient and is the fastest way to lose last month's material before the shelf.</p>
      </div>
      <p class="sect">Session</p>
      <div class="card pad">
        <p class="setting-lab">Per-item timer</p>
        <div class="seg" id="timerSeg">
          <button type="button" data-timer="0">Off</button>
          <button type="button" data-timer="10">10s</button>
          <button type="button" data-timer="20">20s</button>
          <button type="button" data-timer="30">30s</button>
        </div>
        <p class="setting-note">The timer only affects bonus points. A slow, right answer is still right — you never lose the point, only the bonus.</p>
        <p class="setting-lab" style="margin-top:14px">Daily goal</p>
        <div class="seg" id="goalSeg">
          <button type="button" data-goal="1">Post-call · 1 set</button>
          <button type="button" data-goal="2">2 sets</button>
          <button type="button" data-goal="3">3 sets</button>
        </div>
      </div>
      <div class="note" id="modeNote"></div>
      <div style="height:8px"></div>
    </div>
    <div class="footpad">
      <button class="btn" type="button" id="saveFocus">Save focus</button>
    </div>
  </div>`);

  root.querySelector('.iconb')!.addEventListener('click', () => ctx.go('today'));

  const modeSeg = root.querySelector('#modeSeg')!;
  const grid = root.querySelector('#focusGrid')!;
  const mix = root.querySelector('#mix') as HTMLInputElement;
  const mixVal = root.querySelector('#mixVal')!;
  const timerSeg = root.querySelector('#timerSeg')!;
  const goalSeg = root.querySelector('#goalSeg')!;
  const modeNote = root.querySelector('#modeNote')!;

  function options() {
    return draft.mode === 'rotation' ? ROTATIONS : COURSES;
  }

  function renderModeSeg() {
    modeSeg.querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-selected', String((b as HTMLElement).dataset.mode === draft.mode));
    });
  }

  function renderGrid() {
    grid.innerHTML = '';
    for (const o of options()) {
      const tile = el(
        `<button type="button" class="opt-tile" aria-pressed="${o.id === draft.id}"><i></i>${esc(o.name)}</button>`,
      );
      tile.addEventListener('click', () => {
        draft.id = o.id;
        renderGrid();
      });
      grid.appendChild(tile);
    }
  }

  function renderMix() {
    mix.value = String(draft.mixPercent);
    mix.style.setProperty('--pct', draft.mixPercent + '%');
    mixVal.textContent = `${draft.mixPercent}% block · ${100 - draft.mixPercent}% review`;
  }

  function renderTimer() {
    timerSeg.querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-selected', String(Number((b as HTMLElement).dataset.timer) === draft.timerSeconds));
    });
  }

  function renderGoal() {
    goalSeg.querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-selected', String(Number((b as HTMLElement).dataset.goal) === draft.dailyGoal));
    });
  }

  function renderNote() {
    modeNote.innerHTML =
      '<span class="lab">How the modes differ</span>' +
      (draft.mode === 'rotation'
        ? 'On rotation the timer is on by default and feedback stays terse: the discriminator, then the next item. Management-forward content is weighted up.'
        : 'In a systems course the timer is off by default and there is room to read: full explanations, mechanism-forward. Speed comes later — accuracy comes first.');
  }

  modeSeg.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    const mode = (b as HTMLElement).dataset.mode as FocusMode;
    if (mode === draft.mode) return;
    draft.mode = mode;
    draft.id = options()[0].id;
    draft.timerSeconds = defaultSettings(mode).timerSeconds;
    renderModeSeg(); renderGrid(); renderTimer(); renderNote();
  });
  mix.addEventListener('input', () => {
    draft.mixPercent = Number(mix.value);
    renderMix();
  });
  timerSeg.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    draft.timerSeconds = Number((b as HTMLElement).dataset.timer);
    renderTimer();
  });
  goalSeg.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    draft.dailyGoal = Number((b as HTMLElement).dataset.goal);
    renderGoal();
  });

  root.querySelector('#saveFocus')!.addEventListener('click', () => {
    ctx.setState({
      ...ctx.state,
      focus: { mode: draft.mode, id: draft.id, mixPercent: draft.mixPercent },
      settings: { timerSeconds: draft.timerSeconds, dailyGoal: draft.dailyGoal },
    });
    ctx.go('today');
  });

  renderModeSeg(); renderGrid(); renderMix(); renderTimer(); renderGoal(); renderNote();
  return root;
}
