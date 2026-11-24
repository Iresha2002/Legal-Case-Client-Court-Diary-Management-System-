import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../../../components/ui/Button.jsx';
import ReminderForm from './ReminderForm.jsx';

// Page header used by Add Reminder and Edit Reminder: a Back button and the title (Figma 05.1).
export function ReminderPageHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-4">
      <Button type="button" variant="secondary" fullWidth={false} onClick={onBack}>
        Back
      </Button>
      <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">{title}</h1>
    </div>
  );
}

// Figma "JL 05.1 Add Reminder".
export default function AddReminderPage() {
  const { addReminder } = useOutletContext();
  const navigate = useNavigate();
  const back = () => navigate('/reminders');

  const handleSubmit = (values) => {
    addReminder(values);
    navigate('/reminders', { state: { message: 'Reminder added' } });
  };

  return (
    <div className="flex flex-col gap-6">
      <ReminderPageHeader title="Add Reminder" onBack={back} />
      <ReminderForm submitLabel="Save Reminder" onSubmit={handleSubmit} onCancel={back} />
    </div>
  );
}
