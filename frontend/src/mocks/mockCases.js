// Sample cases for the Figma "JL 03 Cases" screens.
// Replace with a backend API call once the cases endpoints exist.
//
// `assignedToMe` marks the logged-in lawyer's cases: only those can be opened.
// The other cases are shown as "Restricted" and need an access request.
// The assigned cases match the Dashboard numbers: 8 cases (3 Civil, 2 Criminal,
// 1 Family, 1 Land, 1 Administrative); 5 Ongoing, 2 Pending, 1 Closed.

const ME = 'Mihiri Weerasekara';
const OTHER = 'Hasini Thennakoon';

function mine(id, clientName, type, status) {
  return { id, clientName, type, status, lawyer: ME, assignedToMe: true };
}

function restricted(id, type, status, lawyer = OTHER) {
  return { id, clientName: null, type, status, lawyer, assignedToMe: false };
}

// Newest first, like the Figma table.
export const cases = [
  mine('LC-2026-0045', 'Nimal Perera', 'Civil', 'Ongoing'),
  restricted('LC-2026-0044', 'Family', 'Ongoing'),
  restricted('LC-2026-0043', 'Criminal', 'Pending'),
  mine('LC-2026-0042', 'Ishara Gunasekara', 'Land', 'Pending'),
  restricted('LC-2026-0041', 'Commercial', 'Ongoing'),
  restricted('LC-2026-0040', 'Labour', 'Closed'),
  mine('LC-2026-0039', 'Hashini Perera', 'Civil', 'Closed'),
  mine('LC-2026-0038', 'Kasun Jayawardena', 'Criminal', 'Ongoing'),
  restricted('LC-2026-0037', 'Civil', 'Ongoing', 'Ruwan Jayasinghe'),
  mine('LC-2026-0036', 'Rashmi Fernando', 'Civil', 'Ongoing'),
  restricted('LC-2026-0035', 'Family', 'Pending'),
  mine('LC-2026-0034', 'Dilani Fernando', 'Criminal', 'Ongoing'),
  restricted('LC-2026-0033', 'Land', 'Ongoing', 'Ruwan Jayasinghe'),
  restricted('LC-2026-0032', 'Commercial', 'Ongoing'),
  restricted('LC-2026-0031', 'Criminal', 'Closed', 'Ruwan Jayasinghe'),
  mine('LC-2026-0030', 'Tharushi Silva', 'Family', 'Pending'),
  mine('LC-2026-0029', 'Chamara Bandara', 'Administrative', 'Ongoing'),
  restricted('LC-2026-0028', 'Labour', 'Ongoing'),
  restricted('LC-2026-0027', 'Civil', 'Pending', 'Ruwan Jayasinghe'),
  restricted('LC-2026-0026', 'Administrative', 'Ongoing'),
  restricted('LC-2026-0025', 'Family', 'Closed'),
  restricted('LC-2026-0024', 'Land', 'Ongoing', 'Ruwan Jayasinghe'),
  restricted('LC-2026-0023', 'Commercial', 'Pending'),
  restricted('LC-2026-0022', 'Criminal', 'Ongoing'),
];
