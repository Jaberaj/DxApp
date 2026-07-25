/* ══════════════════════════════════════════════════════════════
   Set complete.
   The set drawn as a rhythm strip with a flatline per miss, what
   moved today, and ONE named miss with the reasoning — naming one
   failure lands; naming four is noise.
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import type { SummaryPayload } from './drill';
import { conceptById } from '../content/bank';
import { decayedScore } from '../engine/mastery';
import { el, esc } from './dom';
import { ecgPath, flatSegment } from './ecg';

export function renderSummary(ctx: Ctx): HTMLElement {
  const payload = ctx.payload as SummaryPayload | undefined;
  if (!payload || payload.results.length === 0) {
    // nothing to summarise (deep link / reload) — bounce home
    setTimeout(() => ctx.go('today'), 0);
    return el('<div></div>');
  }

  const { items, results, moves, repaired, points } = payload;
  const n = results.length;
  const nCorrect = results.filter((r) => r.correct).length;
  const missIdx = results.map((r, i) => (r.correct ? -1 : i)).filter((i) => i >= 0);
  const accuracy = Math.round((100 * nCorrect) / n);
  const times = results.map((r) => r.elapsedMs).sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)] / 1000;

  const root = el(`<div class="flex-col">
    <div class="scroll" style="padding-top:16px">
      <p class="lab">Set complete</p>
      <h2 class="big" style="margin:6px 0 0;font-size:34px">${nCorrect} of ${n}</h2>
      <p class="sub-line">${repaired ? 'Rough stretch — your streak has been patched for the day you missed.' : missIdx.length === 0 ? 'A clean strip. No flatlines.' : 'Every miss below is one read you now own.'}</p>

      <div class="strip" style="margin-top:18px">
        <div class="strip-head"><b>The set, item by item</b><span class="strip-sub ${missIdx.length ? 'miss-count' : ''}">${
          missIdx.length === 0 ? 'no misses' : missIdx.length === 1 ? '1 miss' : missIdx.length + ' misses'
        }</span></div>
        <svg viewBox="0 0 320 50" preserveAspectRatio="none" aria-label="The set as a rhythm strip; each miss is a flatline.">
          <path class="trace" d="${ecgPath(0, 320, 50, n, { amp: 0.78, flat: missIdx })}"></path>
          ${missIdx
            .map((i) => `<path class="trace" style="stroke:var(--alarm)" d="${flatSegment(320, 50, n, i, i + 1)}"></path>`)
            .join('')}
        </svg>
      </div>

      <div class="figs" style="margin-top:12px">
        <div class="fig"><b>${accuracy}%</b><span>Accuracy</span></div>
        <div class="fig"><b>${median.toFixed(1)}s</b><span>Median</span></div>
        <div class="fig"><b>+${points}</b><span>Points</span></div>
      </div>

      <div id="moved"></div>
      <div id="missCard"></div>
      <div style="height:10px"></div>
    </div>
    <div class="footpad">
      <button class="btn pulse" type="button" id="again">Another set</button>
      <button class="btn quiet" type="button" id="home">Back to today</button>
    </div>
  </div>`);

  // ── moved today ──
  const movedHost = root.querySelector('#moved')!;
  const changed = moves.filter((m) => m.before !== m.after);
  if (changed.length > 0) {
    movedHost.appendChild(el('<p class="sect">Moved today</p>'));
    const card = el('<div class="card pad"></div>');
    for (const m of changed.slice(0, 4)) {
      const up = m.after >= m.before;
      card.appendChild(el(`<div class="mrow">
        <div class="mtop"><span>${esc(m.topic)}</span><em style="color:${up ? 'var(--pulse)' : 'var(--alarm)'}">${m.before}% → ${m.after}%</em></div>
        <div class="mtrack"><div class="mfill ${m.after < 45 ? 'low' : m.after < 75 ? 'mid' : ''}" style="width:${m.after}%"></div></div>
      </div>`));
    }
    movedHost.appendChild(card);
  }

  // ── one named miss ── the weakest-topic miss, not all of them
  const missHost = root.querySelector('#missCard')!;
  if (missIdx.length > 0) {
    const now = new Date();
    const pickIdx = missIdx.reduce((worst, i) => {
      const score = (j: number) => {
        const c = conceptById(items[j].conceptId);
        const m = c ? ctx.state.mastery[c.topic] : undefined;
        return m ? decayedScore(m, now) : 0;
      };
      return score(i) < score(worst) ? i : worst;
    }, missIdx[0]);
    const item = items[pickIdx];
    const chosen = item.options.filter((o) => results[pickIdx].chosen.includes(o.id) && !o.correct);
    const chosenLine = chosen.length > 0 ? ` You chose ${chosen.map((o) => o.text.toLowerCase()).join(', ')}.` : '';
    missHost.appendChild(el(`<div class="card miss-card">
      <p class="lab miss-lab">The one to take with you</p>
      <p class="miss-stem">${esc(item.stem)}${esc(chosenLine)}</p>
      <p class="miss-teach">${esc(item.discriminator)}</p>
    </div>`));
  }

  root.querySelector('#again')!.addEventListener('click', () => ctx.go('drill'));
  root.querySelector('#home')!.addEventListener('click', () => ctx.go('today'));
  return root;
}
