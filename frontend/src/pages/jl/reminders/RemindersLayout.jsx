import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { reminders as sampleReminders } from '../../../mocks/mockReminders.js';

// Holds the reminders for the /reminders pages, so changes made on one page show up on the others.
// Kept in memory only: it resets on page reload, until the backend reminders API exists.
export default function RemindersLayout() {
  const [reminders, setReminders] = useState(sampleReminders);

  const change = (id, update) => {
    setReminders((list) => list.map((r) => (r.id === id ? { ...r, ...update } : r)));
  };

  const addReminder = (values) => {
    setReminders((list) => [
      { ...values, id: Math.max(0, ...list.map((r) => r.id)) + 1, status: 'Upcoming' },
      ...list,
    ]);
  };

  const updateReminder = (id, values) => change(id, values);
  const completeReminder = (id) => change(id, { status: 'Completed' });
  const reopenReminder = (id) => change(id, { status: 'Upcoming' });

  const deleteReminder = (id) => {
    setReminders((list) => list.filter((r) => r.id !== id));
  };

  return (
    <Outlet
      context={{ reminders, addReminder, updateReminder, completeReminder, reopenReminder, deleteReminder }}
    />
  );
}
