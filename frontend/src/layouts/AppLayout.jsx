import { Outlet } from 'react-router-dom';
import AccessRequestsProvider from '../state/AccessRequestsProvider.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

// Page frame shown after login: black sidebar, top bar, and the current page.
// Access requests are shared here because the Cases and Access Requests pages both use them.
export default function AppLayout({ session, onLogout }) {
  return (
    <AccessRequestsProvider>
      <div className="flex min-h-screen bg-bg-page">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar session={session} onLogout={onLogout} />
          <main className="flex-1 px-8 py-8">
            <Outlet /> {/* the current page renders here */}
          </main>
        </div>
      </div>
    </AccessRequestsProvider>
  );
}
