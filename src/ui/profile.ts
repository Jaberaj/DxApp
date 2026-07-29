/* ══════════════════════════════════════════════════════════════
   Profile — account identity, the gamified summary, sign-in, sync
   status, and data export/import.

   Guest-first: a guest can create a local (offline) profile now —
   name + saved progress + export/import. Cloud sign-in (Apple /
   Google / email) activates when a sync backend is configured for
   the build (VITE_SYNC_URL) and, on iOS, wired to native sign-in.
   See docs/SYNC_AND_IOS.md.
   ══════════════════════════════════════════════════════════════ */

import type { Ctx } from './app';
import { el, esc } from './dom';
import { band, decayedScore } from '../engine/mastery';
import { currentLength } from '../engine/streak';
import { syncConfigured, toCloudAccount } from '../sync/account';
import { achievementsWall, rankHero, tierLadder } from './awards';

const STATUS_LABEL: Record<string, string> = {
  idle: 'Ready to sync',
  syncing: 'Syncing…',
  synced: 'Synced',
  offline: 'Offline — will sync later',
  error: 'Sync error — will retry',
  disabled: 'Local only',
};

export function renderProfile(ctx: Ctx): HTMLElement {
  const { state, account } = ctx;
  const now = new Date();
  const name =
    account.displayName ?? (account.kind === 'guest' ? 'Guest' : account.email ?? 'Learner');

  const solid = Object.values(state.mastery).filter((m) => band(decayedScore(m, now)) === 'solid').length;

  const root = el(`<div class="flex-col">
    <div class="topbar"><div class="ttl"><h2 class="big">Profile</h2></div></div>
    <div class="scroll"></div>
  </div>`);
  const scroll = root.querySelector('.scroll')!;

  // ── identity + gamified summary ──
  scroll.appendChild(el(`<div class="card pad profile-hero">
    <div class="avatar">${esc(initials(name))}</div>
    <div class="who">
      <b>${esc(name)}</b>
      <span>${account.kind === 'cloud' ? esc(STATUS_LABEL[ctx.syncStatus]) : account.kind === 'local' ? 'Local profile · this device' : 'Guest · progress saved on this device'}</span>
    </div>
  </div>`));

  // ── rank, points, and progress to the next tier ──
  scroll.appendChild(rankHero(state));

  scroll.appendChild(el(`<div class="figs" style="margin-top:12px">
    <div class="fig"><b>${state.sessions.length}</b><span>Sets</span></div>
    <div class="fig"><b>${currentLength(state.streak, now)}</b><span>Day streak</span></div>
    <div class="fig"><b>${solid}</b><span>Solid topics</span></div>
  </div>`));

  // ── rewards wall ──
  scroll.appendChild(achievementsWall(state, now));

  // ── the ladder ──
  scroll.appendChild(el('<p class="sect">The ladder</p>'));
  scroll.appendChild(tierLadder(state));

  // ── account actions ──
  scroll.appendChild(el('<p class="sect">Account</p>'));
  if (account.kind === 'guest') {
    scroll.appendChild(localProfileForm(ctx));
    scroll.appendChild(cloudCard(ctx));
  } else if (account.kind === 'local') {
    scroll.appendChild(cloudCard(ctx));
    scroll.appendChild(signOutCard(ctx, 'Switch to guest'));
  } else {
    scroll.appendChild(cloudStatusCard(ctx));
    scroll.appendChild(signOutCard(ctx, 'Sign out'));
  }

  // ── data ──
  scroll.appendChild(el('<p class="sect">Your data</p>'));
  scroll.appendChild(dataCard(ctx));

  scroll.appendChild(el(`<p class="profile-legal">Educational use only — all patients are synthetic. Your progress is stored on your device${account.kind === 'cloud' ? ' and your account' : ''}. Export or delete it any time.</p>`));
  scroll.appendChild(el('<div style="height:8px"></div>'));
  return root;
}

function localProfileForm(ctx: Ctx): HTMLElement {
  const card = el(`<div class="card pad">
    <p class="setting-lab">Create your profile</p>
    <p class="setting-note">Add a name to keep a profile on this device. Your points, streak and memory are already being saved.</p>
    <div class="name-row">
      <input class="name-input" id="nameIn" type="text" maxlength="40" placeholder="Your name" autocomplete="name">
      <button class="btn" type="button" id="saveName" style="width:auto;padding:12px 16px">Save</button>
    </div>
  </div>`);
  const input = card.querySelector('#nameIn') as HTMLInputElement;
  card.querySelector('#saveName')!.addEventListener('click', () => {
    if (input.value.trim()) ctx.createLocalProfile(input.value);
  });
  input.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter' && input.value.trim()) ctx.createLocalProfile(input.value);
  });
  return card;
}

