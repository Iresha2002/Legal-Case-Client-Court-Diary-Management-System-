// Sample data from the Figma "JL 01 Dashboard" frame.
// Replace these with backend API calls once the dashboard endpoints exist.

// A date `days` away from today (negative = in the past), so the calendar always has nearby hearings.
function daysFromToday(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

export const summary = {
  totalCases: 8,
  totalClients: 8,
  upcomingHearings: 3,
  hearingsToday: 2,
  openReminders: 5,
  overdueReminders: 1,
};

// `type` is used in the Cases page URL, e.g. /cases?type=civil
export const casesByType = [
  { type: 'civil', label: 'Civil', count: 3 },
  { type: 'criminal', label: 'Criminal', count: 2 },
  { type: 'family', label: 'Family', count: 1 },
  { type: 'land', label: 'Land', count: 1 },
  { type: 'administrative', label: 'Administrative', count: 1 },
];

export const casesByStatus = [
  { status: 'ongoing', label: 'Ongoing', count: 5 },
  { status: 'pending', label: 'Pending', count: 2 },
  { status: 'closed', label: 'Closed', count: 1 },
];

export const recentActivity = [
  {
    id: 1,
    title: 'Access Granted',
    description: 'Granted view access to Kavindu Senanayake | LC-2026-0045',
    time: '22 Sep, 09:45',
  },
  { id: 2, title: 'Document Updated', description: 'Kavindu Senanayake updated Affidavit.pdf', time: '22 Sep, 09:40' },
  { id: 3, title: 'Document Viewed', description: 'Kavindu Senanayake viewed Affidavit.pdf', time: '22 Sep, 09:32' },
  { id: 4, title: 'Document Uploaded', description: 'Uploaded Witness_statement.pdf', time: '21 Sep, 16:20' },
];

// Days that have a court hearing (shown as dots on the calendar).
export const hearingDates = [-19, -13, -7, 0, 7].map(daysFromToday);
