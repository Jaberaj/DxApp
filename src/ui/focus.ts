/* ══════════════════════════════════════════════════════════════
   Focus — two modes, not one dropdown. Systems course and rotation
   are different products wearing the same content. The mix slider
   defaults to 75/25 with one plain sentence of paternalism.
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import type { BoardLevel, FocusMode, System } from '../types';
import { BOARD_LEVELS, COURSES, ROTATIONS, conceptCountBySubtopic } from '../content/bank';
import { systemNode } from '../content/taxonomy';
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
    boards: ctx.state.focus.boards as BoardLevel | 'all',
    subtopics: [...ctx.state.focus.subtopics],
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

      <p class="sect">Board level</p>
      <div class="seg seg-wrap" id="boardSeg">
        ${BOARD_LEVELS.map(
          (b) => `<button type="button" data-board="${b.id}">${esc(b.label)}</button>`,
        ).join('')}
      </div>
      <p class="setting-note" id="boardNote"></p>

      <div id="subtopicSection">
        <p class="sect">Subtopics<span class="match-count" id="matchCount"></span></p>
        <p class="setting-note">Narrow to specific subtopics, or leave all off for the whole system. Greyed subtopics have no content yet.</p>
        <div class="subtopic-chips" id="subtopicChips"></div>
      </div>

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
  const boardSeg = root.querySelector('#boardSeg')!;
  const boardNote = root.querySelector('#boardNote')!;
  const subtopicSection = root.querySelector('#subtopicSection') as HTMLElement;
  const subtopicChips = root.querySelector('#subtopicChips')!;
  const matchCount = root.querySelector('#matchCount')!;

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
        draft.subtopics = []; // subtopics belong to the previous system
        renderGrid();
        renderSubtopics();
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

  function renderBoard() {
    boardSeg.querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-selected', String((b as HTMLElement).dataset.board === draft.boards));
    });
    boardNote.textContent = BOARD_LEVELS.find((b) => b.id === draft.boards)?.blurb ?? '';
  }

  /**
   * Subtopic multi-select. Course mode only — in a systems course the
   * focus is a single system, so its subtopic tree is a clean narrow.
   * Each chip shows the count of concepts with content at the current
   * board scope; empty subtopics are visible but not selectable.
   */
  function renderSubtopics() {
    if (draft.mode !== 'course') {
      subtopicSection.style.display = 'none';
      return;
    }
    subtopicSection.style.display = '';
    const subs = systemNode(draft.id as System)?.subtopics ?? [];
    const counts = conceptCountBySubtopic(draft.boards);

    subtopicChips.innerHTML = '';
    for (const s of subs) {
      const n = counts.get(s.id) ?? 0;
      const pressed = draft.subtopics.includes(s.id);
      const chip = el(
        `<button type="button" class="subchip" aria-pressed="${pressed}" ${n === 0 ? 'disabled' : ''}>${esc(s.name)}<span class="ct">${n}</span></button>`,
      );
      if (n > 0) {
        chip.addEventListener('click', () => {
          draft.subtopics = pressed
            ? draft.subtopics.filter((x) => x !== s.id)
            : [...draft.subtopics, s.id];
          renderSubtopics();
        });
      }
      subtopicChips.appendChild(chip);
    }

    const active = draft.subtopics.length ? draft.subtopics : subs.map((s) => s.id);
    const total = active.reduce((sum, id) => sum + (counts.get(id) ?? 0), 0);
    matchCount.textContent = ` · ${total} concept${total === 1 ? '' : 's'} match`;
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
    draft.subtopics = [];
    draft.timerSeconds = defaultSettings(mode).timerSeconds;
    renderModeSeg(); renderGrid(); renderTimer(); renderNote(); renderSubtopics();
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
  boardSeg.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    draft.boards = (b as HTMLElement).dataset.board as BoardLevel | 'all';
    // a subtopic that had content at the old board scope may now be
    // empty (or vice versa); drop selections that no longer qualify
    const counts = conceptCountBySubtopic(draft.boards);
    draft.subtopics = draft.subtopics.filter((id) => (counts.get(id) ?? 0) > 0);
    renderBoard(); renderSubtopics();
  });

  root.querySelector('#saveFocus')!.addEventListener('click', () => {
    ctx.setState({
      ...ctx.state,
      focus: {
        mode: draft.mode,
        id: draft.id,
        mixPercent: draft.mixPercent,
        boards: draft.boards,
        subtopics: draft.mode === 'course' ? draft.subtopics : [],
      },
      settings: { timerSeconds: draft.timerSeconds, dailyGoal: draft.dailyGoal },
    });
    ctx.go('today');
  });

  renderModeSeg(); renderGrid(); renderMix(); renderTimer(); renderGoal(); renderBoard(); renderNote(); renderSubtopics();
  return root;
}
