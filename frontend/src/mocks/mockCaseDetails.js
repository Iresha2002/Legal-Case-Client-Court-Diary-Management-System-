// Sample hearings, diary notes and documents for the Figma "JL 03.2 Case Details" screens, by case number.
// Replace with backend API calls once the endpoints exist. Cases without an entry start empty.
// Dates use yyyy-mm-dd and times use 24-hour HH:MM, like the date and time inputs.
export const caseDetails = {
  'LC-2026-0045': {
    hearings: [
      {
        id: 1,
        date: '2026-08-12',
        time: '',
        courtRoom: 'Court Room 03',
        judge: 'Hon. Justice Perera',
        status: 'Completed',
        summary: 'Plaint filed and accepted. The respondent was given four weeks to file objections.',
      },
      {
        id: 2,
        date: '2026-09-09',
        time: '',
        courtRoom: 'Court Room 03',
        judge: 'Hon. Justice Perera',
        status: 'Completed',
        summary: 'Objections filed by the respondent. The court fixed the matter for evidence.',
      },
      {
        id: 3,
        date: '2026-09-22',
        time: '09:00',
        courtRoom: 'Court Room 03',
        judge: 'Hon. Justice Perera',
        status: 'Upcoming',
        summary: '',
      },
    ],
    notes: [
      {
        id: 1,
        title: 'Client consultation',
        date: '2026-08-12',
        tag: 'Meeting',
        content: 'Discussed property ownership details and reviewed initial documents before the hearing.',
      },
      {
        id: 2,
        title: 'Document review',
        date: '2026-08-10',
        tag: 'Research',
        content: 'Checked the title deed and survey plan against the land registry extracts.',
      },
      {
        id: 3,
        title: 'Court preparation',
        date: '2026-08-05',
        tag: 'Hearing',
        content: 'Prepared the list of documents and witnesses for the first hearing.',
      },
      {
        id: 4,
        title: 'Initial briefing',
        date: '2026-08-01',
        tag: 'Call',
        content: 'Phone call with the client to explain the filing process and the expected timeline.',
      },
    ],
    documents: [
      { id: 1, name: 'Plaint / Petition.pdf', size: '245 KB', type: 'Pleading', uploadedOn: '2026-08-12' },
      { id: 2, name: 'Affidavit_Nimal_Perera.pdf', size: '120 KB', type: 'Affidavit', uploadedOn: '2026-08-12' },
      { id: 3, name: 'Title_Deed_Copy.pdf', size: '860 KB', type: 'Evidence', uploadedOn: '2026-08-10' },
      { id: 4, name: 'Survey_Plan.jpg', size: '1.4 MB', type: 'Evidence', uploadedOn: '2026-08-10' },
      { id: 5, name: 'Notice_to_Respondent.docx', size: '64 KB', type: 'Correspondence', uploadedOn: '2026-08-14' },
    ],
  },
  'LC-2026-0042': {
    hearings: [
      {
        id: 1,
        date: '2026-07-20',
        time: '10:00',
        courtRoom: 'Court Room 01',
        judge: 'Hon. Justice Silva',
        status: 'Upcoming',
        summary: '',
      },
    ],
    notes: [],
    documents: [],
  },
};
