import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { CASE_STATUSES } from '../caseOptions.js';

// Button style for each status, like the Figma "Ongoing ⌄" / "Closed ⌄" buttons.
const BUTTON_STYLES = {
  Ongoing: 'border-action-primary bg-action-primary text-text-inverse hover:bg-neutral-800',
  Pending: 'border-border-default bg-border-default text-text-primary hover:bg-neutral-300',
  Closed: 'border-border-strong bg-bg-surface text-text-primary hover:bg-bg-page',
};

// Figma "JL 03.35 - 03.37 Status Menu": shows the case status and lets the user change it.
export default function StatusMenu({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Case status: ${status}. Change status`}
        className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-body font-medium transition-colors ${
          BUTTON_STYLES[status] ?? BUTTON_STYLES.Pending
        }`}
      >
        {status}
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-[180px] rounded-md border border-border-default bg-bg-surface p-2 shadow-raised"
        >
          {CASE_STATUSES.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={option === status}
              onClick={() => {
                setOpen(false);
                if (option !== status) onChange(option);
              }}
              className={`flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-body text-text-primary hover:bg-bg-page ${
                option === status ? 'bg-bg-page' : ''
              }`}
            >
              {option}
              {option === status && <Check size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
