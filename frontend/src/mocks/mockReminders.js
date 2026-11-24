import { toDateValue } from '../utils/format.js';

// Sample reminders for the Figma "JL 05 Reminders" screen.
// Replace with backend API calls once the reminders endpoints exist.
// Dates are set from today, so there are always upcoming, overdue and completed reminders:
// 5 open (1 of them overdue) and 2 completed, like the Figma screen and the Dashboard numbers.

function daysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateValue(date);
}

export const reminders = [
  {
    id: 1,
    date: daysFromToday(1),
    time: '14:00',
    type: 'Client Meeting',
    title: 'Meeting with Nimal Perera',
    caseId: 'LC-2026-0045',
    clientName: 'Nimal Perera',
    notes: '',
    status: 'Upcoming',
  },
  {
    id: 2,
    date: daysFromToday(3),
    time: '10:30',
    type: 'Consultation',
    title: 'Consultation on land survey',
    caseId: 'LC-2026-0042',
    clientName: 'Ishara Gunasekara',
    notes: '',
    status: 'Upcoming',
  },
  {
    id: 3,
    date: daysFromToday(4),
    time: '16:00',
    type: 'Follow-up',
    title: 'Follow up on witness list',
    caseId: 'LC-2026-0038',
    clientName: 'Kasun Jayawardena',
    notes: '',
    status: 'Pending',
  },
  {
    id: 4,
    date: daysFromToday(7),
    time: '09:00',
    type: 'Task',
    title: 'Prepare written submissions',
    caseId: 'LC-2026-0045',
    clientName: '',
    notes: '',
    status: 'Upcoming',
  },
  {
    id: 5,
    date: daysFromToday(-3),
    time: '10:00',
    type: 'Follow-up',
    title: 'Collect original deed',
    caseId: 'LC-2026-0042',
    clientName: 'Ishara Gunasekara',
    notes: '',
    status: 'Upcoming', // its time has passed, so it shows as Overdue
  },
  {
    id: 6,
    date: daysFromToday(-6),
    time: '11:00',
    type: 'Task',
    title: 'Draft affidavit',
    caseId: 'LC-2026-0039',
    clientName: 'Hashini Perera',
    notes: '',
    status: 'Completed',
  },
  {
    id: 7,
    date: daysFromToday(-11),
    time: '14:00',
    type: 'Other',
    title: 'Renew bar association membership',
    caseId: '',
    clientName: '',
    notes: '',
    status: 'Completed',
  },
];
