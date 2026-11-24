import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/ui/Breadcrumb.jsx';
import CaseForm from './CaseForm.jsx';
import CaseMessage from './CaseMessage.jsx';

// Figma "JL 03.30 Edit Case": the Add New Case form, filled in with the case's details.
// Only cases assigned to the user can be edited. Saving opens the updated Case Details (Figma 03.31).
export default function EditCasePage() {
  const { caseId } = useParams();
  const { cases, updateCase } = useOutletContext();
  const navigate = useNavigate();

  const item = cases.find((c) => c.id === caseId);
  if (!item) return <CaseMessage title="Case not found" text="This case does not exist or has been removed." />;
  if (!item.assignedToMe) {
    return <CaseMessage title="Access restricted" text="You can edit only the cases assigned to you." />;
  }

  const detailsPath = `/cases/${item.id}`;

  const handleSubmit = (values) => {
    updateCase(item.id, values);
    navigate(`/cases/${values.id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          backTo={detailsPath}
          items={[
            { label: 'Cases', to: '/cases' },
            { label: item.id, to: detailsPath },
            { label: 'Edit Case' },
          ]}
        />
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Edit Case</h1>
      </div>
      <CaseForm
        initialValues={item}
        takenIds={cases.filter((c) => c.id !== item.id).map((c) => c.id)}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate(detailsPath)}
      />
    </div>
  );
}
