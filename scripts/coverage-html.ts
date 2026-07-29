/* HTML renderer for the coverage map. Emits a self-contained page
   (own <style>, theme-aware, CSP-safe: no external fonts/assets) that
   echoes the Cadence instrument look — cool clinical neutrals, mono
   eyebrows, the `depth` blue tier ramp, the app's status semantics.
   renderCoverageBody() returns body-only HTML for embedding (e.g. a
   published artifact); renderCoverageHtml() wraps it in a full doc. */

import type {
  CoverageReport, DepthTier, SubtopicCoverage, SystemCoverage,
} from '../src/content/coverage';
import { ROTATIONS } from '../src/content/coverage';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TIER_LABEL: Record<DepthTier, string> = {
  bare: 'empty', seed: 'seed', covered: 'covered', deep: 'deep',
};

/** Horizontal magnitude bar (single-hue, rounded data-end, direct label). */
function bar(value: number, max: number, label: string, hue = 'depth'): string {
  const pct = max > 0 ? Math.max(value === 0 ? 0 : 3, Math.round((value / max) * 100)) : 0;
  return `<div class="cvg-bar-row">
    <span class="cvg-bar-label">${esc(label)}</span>
    <span class="cvg-bar-track"><span class="cvg-bar-fill cvg-hue-${hue}" style="width:${pct}%"></span></span>
    <span class="cvg-bar-val">${value}</span>
  </div>`;
}

/** Review micro-bar: in_review vs unreviewed (nothing validated yet). */
function statusMicro(s: SubtopicCoverage): string {
  const total = s.concepts || 1;
  const seg = (n: number, cls: string) => (n > 0 ? `<span class="cvg-seg ${cls}" style="flex:${n}"></span>` : '');
  const rs = s.reviewStatus;
  return `<span class="cvg-micro" title="validated ${rs.validated} · in review ${rs.in_review} · unreviewed ${rs.unreviewed} · flagged ${rs.flagged}">
    ${seg(rs.validated, 'cvg-st-val')}${seg(rs.in_review, 'cvg-st-rev')}${seg(rs.unreviewed, 'cvg-st-unr')}${seg(rs.flagged, 'cvg-st-flag')}
    ${rs.validated === 0 && rs.in_review === 0 && rs.unreviewed === 0 ? `<span class="cvg-seg cvg-st-unr" style="flex:${total}"></span>` : ''}
  </span>`;
}

function boardChips(s: SubtopicCoverage): string {
  const chip = (b: 'step1' | 'step2' | 'step3', txt: string) =>
    `<span class="cvg-chip ${s.boards[b] > 0 ? 'on' : ''}" title="${txt}: ${s.boards[b]} vignettes">${txt.replace('Step ', '')}</span>`;
  return `<span class="cvg-chips">${chip('step1', 'Step 1')}${chip('step2', 'Step 2')}${chip('step3', 'Step 3')}</span>`;
}

function subtopicCard(s: SubtopicCoverage): string {
  if (s.tier === 'bare') {
    return `<div class="cvg-cell cvg-bare" title="${esc(s.name)} — no content yet">
      <div class="cvg-cell-name">${esc(s.name)}</div>
      <div class="cvg-cell-empty">empty</div>
    </div>`;
  }
  return `<div class="cvg-cell cvg-${s.tier}" title="${esc(s.name)} — ${s.concepts} concepts, ${s.items} vignettes, ${s.types.length} item types, ${s.deepConcepts} deep">
    <div class="cvg-cell-top">
      <div class="cvg-cell-name">${esc(s.name)}</div>
      <span class="cvg-tier-tag">${TIER_LABEL[s.tier]}</span>
    </div>
    <div class="cvg-cell-nums"><b>${s.concepts}</b> concepts · <b>${s.items}</b> vignettes${s.deepConcepts ? ` · <b>${s.deepConcepts}</b>◆` : ''}</div>
    <div class="cvg-cell-foot">${boardChips(s)}<span class="cvg-var">${s.types.length} types · ${s.presentations.length} pres.</span></div>
    ${statusMicro(s)}
  </div>`;
}

