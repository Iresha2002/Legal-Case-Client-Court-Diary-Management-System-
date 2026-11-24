// Keeps the logged-in user's token and details in the browser.
// "Remember me" -> localStorage (kept after the browser closes).
// Otherwise    -> sessionStorage (deleted when the tab closes).
const STORAGE_KEY = 'lexis-diary.session';

// Storage can be blocked (private mode, browser settings), so every access is wrapped in try/catch.
function safely(action) {
  try {
    return action();
  } catch {
    return null;
  }
}

/** Saves the login response: { token, expiresAt, userId, name, role }. */
export function saveSession(session, remember) {
  clearSession(); // Never keep an old session in the other storage.
  safely(() => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(session));
  });
}

/** Returns the saved session, or null if there is none or its token has expired. */
export function getSession() {
  const saved = safely(() => localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY));
  const session = saved ? safely(() => JSON.parse(saved)) : null;

  if (!session?.token || !(Date.parse(session.expiresAt) > Date.now())) {
    clearSession(); // Remove broken or expired sessions so the user sees the login page.
    return null;
  }
  return session;
}

export function clearSession() {
  safely(() => localStorage.removeItem(STORAGE_KEY));
  safely(() => sessionStorage.removeItem(STORAGE_KEY));
}
