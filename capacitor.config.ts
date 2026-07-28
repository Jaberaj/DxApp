import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor wraps the built web app (dist/) as a native iOS shell so
 * the exact same codebase ships to the App Store. The Xcode project
 * lives in ios/ once `npx cap add ios` is run on a Mac — see
 * docs/SYNC_AND_IOS.md. Nothing here is used by the web/PWA build.
 */
const config: CapacitorConfig = {
  appId: 'md.cadence.app',
  appName: 'Cadence',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
  },
  backgroundColor: '#EFF3F5',
};

export default config;