function systemSection(sys: SystemCoverage, subs: SubtopicCoverage[]): string {
  const cells = subs.filter((s) => s.system === sys.id).map(subtopicCard).join('');
  return `<section class="cvg-sys">
    <header class="cvg-sys-head">
      <h3>${esc(sys.name)}${sys.crossCutting ? '<span class="cvg-xc" title="cross-cutting system">✦</span>' : ''}</h3>
      <div class="cvg-sys-meta">
        <span><b>${sys.subtopicsCovered}</b>/${sys.subtopics} subtopics</span>
        <span><b>${sys.concepts}</b> concepts</span>
        <span><b>${sys.items}</b> vignettes</span>
        <span><b>${sys.deepConcepts}</b> deep ◆</span>
      </div>
    </header>
    <div class="cvg-grid">${cells}</div>
  </section>`;
}

function statTile(value: string | number, label: string, sub = ''): string {
  return `<div class="cvg-stat">
    <div class="cvg-stat-val">${value}</div>
    <div class="cvg-stat-lab">${esc(label)}</div>
    ${sub ? `<div class="cvg-stat-sub">${esc(sub)}</div>` : ''}
  </div>`;
}

function gapsPanel(r: CoverageReport): string {
  const sysName = new Map(r.systems.map((s) => [s.id, s.name]));
  const empty = r.gaps.filter((g) => g.kind === 'empty');
  const thinGaps = r.gaps.filter((g) => g.kind === 'thin');
  const shallow = r.gaps.filter((g) => g.kind === 'shallow');
  const board = r.gaps.filter((g) => g.kind === 'board').length;

  // thin subtopics grouped by system
  const thinBySys = new Map<string, string[]>();
  for (const g of thinGaps) (thinBySys.get(g.system) ?? thinBySys.set(g.system, []).get(g.system)!).push(g.label);
  const thinRows = [...thinBySys.entries()].sort((a, b) => b[1].length - a[1].length);

  // single-vignette concepts counted per system (180 names is noise; the
  // count per system is the actionable signal)
  const shallowBySys = new Map<string, number>();
  for (const g of shallow) shallowBySys.set(g.system, (shallowBySys.get(g.system) ?? 0) + 1);
  const shallowRows = [...shallowBySys.entries()].sort((a, b) => b[1] - a[1]);
  const maxShallow = Math.max(...shallowRows.map((r2) => r2[1]), 1);

  const emptyBanner = empty.length === 0
    ? `<div class="cvg-banner"><b>✓ All ${r.totals.subtopics} tested subtopics carry content</b> — no empty gaps left. The frontier is now <b>depth</b>: thicker subtopics and more vignettes per concept.</div>`
    : `<div class="cvg-banner cvg-banner-warn"><b>${empty.length} empty subtopic${empty.length === 1 ? '' : 's'}</b> — ${empty.map((g) => esc(g.ref)).join(', ')}</div>`;

  return `<section class="cvg-panel cvg-panel-wide">
    <h2 class="cvg-h2">Where to pour next</h2>
    <p class="cvg-dek">The gap list, computed rather than guessed. Empty subtopics are the highest-value holes; thin subtopics need depth; single-vignette concepts fail the variety floor (a diagnosis drilled only one way).</p>
    ${emptyBanner}
    <div class="cvg-gap-cols">
      <div class="cvg-gap-col">
        <div class="cvg-gap-h"><span class="cvg-dot cvg-seed-dot"></span>Thin subtopics — need depth <b>${thinGaps.length}</b></div>
        <ul class="cvg-gap-list">${thinRows
          .map(([sys, names]) => `<li><span class="cvg-gap-sys">${esc(sysName.get(sys as never) ?? sys)}</span><span class="cvg-gap-names">${names.map(esc).join(' · ')}</span></li>`)
          .join('')}</ul>
      </div>
      <div class="cvg-gap-col">
        <div class="cvg-gap-h"><span class="cvg-dot cvg-st-unr"></span>Single-vignette concepts, by system <b>${shallow.length}</b></div>
        <div class="cvg-bars">${shallowRows
          .map(([sys, n]) => bar(n, maxShallow, sysName.get(sys as never) ?? sys, 'depth'))
          .join('')}</div>
      </div>
    </div>
    <div class="cvg-gap-foot">
      <span><b>${r.totals.deepConcepts}</b>/${r.totals.concepts} concepts clear the variety floor (≥3 vignettes across ≥2 item types)</span>
      <span><b>${board}</b> developed subtopics missing a board level</span>
    </div>
  </section>`;
}

