import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AccessRequestsProvider from '../state/AccessRequestsProvider.jsx';
import CasesProvider from '../state/CasesProvider.jsx';
import { loadSettings } from '../pages/jl/settings/settingsOptions.js';
import { applyTheme } from '../theme.js';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

// Page frame shown after login: black sidebar, top bar, and the current page.
// Data used by more than one page lives here: cases (Cases, Court Calendar) and
// access requests (Cases, Access Requests).
export default function AppLayout({ session, onLogout }) {
  // Use the user's saved Appearance setting while logged in; go back to the default on logout.
  useEffect(() => {
    applyTheme(loadSettings(session).preferences.theme);
    return () => applyTheme(null);
  }, [session]);

  return (
    <CasesProvider>
      <AccessRequestsProvider>
        <div className="flex min-h-screen bg-bg-page">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar session={session} onLogout={onLogout} />
            <main className="flex-1 px-8 py-8">
              {/* The current page renders here; pages can read the session with useOutletContext(). */}
              <Outlet context={{ session }} />
            </main>
          </div>
        </div>
      </AccessRequestsProvider>
    </CasesProvider>
  );
}
