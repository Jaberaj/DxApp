/* ══════════════════════════════════════════════════════════════
   REST sync backend — provider-agnostic.
   Talks to any endpoint that implements:
     GET  {baseUrl}/state   → 200 AppState JSON | 404 (no state yet)
     PUT  {baseUrl}/state   ← AppState JSON body
   both behind `Authorization: Bearer <token>`. That contract is
   trivially satisfied by a Supabase Edge Function, a Cloudflare
   Worker, or a small Express app (recipes in docs/SYNC_AND_IOS.md).
   No SDK dependency, so it adds nothing to the app bundle.
   ══════════════════════════════════════════════════════════════ */

import type { AppState } from '../types';
import type { SyncBackend } from './backend';

export class RestBackend implements SyncBackend {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private get headers(): Record<string, string> {
    return { authorization: `Bearer ${this.token}`, 'content-type': 'application/json' };
  }

  async load(): Promise<AppState | null> {
    const res = await this.fetchImpl(`${this.baseUrl}/state`, { headers: this.headers });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`sync load failed: ${res.status}`);
    const body = await res.text();
    return body ? (JSON.parse(body) as AppState) : null;
  }

  async save(state: AppState): Promise<void> {
    const res = await this.fetchImpl(`${this.baseUrl}/state`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(state),
    });
    if (!res.ok) throw new Error(`sync save failed: ${res.status}`);
  }
}