function panels(r: CoverageReport): string {
  const maxBoard = Math.max(r.boards.step1.items, r.boards.step2.items, r.boards.step3.items, 1);
  const boardBars =
    bar(r.boards.step1.items, maxBoard, 'Step 1', 'depth') +
    bar(r.boards.step2.items, maxBoard, 'Step 2 CK', 'depth') +
    bar(r.boards.step3.items, maxBoard, 'Step 3', 'depth');

  const rotEntries = ROTATIONS.map((k) => [k, r.rotations[k].items] as const).sort((a, b) => b[1] - a[1]);
  const maxRot = Math.max(...rotEntries.map((e) => e[1]), 1);
  const rotName: Record<string, string> = {
    im: 'Internal Med', em: 'Emergency', fm: 'Family Med', surg: 'Surgery',
    peds: 'Pediatrics', obgyn: 'OB/GYN', neuro: 'Neurology', psych: 'Psychiatry',
  };
  const rotBars = rotEntries.map(([k, v]) => bar(v, maxRot, rotName[k] ?? k, 'pulse')).join('');

  return `<div class="cvg-panels">
    <section class="cvg-panel">
      <h2 class="cvg-h2">By board level</h2>
      <p class="cvg-dek">Vignettes serving each USMLE step. An item can serve several; Step 1 leans mechanism &amp; buzzword, Step 2 CK diagnosis &amp; next step, Step 3 management &amp; thresholds.</p>
      <div class="cvg-bars">${boardBars}</div>
      <div class="cvg-board-concepts">
        <span>Step 1 — <b>${r.boards.step1.concepts}</b> concepts</span>
        <span>Step 2 CK — <b>${r.boards.step2.concepts}</b></span>
        <span>Step 3 — <b>${r.boards.step3.concepts}</b></span>
      </div>
    </section>
    <section class="cvg-panel">
      <h2 class="cvg-h2">By rotation</h2>
      <p class="cvg-dek">Vignettes tagged for each clerkship, so a student on-block can drill what they're seeing on the wards.</p>
      <div class="cvg-bars">${rotBars}</div>
    </section>
  </div>`;
}

export function renderCoverageBody(r: CoverageReport): string {
  const t = r.totals;
  const rs = r.reviewStatus;
  const covPct = Math.round((t.subtopicsCovered / t.subtopics) * 100);
  const stamp = new Date().toISOString().slice(0, 10);

  return `${STYLE}
<div class="cvg" data-testid="coverage-map">
  <header class="cvg-hero">
    <div class="cvg-eyebrow">Cadence · Content coverage</div>
    <h1 class="cvg-title">The coverage map</h1>
    <p class="cvg-lede">Every tested topic in the USMLE-outline taxonomy, scored live from the bank on depth, item-type variety, board reach, rotation fit, and review readiness. Computed from the content itself — an empty subtopic is a visible, trackable gap, not a guess.</p>
    <div class="cvg-stamp">Snapshot ${stamp} · derived from ${t.concepts} concepts &amp; ${t.items} vignettes</div>
  </header>

  <div class="cvg-stats">
    ${statTile(t.concepts, 'Concepts')}
    ${statTile(t.items, 'Vignettes')}
    ${statTile(`${t.subtopicsCovered}<span class="cvg-of">/${t.subtopics}</span>`, 'Subtopics covered', `${covPct}% of the outline`)}
    ${statTile(t.deepConcepts, 'Deep concepts', `variety floor · ${Math.round((t.deepConcepts / t.concepts) * 100)}%`)}
    ${statTile(`${rs.validated}<span class="cvg-of">/${t.concepts}</span>`, 'Validated', `${rs.in_review} in review · ${rs.unreviewed} unreviewed`)}
  </div>

  <div class="cvg-legend">
    <span class="cvg-leg-title">Depth</span>
    <span class="cvg-leg"><i class="cvg-sw cvg-sw-bare"></i>empty</span>
    <span class="cvg-leg"><i class="cvg-sw cvg-sw-seed"></i>seed</span>
    <span class="cvg-leg"><i class="cvg-sw cvg-sw-covered"></i>covered</span>
    <span class="cvg-leg"><i class="cvg-sw cvg-sw-deep"></i>deep</span>
    <span class="cvg-leg-sep"></span>
    <span class="cvg-leg-title">Review</span>
    <span class="cvg-leg"><i class="cvg-dot cvg-st-val"></i>validated</span>
    <span class="cvg-leg"><i class="cvg-dot cvg-st-rev"></i>in review</span>
    <span class="cvg-leg"><i class="cvg-dot cvg-st-unr"></i>unreviewed</span>
    <span class="cvg-leg">◆ = concept past the variety floor</span>
  </div>

  <div class="cvg-map">
    ${r.systems.map((sys) => systemSection(sys, r.subtopics)).join('')}
  </div>

  ${panels(r)}
  ${gapsPanel(r)}

  <footer class="cvg-foot">
    Cadence coverage map · regenerate with <code>npm run coverage:html</code> · educational tool, synthetic patients, public sources only.
  </footer>
</div>`;
}

