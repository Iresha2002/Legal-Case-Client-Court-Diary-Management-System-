import { useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { Activity, BriefcaseBusiness, Check, Clock, Eye, Lock } from 'lucide-react';
import ActionMenu from '../../../components/ui/ActionMenu.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Pagination from '../../../components/ui/Pagination.jsx';
import StatCard from '../../../components/ui/StatCard.jsx';
import { CASE_TYPES, STATUS_VARIANTS } from './caseOptions.js';

const PAGE_SIZE = 8;

const headerCell = 'px-4 py-3.5 text-left text-label font-semibold tracking-[0.06em] text-text-secondary';

function countByStatus(list, status) {
  return list.filter((item) => item.status === status).length;
}

// Figma "JL 03 Cases" and "JL 03.20 - 03.24 Cases - Filtered by Type".
// All cases are listed, but only the ones assigned to the user can be opened;
// the others show as Restricted with a "Request Access" action.
// ?type=civil shows only the user's cases of that type.
export default function CasesPage() {
  const { cases: allCases } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const typeKey = searchParams.get('type');
  const typeLabel = CASE_TYPES[typeKey]; // undefined when there is no (valid) filter

  const rows = typeLabel ? allCases.filter((c) => c.assignedToMe && c.type === typeLabel) : allCases;

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);

  const total = allCases.length;
  const ongoing = countByStatus(allCases, 'Ongoing');

  const clearFilter = () => {
    setPage(1);
    setSearchParams({});
  };

  const summary = typeLabel
    ? `Showing ${rows.length} of ${rows.length} ${typeLabel} cases assigned to you.`
    : `Showing ${rows.length === 0 ? 0 : start + 1}-${start + pageRows.length} of ${rows.length} cases. You can open only the cases assigned to you.`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Case Management</h1>
        <Button type="button" fullWidth={false} onClick={() => navigate('/cases/new')}>
          + Add New Case
        </Button>
      </div>

      {typeLabel && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border-default bg-bg-surface px-4 py-3">
          <p className="flex items-center gap-3 text-body text-text-secondary">
            Case type <Badge variant="dark">{typeLabel}</Badge>
          </p>
          <Button type="button" variant="secondary" fullWidth={false} onClick={clearFilter}>
            Clear Filter
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Cases" value={total} note="All legal matters" icon={BriefcaseBusiness} />
        <StatCard
          label="Ongoing"
          value={ongoing}
          note={`${total ? Math.round((ongoing / total) * 100) : 0}% of total`}
          icon={Activity}
        />
        <StatCard label="Pending" value={countByStatus(allCases, 'Pending')} note="Awaiting action" icon={Clock} />
        <StatCard label="Closed" value={countByStatus(allCases, 'Closed')} note="Completed matters" icon={Check} />
      </div>

      <div className="overflow-hidden rounded-md border border-border-default bg-bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead className="border-b border-border-default bg-bg-page">
              <tr>
                <th scope="col" className={`${headerCell} pl-5`}>CASE NO.</th>
                <th scope="col" className={headerCell}>CLIENT NAME</th>
                <th scope="col" className={headerCell}>CASE TYPE</th>
                <th scope="col" className={headerCell}>ASSIGNED LAWYER</th>
                <th scope="col" className={headerCell}>STATUS</th>
                <th scope="col" className={headerCell}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((item) => {
                const open = item.assignedToMe;
                const text = open ? 'text-text-primary' : 'text-text-secondary';
                return (
                  <tr key={item.id} className="border-b border-border-default last:border-b-0">
                    <td className={`py-3.5 pr-4 pl-5 text-body ${open ? 'font-medium' : ''} ${text}`}>{item.id}</td>
                    <td className={`px-4 py-3.5 text-body ${text}`}>
                      {open ? (
                        item.clientName
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock size={14} aria-hidden="true" />
                          Restricted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge>{item.type}</Badge>
                    </td>
                    <td className={`px-4 py-3.5 text-body ${text}`}>{item.lawyer}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={STATUS_VARIANTS[item.status] ?? 'muted'}>{item.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <ActionMenu
                        label={`Actions for ${item.id}`}
                        items={
                          open
                            ? [{ label: 'View Case', icon: Eye, onSelect: () => navigate(`/cases/${item.id}`) }]
                            : [
                                {
                                  label: 'Request Access',
                                  icon: Lock,
                                  // The request form (Figma 03.5) comes with the Access Requests screens.
                                  onSelect: () => navigate('/access-requests'),
                                },
                              ]
                        }
                      />
                    </td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-body text-text-secondary">
                    {typeLabel ? `You have no ${typeLabel} cases.` : 'No cases yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-default px-5 py-4">
          <p className="text-body text-text-secondary">{summary}</p>
          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