const APPLE_ICON = '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1c.1 1-.3 2-1 2.8-.7.8-1.7 1.4-2.7 1.3-.1-1 .4-2 1-2.7C14 1.6 15 1 16 1Zm3 16c-.5 1.2-.8 1.7-1.5 2.7-.9 1.4-2.2 3.1-3.8 3.1-1.4 0-1.8-.9-3.7-.9s-2.3.9-3.7.9c-1.6 0-2.8-1.6-3.8-2.9C-.3 17-1 12.4 1 9.7 2 8.3 3.6 7.4 5.2 7.4c1.6 0 2.6 1 3.9 1 1.3 0 2-1 3.9-1 1.4 0 2.9.8 3.9 2.1-3.4 1.9-2.9 6.8 1.2 7.5Z"/></svg>';
const GOOGLE_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 11v3.2h4.5c-.2 1.2-1.5 3.5-4.5 3.5-2.7 0-5-2.3-5-5s2.3-5 5-5c1.6 0 2.6.7 3.2 1.2l2.2-2.1C16.1 4.6 14.3 3.8 12 3.8 7.6 3.8 4 7.4 4 11.8s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.8 0-.5 0-.9-.1-1.3H12Z"/></svg>';

function cloudCard(ctx: Ctx): HTMLElement {
  const configured = syncConfigured();
  const card = el(`<div class="card pad" style="margin-top:9px">
    <p class="setting-lab">Sync across devices</p>
    <p class="setting-note">Sign in to save your progress to your account and pick up where you left off on another device.</p>
    <div class="signin-col">
      <button class="btn signin apple" type="button" ${configured ? '' : 'disabled'}>${APPLE_ICON}Sign in with Apple</button>
      <button class="btn signin google" type="button" ${configured ? '' : 'disabled'}>${GOOGLE_ICON}Sign in with Google</button>
      <button class="btn signin email quiet" type="button" ${configured ? '' : 'disabled'}>Sign in with email</button>
    </div>
    ${configured ? '' : '<p class="setting-note cloud-note">Cloud sync isn\'t set up in this build. Configure a backend (VITE_SYNC_URL) and, for iOS, native sign-in — see docs/SYNC_AND_IOS.md. Until then, your local profile keeps everything on this device.</p>'}
  </div>`);

  if (configured) {
    card.querySelector('.signin.email')!.addEventListener('click', () => cloudEmailFlow(ctx));
    for (const sel of ['.signin.apple', '.signin.google']) {
      card.querySelector(sel)!.addEventListener('click', () => cloudEmailFlow(ctx));
    }
  }
  return card;
}

/**
 * Minimal cloud sign-in for a configured backend: the learner brings
 * an email and a session token issued by the backend's auth flow
 * (native Apple/Google on iOS, or a magic-link server). This adopts
 * the resulting account; the OAuth handshake itself lives in the
 * backend, not here.
 */
function cloudEmailFlow(ctx: Ctx): void {
  const email = window.prompt('Email for your account:')?.trim();
  if (!email) return;
  const token = window.prompt('Session token from your sign-in link:')?.trim();
  if (!token) return;
  ctx.applyCloudAccount(toCloudAccount('email', email, token, email, ctx.account.displayName));
}

function cloudStatusCard(ctx: Ctx): HTMLElement {
  const card = el(`<div class="card pad" style="margin-top:9px">
    <p class="setting-lab">Cloud sync</p>
    <div class="sync-row"><span class="sync-dot ${ctx.syncStatus}"></span><span>${esc(STATUS_LABEL[ctx.syncStatus] ?? ctx.syncStatus)}</span>
      <button class="btn quiet" type="button" id="syncNow" style="width:auto;padding:9px 14px;margin-left:auto">Sync now</button>
    </div>
  </div>`);
  card.querySelector('#syncNow')!.addEventListener('click', () => ctx.syncNow());
  return card;
}

function signOutCard(ctx: Ctx, label: string): HTMLElement {
  const card = el(`<div class="card pad" style="margin-top:9px"><button class="btn quiet" type="button" id="signOut">${esc(label)}</button></div>`);
  card.querySelector('#signOut')!.addEventListener('click', () => {
    if (window.confirm('Your progress stays on this device. Continue?')) ctx.signOut();
  });
  return card;
}

function dataCard(ctx: Ctx): HTMLElement {
  const card = el(`<div class="card pad">
    <p class="setting-note">Export a backup of your progress, or import one on a new device.</p>
    <div class="signin-col">
      <button class="btn quiet" type="button" id="exportBtn">Export my progress (JSON)</button>
      <label class="btn quiet import-label" for="importFile">Import progress</label>
      <input type="file" id="importFile" accept="application/json" hidden>
    </div>
  </div>`);

  card.querySelector('#exportBtn')!.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(ctx.state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cadence-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  const file = card.querySelector('#importFile') as HTMLInputElement;
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      if (typeof parsed === 'object' && parsed && 'version' in parsed && 'schedules' in parsed) {
        ctx.setState(parsed);
        window.alert('Progress imported.');
      } else {
        window.alert('That file is not a Cadence backup.');
      }
    } catch {
      window.alert('Could not read that file.');
    }
  });
  return card;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}
