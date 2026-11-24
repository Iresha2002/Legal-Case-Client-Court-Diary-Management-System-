import { toDateValue } from '../utils/format.js';

// Sample activity for the Figma "JL 07 My Activity History" screen.
// Replace with a backend API call once the activity history endpoint exists.
// Dates are set from today, so the "Last 30 days" cards always have data; the last record is
// older than 30 days, so it is listed but not counted in the cards.
//
// `action` is one of the keys in pages/jl/activity/activityActions.js.
// `target` is the case or document the action was about (or null), and the case it belongs to.

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateValue(date);
}

function record(id, days, time, action, details, target = null) {
  return { id, date: daysAgo(days), time, action, details, target };
}

const caseTarget = (caseId) => ({ kind: 'case', label: caseId, caseId });
const documentTarget = (name, caseId) => ({ kind: 'document', label: name, caseId });

export const activity = [
  record(1, 0, '09:45', 'accessGranted', 'Granted view access to Kavindu Senanayake', caseTarget('LC-2026-0045')),
  record(2, 0, '09:40', 'documentUpdated', 'Kavindu Senanayake updated Affidavit.pdf', documentTarget('Affidavit.pdf', 'LC-2026-0045')),
  record(3, 0, '09:32', 'documentViewed', 'Kavindu Senanayake viewed Affidavit.pdf', documentTarget('Affidavit.pdf', 'LC-2026-0045')),
  record(4, 1, '16:20', 'documentUploaded', 'Uploaded Witness_statement.pdf', documentTarget('Witness_statement.pdf', 'LC-2026-0045')),
  record(5, 2, '14:10', 'caseUpdated', 'Changed hearing date to 12 Dec 2026', caseTarget('LC-2026-0042')),
  record(6, 3, '11:05', 'noteAdded', 'Added meeting notes', caseTarget('LC-2026-0045')),
  record(7, 4, '09:18', 'login', 'Successful login'),
  record(8, 6, '18:32', 'logout', 'Logged out from the system'),
  record(9, 7, '10:15', 'documentDownloaded', 'Downloaded Plaint / Petition.pdf', documentTarget('Plaint / Petition.pdf', 'LC-2026-0045')),
  record(10, 8, '15:40', 'accessGranted', 'Granted view access to Dilan Niroshan', caseTarget('LC-2026-0039')),
  record(11, 9, '09:02', 'login', 'Successful login'),
  record(12, 10, '17:45', 'logout', 'Logged out from the system'),
  record(13, 12, '11:30', 'caseUpdated', 'Changed case status to Pending', caseTarget('LC-2026-0030')),
  record(14, 14, '13:20', 'noteAdded', 'Added court preparation notes', caseTarget('LC-2026-0045')),
  record(15, 16, '10:05', 'documentUploaded', 'Uploaded Title_Deed_Copy.pdf', documentTarget('Title_Deed_Copy.pdf', 'LC-2026-0045')),
  record(16, 20, '09:10', 'login', 'Successful login'),
  record(17, 25, '16:00', 'accessGranted', 'Granted case access to Hasini Thennakoon', caseTarget('LC-2026-0045')),
  record(18, 35, '09:00', 'login', 'Successful login'),
];