export function renderCoverageHtml(r: CoverageReport): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cadence — Coverage Map</title>
</head>
<body>
${renderCoverageBody(r)}
</body>
</html>`;
}

/* ── styles: theme-aware tokens, Cadence instrument look ─────────── */
const STYLE = `<style>
.cvg{
  --paper:#EFF3F5; --card:#FFFFFF; --sunk:#F4F7F8; --rule:#DCE4E8; --rule-2:#C6D3D9;
  --ink:#16232B; --ink-2:#5C7280; --ink-3:#93A6B0;
  --depth:#1B5480; --depth-d:#143E60;
  --seed-bg:#E9F1F7; --seed-st:#8FBAD8;
  --covered-bg:#D6E6F2; --covered-st:#3E7CA8;
  --deep-bg:#C2D9EC; --deep-st:#1B5480;
  --pulse:#0F8A72; --amber:#E08A0B; --alarm:#B0293C;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --sans:system-ui,-apple-system,"Segoe UI",sans-serif;
  color:var(--ink); background:var(--paper); font-family:var(--sans);
  line-height:1.5; -webkit-font-smoothing:antialiased;
  max-width:1160px; margin:0 auto; padding:34px 22px 60px;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]) .cvg{
    --paper:#0C1216; --card:#141C22; --sunk:#0F171C; --rule:#233039; --rule-2:#31434E;
    --ink:#E8EEF1; --ink-2:#93A6B0; --ink-3:#5C7280;
    --depth:#4C88B4; --depth-d:#8FB6EE;
    --seed-bg:#16293A; --seed-st:#3E6C8E;
    --covered-bg:#1C3D57; --covered-st:#5C93C0;
    --deep-bg:#24567A; --deep-st:#8FB6EE;
    --pulse:#2FB295; --amber:#D9922E; --alarm:#D4536A;
  }
}
:root[data-theme="dark"] .cvg{
  --paper:#0C1216; --card:#141C22; --sunk:#0F171C; --rule:#233039; --rule-2:#31434E;
  --ink:#E8EEF1; --ink-2:#93A6B0; --ink-3:#5C7280;
  --depth:#4C88B4; --depth-d:#8FB6EE;
  --seed-bg:#16293A; --seed-st:#3E6C8E;
  --covered-bg:#1C3D57; --covered-st:#5C93C0;
  --deep-bg:#24567A; --deep-st:#8FB6EE;
  --pulse:#2FB295; --amber:#D9922E; --alarm:#D4536A;
}
.cvg *{box-sizing:border-box}
.cvg-eyebrow,.cvg-leg-title,.cvg-stat-lab,.cvg-tier-tag,.cvg-bar-label,.cvg-gap-sys,.cvg-stamp,.cvg-var,.cvg-cell-empty{
  font-family:var(--mono); text-transform:uppercase; letter-spacing:.13em; font-size:10px; font-weight:500;
}
.cvg-hero{border-bottom:1px solid var(--rule); padding-bottom:22px; margin-bottom:24px}
.cvg-eyebrow{color:var(--ink-3); margin-bottom:12px}
.cvg-title{font-size:38px; font-weight:800; letter-spacing:-.03em; margin:0 0 10px; text-wrap:balance}
.cvg-lede{max-width:64ch; color:var(--ink-2); font-size:15px; margin:0 0 12px}
.cvg-stamp{color:var(--ink-3)}

