import { useNavigate, useOutletContext } from 'react-router-dom';
import Breadcrumb from '../../../components/ui/Breadcrumb.jsx';
import CaseForm from './CaseForm.jsx';

// Figma "JL 03.1 Add New Case".
export default function AddCasePage() {
  const { cases, addCase } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    addCase(values);
    navigate('/cases');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb backTo="/cases" items={[{ label: 'Cases', to: '/cases' }, { label: 'Add New Case' }]} />
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Add New Case</h1>
      </div>
      <CaseForm
        takenIds={cases.map((item) => item.id)}
        submitLabel="Create Case"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/cases')}
      />
    </div>
  );
}
