/* ══════════════════════════════════════════════════════════════
   Parametric rhythm-strip renderer for the ECG mini-game.
   Schematic, not diagnostic-grade: the goal is that the teaching
   morphology is unmistakable at a glance on a phone. Deterministic
   for a given spec+seed so an item always looks the same.
   ══════════════════════════════════════════════════════════════ */

import type { EcgSpec } from '../types';

export interface EcgPath {
  d: string;
  /** semantic class → CSS stroke: 'main' | 'faint' */
  cls: 'main' | 'faint';
}

export interface EcgDrawing {
  paths: EcgPath[];
  label: string;
  width: number;
  height: number;
}

const W = 320;
const H = 96;
const MID = H / 2;

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(spec: EcgSpec): number {
  const key = `${spec.rate}|${spec.regularity}|${spec.pWave}|${spec.special ?? ''}|${spec.qrsWide ?? ''}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** One QRS-T complex within a beat box [x, x+bw]. */
function complex(x: number, bw: number, spec: EcgSpec): string {
  const A = H * 0.42;
  const stY = MID - (spec.stShift ?? 0) * A;
  const rWidth = spec.qrsWide ? 0.2 : 0.09;

  // segment anchors as fractions of bw
  const pEnd = 0.22;
  const prMs = spec.prMs ?? 160;
  const qrsStart = Math.min(0.5, pEnd + (prMs / 200) * 0.14);
  const qStart = qrsStart;
  const rPeak = qStart + rWidth * 0.5;
  const sEnd = qStart + rWidth;
  const stEnd = sEnd + 0.14;
  const tPeak = stEnd + 0.12;
  const tEnd = Math.min(0.98, tPeak + 0.12);

  const px = (f: number) => x + bw * f;

  let d = `L ${px(pEnd)} ${MID}`;

  if (spec.delta) {
    // slurred upstroke from the PR segment into a wide R
    d += ` L ${px(qStart)} ${MID}`;
    d += ` L ${px(rPeak)} ${MID - A * 0.92}`;
    d += ` L ${px(sEnd)} ${MID + A * 0.12}`;
  } else {
    d += ` L ${px(qStart)} ${MID}`;
    d += ` L ${px(qStart + rWidth * 0.15)} ${MID + A * 0.18}`; // Q
    d += ` L ${px(rPeak)} ${MID - A * (spec.qrsWide ? 0.8 : 1)}`; // R
    d += ` L ${px(sEnd)} ${MID + A * (spec.qrsWide ? 0.5 : 0.34)}`; // S
  }

  // ST segment (possibly shifted)
  d += ` L ${px(stEnd)} ${stY}`;

  // T wave
  const t = spec.tWave ?? 'normal';
  if (t === 'flat') {
    d += ` L ${px(tEnd)} ${stY}`;
  } else if (t === 'inverted') {
    d += ` Q ${px(tPeak)} ${stY + A * 0.45} ${px(tEnd)} ${MID}`;
  } else if (t === 'peaked') {
    d += ` L ${px(tPeak - 0.02)} ${MID} L ${px(tPeak)} ${stY - A * 0.75} L ${px(tPeak + 0.02)} ${MID} L ${px(tEnd)} ${MID}`;
  } else {
    d += ` Q ${px(tPeak)} ${stY - A * 0.34} ${px(tEnd)} ${MID}`;
  }
  d += ` L ${x + bw} ${MID}`;
  return d;
}

/** P wave as a small hump ending at fraction 0.22 of the beat box. */
function pWavePath(x: number, bw: number): string {
  const A = H * 0.42;
  return `M ${x} ${MID} L ${x + bw * 0.06} ${MID} Q ${x + bw * 0.12} ${MID - A * 0.22} ${x + bw * 0.18} ${MID} L ${x + bw * 0.22} ${MID}`;
}

function specialDrawing(spec: EcgSpec): EcgDrawing {
  const rnd = mulberry32(seedFrom(spec));
  const pts: string[] = [`M 0 ${MID}`];
  const n = 240;
  for (let i = 1; i <= n; i++) {
    const x = (W * i) / n;
    let y = MID;
    if (spec.special === 'torsades') {
      // sinusoidal QRS axis swinging above and below the baseline
      const env = Math.sin((i / n) * Math.PI * 2);
      y = MID - env * H * 0.34 * Math.sin(i * 0.9);
    } else if (spec.special === 'vfib') {
      y = MID - (rnd() - 0.5) * H * 0.6;
    } else {
      // asystole: near-flat with a faint wander
      y = MID - (rnd() - 0.5) * H * 0.03;
    }
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return { paths: [{ d: pts.join(' '), cls: 'main' }], label: spec.lead ?? 'Lead II', width: W, height: H };
}

export function renderEcg(spec: EcgSpec): EcgDrawing {
  if (spec.special) return specialDrawing(spec);

  const rnd = mulberry32(seedFrom(spec));
  const beats = Math.max(3, Math.min(11, Math.round(spec.rate / 17)));
  const baseBw = W / beats;

  // beat x-offsets, jittered for irregular rhythms
  const offsets: number[] = [];
  let cursor = 0;
  for (let i = 0; i < beats; i++) {
    offsets.push(cursor);
    let bw = baseBw;
    if (spec.regularity === 'irregularly_irregular') bw = baseBw * (0.6 + rnd() * 0.8);
    else if (spec.regularity === 'irregular') bw = baseBw * (i % 2 === 0 ? 0.8 : 1.2);
    cursor += bw;
  }
  const scale = W / cursor;

  let trace = `M 0 ${MID}`;
  const pPaths: string[] = [];
  for (let i = 0; i < beats; i++) {
    const x = offsets[i] * scale;
    const bw = (i + 1 < beats ? offsets[i + 1] : cursor) * scale - x;
    if (spec.pWave === 'normal') {
      trace += ` L ${x + bw * 0.22} ${MID}`; // P drawn on its own faint path
      pPaths.push(pWavePath(x, bw));
    }
    trace += complex(x, bw, spec);
  }

  const paths: EcgPath[] = [];

  // fibrillatory / sawtooth baselines drawn faintly under the trace
  if (spec.pWave === 'fibrillatory' || spec.pWave === 'sawtooth') {
    const pts: string[] = [`M 0 ${MID}`];
    const n = 200;
    for (let i = 1; i <= n; i++) {
      const x = (W * i) / n;
      const y =
        spec.pWave === 'sawtooth'
          ? MID - ((i % 12) / 12) * H * 0.12 + H * 0.06
          : MID - (rnd() - 0.5) * H * 0.06;
      pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    paths.push({ d: pts.join(' '), cls: 'faint' });
  }

  // dissociated P waves marching at their own (atrial) rate
  if (spec.pWave === 'dissociated') {
    const pRate = 8;
    const parts: string[] = [];
    for (let i = 0; i < pRate; i++) {
      const x = (W * i) / pRate;
      parts.push(pWavePath(x, W / pRate));
    }
    paths.push({ d: parts.join(' '), cls: 'faint' });
  }

  for (const d of pPaths) paths.push({ d, cls: 'faint' });
  paths.push({ d: trace, cls: 'main' });

  return { paths, label: spec.lead ?? 'Lead II', width: W, height: H };
}
