import { useNavigate, useOutletContext } from 'react-router-dom';
import Breadcrumb from '../../../components/ui/Breadcrumb.jsx';
import ClientForm from './ClientForm.jsx';

// Figma "JL 02.1 Add Client".
export default function AddClientPage() {
  const { addClient } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    addClient(values);
    navigate('/clients');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: 'Clients', to: '/clients' }, { label: 'Add Client' }]} />
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Add Client</h1>
      </div>
      <ClientForm submitLabel="Save Client" onSubmit={handleSubmit} onCancel={() => navigate('/clients')} />
    </div>
  );
}
