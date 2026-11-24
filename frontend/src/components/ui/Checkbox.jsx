import { Check } from 'lucide-react';

// The tick uses the theme's inverse text colour, so it shows on the filled box in light and dark mode.
export default function Checkbox({ label, checked, onChange, ...props }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-body text-text-primary">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        {...props}
      />
      <span
        aria-hidden="true"
        className={`flex size-5 items-center justify-center rounded-[4px] border border-action-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action-primary ${
          checked ? 'bg-action-primary' : 'bg-bg-surface'
        }`}
      >
        {checked && <Check size={14} strokeWidth={2.5} className="block text-text-inverse" />}
      </span>
      {label}
    </label>
  );
}
