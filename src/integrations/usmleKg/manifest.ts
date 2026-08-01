/* Manifest loading and validation for the knowledge-graph snapshot.
   The manifest is the contract: it pins the contract version, the source
   commit, the included bundles, and their checksums. We validate it
   before trusting any bundle, and we NEVER assume the manifest's declared
   source commit equals the checked-out repository HEAD. */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REQUIRED_BUNDLES, SUPPORTED_CONTRACT_VERSIONS, type KgManifest } from './types';

/** Read manifest.json from a snapshot directory. Throws if absent/malformed. */
export function loadManifest(dir: string): KgManifest {
  const raw = readFileSync(join(dir, 'manifest.json'), 'utf8');
  const m = JSON.parse(raw) as KgManifest;
  if (!m.application_contract_version || !m.git_commit || !m.checksums) {
    throw new Error('manifest.json is missing required fields (contract version, git_commit, checksums)');
  }
  return m;
}

export interface ManifestValidation {
  ok: boolean;
  errors: string[];
}

/**
 * Validate a manifest against what this importer supports. Fails on an
 * unsupported contract version or any required bundle missing from the
 * manifest's own included-bundle list or checksum map.
 */
export function validateManifest(m: KgManifest): ManifestValidation {
  const errors: string[] = [];

  if (!SUPPORTED_CONTRACT_VERSIONS.includes(m.application_contract_version)) {
    errors.push(
      `unsupported application_contract_version "${m.application_contract_version}" ` +
        `(supported: ${SUPPORTED_CONTRACT_VERSIONS.join(', ')})`,
    );
  }

  const included = new Set(m.included_bundles ?? []);
  const checksummed = new Set(Object.keys(m.checksums ?? {}));
  for (const bundle of REQUIRED_BUNDLES) {
    if (!included.has(bundle)) errors.push(`required bundle "${bundle}" is not in the manifest included_bundles`);
    if (!checksummed.has(bundle)) errors.push(`required bundle "${bundle}" has no checksum in the manifest`);
  }

  return { ok: errors.length === 0, errors };
}
