import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

const SHOW_FOR_MS = 3000;

// Figma "Diary note deleted" message: a small card at the top right that hides itself.
// Give it a new `key` for each message so the timer starts again.
export default function Toast({ message, onDone }) {
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(), SHOW_FOR_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      className="fixed top-20 right-8 z-50 flex items-center gap-3 rounded-md border border-border-default bg-bg-surface px-4 py-3 text-body text-text-primary shadow-raised print:hidden"
    >
      <Check size={16} aria-hidden="true" />
      {message}
    </div>
  );
}
