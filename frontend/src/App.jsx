import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import DashboardPage from './pages/jl/DashboardPage.jsx';
import ComingSoonPage from './pages/jl/ComingSoonPage.jsx';
import ClientsLayout from './pages/jl/clients/ClientsLayout.jsx';
import ClientsPage from './pages/jl/clients/ClientsPage.jsx';
import AddClientPage from './pages/jl/clients/AddClientPage.jsx';
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
  return (
    <Routes>
      <Route element={<AppLayout session={session} onLogout={() => setSession(null)} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="clients" element={<ClientsLayout />}>
          <Route index element={<ClientsPage />} />
          <Route path="new" element={<AddClientPage />} />
          <Route path=":clientId" element={<ComingSoonPage title="Client Details" />} />
          <Route path=":clientId/edit" element={<ComingSoonPage title="Edit Client" />} />
        </Route>
        <Route path="cases" element={<ComingSoonPage title="Cases" />} />
        <Route path="calendar" element={<ComingSoonPage title="Court Calendar" />} />
        <Route path="reminders" element={<ComingSoonPage title="Reminders" />} />
        <Route path="access-requests" element={<ComingSoonPage title="Access Requests" />} />
        <Route path="activity" element={<ComingSoonPage title="Activity History" />} />
        <Route path="settings" element={<ComingSoonPage title="Settings" />} />
        {/* Unknown URLs go back to the dashboard. */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
