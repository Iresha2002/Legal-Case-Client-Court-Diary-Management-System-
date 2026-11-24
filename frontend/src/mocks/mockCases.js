import { CURRENT_LAWYER } from '../pages/jl/cases/caseOptions.js';

// Sample cases for the Figma "JL 03 Cases" screens.
// Replace with a backend API call once the cases endpoints exist.
//
// `assignedToMe` marks the logged-in lawyer's cases: only those can be opened.
// The other cases are shown as "Restricted" and need an access request.
// The assigned cases match the Dashboard numbers: 8 cases (3 Civil, 2 Criminal,
// 1 Family, 1 Land, 1 Administrative); 5 Ongoing, 2 Pending, 1 Closed.

const OTHER = 'Hasini Thennakoon';

function mine(id, clientName, type, status, details = {}) {
  return {
    id,
    clientName,
    type,
    status,
    lawyer: CURRENT_LAWYER,
    assignedToMe: true,
    title: '',
    description: '',
    filedOn: '',
    priority: '',
    court: '', // court name, shown on the Court Calendar
    ...details,
  };
}

function restricted(id, type, status, lawyer = OTHER) {
  return { id, clientName: null, type, status, lawyer, assignedToMe: false };
}

// Newest first, like the Figma table.
export const cases = [
  mine('LC-2026-0045', 'Nimal Perera', 'Civil', 'Ongoing', {
    title: 'Property Ownership Dispute',
    description: 'Dispute over ownership of the property at 42 Ward Place, Colombo 07. Plaint filed on 12 August 2026.',
    filedOn: '2026-08-12',
    priority: 'Medium',
    court: 'Colombo High Court',
  }),
  restricted('LC-2026-0044', 'Family', 'Ongoing'),
  restricted('LC-2026-0043', 'Criminal', 'Pending'),
  mine('LC-2026-0042', 'Ishara Gunasekara', 'Land', 'Pending', {
    title: 'Boundary Dispute',
    filedOn: '2026-07-01',
    priority: 'High',
    court: 'Galle District Court',
  }),
  restricted('LC-2026-0041', 'Commercial', 'Ongoing'),
  restricted('LC-2026-0040', 'Labour', 'Closed'),
  mine('LC-2026-0039', 'Hashini Perera', 'Civil', 'Closed', {
    title: 'Contract Agreement Breach',
    filedOn: '2026-06-20',
    priority: 'Low',
    court: 'Colombo District Court',
  }),
  mine('LC-2026-0038', 'Kasun Jayawardena', 'Criminal', 'Ongoing', {
    title: 'Fraud Allegation Defence',
    filedOn: '2026-06-11',
    priority: 'High',
    court: 'Colombo Magistrate Court',
  }),
  restricted('LC-2026-0037', 'Civil', 'Ongoing', 'Ruwan Jayasinghe'),
  mine('LC-2026-0036', 'Rashmi Fernando', 'Civil', 'Ongoing', {
    title: 'Debt Recovery',
    filedOn: '2026-05-28',
    priority: 'Medium',
    court: 'Colombo District Court',
  }),
  restricted('LC-2026-0035', 'Family', 'Pending'),
  mine('LC-2026-0034', 'Dilani Fernando', 'Criminal', 'Ongoing', {
    title: 'Assault Case',
    filedOn: '2026-05-09',
    priority: 'Urgent',
    court: 'Negombo Magistrate Court',
  }),
  restricted('LC-2026-0033', 'Land', 'Ongoing', 'Ruwan Jayasinghe'),
  restricted('LC-2026-0032', 'Commercial', 'Ongoing'),
  restricted('LC-2026-0031', 'Criminal', 'Closed', 'Ruwan Jayasinghe'),
  mine('LC-2026-0030', 'Tharushi Silva', 'Family', 'Pending', {
    title: 'Child Custody',
    filedOn: '2026-03-14',
    priority: 'High',
    court: 'Kandy District Court',
  }),
  mine('LC-2026-0029', 'Chamara Bandara', 'Administrative', 'Ongoing', {
    title: 'Licence Cancellation Appeal',
    filedOn: '2026-03-02',
    priority: 'Medium',
    court: 'Court of Appeal',
  }),
  restricted('LC-2026-0028', 'Labour', 'Ongoing'),
  restricted('LC-2026-0027', 'Civil', 'Pending', 'Ruwan Jayasinghe'),
  restricted('LC-2026-0026', 'Administrative', 'Ongoing'),
  restricted('LC-2026-0025', 'Family', 'Closed'),
  restricted('LC-2026-0024', 'Land', 'Ongoing', 'Ruwan Jayasinghe'),
  restricted('LC-2026-0023', 'Commercial', 'Pending'),
  restricted('LC-2026-0022', 'Criminal', 'Ongoing'),
];
