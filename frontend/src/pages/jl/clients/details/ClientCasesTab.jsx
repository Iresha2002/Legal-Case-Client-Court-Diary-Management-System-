import { Link } from 'react-router-dom';
import { CalendarDays, Eye } from 'lucide-react';
import Badge from '../../../../components/ui/Badge.jsx';
import Card from '../../../../components/ui/Card.jsx';
import { formatDate } from '../../../../utils/format.js';

const STATUS_VARIANTS = { Ongoing: 'dark', Pending: 'muted', Closed: 'outline' };

const headerCell = 'px-4 py-3.5 text-left text-label font-semibold tracking-[0.06em] text-text-secondary';
const cell = 'px-4 py-3.5 text-body text-text-primary';

// Figma "JL 02.3 Client Details - Cases": the client's cases with their next hearing.
export default function ClientCasesTab({ cases }) {
  return (
    <Card title={`Cases (${cases.length})`}>
      {cases.length === 0 ? (
        <p className="text-body text-text-secondary">This client has no cases yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead className="bg-bg-page">
              <tr>
                <th scope="col" className={headerCell}>CASE NO.</th>
                <th scope="col" className={headerCell}>CASE TYPE</th>
                <th scope="col" className={headerCell}>COURT</th>
                <th scope="col" className={headerCell}>FILED DATE</th>
                <th scope="col" className={headerCell}>NEXT HEARING</th>
                <th scope="col" className={headerCell}>STATUS</th>
                <th scope="col" className={headerCell}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr key={item.id} className="border-b border-border-default">
                  <td className={cell}>{item.id}</td>
                  <td className={cell}>
                    <Badge>{item.type}</Badge>
                  </td>
                  <td className={cell}>{item.court}</td>
                  <td className={cell}>{formatDate(item.filedOn, { short: true })}</td>
                  <td className={cell}>
                    {item.nextHearing ? (
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} aria-hidden="true" />
                        {formatDate(item.nextHearing, { short: true })}
                      </span>
                    ) : (
                      <span className="text-text-secondary">—</span>
                    )}
                  </td>
                  <td className={cell}>
                    <Badge variant={STATUS_VARIANTS[item.status] ?? 'muted'}>{item.status}</Badge>
                  </td>
                  <td className={cell}>
                    <Link
                      to={`/cases/${item.id}`}
                      aria-label={`View case ${item.id}`}
                      className="inline-flex rounded-sm p-1.5 hover:bg-bg-page"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
