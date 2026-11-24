import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import ReminderForm from './ReminderForm.jsx';
import { ReminderPageHeader } from './AddReminderPage.jsx';

// "Edit Reminder": the Add Reminder form (Figma 05.1), filled in with the reminder's details.
export default function EditReminderPage() {
  const { reminderId } = useParams();
  const { reminders, updateReminder } = useOutletContext();
  const navigate = useNavigate();
  const back = () => navigate('/reminders');

  const reminder = reminders.find((r) => String(r.id) === reminderId);
  if (!reminder) {
    return (
      <div className="flex flex-col items-start gap-3">
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Reminder not found</h1>
        <p className="text-body text-text-secondary">This reminder does not exist or has been deleted.</p>
        <Link to="/reminders" className="text-body font-medium text-text-primary hover:underline">
          Back to Reminders
        </Link>
      </div>
    );
  }

  const handleSubmit = (values) => {
    updateReminder(reminder.id, values);
    navigate('/reminders', { state: { message: 'Reminder updated' } });
  };

  return (
    <div className="flex flex-col gap-6">
      <ReminderPageHeader title="Edit Reminder" onBack={back} />
      <ReminderForm initialValues={reminder} submitLabel="Save Changes" onSubmit={handleSubmit} onCancel={back} />
    </div>
  );
}
