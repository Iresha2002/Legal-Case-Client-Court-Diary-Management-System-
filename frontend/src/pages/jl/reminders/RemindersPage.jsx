import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { CircleCheck, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import ActionMenu from '../../../components/ui/ActionMenu.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import Toast from '../../../components/ui/Toast.jsx';
import { useCases } from '../../../state/casesContext.js';
import { formatDate, formatTime } from '../../../utils/format.js';
import { REMINDER_STATUS_VARIANTS, reminderStatus } from './reminderOptions.js';

const headerCell = 'px-3 py-3 text-left text-label font-semibold tracking-[0.06em] text-text-secondary';
const cell = 'px-3 py-3.5 text-body text-text-primary';

function sortKey(reminder) {
  return `${reminder.date} ${reminder.time}`;
}

function ReminderTable({ title, rows, myCaseIds, emptyText, actionsFor }) {
  return (
    <section className="flex flex-col gap-4 rounded-md border border-border-default bg-bg-surface p-5">
      <h2 className="text-[18px] leading-[26px] font-semibold text-text-primary">
        {title} ({rows.length})
      </h2>
      {rows.length === 0 ? (
        <p className="text-body text-text-secondary">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          {/* Fixed column widths, so the Upcoming and Completed tables line up like in Figma. */}
          <table className="w-full min-w-[880px] table-fixed border-collapse">
            <thead className="bg-bg-page">
              <tr>
                <th scope="col" className={`${headerCell} w-[18%]`}>DATE &amp; TIME</th>
                <th scope="col" className={`${headerCell} w-[13%]`}>TYPE</th>
                <th scope="col" className={`${headerCell} w-[22%]`}>TITLE</th>
                <th scope="col" className={`${headerCell} w-[13%]`}>RELATED CASE</th>
                <th scope="col" className={`${headerCell} w-[15%]`}>CLIENT</th>
                <th scope="col" className={`${headerCell} w-[11%]`}>STATUS</th>
                <th scope="col" className={`${headerCell} w-[8%]`}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ reminder, status }) => (
                <tr key={reminder.id} className="border-b border-border-default">
                  <td className={`${cell} whitespace-nowrap`}>
                    {formatDate(reminder.date, { short: true })}, {formatTime(reminder.time)}
                  </td>
                  <td className={cell}>
                    <Badge>{reminder.type}</Badge>
                  </td>
                  <td className={cell}>{reminder.title}</td>
                  <td className={cell}>
                    {!reminder.caseId && <span className="text-text-secondary">-</span>}
                    {reminder.caseId && myCaseIds.has(reminder.caseId) && (
                      <Link to={`/cases/${reminder.caseId}`} className="hover:underline">
                        {reminder.caseId}
                      </Link>
                    )}
                    {reminder.caseId && !myCaseIds.has(reminder.caseId) && reminder.caseId}
                  </td>
                  <td className={cell}>
                    {reminder.clientName || <span className="text-text-secondary">-</span>}
                  </td>
                  <td className={cell}>
                    <Badge variant={REMINDER_STATUS_VARIANTS[status]}>{status}</Badge>
                  </td>
                  <td className={cell}>
                    <ActionMenu label={`Actions for ${reminder.title}`} items={actionsFor(reminder)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// Figma "JL 05 Reminders": open reminders (soonest first, overdue ones last) and completed ones
// (latest first). An open reminder whose time has passed shows as Overdue.
// Each row has a ⋮ menu, like the Cases table: complete or reopen, edit, and delete (with a
// confirmation like the diary note delete).
export default function RemindersPage() {
  const { reminders, completeReminder, reopenReminder, deleteReminder } = useOutletContext();
  const { cases } = useCases();
  const navigate = useNavigate();
  const location = useLocation();
  const [deleting, setDeleting] = useState(null); // reminder in the delete dialog
  const toastCount = useRef(0);
  // A message passed from Add / Edit Reminder, e.g. "Reminder added".
  const [toast, setToast] = useState(() => (location.state?.message ? { id: 0, text: location.state.message } : null));

  // Clear the message from the browser history, so going back or reloading does not show it again.
  useEffect(() => {
    if (location.state?.message) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const showToast = (text) => {
    toastCount.current += 1;
    setToast({ id: toastCount.current, text });
  };

  const now = new Date();
  const withStatus = reminders.map((reminder) => ({ reminder, status: reminderStatus(reminder, now) }));
  const byTime = (a, b) => sortKey(a.reminder).localeCompare(sortKey(b.reminder));

  const open = withStatus.filter((r) => r.status !== 'Completed');
  const upcoming = [
    ...open.filter((r) => r.status !== 'Overdue').sort(byTime),
    ...open.filter((r) => r.status === 'Overdue').sort(byTime),
  ];
  const completed = withStatus.filter((r) => r.status === 'Completed').sort((a, b) => byTime(b, a));
  const myCaseIds = new Set(cases.filter((c) => c.assignedToMe).map((c) => c.id));

  const deleteItem = (reminder) => ({ label: 'Delete', icon: Trash2, onSelect: () => setDeleting(reminder) });

  const openActions = (reminder) => [
    {
      label: 'Mark as Complete',
      icon: CircleCheck,
      onSelect: () => {
        completeReminder(reminder.id);
        showToast('Reminder marked as complete');
      },
    },
    { label: 'Edit', icon: Pencil, onSelect: () => navigate(`/reminders/${reminder.id}/edit`) },
    deleteItem(reminder),
  ];

  const completedActions = (reminder) => [
    {
      label: 'Mark as Upcoming',
      icon: RotateCcw,
      onSelect: () => {
        reopenReminder(reminder.id);
        showToast('Reminder moved back to upcoming');
      },
    },
    deleteItem(reminder),
  ];

  const confirmDelete = () => {
    deleteReminder(deleting.id);
    setDeleting(null);
    showToast('Reminder deleted');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Reminders</h1>
        <Button type="button" fullWidth={false} onClick={() => navigate('/reminders/new')}>
          <Plus size={16} aria-hidden="true" />
          Add Reminder
        </Button>
      </div>

      <ReminderTable
        title="Upcoming Reminders"
        rows={upcoming}
        myCaseIds={myCaseIds}
        emptyText="No upcoming reminders."
        actionsFor={openActions}
      />
      <ReminderTable
        title="Completed Reminders"
        rows={completed}
        myCaseIds={myCaseIds}
        emptyText="No completed reminders yet."
        actionsFor={completedActions}
      />

      {deleting && (
        <Modal
          title="Delete this reminder?"
          icon={<Trash2 size={18} />}
          size="sm"
          showClose={false}
          onClose={() => setDeleting(null)}
        >
          <p className="text-body text-text-secondary">
            &quot;{deleting.title}&quot; will be permanently removed. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" fullWidth={false} onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button type="button" fullWidth={false} onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      )}

      {toast && <Toast key={toast.id} message={toast.text} onDone={() => setToast(null)} />}
    </div>
  );
}
