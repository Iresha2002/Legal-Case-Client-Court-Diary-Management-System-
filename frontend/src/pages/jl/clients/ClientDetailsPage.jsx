import { useState } from 'react';
import { useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { Pencil, Printer } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Breadcrumb from '../../../components/ui/Breadcrumb.jsx';
import Button from '../../../components/ui/Button.jsx';
import { clientCases, clientDocuments } from '../../../mocks/mockClients.js';
import { initials } from '../../../utils/format.js';
import ClientNotFound from './ClientNotFound.jsx';
import ClientInfoTab from './details/ClientInfoTab.jsx';
import ClientCasesTab from './details/ClientCasesTab.jsx';
import ClientDocumentsTab from './details/ClientDocumentsTab.jsx';

const TAB_IDS = ['info', 'cases', 'documents'];

// Figma "JL 02.2 - 02.4 Client Details": client header, then Information / Cases / Documents tabs.
// The open tab is kept in the URL (?tab=cases) so it survives a reload and can be linked to.
export default function ClientDetailsPage() {
  const { clientId } = useParams();
  const { clients } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState(() => clientDocuments[clientId] ?? []);

  const client = clients.find((c) => String(c.id) === clientId);
  if (!client) return <ClientNotFound />;

  const cases = clientCases[clientId] ?? [];
  const activeTab = TAB_IDS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'info';

  const tabs = [
    { id: 'info', label: 'Client Information' },
    { id: 'cases', label: `Cases (${cases.length})` },
    { id: 'documents', label: `Documents (${documents.length})` },
  ];

  const handleDeleteDocument = (doc) => {
    // Until the backend exists, this only removes the document from this page.
    if (window.confirm(`Delete "${doc.name}"? This cannot be undone.`)) {
      setDocuments((list) => list.filter((d) => d.id !== doc.id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb backTo="/clients" items={[{ label: 'Clients', to: '/clients' }, { label: 'Client Details' }]} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[32px] leading-[40px] font-bold text-text-primary">Client Details</h1>
          <div className="flex gap-3 print:hidden">
            <Button type="button" variant="secondary" fullWidth={false} onClick={() => window.print()}>
              <Printer size={18} aria-hidden="true" />
              Print
            </Button>
            <Button type="button" fullWidth={false} onClick={() => navigate(`/clients/${client.id}/edit`)}>
              <Pencil size={18} aria-hidden="true" />
              Edit Client
            </Button>
          </div>
        </div>
      </div>

      <section className="flex items-center gap-6 rounded-md border border-border-default bg-bg-surface px-8 py-8">
        <span className="flex size-[90px] shrink-0 items-center justify-center rounded-full bg-action-primary text-[28px] font-bold text-text-inverse">
          {initials(client.name)}
        </span>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[28px] leading-[36px] font-bold text-text-primary">{client.name}</h2>
            <Badge variant={client.status === 'Active' ? 'dark' : 'muted'}>{client.status}</Badge>
          </div>
          {client.email && <p className="text-body text-text-secondary">{client.email}</p>}
        </div>
      </section>

      <div role="tablist" aria-label="Client sections" className="grid grid-cols-3 border-b border-border-default print:hidden">
        {tabs.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="client-tab-panel"
              onClick={() => setSearchParams({ tab: tab.id }, { replace: true })}
              className={`-mb-px border-b-2 px-4 py-4 text-body transition-colors ${
                selected
                  ? 'border-action-primary font-semibold text-text-primary'
                  : 'border-transparent font-medium text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="client-tab-panel" aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'info' && <ClientInfoTab client={client} />}
        {activeTab === 'cases' && <ClientCasesTab cases={cases} />}
        {activeTab === 'documents' && <ClientDocumentsTab documents={documents} onDelete={handleDeleteDocument} />}
      </div>
    </div>
  );
}
