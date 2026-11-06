import checkIcon from '../../assets/icons/check.svg';

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
        {checked && <img src={checkIcon} alt="" width="14" height="14" className="block" />}
      </span>
      {label}
    </label>
  );
}
