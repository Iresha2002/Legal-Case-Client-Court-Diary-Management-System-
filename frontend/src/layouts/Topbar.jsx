import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Search, Settings, UserRound } from 'lucide-react';
import { logout } from '../api/auth.js';
import { clearSession } from '../auth/session.js';
import { initials } from '../utils/format.js';

// Names shown to the user for the roles the backend puts in the token.
const ROLE_LABELS = {
  ROLE_SENIOR_LAWYER: 'Senior Lawyer',
  ROLE_JUNIOR_LAWYER: 'Junior Lawyer',
  ROLE_CLERK: 'Clerk',
};

const menuItemClass =
  'flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-body text-text-primary hover:bg-bg-page disabled:opacity-60';

// Figma "Profile Dropdown": avatar + name + role; opens My Account, Settings and Log Out.
function ProfileMenu({ session, onLogout }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close the menu when the user clicks outside it or presses Escape.
  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout(session.token); // Never fails; see api/auth.js.
    clearSession();
    onLogout();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-3 rounded-sm px-1 py-1 hover:bg-bg-page"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-action-primary text-caption font-semibold text-text-inverse">
          {initials(session.name)}
        </span>
        <span className="hidden flex-col text-left sm:flex">
          <span className="text-body font-medium text-text-primary">{session.name}</span>
          <span className="text-caption text-text-secondary">{ROLE_LABELS[session.role] ?? session.role}</span>
        </span>
        <ChevronDown size={18} className={`text-text-primary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-[220px] rounded-md border border-border-default bg-bg-surface p-2 shadow-raised"
        >
          {/* Figma has no separate account screen: My Account opens the Account tab of Settings. */}
          <button type="button" role="menuitem" className={menuItemClass} onClick={() => goTo('/settings?tab=account')}>
            <UserRound size={18} />
            My Account
          </button>
          <button type="button" role="menuitem" className={menuItemClass} onClick={() => goTo('/settings')}>
            <Settings size={18} />
            Settings
          </button>

          <div className="my-2 h-px bg-border-default" />

          <button type="button" role="menuitem" className={menuItemClass} onClick={handleLogout} disabled={loggingOut}>
            <LogOut size={18} />
            {loggingOut ? 'Logging out…' : 'Log Out'}
          </button>
        </div>
      )}
    </div>
  );
}

// Top bar: search, notifications and the profile menu.
export default function Topbar({ session, onLogout }) {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-border-default bg-bg-surface px-8 py-3 print:hidden">
      <label className="flex w-full max-w-[460px] items-center gap-3 rounded-full border border-border-default bg-bg-page px-4 py-2.5">
        <Search size={18} className="text-text-secondary" />
        <input
          type="search"
          placeholder="Search cases, clients, hearings, documents..."
          className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-text-secondary"
        />
      </label>

      <div className="flex items-center gap-5">
        <button type="button" aria-label="Notifications" className="text-text-primary">
          <Bell size={20} />
        </button>
        <ProfileMenu session={session} onLogout={onLogout} />
      </div>
    </header>
  );
}
