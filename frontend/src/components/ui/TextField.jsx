import { useId } from 'react';

// Figma "Text Field" / "Password Field": label above a bordered input.
// `trailing` renders inside the input box on the right (e.g. the password eye toggle).
// `hint` is a short help text under the input; an error replaces it.
export default function TextField({ label, error, hint, trailing, className = '', ...inputProps }) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-body font-medium text-text-primary">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 rounded-sm border bg-bg-surface px-4 py-3 focus-within:border-border-strong ${
          error ? 'border-red-600' : 'border-border-default'
        }`}
      >
        <input
          id={id}
          className="min-w-0 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-secondary"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...inputProps}
        />
        {trailing}
      </div>
      {error ? (
        <p id={errorId} className="text-caption text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-caption text-text-secondary">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
