import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, CalendarDays, FileText, Lock, Users } from 'lucide-react';
import Pagination from '../../../components/ui/Pagination.jsx';
import { activity } from '../../../mocks/mockActivity.js';
import { useCases } from '../../../state/casesContext.js';
import { formatDate, toDateValue } from '../../../utils/format.js';
import { ACTIVITY_ACTIONS } from './activityActions.js';

const PAGE_SIZE = 8;
const SUMMARY_DAYS = 30;

const headerCell = 'px-3 py-3 text-left text-body font-medium text-text-primary';
const cell = 'px-3 py-3.5 text-body';

// Figma summary card: an icon in a grey box, then label, number and "Last 30 days".
function SummaryCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-border-default bg-bg-surface p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-border-default bg-bg-page">
        <Icon size={22} aria-hidden="true" />
      </span>
      <div className="flex flex-col">
        <p className="text-body font-medium text-text-primary">{label}</p>
        <p className="text-[32px] leading-[40px] font-bold text-text-primary">{value}</p>
        <p className="text-caption text-text-secondary">Last {SUMMARY_DAYS} days</p>
      </div>
    </div>
  );
}

// The case or document column: an underlined link to the case (documents open their case).
function TargetLink({ target, openableCaseIds }) {
  if (!target) return <span className="text-text-secondary">-</span>;
  const Icon = target.kind === 'document' ? FileText : CalendarDays;
  const content = (
    <>
      <Icon size={16} className="shrink-0" aria-hidden="true" />
      <span className="truncate underline underline-offset-2">{target.label}</span>
    </>
  );
  if (!openableCaseIds.has(target.caseId)) {
    return <span className="flex items-center gap-2 text-text-primary">{content}</span>;
  }
  return (
    <Link
      to={`/cases/${target.caseId}`}
      title={target.kind === 'document' ? `Open case ${target.caseId}` : undefined}
      className="flex items-center gap-2 text-text-primary hover:text-text-secondary"
    >
      {content}
    </Link>
  );
}

// Figma "JL 07 My Activity History": counts for the last 30 days, then every activity,
// newest first (click Date & Time to switch the order), 8 per page.
export default function ActivityHistoryPage() {
  const { cases } = useCases();
  const [newestFirst, setNewestFirst] = useState(true);
  const [page, setPage] = useState(1);

  const since = new Date();
  since.setDate(since.getDate() - SUMMARY_DAYS);
  const recent = activity.filter((item) => item.date >= toDateValue(since));
  const countGroup = (group) => recent.filter((item) => ACTIVITY_ACTIONS[item.action]?.group === group).length;

  const sorted = [...activity].sort((a, b) => {
    const order = `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
    return newestFirst ? -order : order;
  });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = sorted.slice(start, start + PAGE_SIZE);

  const openableCaseIds = new Set(cases.filter((c) => c.assignedToMe).map((c) => c.id));
  const SortIcon = newestFirst ? ArrowDown : ArrowUp;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Activity &amp; Access History</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="My Activities" value={recent.length} icon={FileText} />
        <SummaryCard label="Access Granted" value={countGroup('access')} icon={Users} />
        <SummaryCard label="Document Actions" value={countGroup('document')} icon={FileText} />
        <SummaryCard label="Login History" value={countGroup('login')} icon={Lock} />
      </div>

      <section className="flex flex-col gap-4 rounded-md border border-border-default bg-bg-surface p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] table-fixed border-collapse">
            <thead className="bg-bg-page">
              <tr>
                <th scope="col" className={`${headerCell} w-[20%]`} aria-sort={newestFirst ? 'descending' : 'ascending'}>
                  <button
                    type="button"
                    onClick={() => {
                      setNewestFirst((value) => !value);
                      setPage(1);
                    }}
                    className="flex items-center gap-2 hover:underline"
                  >
                    Date &amp; Time
                    <SortIcon size={14} aria-hidden="true" />
                    <span className="sr-only">{newestFirst ? '(newest first)' : '(oldest first)'}</span>
                  </button>
                </th>
                <th scope="col" className={`${headerCell} w-[25%]`}>Action</th>
                <th scope="col" className={`${headerCell} w-[30%]`}>Details</th>
                <th scope="col" className={`${headerCell} w-[25%]`}>Case / Document</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const action = ACTIVITY_ACTIONS[item.action] ?? { label: item.action, icon: FileText };
                const ActionIcon = action.icon;
                return (
                  <tr key={item.id} className="border-b border-border-default">
                    <td className={`${cell} text-text-secondary`}>
                      {formatDate(item.date, { short: true })}, {item.time}
                    </td>
                    <td className={`${cell} text-text-primary`}>
                      <span className="flex items-center gap-3 font-medium">
                        <ActionIcon size={18} className="shrink-0" aria-hidden="true" />
                        {action.label}
                      </span>
                    </td>
                    <td className={`${cell} text-text-secondary`}>{item.details}</td>
                    <td className={cell}>
                      <TargetLink target={item.target} openableCaseIds={openableCaseIds} />
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center text-body text-text-secondary">
                    No activity yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-2">
          <p className="text-body text-text-secondary">
            {sorted.length === 0
              ? 'Showing 0 records'
              : `Showing ${start + 1} to ${start + rows.length} of ${sorted.length} records`}
          </p>
          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>
    </div>
  );
}
