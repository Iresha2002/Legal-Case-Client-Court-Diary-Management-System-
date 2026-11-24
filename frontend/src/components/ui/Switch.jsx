// Figma toggle: black with a white knob when on, light grey when off.
export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary ${
        checked ? 'bg-action-primary' : 'bg-border-default'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block size-[18px] rounded-full bg-bg-surface shadow transition-transform ${
          checked ? 'translate-x-[23px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}
