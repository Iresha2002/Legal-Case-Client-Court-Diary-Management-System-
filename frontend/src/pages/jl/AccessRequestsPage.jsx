import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Toast from '../../components/ui/Toast.jsx';
import { REQUEST_STATUS_VARIANTS, useAccessRequests } from '../../state/accessRequestsContext.js';
import { formatDate } from '../../utils/format.js';

const headerCell = 'px-4 py-3.5 text-left text-label font-semibold tracking-[0.06em] text-text-secondary';
const cell = 'px-4 py-3.5 text-body text-text-primary';

function byNewest(list) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
}

function Table({ headers, children, empty }) {
  return (
    <div className="overflow-hidden rounded-md border border-border-default bg-bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead className="border-b border-border-default bg-bg-page">
            <tr>
              {headers.map((header, index) => (
                <th key={header} scope="col" className={`${headerCell} ${index === 0 ? 'pl-5' : ''}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children}
            {empty && (
              <tr>
                <td colSpan={headers.length} className="px-5 py-10 text-center text-body text-text-secondary">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Figma "JL 06 Access Requests": Incoming (others asking for the user's cases, with Approve / Reject)
// and My Requests (the user's own requests). The open tab is kept in the URL (?tab=mine).
// The tab counts show the requests that are still pending.
export default function AccessRequestsPage() {
  const { incoming, mine, decideRequest } = useAccessRequests();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState(null);
  const toastCount = useRef(0); // gives each message a new key, so its timer starts again

  const activeTab = searchParams.get('tab') === 'mine' ? 'mine' : 'incoming';
  const pending = (list) => list.filter((r) => r.status === 'Pending').length;

  const tabs = [
    { id: 'incoming', label: `Incoming (${pending(incoming)})` },
    { id: 'mine', label: `My Requests (${pending(mine)})` },
  ];

  const decide = (request, status) => {
    decideRequest(request.id, status);
    toastCount.current += 1;
    setToast({ id: toastCount.current, text: `Request from ${request.requestedBy} ${status.toLowerCase()}` });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Access Requests</h1>

      <div
        role="tablist"
        aria-label="Access request lists"
        className="grid grid-cols-2 rounded-md border border-border-default bg-bg-surface"
      >
        {tabs.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="requests-panel"
              onClick={() => setSearchParams(tab.id === 'mine' ? { tab: 'mine' } : {}, { replace: true })}
              className={`border-b-2 px-4 py-3.5 text-body transition-colors ${
                selected
                  ? 'border-action-primary font-medium text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="requests-panel" aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'incoming' ? (
          <Table
            headers={['REQUESTED BY', 'ROLE', 'REQUEST', 'CASE', 'DATE', 'STATUS', 'ACTION']}
            empty={incoming.length === 0 ? 'No one has asked for access to your cases.' : null}
          >
            {byNewest(incoming).map((request) => (
              <tr key={request.id} className="border-b border-border-default last:border-b-0">
                <td className={`${cell} pl-5 font-medium`}>{request.requestedBy}</td>
                <td className={cell}>{request.role}</td>
                <td className={cell}>{request.access}</td>
                <td className={cell}>{request.caseId}</td>
                <td className={cell}>{formatDate(request.date, { short: true })}</td>
                <td className={cell}>
                  <Badge variant={REQUEST_STATUS_VARIANTS[request.status]}>{request.status}</Badge>
                </td>
                <td className={cell}>
                  {request.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <Button type="button" fullWidth={false} onClick={() => decide(request, 'Approved')}>
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        fullWidth={false}
                        onClick={() => decide(request, 'Rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-text-secondary">-</span>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Table
            headers={['CASE', 'ASSIGNED TO', 'REQUEST', 'DATE', 'STATUS']}
            empty={mine.length === 0 ? 'You have not sent any access requests.' : null}
          >
            {byNewest(mine).map((request) => (
              <tr key={request.id} className="border-b border-border-default last:border-b-0">
                <td className={`${cell} pl-5 font-medium`}>{request.caseId}</td>
                <td className={cell}>{request.assignedTo}</td>
                <td className={cell}>{request.access}</td>
                <td className={cell}>{formatDate(request.date, { short: true })}</td>
                <td className={cell}>
                  <Badge variant={REQUEST_STATUS_VARIANTS[request.status]}>{request.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {toast && <Toast key={toast.id} message={toast.text} onDone={() => setToast(null)} />}
    </div>
  );
}
