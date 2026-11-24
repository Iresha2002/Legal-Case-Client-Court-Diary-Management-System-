import { createContext, useContext } from 'react';

// Access requests shared by the Cases page (Request Access) and the Access Requests page.
// The value comes from AccessRequestsProvider.
export const AccessRequestsContext = createContext(null);

export function useAccessRequests() {
  const value = useContext(AccessRequestsContext);
  if (!value) throw new Error('useAccessRequests must be used inside AccessRequestsProvider.');
  return value;
}

// What can be requested: `value` is shown in the request lists, `label` in the Request Access form.
export const ACCESS_TYPES = [
  { value: 'Case access', label: 'View case details' },
  { value: 'Client details', label: 'View client details' },
  { value: 'Documents', label: 'View documents' },
];

// Badge style for each request status.
export const REQUEST_STATUS_VARIANTS = {
  Pending: 'muted',
  Approved: 'dark',
  Rejected: 'outline',
};
