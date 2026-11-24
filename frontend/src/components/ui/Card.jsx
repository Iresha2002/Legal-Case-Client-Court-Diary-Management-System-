// White rounded box used for dashboard sections. `action` sits on the right of the title.
export default function Card({ title, action, className = '', children }) {
  return (
    <section className={`flex flex-col gap-6 rounded-md border border-border-default bg-bg-surface p-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[18px] leading-[26px] font-semibold text-text-primary">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
