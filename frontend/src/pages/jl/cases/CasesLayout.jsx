import { Outlet } from 'react-router-dom';
import { useCases } from '../../../state/casesContext.js';

// Parent route of all /cases pages. The data lives in CasesProvider (see AppLayout), so the
// Court Calendar can use it too; here it is passed on to the pages as the outlet context.
export default function CasesLayout() {
  return <Outlet context={useCases()} />;
}
