// Applies the Appearance setting (Settings > Preferences) by setting data-theme on <html>;
// the dark colours are in index.css.
// 'light' or 'dark' is used as is; 'system' follows the computer's setting and changes with it;
// null removes the theme, so the login page always looks the same.

let systemQuery = null;
let systemListener = null;

function stopFollowingSystem() {
  if (systemQuery && systemListener) systemQuery.removeEventListener('change', systemListener);
  systemQuery = null;
  systemListener = null;
}

function setDark(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

export function applyTheme(choice) {
  stopFollowingSystem();
  if (!choice) {
    delete document.documentElement.dataset.theme;
    return;
  }
  if (choice === 'system' && window.matchMedia) {
    systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemListener = (event) => setDark(event.matches);
    systemQuery.addEventListener('change', systemListener);
    setDark(systemQuery.matches);
    return;
  }
  setDark(choice === 'dark');
}
