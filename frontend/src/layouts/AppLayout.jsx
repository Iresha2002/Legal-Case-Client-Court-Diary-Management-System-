import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

// Page frame shown after login: black sidebar, top bar, and the current page.
export default function AppLayout({ session, onLogout }) {
  return (
    <div className="flex min-h-screen bg-bg-page">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar session={session} onLogout={onLogout} />
        <main className="flex-1 px-8 py-8">
          <Outlet /> {/* the current page renders here */}
        </main>
      </div>
    </div>
  );
}
