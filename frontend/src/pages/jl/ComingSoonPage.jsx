// Temporary page for JL screens that are not built yet.
export default function ComingSoonPage({ title }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-serif text-[32px] leading-[40px] font-bold text-text-primary">{title}</h1>
      <p className="text-body text-text-secondary">This screen is coming soon.</p>
    </div>
  );
}
