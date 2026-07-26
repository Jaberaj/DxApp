import { describe, expect, it } from 'vitest';
import { renderEcg } from '../src/ui/ecgRenderer';
import { ITEMS } from '../src/content/bank';
import type { EcgSpec } from '../src/types';

/** A path string is well-formed if every coordinate token is finite. */
function coordsFinite(d: string): boolean {
  const nums = d.match(/-?\d+(\.\d+)?/g) ?? [];
  return nums.length > 0 && nums.every((n) => Number.isFinite(Number(n)));
}

describe('ECG renderer', () => {
  it('renders every ECG item in the bank to a non-empty, finite path', () => {
    const specs = ITEMS.filter((i) => i.ecg).map((i) => i.ecg!);
    expect(specs.length).toBeGreaterThan(0);
    for (const spec of specs) {
      const dr = renderEcg(spec);
      expect(dr.paths.length).toBeGreaterThan(0);
      expect(dr.width).toBeGreaterThan(0);
      expect(dr.height).toBeGreaterThan(0);
      for (const p of dr.paths) {
        expect(p.d.startsWith('M')).toBe(true);
        expect(coordsFinite(p.d), JSON.stringify(spec)).toBe(true);
      }
    }
  });

  it('is deterministic for a given spec', () => {
    const spec: EcgSpec = { rate: 130, regularity: 'irregularly_irregular', pWave: 'fibrillatory' };
    expect(JSON.stringify(renderEcg(spec))).toBe(JSON.stringify(renderEcg(spec)));
  });

  it('handles the special arrest morphologies', () => {
    for (const special of ['torsades', 'vfib', 'asystole'] as const) {
      const dr = renderEcg({ rate: 200, regularity: 'irregular', pWave: 'absent', special });
      expect(dr.paths.length).toBeGreaterThan(0);
      expect(coordsFinite(dr.paths[0].d), special).toBe(true);
    }
  });

  it('draws a faint P-wave path for a normal sinus beat and none when P is absent', () => {
    const sinus = renderEcg({ rate: 70, regularity: 'regular', pWave: 'normal' });
    expect(sinus.paths.some((p) => p.cls === 'faint')).toBe(true);
    const vt = renderEcg({ rate: 180, regularity: 'regular', pWave: 'absent', qrsWide: true });
    expect(vt.paths.every((p) => p.cls === 'main')).toBe(true);
  });
});
