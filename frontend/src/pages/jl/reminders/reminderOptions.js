// Reminder types and statuses. Figma shows these types as examples; the team should confirm the list.
export const REMINDER_TYPES = ['Client Meeting', 'Consultation', 'Follow-up', 'Task', 'Court Deadline', 'Other'];

// Badge style for each status.
export const REMINDER_STATUS_VARIANTS = {
  Upcoming: 'muted',
  Pending: 'muted',
  Overdue: 'strong',
  Completed: 'outline',
};

// Date and time of a reminder as a Date.
function reminderTime(reminder) {
  const [year, month, day] = reminder.date.split('-').map(Number);
  const [hours, minutes] = (reminder.time || '00:00').split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

// The status to show: Completed stays Completed; an open reminder whose time has passed is Overdue;
// otherwise the saved status (Upcoming or Pending).
export function reminderStatus(reminder, now) {
  if (reminder.status === 'Completed') return 'Completed';
  return reminderTime(reminder) < now ? 'Overdue' : reminder.status;
}

// True when the date and time are later than `now`.
export function isInFuture(date, time, now) {
  return reminderTime({ date, time }) > now;
}
