// Case types, statuses and other choices shared by the Cases screens.
// Lawyers and priorities are not listed in Figma beyond the examples, so the team should confirm them.

// URL key -> label, e.g. /cases?type=civil
export const CASE_TYPES = {
  civil: 'Civil',
  criminal: 'Criminal',
  family: 'Family',
  land: 'Land',
  administrative: 'Administrative',
  commercial: 'Commercial',
  labour: 'Labour',
};

export const CASE_STATUSES = ['Ongoing', 'Pending', 'Closed'];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

// Sample lawyers until the users API exists. The first one is the logged-in lawyer in the sample data.
export const CURRENT_LAWYER = 'Mihiri Weerasekara';
export const LAWYERS = [CURRENT_LAWYER, 'Hasini Thennakoon', 'Ruwan Jayasinghe'];

// Case Details choices. Figma shows only some of them as examples, so the team should confirm these lists.
export const NOTE_TAGS = ['Meeting', 'Research', 'Hearing', 'Call', 'Other'];
export const DOCUMENT_TYPES = ['Pleading', 'Affidavit', 'Evidence', 'Agreement', 'Correspondence', 'Court Order', 'Other'];

// Badge style for each case status.
export const STATUS_VARIANTS = {
  Ongoing: 'dark',
  Pending: 'muted',
  Closed: 'outline',
};
