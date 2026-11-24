import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Eye, Pencil } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Checkbox from '../../../components/ui/Checkbox.jsx';
import Pagination from '../../../components/ui/Pagination.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { initials } from '../../../utils/format.js';

const PAGE_SIZE = 6;

const headerCell = 'px-4 py-4 text-left text-label font-semibold tracking-[0.06em] text-text-secondary';
const iconLink = 'rounded-sm p-1.5 text-text-primary transition-colors hover:bg-bg-page';

// Figma "JL 02 Clients": table of clients with selection, status, view/edit actions and pagination.
export default function ClientsPage() {
  const { clients } = useOutletContext();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());

  const pageCount = Math.max(1, Math.ceil(clients.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = clients.slice(start, start + PAGE_SIZE);

  const allSelected = rows.length > 0 && rows.every((client) => selected.has(client.id));

  const setRowsSelected = (ids, checked) =>
    setSelected((previous) => {
      const next = new Set(previous);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Clients</h1>
        <Button type="button" fullWidth={false} onClick={() => navigate('/clients/new')}>
          + Add Client
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-border-default bg-bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="border-b border-border-default bg-bg-page">
              <tr>
                <th scope="col" className="w-14 py-4 pl-5">
                  <Checkbox
                    checked={allSelected}
                    onChange={(checked) => setRowsSelected(rows.map((client) => client.id), checked)}
                    aria-label="Select all clients on this page"
                  />
                </th>
                <th scope="col" className={headerCell}>
                  CLIENT
                </th>
                <th scope="col" className={`${headerCell} w-[25%]`}>
                  STATUS
                </th>
                <th scope="col" className={`${headerCell} w-[160px]`}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((client) => (
                <tr key={client.id} className="border-b border-border-default last:border-b-0">
                  <td className="py-5 pl-5">
                    <Checkbox
                      checked={selected.has(client.id)}
                      onChange={(checked) => setRowsSelected([client.id], checked)}
                      aria-label={`Select ${client.name}`}
                    />
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-border-default text-body font-medium text-text-primary">
                        {initials(client.name)}
                      </span>
                      <span className="text-body font-medium text-text-primary">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <Badge variant={client.status === 'Active' ? 'dark' : 'muted'}>{client.status}</Badge>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <Link to={`/clients/${client.id}`} aria-label={`View ${client.name}`} className={iconLink}>
                        <Eye size={18} />
                      </Link>
                      <Link to={`/clients/${client.id}/edit`} aria-label={`Edit ${client.name}`} className={iconLink}>
                        <Pencil size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-body text-text-secondary">
                    No clients yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-default px-5 py-4">
          <p className="text-body text-text-secondary">
            {clients.length === 0
              ? 'Showing 0 clients'
              : `Showing ${start + 1}-${start + rows.length} of ${clients.length} clients`}
          </p>
          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
