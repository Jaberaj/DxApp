/* ══════════════════════════════════════════════════════════════
   App shell: screen registry, navigation, tab bar.
   ══════════════════════════════════════════════════════════════ */

import type { AppState } from '../types';
import { loadState, saveState } from '../state/store';
import { el } from './dom';
import { renderToday } from './today';
import { renderFocus } from './focus';
import { renderDrill } from './drill';
import { renderSummary } from './summary';
import { renderProgress } from './progress';

export type ScreenId = 'today' | 'focus' | 'drill' | 'summary' | 'progress';

export interface Ctx {
  readonly state: AppState;
  setState(next: AppState): void;
  go(screen: ScreenId, payload?: unknown): void;
  payload: unknown;
}

const TABS: { id: ScreenId; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '<path d="M3 11 12 3l9 8M5 10v10h14V10"/>' },
  { id: 'drill', label: 'Drill', icon: '<path d="M2 12h4l2.5-7 4 14L15 12h7"/>' },
  { id: 'focus', label: 'Focus', icon: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>' },
  { id: 'progress', label: 'Progress', icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>' },
];

/** Screens that keep the tab bar. Drill and summary run full-bleed. */
const TABBED: ScreenId[] = ['today', 'focus', 'progress'];

export class App {
  private root: HTMLElement;
  private stateInternal: AppState;
  private current: ScreenId = 'today';
  payload: unknown = undefined;

  constructor(root: HTMLElement) {
    this.root = root;
    this.stateInternal = loadState();
  }

  get state(): AppState {
    return this.stateInternal;
  }

  setState = (next: AppState): void => {
    this.stateInternal = next;
    saveState(next);
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
    };

    this.root.innerHTML = '';
    const screen = el('<div class="screen is-active"></div>');
    switch (this.current) {
      case 'today': screen.appendChild(renderToday(ctx)); break;
      case 'focus': screen.appendChild(renderFocus(ctx)); break;
      case 'drill': screen.appendChild(renderDrill(ctx)); break;
      case 'summary': screen.appendChild(renderSummary(ctx)); break;
      case 'progress': screen.appendChild(renderProgress(ctx)); break;
    }
    this.root.appendChild(screen);

    if (TABBED.includes(this.current)) {
      this.root.appendChild(this.tabbar());
    }
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
