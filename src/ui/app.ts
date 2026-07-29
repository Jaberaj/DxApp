/* ══════════════════════════════════════════════════════════════
   App shell: screen registry, navigation, tab bar, account & sync.
   Local-first: the app always reads/writes local state and works
   offline. When a cloud account is active, a debounced push keeps
   the backend in step and a pull-merge runs on launch/sign-in.
   ══════════════════════════════════════════════════════════════ */

import type { Account, AppState, SyncStatus } from '../types';
import { loadState, reconcileShields, saveState } from '../state/store';
import {
  backendForAccount,
  loadAccount,
  newGuest,
  saveAccount,
  toLocalProfile,
} from '../sync/account';
import { SyncEngine } from '../sync/engine';
import { el } from './dom';
import { renderToday } from './today';
import { renderFocus } from './focus';
import { renderDrill } from './drill';
import { renderSummary } from './summary';
import { renderProgress } from './progress';
import { renderProfile } from './profile';

export type ScreenId = 'today' | 'focus' | 'drill' | 'summary' | 'progress' | 'profile';

export interface Ctx {
  readonly state: AppState;
  setState(next: AppState): void;
  go(screen: ScreenId, payload?: unknown): void;
  payload: unknown;
  readonly account: Account;
  readonly syncStatus: SyncStatus;
  /** convert the guest into a named local (offline) profile */
  createLocalProfile(name: string): void;
  /** adopt a cloud account (token acquired elsewhere) and sync */
  applyCloudAccount(account: Account): void;
  /** drop the account identity back to a guest (local progress kept) */
  signOut(): void;
  /** force an immediate sync (cloud accounts only) */
  syncNow(): void;
}

const TABS: { id: ScreenId; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '<path d="M3 11 12 3l9 8M5 10v10h14V10"/>' },
  { id: 'drill', label: 'Drill', icon: '<path d="M2 12h4l2.5-7 4 14L15 12h7"/>' },
  { id: 'focus', label: 'Focus', icon: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>' },
  { id: 'progress', label: 'Progress', icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>' },
  { id: 'profile', label: 'Profile', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>' },
];

/** Screens that keep the tab bar. Drill and summary run full-bleed. */
const TABBED: ScreenId[] = ['today', 'focus', 'progress', 'profile'];

export class App {
  private root: HTMLElement;
  private stateInternal: AppState;
  private accountInternal: Account;
  private engine: SyncEngine | null = null;
  private syncStatusInternal: SyncStatus = 'disabled';
  private current: ScreenId = 'today';
  private shieldToast = false;
  payload: unknown = undefined;

  constructor(root: HTMLElement) {
    this.root = root;
    this.stateInternal = loadState();
    this.accountInternal = loadAccount();
    // spend a shield to cover a single missed day, once, at launch
    const { state, spentShield } = reconcileShields(this.stateInternal, new Date());
    if (spentShield) {
      this.stateInternal = state;
      saveState(state);
      this.shieldToast = true;
    }
    this.initSync();
  }

  get state(): AppState {
    return this.stateInternal;
  }
  get account(): Account {
    return this.accountInternal;
  }
  get syncStatus(): SyncStatus {
    return this.syncStatusInternal;
  }

  /** Build (or tear down) the sync engine for the current account. */
  private initSync(): void {
    this.engine?.dispose();
    this.engine = null;
    const backend = backendForAccount(this.accountInternal);
    if (!backend) {
      this.syncStatusInternal = 'disabled';
      return;
    }
    this.syncStatusInternal = 'idle';
    this.engine = new SyncEngine(backend, {
      getLocal: () => this.stateInternal,
      setLocal: (s) => {
        this.stateInternal = s;
        saveState(s);
      },
      onStatus: (status) => {
        this.syncStatusInternal = status;
        if (TABBED.includes(this.current)) this.render();
      },
    });
    // pull-merge on launch, then reflect the merged state
    void this.engine.pull().then(() => this.render());
  }

  setState = (next: AppState): void => {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    this.stateInternal = stamped;
    saveState(stamped);
    this.engine?.schedulePush();
  };

  createLocalProfile = (name: string): void => {
    this.accountInternal = toLocalProfile(this.accountInternal, name.trim() || 'Learner');
    saveAccount(this.accountInternal);
    this.render();
  };

  applyCloudAccount = (account: Account): void => {
    this.accountInternal = account;
    saveAccount(account);
    this.initSync();
    this.render();
  };

  signOut = (): void => {
    this.accountInternal = newGuest();
    saveAccount(this.accountInternal);
    this.initSync();
    this.render();
  };

  syncNow = (): void => {
    void this.engine?.pull().then(() => this.render());
  };

  go = (screen: ScreenId, payload?: unknown): void => {
    this.payload = payload;
    this.current = screen;
    this.render();
  };

  render(): void {
    const ctx: Ctx = {
      state: this.stateInternal,
      setState: this.setState,
      go: this.go,
      payload: this.payload,
      account: this.accountInternal,
      syncStatus: this.syncStatusInternal,
      createLocalProfile: this.createLocalProfile,
      applyCloudAccount: this.applyCloudAccount,
      signOut: this.signOut,
      syncNow: this.syncNow,
    };

    this.root.innerHTML = '';
    const screen = el('<div class="screen is-active"></div>');
    switch (this.current) {
      case 'today': screen.appendChild(renderToday(ctx)); break;
      case 'focus': screen.appendChild(renderFocus(ctx)); break;
      case 'drill': screen.appendChild(renderDrill(ctx)); break;
      case 'summary': screen.appendChild(renderSummary(ctx)); break;
      case 'progress': screen.appendChild(renderProgress(ctx)); break;
      case 'profile': screen.appendChild(renderProfile(ctx)); break;
    }
    this.root.appendChild(screen);

    if (TABBED.includes(this.current)) {
      this.root.appendChild(this.tabbar());
    }

    if (this.shieldToast) {
      this.shieldToast = false;
      const n = this.stateInternal.awards?.shields ?? 0;
      this.showToast(`A shield covered yesterday. ${n} left.`);
    }
  }

  private showToast(text: string): void {
    const t = el(`<div class="toast" role="status">${text}</div>`);
    this.root.appendChild(t);
    setTimeout(() => t.classList.add('out'), 3200);
    setTimeout(() => t.remove(), 3600);
  }

  private tabbar(): HTMLElement {
    const bar = el('<nav class="tabbar" aria-label="Sections"></nav>');
    for (const tab of TABS) {
      const b = el(
        `<button class="tab" type="button" aria-current="${tab.id === this.current}">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${tab.icon}</svg>
          <span>${tab.label}</span>
        </button>`,
      );
      b.addEventListener('click', () => this.go(tab.id));
      bar.appendChild(b);
    }
    return bar;
  }
}
