// Sample clients for the Figma "JL 02 Clients" screens.
// Replace with backend API calls once the clients endpoints exist.
// Dates use the date input format, yyyy-mm-dd.
export const clients = [
  {
    id: 1,
    name: 'Nimal Perera',
    status: 'Active',
    email: 'nimal.perera@email.lk',
    occupation: 'Company Director',
    contactNo: '+94 77 234 5678',
    address: '42, Ward Place, Colombo 07',
    dateOfBirth: '1987-05-14',
    gender: 'Male',
    clientType: 'Individual',
    nationality: 'Sri Lankan',
    registeredOn: '2026-01-08',
    language: 'English / Sinhala',
    repName: 'Kamal Perera',
    repRelationship: 'Brother',
    repContactNo: '+94 71 345 6789',
    notes: 'Client prefers communication by email.',
  },
  {
    id: 2,
    name: 'Dilani Fernando',
    status: 'Active',
    email: 'dilani.fernando@email.lk',
    occupation: 'Teacher',
    contactNo: '+94 71 456 7890',
    address: '15, Temple Road, Negombo',
    dateOfBirth: '1990-11-02',
    gender: 'Female',
    clientType: 'Individual',
    nationality: 'Sri Lankan',
    registeredOn: '2026-02-12',
    language: 'Sinhala',
  },
  {
    id: 3,
    name: 'Kasun Jayawardena',
    status: 'Active',
    email: 'kasun.j@email.lk',
    occupation: 'Engineer',
    contactNo: '+94 76 112 3344',
    address: '8, Lake Drive, Kandy',
    dateOfBirth: '1985-03-21',
    gender: 'Male',
    clientType: 'Individual',
    nationality: 'Sri Lankan',
    registeredOn: '2026-03-03',
    language: 'English',
  },
  {
    id: 4,
    name: 'Ishara Gunasekara',
    status: 'Pending',
    email: 'ishara.g@email.lk',
    occupation: 'Business Owner',
    contactNo: '+94 77 998 1122',
    address: '102, Main Street, Galle',
    dateOfBirth: '1992-07-09',
    gender: 'Female',
    clientType: 'Company',
    nationality: 'Sri Lankan',
    registeredOn: '2026-04-18',
    language: 'English / Sinhala',
  },
  { id: 5, name: 'Ruwan Wickramasinghe', status: 'Active', occupation: 'Farmer', contactNo: '+94 70 223 4455', gender: 'Male', nationality: 'Sri Lankan', language: 'Sinhala' },
  { id: 6, name: 'Tharushi Silva', status: 'Active', occupation: 'Accountant', contactNo: '+94 75 667 8899', gender: 'Female', nationality: 'Sri Lankan', language: 'English' },
  { id: 7, name: 'Kavindu Senanayake', status: 'Active', occupation: 'Lecturer', contactNo: '+94 77 101 2020', gender: 'Male', nationality: 'Sri Lankan', language: 'English / Sinhala' },
  { id: 8, name: 'Sanduni Rathnayake', status: 'Pending', occupation: 'Nurse', contactNo: '+94 71 303 4040', gender: 'Female', nationality: 'Sri Lankan', language: 'Sinhala' },
  { id: 9, name: 'Chamara Bandara', status: 'Active', occupation: 'Driver', contactNo: '+94 76 505 6060', gender: 'Male', nationality: 'Sri Lankan', language: 'Sinhala' },
  { id: 10, name: 'Nadeesha Herath', status: 'Active', occupation: 'Designer', contactNo: '+94 77 707 8080', gender: 'Female', nationality: 'Sri Lankan', language: 'English' },
  { id: 11, name: 'Pradeep Kumara', status: 'Pending', occupation: 'Shop Owner', contactNo: '+94 70 909 1010', gender: 'Male', nationality: 'Sri Lankan', language: 'Tamil' },
  { id: 12, name: 'Malsha Dissanayake', status: 'Active', occupation: 'Pharmacist', contactNo: '+94 75 121 3141', gender: 'Female', nationality: 'Sri Lankan', language: 'English / Sinhala' },
];

// Cases for each client, by client id. Clients without an entry have no cases yet.
export const clientCases = {
  1: [
    { id: 'LC-2026-0045', type: 'Civil', court: 'Colombo High Court', filedOn: '2026-08-12', nextHearing: '2026-09-22', status: 'Ongoing' },
    { id: 'LC-2026-0044', type: 'Family', court: 'Kandy District Court', filedOn: '2026-08-05', nextHearing: '2026-09-24', status: 'Ongoing' },
    { id: 'LC-2026-0043', type: 'Criminal', court: 'Supreme Court', filedOn: '2026-07-18', nextHearing: '2026-09-29', status: 'Pending' },
  ],
  2: [
    { id: 'LC-2026-0039', type: 'Civil', court: 'Negombo District Court', filedOn: '2026-06-20', nextHearing: '2026-10-02', status: 'Ongoing' },
  ],
  3: [
    { id: 'LC-2026-0042', type: 'Land', court: 'Kandy District Court', filedOn: '2026-07-01', nextHearing: '2026-10-08', status: 'Ongoing' },
    { id: 'LC-2026-0030', type: 'Family', court: 'Kandy District Court', filedOn: '2026-03-14', nextHearing: '', status: 'Closed' },
  ],
};

// Documents for each client, by client id.
export const clientDocuments = {
  1: [
    { id: 1, name: 'Agreement Document.pdf', size: '245 KB', type: 'Agreement', uploadedOn: '2026-08-12', uploadedBy: 'System Administrator' },
    { id: 2, name: 'Client ID Copy.docx', size: '120 KB', type: 'Identification', uploadedOn: '2026-08-10', uploadedBy: 'System Administrator' },
    { id: 3, name: 'Authorization Letter.pdf', size: '310 KB', type: 'Authorization', uploadedOn: '2026-08-10', uploadedBy: 'System Administrator' },
    { id: 4, name: 'Consent Form.docx', size: '180 KB', type: 'Consent Form', uploadedOn: '2026-08-09', uploadedBy: 'System Administrator' },
    { id: 5, name: 'Signed Contract.pdf', size: '420 KB', type: 'Contract', uploadedOn: '2026-08-08', uploadedBy: 'System Administrator' },
    { id: 6, name: 'Other Client Document.pdf', size: '150 KB', type: 'Other', uploadedOn: '2026-08-08', uploadedBy: 'System Administrator' },
  ],
  2: [
    { id: 1, name: 'Client ID Copy.pdf', size: '98 KB', type: 'Identification', uploadedOn: '2026-06-20', uploadedBy: 'System Administrator' },
  ],
};
