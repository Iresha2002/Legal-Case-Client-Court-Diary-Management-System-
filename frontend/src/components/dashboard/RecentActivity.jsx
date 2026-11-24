// Figma "Recent Activity": latest actions on the user's cases.
export default function RecentActivity({ items }) {
  if (items.length === 0) {
    return <p className="text-body text-text-secondary">No recent activity.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-text-primary" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-body font-medium text-text-primary">{item.title}</p>
            <p className="text-caption text-text-secondary">{item.description}</p>
          </div>
          <span className="shrink-0 text-caption text-text-secondary">{item.time}</span>
        </li>
      ))}
    </ul>
  );
}
