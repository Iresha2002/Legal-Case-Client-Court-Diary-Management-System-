import { useId } from 'react';

// Multi-line version of TextField. Leave `label` empty when the card title already names the field,
// and pass `aria-label` instead. `hint` shows help text under the box (an error replaces it);
// `showCount` with `maxLength` shows a "0/500" counter.
export default function TextAreaField({ label, error, hint, showCount = false, rows = 3, className = '', ...textareaProps }) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const { value = '', maxLength } = textareaProps;

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
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...textareaProps}
      />
      {(error || hint || showCount) && (
        <div className="flex items-start justify-between gap-4">
          {error ? (
            <p id={errorId} className="text-caption text-red-600">
              {error}
            </p>
          ) : (
            <p id={hintId} className="text-caption text-text-secondary">
              {hint}
            </p>
          )}
          {showCount && maxLength && (
            <p className="shrink-0 text-caption text-text-secondary">
              {value.length}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
