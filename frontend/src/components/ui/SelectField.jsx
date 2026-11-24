import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

// Figma "Select": label above a bordered dropdown. Shows `placeholder` until a value is chosen.
export default function SelectField({ label, error, placeholder, options, value, className = '', ...selectProps }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-body font-medium text-text-primary">
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-sm border bg-bg-surface focus-within:border-border-strong ${
          error ? 'border-red-600' : 'border-border-default'
        }`}
      >
        <select
          id={id}
          value={value}
          className={`w-full appearance-none bg-transparent py-3 pr-10 pl-4 text-body outline-none ${
            value ? 'text-text-primary' : 'text-text-secondary'
          }`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...selectProps}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-text-primary">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-4 text-text-primary" aria-hidden="true" />
      </div>
      {error && (
        <p id={errorId} className="text-caption text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
