import { useState } from 'react';
import { incomingRequests as sampleIncoming, myRequests as sampleMine } from '../mocks/mockAccessRequests.js';
import { toDateValue } from '../utils/format.js';
import { AccessRequestsContext } from './accessRequestsContext.js';

// Keeps the incoming requests and the user's own requests for every page after login.
// In memory only: it resets on page reload, until the backend access request API exists.
export default function AccessRequestsProvider({ children }) {
  const [incoming, setIncoming] = useState(sampleIncoming);
  const [mine, setMine] = useState(sampleMine);

  // values: { caseId, assignedTo, access, reason }
  const sendRequest = (values) => {
    setMine((list) => [
      { ...values, id: Math.max(0, ...list.map((r) => r.id)) + 1, date: toDateValue(), status: 'Pending' },
      ...list,
    ]);
  };

  // status: 'Approved' or 'Rejected'
  const decideRequest = (id, status) => {
    setIncoming((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  // The user's pending request for a case, if there is one.
  const pendingRequestFor = (caseId) => mine.find((r) => r.caseId === caseId && r.status === 'Pending');

  return (
    <AccessRequestsContext.Provider value={{ incoming, mine, sendRequest, decideRequest, pendingRequestFor }}>
      {children}
    </AccessRequestsContext.Provider>
  );
}
