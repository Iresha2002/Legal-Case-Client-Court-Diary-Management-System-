import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import { logout } from '../api/auth.js';
import { clearSession } from '../auth/session.js';

// Names shown to the user for the roles the backend puts in the token.
const ROLE_LABELS = {
  ROLE_SENIOR_LAWYER: 'Senior Lawyer',
  ROLE_JUNIOR_LAWYER: 'Junior Lawyer',
  ROLE_CLERK: 'Clerk',
};

// Placeholder shown after login until the real dashboard is built.
export default function HomePage({ session, onLogout }) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout(session.token); // Never fails; see api/auth.js.
    clearSession();
    onLogout();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-page px-4 py-12">
      <div className="flex w-full max-w-[440px] flex-col gap-5 rounded-md border border-border-default bg-bg-surface p-6 shadow-raised sm:p-10">
        <p className="text-label font-semibold tracking-[0.06em] text-text-secondary">LEXIS DIARY</p>

        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-[36px] leading-[44px] font-bold text-text-primary">
            Welcome, {session.name}
          </h1>
          <p className="text-body text-text-secondary">
            Signed in as {ROLE_LABELS[session.role] ?? session.role}.
          </p>
        </div>

        <p className="rounded-sm border border-border-default bg-bg-page px-4 py-3 text-body text-text-primary">
          The dashboard is coming soon.
        </p>

        <Button type="button" variant="secondary" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? 'Logging out…' : 'Log out'}
        </Button>
      </div>
    </main>
  );
}
