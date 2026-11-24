// Sample access requests for the Figma "JL 06 Access Requests" screens.
// Replace with backend API calls once the access request endpoints exist. Dates use yyyy-mm-dd.

// Requests from other users for cases assigned to the logged-in lawyer.
export const incomingRequests = [
  { id: 1, requestedBy: 'Dilan Niroshan', role: 'Clerk', access: 'Client details', caseId: 'LC-2026-0045', date: '2026-09-22', status: 'Pending' },
  { id: 2, requestedBy: 'Ravindu Perera', role: 'Clerk', access: 'Client details', caseId: 'LC-2026-0042', date: '2026-09-21', status: 'Pending' },
  { id: 3, requestedBy: 'Hasini Thennakoon', role: 'Junior Lawyer', access: 'Case access', caseId: 'LC-2026-0045', date: '2026-09-20', status: 'Approved' },
  { id: 4, requestedBy: 'Dilan Niroshan', role: 'Clerk', access: 'Client details', caseId: 'LC-2026-0039', date: '2026-09-18', status: 'Rejected' },
];

// Requests the logged-in lawyer sent for other lawyers' cases.
export const myRequests = [
  { id: 1, caseId: 'LC-2026-0043', assignedTo: 'Hasini Thennakoon', access: 'Case access', reason: '', date: '2026-09-21', status: 'Pending' },
  { id: 2, caseId: 'LC-2026-0041', assignedTo: 'Hasini Thennakoon', access: 'Case access', reason: '', date: '2026-09-15', status: 'Approved' },
];
