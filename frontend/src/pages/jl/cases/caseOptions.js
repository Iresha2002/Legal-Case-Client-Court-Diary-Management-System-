// Case types and statuses shared by the Cases screens.

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

// Badge style for each case status.
export const STATUS_VARIANTS = {
  Ongoing: 'dark',
  Pending: 'muted',
  Closed: 'outline',
};
