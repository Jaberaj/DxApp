/* ══════════════════════════════════════════════════════════════
   The drill — one screen, every mini-game (v5 gamified).
   Combo scoring: a correct answer is worth 45 × the running combo
   (multiplier capped at ×10); a wrong answer scores nothing and
   resets the combo. The timer never touches correctness. Feedback is
   immediate: the answer, one sentence on the discriminator, one on
   the best distractor, the points earned, and — when a run reaches
   five or ten — the badge fires inline, not on a summary later.
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import type { GameId, Item, SessionItemResult } from '../types';
import { TREATMENT_TYPES } from '../types';
import { CONCEPTS, ITEMS, conceptById } from '../content/bank';
import { gameById, type GameDef } from '../content/games';
import { buildSet } from '../engine/session';
import { shuffleOptions } from '../engine/shuffle';
import { comboAward, COMBO_CAP, type Badge } from '../engine/progression';
import { commitSession } from '../state/store';
import { el, esc } from './dom';
import { renderEcg } from './ecgRenderer';
import { badgeAwardCard } from './awards';
import { runCelebrations, type Celebration } from './celebrate';

export interface SummaryPayload {
  game: GameId;
  items: Item[];
  results: SessionItemResult[];
  moves: { topic: string; before: number; after: number }[];
  repaired: boolean;
  points: number;
  /** badges unlocked by this set */
  newBadges: Badge[];
  /** badge ids already shown inline during the drill (don't repeat) */
  shownInline: string[];
}

const CLOSE_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 4l16 16M20 4L4 20"/></svg>';
const FLAME_SMALL =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M13.5 1.5c.6 3.4-1.3 4.8-2.7 6.2C9.2 9.3 8 10.7 8 13a4 4 0 0 0 1.3 3c-.2-1.9.6-3.3 1.8-4.4 1.5 1.9 1 3.4.4 4.7 1.1-.4 2-1.3 2.5-2.4.7 1 .9 2.2.5 3.4 1.6-1 2.6-2.9 2.6-5 0-4.6-3.2-6.6-3.6-10.8Z"/></svg>';

/** Noun for the counter, per game. */
const UNIT: Record<GameId, string> = { rapid_ddx: 'Item', rapid_tx: 'Item', ecg: 'Rhythm', buzzword: 'Buzzword' };

