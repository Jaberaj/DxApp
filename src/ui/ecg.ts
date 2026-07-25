/* ══════════════════════════════════════════════════════════════
   The rhythm strip — a streak drawn as an ECG trace, a miss drawn
   as a flatline. The one visual flourish of the product.
   ══════════════════════════════════════════════════════════════ */

function beat(x: number, bw: number, mid: number, A: number): string {
  return (
    ` L ${x + bw * 0.1} ${mid}` +
    ` Q ${x + bw * 0.16} ${mid - A * 0.24} ${x + bw * 0.22} ${mid}` +
    ` L ${x + bw * 0.32} ${mid}` +
    ` L ${x + bw * 0.36} ${mid + A * 0.16}` +
    ` L ${x + bw * 0.42} ${mid - A * 0.94}` +
    ` L ${x + bw * 0.48} ${mid + A * 0.36}` +
    ` L ${x + bw * 0.545} ${mid}` +
    ` Q ${x + bw * 0.66} ${mid - A * 0.42} ${x + bw * 0.79} ${mid}` +
    ` L ${x + bw} ${mid}`
  );
}

export interface EcgOptions {
  /** indexes drawn as flatline instead of a beat */
  flat?: number[];
  /** amplitude 0–1 */
  amp?: number;
}

/** SVG path: n beats across a w×h box starting at x0. */
export function ecgPath(x0: number, w: number, h: number, n: number, o: EcgOptions = {}): string {
  const flat = o.flat ?? [];
  const amp = o.amp ?? 1;
  const bw = w / n;
  const mid = h / 2;
  const A = (h / 2) * amp;
  let d = `M ${x0} ${mid}`;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * bw;
    d += flat.includes(i) ? ` L ${x + bw} ${mid}` : beat(x, bw, mid, A);
  }
  return d;
}

/** Flat segment path spanning beat slots [from, to) of n across w. */
export function flatSegment(w: number, h: number, n: number, from: number, to: number): string {
  const mid = h / 2;
  return `M ${(w * from) / n} ${mid} L ${(w * to) / n} ${mid}`;
}
