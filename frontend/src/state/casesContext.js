import { createContext, useContext } from 'react';

// Cases and each case's hearings, diary notes and documents, shared by the Cases pages
// and the Court Calendar. The value comes from CasesProvider.
export const CasesContext = createContext(null);

export function useCases() {
  const value = useContext(CasesContext);
  if (!value) throw new Error('useCases must be used inside CasesProvider.');
  return value;
}