export function renderDrill(ctx: Ctx): HTMLElement {
  const payload = ctx.payload as { game?: GameId } | undefined;
  const game = gameById(payload?.game ?? 'rapid_ddx');
  const startedAt = new Date();
  const set = buildSet(ITEMS, CONCEPTS, ctx.state, startedAt, {
    types: game.itemTypes,
    board: ctx.state.focus.boards,
    setSize: game.setSize,
  });
  const timerSeconds = ctx.state.settings.timerSeconds;
  const results: SessionItemResult[] = [];
  let combo = 0;
  const shownInline: string[] = [];

  if (set.length === 0) {
    const empty = el(`<div class="flex-col">
      <div class="topbar drill-top">
        <button class="iconb" type="button" aria-label="Back">${CLOSE_ICON}</button>
        <span class="crumb">${esc(game.name)}</span>
      </div>
      <div class="scroll" style="padding-top:24px">
        <p class="intro">No ${esc(UNIT[game.id].toLowerCase())}s available for this focus and board level yet. Widen the board scope in Focus, or try another game.</p>
      </div>
    </div>`);
    empty.querySelector('.iconb')!.addEventListener('click', () => ctx.go('today'));
    return empty;
  }

  let index = 0;
  let itemStart = 0;
  let timedOut = false;
  let locked = false;
  let selected = new Set<string>();
  let displayOptions: Item['options'] = [];
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const root = el(`<div class="flex-col">
    <div class="topbar drill-top">
      <button class="iconb" type="button" aria-label="Leave set">${CLOSE_ICON}</button>
      <span class="pips" id="pips"></span>
      <span class="combo" id="combo" hidden>${FLAME_SMALL}<span id="comboN">×2</span></span>
      <span class="mono points" id="points">0</span>
    </div>
    <div class="timer" id="timer"><i></i></div>
    <div class="scroll" id="body"></div>
    <div class="footpad">
      <button class="btn off" type="button" id="checkBtn" disabled>Check</button>
    </div>
  </div>`);

  const pips = root.querySelector('#pips')!;
  const pointsEl = root.querySelector('#points')!;
  const comboEl = root.querySelector('#combo') as HTMLElement;
  const comboN = root.querySelector('#comboN')!;
  const timer = root.querySelector('#timer') as HTMLElement;
  const timerBar = timer.querySelector('i') as HTMLElement;
  const body = root.querySelector('#body')!;
  const checkBtn = root.querySelector('#checkBtn') as HTMLButtonElement;

  root.querySelector('.iconb')!.addEventListener('click', () => {
    clearTimeout(timeoutHandle);
    ctx.go('today');
  });

  function totalPoints(): number {
    return results.reduce((s, r) => s + r.points, 0);
  }

  function renderPips(): void {
    pips.innerHTML = set
      .map((_, i) => {
        if (i < results.length) return `<i class="${results[i].correct ? 'done' : 'miss'}"></i>`;
        if (i === index) return '<i class="now"></i>';
        return '<i></i>';
      })
      .join('');
  }

  function renderCombo(): void {
    if (combo >= 2) {
      comboEl.hidden = false;
      comboN.textContent = `×${Math.min(combo, COMBO_CAP)}`;
      comboEl.style.animation = 'none';
      void comboEl.offsetWidth;
      comboEl.style.animation = 'cd-pop .3s cubic-bezier(.22,.9,.3,1)';
    } else {
      comboEl.hidden = true;
    }
  }

  function startTimer(): void {
    timedOut = false;
    clearTimeout(timeoutHandle);
    timerBar.style.animation = 'none';
    void timerBar.offsetWidth;
    if (timerSeconds <= 0) {
      // no timer: show a static set-progress rail instead of faking a drain
      timer.classList.add('progress');
      timerBar.style.width = `${(index / set.length) * 100}%`;
      return;
    }
    timer.classList.remove('progress');
    timerBar.style.width = '';
    timerBar.style.animation = `drain ${timerSeconds}s linear forwards`;
    timeoutHandle = setTimeout(() => {
      timedOut = true;
    }, timerSeconds * 1000);
  }

  function promptBlock(item: Item): HTMLElement {
    if (item.ecg) {
      const dr = renderEcg(item.ecg);
      const paths = dr.paths.map((p) => `<path class="ecg-${p.cls}" d="${p.d}"/>`).join('');
      return el(`<div class="ecg-card">
        <div class="ecg-lead">${esc(dr.label)}</div>
        <svg class="ecg-svg" viewBox="0 0 ${dr.width} ${dr.height}" preserveAspectRatio="none" role="img" aria-label="Rhythm strip to interpret">${paths}</svg>
        ${item.stem ? `<p class="ecg-context">${esc(item.stem)}</p>` : ''}
      </div>`);
    }
    if (item.type === 'association') {
      return el(`<div class="vig assoc">
        <span class="lab assoc-lab">Name the diagnosis</span>
        <p class="assoc-prompt">${esc(item.stem)}</p>
      </div>`);
    }
    const vig = el(`<div class="vig"><p>${esc(item.stem)}</p></div>`);
    if (item.vitals.length > 0) {
      vig.appendChild(
        el(
          `<div class="vitals">${item.vitals
            .map((vt) => `<span class="vital ${vt.hot ? 'hot' : ''}">${esc(vt.label)} ${esc(vt.value)}</span>`)
            .join('')}</div>`,
        ),
      );
    }
    for (const f of item.findings) {
      vig.appendChild(el(`<p class="extra">${esc(f)}</p>`));
    }
    return vig;
  }

  function showItem(): void {
    const item = set[index];
    const concept = conceptById(item.conceptId);
    locked = false;
    selected = new Set();
    itemStart = Date.now();
    renderPips();
    startTimer();

    const multi = item.type === 'build_ddx' && (item.selectCount ?? 0) > 1;
    body.innerHTML = '';
    body.appendChild(
      el(`<p class="lab item-lab">${UNIT[game.id]} ${index + 1} of ${set.length} · ${esc(concept?.topic ?? '')}${
        multi ? ` · pick ${item.selectCount}` : ''
      }</p>`),
    );

    body.appendChild(promptBlock(item));

    displayOptions = shuffleOptions(item.options);
    const opts = el('<div class="opts" id="opts"></div>');
    displayOptions.forEach((o, i) => {
      const key = String.fromCharCode(65 + i);
      const b = el(
        `<button class="opt" type="button" data-id="${esc(o.id)}"><span class="key">${key}</span><span class="opt-tx">${esc(o.text)}</span><span class="mk"></span></button>`,
      );
      b.addEventListener('click', () => toggleOption(item, o.id, multi));
      opts.appendChild(b);
    });
    body.appendChild(opts);
    body.appendChild(el('<div id="resultSlot"></div>'));
    body.appendChild(el('<div style="height:14px"></div>'));
    (body as HTMLElement).scrollTop = 0;

    checkBtn.textContent = 'Check';
    checkBtn.className = 'btn off';
    checkBtn.disabled = true;
  }

  function toggleOption(item: Item, id: string, multi: boolean): void {
    if (locked) return;
    if (multi) {
      if (selected.has(id)) selected.delete(id);
      else if (selected.size < (item.selectCount ?? 1)) selected.add(id);
    } else {
      selected = new Set([id]);
    }
    body.querySelectorAll('.opt').forEach((b) => {
      b.classList.toggle('sel', selected.has((b as HTMLElement).dataset.id!));
    });
    const ready = multi ? selected.size === (item.selectCount ?? 1) : selected.size === 1;
    checkBtn.disabled = !ready;
    checkBtn.className = ready ? 'btn check' : 'btn off';
  }

  function check(): void {
    if (locked || selected.size === 0) return;
    const item = set[index];
    locked = true;
    clearTimeout(timeoutHandle);
    timerBar.style.animationPlayState = 'paused';

    const elapsedMs = Date.now() - itemStart;
    const correctIds = new Set(item.options.filter((o) => o.correct).map((o) => o.id));
    const correct =
      selected.size === correctIds.size && [...selected].every((id) => correctIds.has(id));

    combo = correct ? combo + 1 : 0;
    const points = correct ? comboAward(combo) : 0;

    results.push({
      itemId: item.itemId,
      conceptId: item.conceptId,
      correct,
      elapsedMs,
      chosen: [...selected],
      timedOut,
      points,
    });
    // count-up the running score
    animatePoints(pointsEl as HTMLElement, totalPoints());
    renderCombo();
    renderPips();

    body.querySelectorAll('.opt').forEach((b) => {
      const id = (b as HTMLElement).dataset.id!;
      b.classList.remove('sel');
      if (correctIds.has(id)) {
        b.classList.add('right');
        b.querySelector('.mk')!.textContent = '✓';
      } else if (selected.has(id)) {
        b.classList.add('wrong');
        b.querySelector('.mk')!.textContent = '✕';
      }
    });
    body.querySelector('#opts')!.classList.add('locked');

    const slot = body.querySelector('#resultSlot')!;
    slot.appendChild(resultCard(item, correct, selected, points));
    // inline combo badge — the moment is worth more than a later tally
    const comboBadge = correct && combo === 5 ? { id: 'five-combo', glyph: '5', name: 'Five in a row' }
      : correct && combo === 10 ? { id: 'ten-combo', glyph: '×10', name: 'Ten in a row' }
      : null;
    if (comboBadge && !shownInline.includes(comboBadge.id)) {
      shownInline.push(comboBadge.id);
      slot.appendChild(badgeAwardCard(comboBadge.glyph, 'amber', comboBadge.name));
    }

    const last = index === set.length - 1;
    checkBtn.textContent = last ? 'Finish set' : 'Next item';
    checkBtn.className = 'btn next';
    checkBtn.disabled = false;
    checkBtn.focus();
  }

  function resultCard(item: Item, correct: boolean, chosen: Set<string>, points: number): HTMLElement {
    const answers = item.options.filter((o) => o.correct).map((o) => o.text);
    const title = correct ? answers.join(' · ') : `It was ${answers.join(', ')}`;
    const chip = correct
      ? `+${points}${combo >= 2 ? ' · ×' + Math.min(combo, COMBO_CAP) : ''}`
      : 'no points · combo lost';

    const wrongPick = item.options.find((o) => chosen.has(o.id) && !o.correct && o.whyNot);
    const bestDistractor = wrongPick ?? item.options.find((o) => !o.correct && o.whyNot);

    const card = el(`<div class="result ${correct ? '' : 'bad'}">
      <div class="rh"><span class="rt">${esc(title)}</span><span class="xp ${correct ? '' : 'zero'}">${esc(chip)}</span></div>
      <p>${esc(item.discriminator)}</p>
    </div>`);
    if (bestDistractor) {
      card.appendChild(
        el(`<p><b>Why not ${esc(bestDistractor.text.toLowerCase())}?</b> ${esc(bestDistractor.whyNot!)}</p>`),
      );
    }
    if (item.teachingPoint) {
      card.appendChild(el(`<p>${esc(item.teachingPoint)}</p>`));
    }
    if (TREATMENT_TYPES.includes(item.type) && item.source[0]) {
      const s = item.source[0];
      card.appendChild(el(`<p class="src">Guideline · ${esc(s.ref)} (${s.year})</p>`));
    }
    return card;
  }

  function advance(): void {
    if (index === set.length - 1) {
      finish();
      return;
    }
    index += 1;
    showItem();
  }

  function finish(): void {
    clearTimeout(timeoutHandle);
    const outcome = commitSession(ctx.state, results, game.id, startedAt, new Date());
    ctx.setState(outcome.state);
    const summary: SummaryPayload = {
      game: game.id,
      items: set,
      results,
      moves: outcome.masteryMoves,
      repaired: outcome.streakUpdate.repaired,
      points: totalPoints(),
      newBadges: outcome.newBadges,
      shownInline,
    };
    // celebrations fire full-screen BEFORE the summary: milestone first,
    // then level-up (spec: never both back-to-back without a claim between)
    const queue: Celebration[] = [];
    for (const m of outcome.milestones) queue.push({ kind: 'milestone', milestone: m });
    if (outcome.leveledUpTo) queue.push({ kind: 'level', level: outcome.leveledUpTo });
    runCelebrations(queue, outcome.state, () => ctx.go('summary', summary));
  }

  checkBtn.addEventListener('click', () => (locked ? advance() : check()));

  root.tabIndex = -1;
  root.addEventListener('keydown', (e) => {
    const item = set[index];
    if (!item) return;
    const k = e.key.toUpperCase();
    const idx = k.charCodeAt(0) - 65;
    if (idx >= 0 && idx < displayOptions.length && k.length === 1) {
      toggleOption(item, displayOptions[idx].id, item.type === 'build_ddx' && (item.selectCount ?? 0) > 1);
    } else if (e.key === 'Enter' && !checkBtn.disabled) {
      e.preventDefault();
      locked ? advance() : check();
    }
  });

  showItem();
  return root;
}

/** Count a number up over ~26 frames; collapses under reduced motion. */
function animatePoints(node: HTMLElement, to: number): void {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const from = Number(node.textContent) || 0;
  if (reduce || from === to) {
    node.textContent = String(to);
    return;
  }
  const frames = 26;
  let i = 0;
  const step = (): void => {
    i++;
    const v = Math.round(from + ((to - from) * i) / frames);
    node.textContent = String(i >= frames ? to : v);
    if (i < frames) setTimeout(step, 34);
  };
  step();
}

export type { GameDef };
