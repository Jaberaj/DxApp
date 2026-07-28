# Accounts, sync, and iOS

This app is **local-first**: it runs entirely in the browser, saves progress to
`localStorage`, and works fully offline as a guest. Accounts and the iOS app are
layered on top. This doc covers the three things that must happen **outside this
repo's build** to go live, and exactly how the code already here plugs into them.

---

## 1. Cloud sync backend

The app talks to a backend through one tiny contract (`src/sync/rest.ts`), so any
host works. Implement two authenticated endpoints:

```
GET  {VITE_SYNC_URL}/state   → 200 <AppState JSON>  | 404 (no state yet)
PUT  {VITE_SYNC_URL}/state   ← <AppState JSON body>  → 200
```

both requiring `Authorization: Bearer <token>`. `AppState` is the whole learner
state — a small JSON blob (`src/types.ts`). That's the entire server surface;
merge/conflict handling is done **client-side** (`src/sync/merge.ts`), which
already preserves progress across devices without double-counting.

Set the backend for a build with an env var:

```sh
# .env.local
VITE_SYNC_URL=https://your-backend.example.com
```

With it unset, the app is guest/local-only and the cloud sign-in buttons are
disabled with an in-app explainer — no broken states.

### Recipe A — Supabase (recommended)

1. Create a Supabase project. Enable **Sign in with Apple** and **Google** in
   Auth providers.
2. One table, row-level-secured to the owner:
   ```sql
   create table learner_state (
     user_id uuid primary key references auth.users on delete cascade,
     state   jsonb not null,
     updated_at timestamptz default now()
   );
   alter table learner_state enable row level security;
   create policy own on learner_state
     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ```
3. A tiny **Edge Function** (`/state`) that reads the `Authorization` JWT,
   resolves `auth.uid()`, and does `select`/`upsert` on that row. Point
   `VITE_SYNC_URL` at the function URL. The Supabase JWT is the bearer token.

### Recipe B — Cloudflare Worker / Express

Any server that verifies a bearer token and stores one JSON blob per user
(KV, D1, Postgres, a file) satisfies the contract. ~40 lines.

### Auth token

`RestBackend` needs a session token. Where it comes from:

- **iOS**: native Sign in with Apple / Google (see §3) returns an identity
  token; exchange it with your backend for a session token.
- **Web**: an email magic-link flow, or Supabase's JS auth client, yields a
  session token.

The app consumes the finished result via `applyCloudAccount(...)`
(`src/sync/account.ts`) — the OAuth handshake lives in the backend/provider,
not in this client, so no provider secret is ever shipped in the bundle.

---

## 2. Data model & privacy

- The synced document is the learner's `AppState` only: schedules, mastery,
  streak, session history, settings, points. **No PHI, ever** — all patients
  are synthetic. This is a deliberate selling point.
- Export/import JSON is built in (Profile → Your data), which doubles as the
  account-migration and backup path.
- Account deletion = delete the user's row and clear local storage.

---

## 3. iOS app (Capacitor)

Capacitor wraps the built web app as a native iOS project — the **same
codebase** ships to the App Store. The web build stays a PWA in parallel.

**Requires a Mac with Xcode and an Apple Developer account.** These steps
cannot run in this Linux container; run them on a Mac:

```sh
npm run build          # produce dist/
npm run ios:add        # npx cap add ios  → creates ios/ Xcode project
npm run ios:sync       # build + copy web assets into the native shell
npm run ios:open       # open in Xcode to run, sign, and archive
```

`capacitor.config.ts` is already set (`appId: md.cadence.app`, `webDir: dist`).

### Native niceties to add in Xcode / plugins

- **Sign in with Apple** via `@capacitor-community/apple-sign-in` (or Firebase).
  Apple **requires** Sign in with Apple if you offer any other social login on
  iOS — build it.
- Status-bar + safe-area (the CSS already uses `env(safe-area-inset-*)`).
- Push notifications later (the product cap is one/day, user-timed).

### PWA alternative (no App Store)

The app is already an installable PWA (`public/manifest.webmanifest`,
`public/sw.js`, offline cache). "Add to Home Screen" on iOS Safari gives a
full-screen app today — good for TestFlight-style validation before investing
in the native submission.

---

## What's built vs what's external

| Piece | Status |
|---|---|
| Local-first state, offline, guest mode | **built** |
| Progress-preserving merge + sync engine | **built & unit-tested** |
| Provider-agnostic REST backend adapter | **built** |
| Account model, guest→profile conversion, Profile UI | **built** |
| Export / import backup | **built** |
| Capacitor iOS config + scripts | **built** |
| A running sync backend (Supabase/Worker) | you provide (recipes above) |
| OAuth handshake (Apple/Google) | provider + backend |
| Xcode build, signing, App Store submission | Mac + Apple Developer account |
