import { useState } from 'react';
import { cases as sampleCases } from '../mocks/mockCases.js';
import { caseDetails as sampleDetails } from '../mocks/mockCaseDetails.js';
import { CURRENT_LAWYER } from '../pages/jl/cases/caseOptions.js';
import { CasesContext } from './casesContext.js';

const EMPTY_DETAILS = { hearings: [], notes: [], documents: [] };

// Keeps the cases, and each case's hearings, diary notes and documents, for every page after login,
// so a change on one page (e.g. a new hearing) also shows on another (e.g. the Court Calendar).
// In memory only: it resets on page reload, until the backend cases API exists.
export default function CasesProvider({ children }) {
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

  return (
    <CasesContext.Provider value={{ cases, addCase, updateCase, getDetails, updateDetails }}>
      {children}
    </CasesContext.Provider>
  );
}
