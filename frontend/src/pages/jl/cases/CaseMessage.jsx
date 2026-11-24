import { Link } from 'react-router-dom';

// Full-page message for a case that does not exist or is not assigned to the user.
export default function CaseMessage({ title, text }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">{title}</h1>
      <p className="text-body text-text-secondary">{text}</p>
      <Link to="/cases" className="text-body font-medium text-text-primary hover:underline">
        Back to Cases
      </Link>
    </div>
  );
}
