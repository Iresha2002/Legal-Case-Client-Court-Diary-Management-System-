import { Link } from 'react-router-dom';

// Shown when the URL has a client id that is not in the list.
export default function ClientNotFound() {
  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Client not found</h1>
      <p className="text-body text-text-secondary">This client does not exist or has been removed.</p>
      <Link to="/clients" className="text-body font-medium text-text-primary hover:underline">
        Back to Clients
      </Link>
    </div>
  );
}