.cvg-stats{display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:22px}
.cvg-stat{background:var(--card); border:1px solid var(--rule); border-radius:12px; padding:16px 16px 14px}
.cvg-stat-val{font-size:30px; font-weight:800; letter-spacing:-.03em; line-height:1}
.cvg-of{font-size:16px; font-weight:600; color:var(--ink-3)}
.cvg-stat-lab{color:var(--ink-2); margin-top:9px}
.cvg-stat-sub{font-size:11.5px; color:var(--ink-3); margin-top:3px; letter-spacing:0; text-transform:none; font-family:var(--sans)}

.cvg-legend{display:flex; flex-wrap:wrap; align-items:center; gap:14px; padding:12px 16px; background:var(--sunk);
  border:1px solid var(--rule); border-radius:10px; margin-bottom:26px; font-size:12.5px; color:var(--ink-2)}
.cvg-leg{display:inline-flex; align-items:center; gap:6px}
.cvg-leg-title{color:var(--ink-3)}
.cvg-leg-sep{width:1px; height:16px; background:var(--rule-2)}
.cvg-sw{width:14px; height:14px; border-radius:4px; display:inline-block}
.cvg-sw-bare{background:var(--sunk); border:1px dashed var(--rule-2)}
.cvg-sw-seed{background:var(--seed-bg); border-left:3px solid var(--seed-st)}
.cvg-sw-covered{background:var(--covered-bg); border-left:3px solid var(--covered-st)}
.cvg-sw-deep{background:var(--deep-bg); border-left:3px solid var(--deep-st)}
.cvg-dot{width:9px; height:9px; border-radius:50%; display:inline-block}
.cvg-st-val{background:var(--pulse)} .cvg-st-rev,.cvg-seed-dot{background:var(--amber)}
.cvg-st-unr{background:var(--ink-3)} .cvg-st-flag{background:var(--alarm)}
.cvg-seed-dot{background:var(--seed-st)}

.cvg-map{display:flex; flex-direction:column; gap:22px}
.cvg-sys{background:var(--card); border:1px solid var(--rule); border-radius:14px; padding:16px 16px 18px}
.cvg-sys-head{display:flex; flex-wrap:wrap; align-items:baseline; justify-content:space-between; gap:8px; margin-bottom:13px}
.cvg-sys-head h3{font-size:18px; font-weight:750; letter-spacing:-.02em; margin:0}
.cvg-xc{color:var(--depth); margin-left:6px; font-size:13px}
.cvg-sys-meta{display:flex; flex-wrap:wrap; gap:14px; font-size:12.5px; color:var(--ink-2)}
.cvg-sys-meta b{color:var(--ink)}
.cvg-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(196px,1fr)); gap:9px}

.cvg-cell{border-radius:10px; padding:11px 11px 9px; border:1px solid var(--rule); background:var(--card);
  border-left-width:4px; display:flex; flex-direction:column; gap:7px; min-height:96px}
.cvg-seed{background:var(--seed-bg); border-left-color:var(--seed-st)}
.cvg-covered{background:var(--covered-bg); border-left-color:var(--covered-st)}
.cvg-deep{background:var(--deep-bg); border-left-color:var(--deep-st)}
.cvg-bare{background:var(--sunk); border:1px dashed var(--rule-2); min-height:auto; justify-content:space-between}
.cvg-cell-top{display:flex; align-items:flex-start; justify-content:space-between; gap:6px}
.cvg-cell-name{font-size:13px; font-weight:650; line-height:1.28; color:var(--ink)}
.cvg-tier-tag{color:var(--ink-2); background:rgba(255,255,255,.45); border-radius:5px; padding:1px 5px; white-space:nowrap}
:root[data-theme="dark"] .cvg-tier-tag,.cvg .cvg-deep .cvg-tier-tag{background:rgba(0,0,0,.16)}
.cvg-cell-nums{font-size:12px; color:var(--ink-2)} .cvg-cell-nums b{color:var(--ink); font-variant-numeric:tabular-nums}
.cvg-cell-foot{display:flex; align-items:center; justify-content:space-between; gap:6px; margin-top:auto}
.cvg-var{color:var(--ink-3); letter-spacing:.06em}
.cvg-cell-empty{color:var(--ink-3)}
.cvg-chips{display:inline-flex; gap:3px}
.cvg-chip{font-family:var(--mono); font-size:10px; font-weight:600; width:16px; height:16px; border-radius:5px;
  display:inline-flex; align-items:center; justify-content:center; color:var(--ink-3); background:transparent; border:1px solid var(--rule-2)}
