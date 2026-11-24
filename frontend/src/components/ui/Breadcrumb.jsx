import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

// "Clients > Client Details". Every item except the last links somewhere.
// `backTo` adds the back arrow shown on the Client Details screen.
export default function Breadcrumb({ items, backTo }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-body print:hidden">
      {backTo && (
        <Link to={backTo} aria-label="Back" className="mr-2 rounded-sm p-1 text-text-secondary hover:bg-border-default">
          <ArrowLeft size={18} />
        </Link>
      )}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-2">
            {isLast ? (
              <span aria-current="page" className="font-medium text-text-primary">
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className="text-text-secondary hover:underline">
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight size={14} className="text-text-secondary" aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}
