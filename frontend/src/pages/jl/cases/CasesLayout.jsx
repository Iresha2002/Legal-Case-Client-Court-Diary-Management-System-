import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cases as sampleCases } from '../../../mocks/mockCases.js';
import { caseDetails as sampleDetails } from '../../../mocks/mockCaseDetails.js';
import { CURRENT_LAWYER } from './caseOptions.js';

const EMPTY_DETAILS = { hearings: [], notes: [], documents: [] };

// Holds the cases, and each case's hearings, diary notes and documents, for all /cases pages,
// so changes show up everywhere. Kept in memory only: it resets on page reload,
// until the backend cases API exists.
export default function CasesLayout() {
  const [cases, setCases] = useState(sampleCases);
  const [details, setDetails] = useState(sampleDetails);

  // `values` comes from CaseForm. A case is "mine" when it is assigned to the logged-in lawyer.
  const toCase = (values) => ({ ...values, assignedToMe: values.lawyer === CURRENT_LAWYER });

  const addCase = (values) => {
    setCases((list) => [toCase(values), ...list]);
  };

  // `oldId` is the case number before editing, because the form can change it.
  const updateCase = (oldId, values) => {
    setCases((list) => list.map((item) => (item.id === oldId ? { ...item, ...toCase(values) } : item)));
    if (values.id && values.id !== oldId) {
      // Keep the hearings, notes and documents with the case under its new number.
      setDetails((all) => {
        if (!all[oldId]) return all;
        const { [oldId]: moved, ...rest } = all;
        return { ...rest, [values.id]: moved };
      });
    }
  };

  const getDetails = (caseId) => details[caseId] ?? EMPTY_DETAILS;

  // updater receives the case's current { hearings, notes, documents } and returns the new one.
  const updateDetails = (caseId, updater) => {
    setDetails((all) => ({ ...all, [caseId]: updater(all[caseId] ?? EMPTY_DETAILS) }));
  };

  return <Outlet context={{ cases, addCase, updateCase, getDetails, updateDetails }} />;
}
