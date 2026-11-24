import { useId } from 'react';

// Multi-line version of TextField. Leave `label` empty when the card title already names the field,
// and pass `aria-label` instead.
export default function TextAreaField({ label, error, rows = 3, className = '', ...textareaProps }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-body font-medium text-text-primary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full resize-none rounded-sm border bg-bg-surface px-4 py-3 text-body text-text-primary outline-none placeholder:text-text-secondary focus:border-border-strong ${
          error ? 'border-red-600' : 'border-border-default'
        }`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...textareaProps}
      />
      {error && (
        <p id={errorId} className="text-caption text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
