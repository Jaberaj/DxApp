/* ══════════════════════════════════════════════════════════════
   The drill — one screen, every mini-game.
   The set is built for whichever game launched it (Rapid
   Differentials, ECG Rhythms, Buzzword Blitz) and narrowed by the
   board scope. The timer affects bonus points only, never
   correctness. Feedback is immediate and short: one sentence on the
   discriminator, one on the best distractor.
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import type { GameId, Item, SessionItemResult } from '../types';
import { TREATMENT_TYPES } from '../types';
import { CONCEPTS, ITEMS, conceptById } from '../content/bank';
import { gameById, type GameDef } from '../content/games';
import { buildSet } from '../engine/session';
import { shuffleOptions } from '../engine/shuffle';
import { pointsFor } from '../engine/scoring';
import type { Achievement, Tier } from '../engine/progression';
import { commitSession } from '../state/store';
import { el, esc, fmtSeconds } from './dom';
import { renderEcg } from './ecgRenderer';

export interface SummaryPayload {
  game: GameId;
  items: Item[];
  results: SessionItemResult[];
  moves: { topic: string; before: number; after: number }[];
  repaired: boolean;
  points: number;
  /** achievements unlocked by this set */
  newAwards: Achievement[];
  /** rank reached by this set, if any */
  promotedTo: Tier | null;
}

const CLOSE_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 4l16 16M20 4L4 20"/></svg>';

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

  function startTimer(): void {
    timedOut = false;
    clearTimeout(timeoutHandle);
    if (timerSeconds <= 0) {
      timer.style.display = 'none';
      return;
    }
    timer.style.display = '';
    timerBar.style.animation = 'none';
    void timerBar.offsetWidth;
    timerBar.style.animation = `drain ${timerSeconds}s linear forwards`;
    timeoutHandle = setTimeout(() => {
      timedOut = true;
    }, timerSeconds * 1000);
  }

  /** The prompt block — differs by game: rhythm strip, buzzword, or vignette. */
  function promptBlock(item: Item): HTMLElement {
    if (item.ecg) {
      const dr = renderEcg(item.ecg);
      const paths = dr.paths.map((p) => `<path class="ecg-${p.cls}" d="${p.d}"/>`).join('');
      const card = el(`<div class="ecg-card">
        <div class="ecg-lead">${esc(dr.label)}</div>
        <svg class="ecg-svg" viewBox="0 0 ${dr.width} ${dr.height}" preserveAspectRatio="none" role="img" aria-label="Rhythm strip to interpret">${paths}</svg>
        ${item.stem ? `<p class="ecg-context">${esc(item.stem)}</p>` : ''}
      </div>`);
      return card;
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

    // authored order always lists the answer first — shuffle for display
    // so "A" never becomes the tell (correctness is by option id, not position)
    displayOptions = shuffleOptions(item.options);

    const opts = el('<div class="opts" id="opts"></div>');
    displayOptions.forEach((o, i) => {
      const key = String.fromCharCode(65 + i);
      const b = el(
        `<button class="opt" type="button" data-id="${esc(o.id)}"><span class="key">${key}</span>${esc(o.text)}<span class="mk"></span></button>`,
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
    checkBtn.className = ready ? 'btn' : 'btn off';
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
    const effectiveElapsed = timedOut ? timerSeconds * 1000 : elapsedMs;
    const points = pointsFor(correct, effectiveElapsed, timerSeconds);

    results.push({
      itemId: item.itemId,
      conceptId: item.conceptId,
      correct,
      elapsedMs,
      chosen: [...selected],
      timedOut,
      points,
    });
    pointsEl.textContent = String(totalPoints());
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

    body.querySelector('#resultSlot')!.appendChild(resultCard(item, correct, selected, points, elapsedMs));

    const last = index === set.length - 1;
    checkBtn.textContent = last ? 'Finish set' : 'Next';
    checkBtn.className = 'btn pulse';
    checkBtn.disabled = false;
    checkBtn.focus();
  }

  function resultCard(
    item: Item,
    correct: boolean,
    chosen: Set<string>,
    points: number,
    elapsedMs: number,
  ): HTMLElement {
    const answers = item.options.filter((o) => o.correct).map((o) => o.text);
    const title = correct ? answers.join(' · ') : `It was ${answers.join(', ')}`;
    const xp = correct
      ? `+${points}${timerSeconds > 0 && !timedOut ? ' · ' + fmtSeconds(elapsedMs) : ''}`
      : 'no points';

    // one sentence on the best distractor: the one they fell for,
    // or the most tempting one when they got it right
    const wrongPick = item.options.find((o) => chosen.has(o.id) && !o.correct && o.whyNot);
    const bestDistractor = wrongPick ?? item.options.find((o) => !o.correct && o.whyNot);

    const card = el(`<div class="result ${correct ? '' : 'bad'}">
      <div class="rh"><span class="rt">${esc(title)}</span><span class="xp">${esc(xp)}</span></div>
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
    // Treatment items carry a higher bar: surface the guideline citation.
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
      newAwards: outcome.newAwards,
      promotedTo: outcome.promotedTo,
    };
    ctx.go('summary', summary);
  }

  checkBtn.addEventListener('click', () => (locked ? advance() : check()));

  // keyboard: A–E to select, Enter to check/advance
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

export type { GameDef };
