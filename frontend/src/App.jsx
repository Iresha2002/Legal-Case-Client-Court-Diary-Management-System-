import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import DashboardPage from './pages/jl/DashboardPage.jsx';
import ComingSoonPage from './pages/jl/ComingSoonPage.jsx';
import ClientsLayout from './pages/jl/clients/ClientsLayout.jsx';
import ClientsPage from './pages/jl/clients/ClientsPage.jsx';
import AddClientPage from './pages/jl/clients/AddClientPage.jsx';
import ClientDetailsPage from './pages/jl/clients/ClientDetailsPage.jsx';
import EditClientPage from './pages/jl/clients/EditClientPage.jsx';
import CasesLayout from './pages/jl/cases/CasesLayout.jsx';
import CasesPage from './pages/jl/cases/CasesPage.jsx';
import AddCasePage from './pages/jl/cases/AddCasePage.jsx';
import EditCasePage from './pages/jl/cases/EditCasePage.jsx';
import CaseDetailsPage from './pages/jl/cases/CaseDetailsPage.jsx';
import AccessRequestsPage from './pages/jl/AccessRequestsPage.jsx';
import CourtCalendarPage from './pages/jl/calendar/CourtCalendarPage.jsx';
import RemindersLayout from './pages/jl/reminders/RemindersLayout.jsx';
import RemindersPage from './pages/jl/reminders/RemindersPage.jsx';
import AddReminderPage from './pages/jl/reminders/AddReminderPage.jsx';
import EditReminderPage from './pages/jl/reminders/EditReminderPage.jsx';
import ActivityHistoryPage from './pages/jl/activity/ActivityHistoryPage.jsx';
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
          <Route path=":clientId" element={<ClientDetailsPage />} />
          <Route path=":clientId/edit" element={<EditClientPage />} />
        </Route>
        <Route path="cases" element={<CasesLayout />}>
          <Route index element={<CasesPage />} />
          <Route path="new" element={<AddCasePage />} />
          <Route path=":caseId" element={<CaseDetailsPage />} />
          <Route path=":caseId/edit" element={<EditCasePage />} />
        </Route>
        <Route path="calendar" element={<CourtCalendarPage />} />
        <Route path="reminders" element={<RemindersLayout />}>
          <Route index element={<RemindersPage />} />
          <Route path="new" element={<AddReminderPage />} />
          <Route path=":reminderId/edit" element={<EditReminderPage />} />
        </Route>
        <Route path="access-requests" element={<AccessRequestsPage />} />
        <Route path="activity" element={<ActivityHistoryPage />} />
        <Route path="settings" element={<ComingSoonPage title="Settings" />} />
        {/* Unknown URLs go back to the dashboard. */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
