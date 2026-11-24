import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  Gavel,
  Scale,
  Users,
} from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import CasesOverview from '../../components/dashboard/CasesOverview.jsx';
import RecentActivity from '../../components/dashboard/RecentActivity.jsx';
import MiniCalendar from '../../components/dashboard/MiniCalendar.jsx';
import { casesByStatus, casesByType, hearingDates, recentActivity, summary } from '../../mocks/mockDashboard.js';

// Icons for each case type, as in the Figma "Cases by Type" card.
const TYPE_ICONS = {
  civil: Scale,
  criminal: Gavel,
  family: Users,
  land: FileText,
  administrative: Building2,
};

// "Tuesday, 22 September 2026"
function formatToday() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function CaseTypeCard({ type, label, count }) {
  const Icon = TYPE_ICONS[type];
  return (
    <Link
      to={`/cases?type=${type}`}
      className="group flex flex-col gap-4 rounded-sm border border-border-default bg-bg-surface p-4 transition-colors hover:bg-border-default"
    >
      <span className="flex items-center gap-2 text-body font-medium text-text-primary">
        {Icon && <Icon size={18} aria-hidden="true" />}
        {label}
      </span>
      <span className="flex items-end justify-between gap-2">
        <span className="flex flex-col">
          <span className="text-[32px] leading-[40px] font-bold text-text-primary">{count}</span>
          <span className="text-caption text-text-secondary">{count === 1 ? 'case' : 'cases'}</span>
        </span>
        <span className="mb-3 flex size-[30px] items-center justify-center rounded-full border border-border-default bg-bg-surface">
          <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

// Figma "JL 01 Dashboard". Uses sample data from mocks/mockDashboard.js for now.
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Dashboard</h1>
        <p className="flex items-center gap-2 rounded-sm border border-border-default bg-bg-surface px-4 py-3 text-body font-medium text-text-primary">
          <CalendarDays size={20} aria-hidden="true" />
          {formatToday()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Cases" value={summary.totalCases} note="Assigned to you" icon={BriefcaseBusiness} />
        <StatCard label="Total Clients" value={summary.totalClients} note="Across your cases" icon={Users} />
        <StatCard
          label="Upcoming Hearings"
          value={summary.upcomingHearings}
          note={`${summary.hearingsToday} scheduled today`}
          icon={CalendarDays}
        />
        <StatCard
          label="Open Reminders"
          value={summary.openReminders}
          note={`${summary.overdueReminders} overdue`}
          icon={Bell}
        />
      </div>

      <Card title="Cases by Type">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {casesByType.map((item) => (
            <CaseTypeCard key={item.type} {...item} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-[304fr_452fr_388fr]">
        <Card title="Cases Overview">
          <CasesOverview items={casesByStatus} />
        </Card>
        <Card title="Recent Activity">
          <RecentActivity items={recentActivity} />
        </Card>
        <Card
          title="Court Calendar"
          action={
            <Link to="/calendar" className="text-caption font-medium text-text-primary hover:underline">
              Full calendar
            </Link>
          }
        >
          <MiniCalendar markedDates={hearingDates} />
        </Card>
      </div>
    </div>
  );
}
