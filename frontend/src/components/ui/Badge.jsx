// Small rounded label, e.g. "Active", "Pending", "Civil".
// dark = solid black, strong = dark grey (e.g. "Overdue"), muted = light grey,
// outline = white with a grey border.
const VARIANTS = {
  dark: 'bg-action-primary text-text-inverse',
  strong: 'bg-neutral-500 text-text-inverse',
  muted: 'bg-border-default text-text-primary',
  outline: 'border border-border-default bg-bg-surface text-text-secondary',
};

export default function Badge({ variant = 'muted', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-caption font-medium whitespace-nowrap ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
