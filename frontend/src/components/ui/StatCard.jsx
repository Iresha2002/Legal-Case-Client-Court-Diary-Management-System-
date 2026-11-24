// Figma "Practice metric": small label, big number, short note and an icon on the right.
export default function StatCard({ label, value, note, icon: Icon }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border-default bg-bg-surface px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-label font-medium text-text-secondary">{label}</p>
        {Icon && <Icon size={20} className="shrink-0 text-text-primary" aria-hidden="true" />}
      </div>
      <p className="text-[32px] leading-[40px] font-bold text-text-primary">{value}</p>
      {note && <p className="text-caption text-text-secondary">{note}</p>}
    </div>
  );
}
