import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cases as sampleCases } from '../../../mocks/mockCases.js';
import { CURRENT_LAWYER } from './caseOptions.js';

// Holds the case list for all /cases pages, so a case added or edited shows up
// on the list. Kept in memory only: it resets on page reload, until the backend cases API exists.
export default function CasesLayout() {
  const [cases, setCases] = useState(sampleCases);

  // `values` comes from CaseForm. A case is "mine" when it is assigned to the logged-in lawyer.
  const toCase = (values) => ({ ...values, assignedToMe: values.lawyer === CURRENT_LAWYER });

  const addCase = (values) => {
    setCases((list) => [toCase(values), ...list]);
  };

  // `oldId` is the case number before editing, because the form can change it.
  const updateCase = (oldId, values) => {
    setCases((list) => list.map((item) => (item.id === oldId ? { ...item, ...toCase(values) } : item)));
  };

  return <Outlet context={{ cases, addCase, updateCase }} />;
}
