import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import { clearSession, getSession } from './auth/session.js';

function App() {
  // Start with a saved session, so a page reload keeps the user logged in.
  const [session, setSession] = useState(() => getSession());

  // Go back to the login page when the token expires, even if the page stays open.
  useEffect(() => {
    if (!session) return undefined;
    const msLeft = Date.parse(session.expiresAt) - Date.now();
    const timer = setTimeout(() => {
      clearSession();
      setSession(null);
    }, msLeft);
    return () => clearTimeout(timer);
  }, [session]);

  if (!session) {
    return <LoginPage onLogin={setSession} />;
  }
  return <HomePage session={session} onLogout={() => setSession(null)} />;
}

export default App;
