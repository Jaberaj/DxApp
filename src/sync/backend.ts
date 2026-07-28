/* ══════════════════════════════════════════════════════════════
   Sync backend port.
   The engine talks to this interface, never to a specific provider.
   Two implementations ship: an in-memory backend (tests, and the
   "local profile" mode) and a REST backend that works with any
   endpoint exposing GET/PUT `/state` behind a bearer token — a
   Supabase Edge Function, a Cloudflare Worker, a tiny Express app,
   etc. See docs/SYNC_AND_IOS.md.
   ══════════════════════════════════════════════════════════════ */

import type { AppState } from '../types';

export interface SyncBackend {
  /** the remote copy, or null if the account has none yet */
  load(): Promise<AppState | null>;
  /** overwrite the remote copy with `state` */
  save(state: AppState): Promise<void>;
}

/** In-memory backend — used by tests and by the offline "local" profile. */
export class MemoryBackend implements SyncBackend {
  private stored: AppState | null;
  constructor(seed: AppState | null = null) {
    this.stored = seed ? structuredClone(seed) : null;
  }
  async load(): Promise<AppState | null> {
    return this.stored ? structuredClone(this.stored) : null;
  }
  async save(state: AppState): Promise<void> {
    this.stored = structuredClone(state);
  }
}
