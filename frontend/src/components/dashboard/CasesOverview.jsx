// Figma "Cases Overview": donut chart of cases by status, with a legend below.
// Ongoing uses the theme's primary colour, so it stays visible in dark mode.
const STATUS_COLORS = {
  ongoing: 'var(--color-action-primary)',
  pending: '#737373',
  closed: '#d4d4d4',
};

const SIZE = 156;
const STROKE = 20;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2; // white space between segments

function DonutChart({ items, total }) {
  // Where each segment starts on the circle, from the top, going clockwise.
  const segments = items.reduce((list, item) => {
    const start = list.length ? list[list.length - 1].start + list[list.length - 1].length : 0;
    const length = total ? (item.count / total) * CIRCUMFERENCE : 0;
    return [...list, { ...item, start, length }];
  }, []);

  return (
    <div className="relative size-[156px]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full -rotate-90" aria-hidden="true">
        {segments
          .filter((segment) => segment.length > 0)
          .map((segment) => (
            <circle
              key={segment.status}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={STATUS_COLORS[segment.status]}
              strokeWidth={STROKE}
              strokeDasharray={`${Math.max(segment.length - GAP, 0)} ${CIRCUMFERENCE}`}
              strokeDashoffset={-segment.start}
            />
          ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[32px] leading-[40px] font-bold text-text-primary">{total}</span>
        <span className="text-label font-medium tracking-[0.06em] text-text-secondary">TOTAL</span>
      </div>
    </div>
  );
}

export default function CasesOverview({ items }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center">
        <DonutChart items={items} total={total} />
      </div>
      <ul className="flex flex-col gap-3" aria-label="Cases by status">
        {items.map((item) => (
          <li key={item.status} className="flex items-center justify-between text-body">
            <span className="flex items-center gap-2.5 text-text-secondary">
              <span className="size-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] }} />
              {item.label}
            </span>
            <span className="font-medium text-text-primary">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
