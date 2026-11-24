import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import { formatDate, formatTime } from '../../../utils/format.js';

// Joins the parts that have a value with a "|" between them.
function Line({ parts, className }) {
  const shown = parts.filter(Boolean);
  return (
    <p className={className}>
      {shown.map((part, index) => (
        <span key={part}>
          {index > 0 && <span className="mx-1.5">|</span>}
          {part}
        </span>
      ))}
    </p>
  );
}

function SummaryBox({ title, text, bordered = false }) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-sm px-3 py-2.5 ${
        bordered ? 'border border-border-default bg-bg-surface' : 'bg-bg-page'
      }`}
    >
      <p className="text-label font-semibold tracking-[0.06em] text-text-secondary">{title}</p>
      <p className="text-caption text-text-primary">{text}</p>
    </div>
  );
}

// One hearing in the Court Calendar day list and the date dialog (Figma 04.1, 04.2, 04.6 - 04.8):
// case, client, time, court, the previous hearing's summary, this hearing's summary once it
// is completed, and an Open Case button.
export default function HearingCard({ entry, showStatus = false, highlighted = false, onOpenCase }) {
  const { caseItem, hearing, number, previous } = entry;
  const done = hearing.status === 'Completed';

  return (
    <article
      className={`flex flex-col gap-2 rounded-md border bg-bg-surface p-4 ${
        highlighted ? 'border-border-strong' : 'border-border-default'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-body font-semibold text-text-primary">{caseItem.id}</h3>
          <Badge>{caseItem.type}</Badge>
          {showStatus && <span className="text-body text-text-secondary">Hearing {number}</span>}
        </div>
        {showStatus && <Badge variant={done ? 'outline' : 'dark'}>{done ? 'Completed' : 'Upcoming'}</Badge>}
      </div>

      <Line parts={[caseItem.clientName, formatTime(hearing.time)]} className="text-caption text-text-secondary" />
      <Line parts={[caseItem.court, hearing.courtRoom, hearing.judge]} className="text-caption text-text-primary" />

      {previous?.summary && (
        <SummaryBox
          title={`PREVIOUS HEARING SUMMARY  |  Hearing ${number - 1}, ${formatDate(previous.date, { short: true })}`}
          text={previous.summary}
        />
      )}
      {done && hearing.summary && <SummaryBox title="THIS HEARING'S SUMMARY" text={hearing.summary} bordered />}

      <div>
        <Button type="button" variant="secondary" fullWidth={false} onClick={() => onOpenCase(caseItem.id)}>
          Open Case
        </Button>
      </div>
    </article>
  );
}
