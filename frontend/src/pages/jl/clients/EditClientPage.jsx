import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/ui/Breadcrumb.jsx';
import ClientForm from './ClientForm.jsx';
import ClientNotFound from './ClientNotFound.jsx';

// Figma "JL 02.5 Edit Client": the Add Client form, filled in with the client's details.
export default function EditClientPage() {
  const { clientId } = useParams();
  const { clients, updateClient } = useOutletContext();
  const navigate = useNavigate();

  const client = clients.find((c) => String(c.id) === clientId);
  if (!client) return <ClientNotFound />;

  const detailsPath = `/clients/${client.id}`;

  const handleSubmit = (values) => {
    updateClient(client.id, values);
    navigate(detailsPath);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: 'Clients', to: '/clients' },
            { label: client.name, to: detailsPath },
            { label: 'Edit Client' },
          ]}
        />
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Edit Client</h1>
      </div>
      <ClientForm
        initialValues={{ ...client, fullName: client.name }}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate(detailsPath)}
      />
    </div>
  );
}
