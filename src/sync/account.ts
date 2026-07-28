/* ══════════════════════════════════════════════════════════════
   Accounts.
   Guest-first: everyone starts as a guest with a stable device id
   and local-only progress. A "local" profile adds a display name
   (identity + export/import, still no cloud). A "cloud" account
   carries a backend token and its progress syncs.

   The account lives in its own localStorage key, separate from the
   synced learner state (which the account owns but does not embed).
   ══════════════════════════════════════════════════════════════ */

import type { Account, AuthProvider } from '../types';
import type { SyncBackend } from './backend';
import { RestBackend } from './rest';

const ACCOUNT_KEY = 'cadence.account';

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'g-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Is a cloud sync backend configured for this build? */
export function syncConfigured(): boolean {
  return !!import.meta.env.VITE_SYNC_URL;
}

export function newGuest(): Account {
  return { kind: 'guest', id: uuid() };
}

export function loadAccount(storage: Pick<Storage, 'getItem'> = localStorage): Account {
  try {
    const raw = storage.getItem(ACCOUNT_KEY);
    if (raw) return JSON.parse(raw) as Account;
  } catch {
    /* fall through to a fresh guest */
  }
  return newGuest();
}

export function saveAccount(account: Account, storage: Pick<Storage, 'setItem'> = localStorage): void {
  storage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

/** Turn a guest into a named local (offline) profile, keeping the id. */
export function toLocalProfile(guest: Account, displayName: string): Account {
  return { kind: 'local', id: guest.id, displayName };
}

/**
 * Build a cloud account from an auth result. The token/id/email come
 * from the auth provider (native Sign in with Apple/Google on iOS, or
 * an email magic-link server) — see docs/SYNC_AND_IOS.md. This module
 * does not perform the OAuth handshake; it consumes its result.
 */
export function toCloudAccount(
  provider: AuthProvider,
  userId: string,
  token: string,
  email?: string,
  displayName?: string,
): Account {
  return { kind: 'cloud', id: userId, provider, token, email, displayName };
}

/** The sync backend for an account, or null if it cannot sync. */
export function backendForAccount(account: Account, fetchImpl: typeof fetch = fetch): SyncBackend | null {
  if (account.kind !== 'cloud' || !account.token) return null;
  const base = import.meta.env.VITE_SYNC_URL;
  if (!base) return null;
  return new RestBackend(base, account.token, fetchImpl);
}
