import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, CalendarDays, Bell, ShieldCheck, History } from 'lucide-react';
import scaleIcon from '../assets/icons/scale.svg';

// Junior Lawyer menu, in the same order as the Figma sidebar.
const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/cases', label: 'Cases', icon: Briefcase },
  { to: '/calendar', label: 'Court Calendar', icon: CalendarDays },
  { to: '/reminders', label: 'Reminders', icon: Bell },
  { to: '/access-requests', label: 'Access Requests', icon: ShieldCheck },
  { to: '/activity', label: 'Activity History', icon: History },
];

export default function Sidebar() {
  return (
    // sticky + h-screen keeps the sidebar in place while the page scrolls. Hidden when printing.
    <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col justify-between overflow-y-auto bg-bg-sidebar px-4 py-8 print:hidden">
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-3 px-3">
          <img src={scaleIcon} alt="" width="32" height="32" />
          <div>
            {/* text-white, not text-inverse: the sidebar is dark in both themes. */}
            <p className="font-serif text-logo font-semibold tracking-[0.06em] text-white">LEXIS DIARY</p>
            <p className="text-caption text-text-sidebar">Secure Legal Case &amp; Court Diary Management System</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3 py-3 text-body ${
                  isActive ? 'bg-neutral-800 text-white' : 'text-text-sidebar hover:bg-neutral-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <p className="text-center text-caption text-text-sidebar">Justice. Organized. Secure.</p>
    </aside>
  );
}
