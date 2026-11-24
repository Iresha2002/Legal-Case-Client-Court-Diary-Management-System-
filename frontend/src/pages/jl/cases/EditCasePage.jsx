import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/ui/Breadcrumb.jsx';
import CaseForm from './CaseForm.jsx';

function Message({ title, text }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">{title}</h1>
      <p className="text-body text-text-secondary">{text}</p>
      <Link to="/cases" className="text-body font-medium text-text-primary hover:underline">
        Back to Cases
      </Link>
    </div>
  );
}

// Figma "JL 03.30 Edit Case": the Add New Case form, filled in with the case's details.
// Only cases assigned to the user can be edited.
export default function EditCasePage() {
  const { caseId } = useParams();
  const { cases, updateCase } = useOutletContext();
  const navigate = useNavigate();

  const item = cases.find((c) => c.id === caseId);
  if (!item) return <Message title="Case not found" text="This case does not exist or has been removed." />;
  if (!item.assignedToMe) {
    return <Message title="Access restricted" text="You can edit only the cases assigned to you." />;
  }

  const handleSubmit = (values) => {
    updateCase(item.id, values);
    // Case Details (Figma 03.31) is built in the next step; go back to the list until then.
    navigate('/cases');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb backTo="/cases" items={[{ label: 'Cases', to: '/cases' }, { label: 'Edit Case' }]} />
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Edit Case</h1>
      </div>
      <CaseForm
        initialValues={item}
        takenIds={cases.filter((c) => c.id !== item.id).map((c) => c.id)}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/cases')}
      />
    </div>
  );
}
