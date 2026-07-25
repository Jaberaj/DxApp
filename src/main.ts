import './styles.css';
import { App } from './ui/app';

const root = document.getElementById('app');
if (!root) throw new Error('missing #app root');

new App(root).render();

// Offline-first: hospital basements and radiology suites are dead
// zones. The service worker caches the shell so a loaded app keeps
// working with no signal.
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // offline cache is an enhancement, never a blocker
    });
  });
}
