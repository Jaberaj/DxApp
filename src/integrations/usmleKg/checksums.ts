/* SHA-256 verification of knowledge-graph bundles against the manifest.
   A bundle whose digest does not match the manifest is rejected — a
   corrupt or swapped snapshot must never be imported. */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { KgManifest } from './types';

/** SHA-256 hex digest of a file's bytes. */
export function sha256File(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

export interface ChecksumResult {
  ok: boolean;
  mismatches: { bundle: string; expected: string; actual: string }[];
  missing: string[];
}

/**
 * Verify every bundle listed in the manifest's checksum map against the
 * files on disk in `dir`. Returns the set of mismatches and missing
 * files; the caller fails the import on any of them.
 */
export function verifyChecksums(dir: string, manifest: KgManifest): ChecksumResult {
  const mismatches: ChecksumResult['mismatches'] = [];
  const missing: string[] = [];
  for (const [bundle, expected] of Object.entries(manifest.checksums)) {
    let actual: string;
    try {
      actual = sha256File(join(dir, bundle));
    } catch {
      missing.push(bundle);
      continue;
    }
    if (actual !== expected) mismatches.push({ bundle, expected, actual });
  }
  return { ok: mismatches.length === 0 && missing.length === 0, mismatches, missing };
}
