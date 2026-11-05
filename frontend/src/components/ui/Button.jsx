// Figma "Button": Primary = solid black (one per page). Secondary = white with black outline.
const variants = {
  primary: 'bg-action-primary text-action-primary-text border-action-primary hover:bg-neutral-800',
  secondary: 'bg-bg-surface text-text-primary border-border-strong hover:bg-neutral-100',
};

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-sm border px-5 py-3 text-body font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