.cvg-chip.on{color:#fff; background:var(--depth); border-color:var(--depth)}
:root[data-theme="dark"] .cvg-chip.on{color:#0C1216}
.cvg-micro{display:flex; height:4px; border-radius:2px; overflow:hidden; gap:1px; background:transparent}
.cvg-seg{display:block; border-radius:1px}
.cvg-micro .cvg-st-val{background:var(--pulse)} .cvg-micro .cvg-st-rev{background:var(--amber)}
.cvg-micro .cvg-st-unr{background:var(--rule-2)} .cvg-micro .cvg-st-flag{background:var(--alarm)}

.cvg-panels{display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px}
.cvg-panel{background:var(--card); border:1px solid var(--rule); border-radius:14px; padding:18px 18px 20px; margin-top:24px}
.cvg-panels .cvg-panel{margin-top:0}
.cvg-h2{font-size:19px; font-weight:750; letter-spacing:-.02em; margin:0 0 6px}
.cvg-dek{color:var(--ink-2); font-size:13px; margin:0 0 15px; max-width:60ch}
.cvg-bars{display:flex; flex-direction:column; gap:9px}
.cvg-bar-row{display:grid; grid-template-columns:96px 1fr 34px; align-items:center; gap:10px}
.cvg-bar-label{color:var(--ink-2); text-align:right}
.cvg-bar-track{height:9px; background:var(--sunk); border-radius:5px; overflow:hidden}
.cvg-bar-fill{display:block; height:100%; border-radius:5px}
.cvg-hue-depth{background:var(--depth)} .cvg-hue-pulse{background:var(--pulse)}
.cvg-bar-val{font-family:var(--mono); font-size:12px; color:var(--ink); font-variant-numeric:tabular-nums; text-align:right}
.cvg-board-concepts{display:flex; flex-wrap:wrap; gap:16px; margin-top:14px; font-size:12.5px; color:var(--ink-2)}
.cvg-board-concepts b{color:var(--ink)}

.cvg-gap-cols{display:grid; grid-template-columns:1fr 1fr; gap:22px}
.cvg-gap-h{display:flex; align-items:center; gap:8px; font-weight:700; font-size:14px; margin-bottom:10px}
.cvg-gap-h b{margin-left:auto; font-variant-numeric:tabular-nums; color:var(--ink-2)}
.cvg-gap-list{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:9px}
.cvg-gap-list li{display:flex; gap:10px; font-size:13px; align-items:baseline}
.cvg-gap-sys{color:var(--ink-3); flex:0 0 92px; padding-top:1px}
.cvg-gap-names{color:var(--ink); line-height:1.45}
.cvg-none{color:var(--ink-3); font-size:13px; margin:0}
.cvg-gap-foot{display:flex; flex-wrap:wrap; gap:22px; margin-top:16px; padding-top:14px; border-top:1px solid var(--rule); font-size:13px; color:var(--ink-2)}
.cvg-gap-foot b{color:var(--ink)}

.cvg-foot{margin-top:30px; padding-top:16px; border-top:1px solid var(--rule); color:var(--ink-3); font-size:12px}
.cvg-foot code{font-family:var(--mono); font-size:11px; background:var(--sunk); padding:1px 5px; border-radius:4px; color:var(--ink-2)}

@media(max-width:820px){
  .cvg-stats{grid-template-columns:repeat(2,1fr)}
  .cvg-panels{grid-template-columns:1fr}
  .cvg-gap-cols{grid-template-columns:1fr}
  .cvg-title{font-size:30px}
}
</style>`;
