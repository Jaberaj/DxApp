/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the sync backend (GET/PUT `/state`). Unset = no cloud sync. */
  readonly VITE_SYNC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
