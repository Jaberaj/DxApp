/* ══════════════════════════════════════════════════════════════
   Sync engine.
   Local-first: the app always reads and writes local state, so it
   works fully offline. The engine reconciles that local state with a
   backend:
     - pull()  : load remote, merge into local, save merged remote
     - push()  : save local to remote (debounced via schedulePush)
   Merge is progress-preserving (see merge.ts), so a first sign-in
   folds guest progress into the account rather than clobbering it.
   ══════════════════════════════════════════════════════════════ */

import type { AppState, SyncStatus } from '../types';
import type { SyncBackend } from './backend';
import { mergeStates } from './merge';

export interface SyncHooks {
  getLocal(): AppState;
  setLocal(state: AppState): void;
  onStatus?(status: SyncStatus): void;
}

export class SyncEngine {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private inFlight = false;
  private pending = false;

  constructor(
    private readonly backend: SyncBackend,
    private readonly hooks: SyncHooks,
    private readonly debounceMs = 1500,
  ) {}

  private status(s: SyncStatus): void {
    this.hooks.onStatus?.(s);
  }

  /** Pull remote, merge into local, and write the merged state back to both. */
  async pull(): Promise<void> {
    this.status('syncing');
    try {
      const remote = await this.backend.load();
      const local = this.hooks.getLocal();
      const merged = remote ? mergeStates(local, remote) : local;
      this.hooks.setLocal(merged);
      await this.backend.save(merged);
      this.status('synced');
    } catch {
      this.status('error');
    }
  }

  /** Push local state to remote now. Coalesces concurrent calls. */
  async push(): Promise<void> {
    if (this.inFlight) {
      this.pending = true;
      return;
    }
    this.inFlight = true;
    this.status('syncing');
    try {
      await this.backend.save(this.hooks.getLocal());
      this.status('synced');
    } catch {
      this.status('error');
    } finally {
      this.inFlight = false;
      if (this.pending) {
        this.pending = false;
        void this.push();
      }
    }
  }

  /** Debounced push — call after every local mutation. */
  schedulePush(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.push(), this.debounceMs);
  }

  dispose(): void {
    clearTimeout(this.timer);
  }
}
