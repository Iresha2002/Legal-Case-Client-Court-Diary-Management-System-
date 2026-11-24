import { Check, Plus } from 'lucide-react';
import Badge from '../../../../components/ui/Badge.jsx';
import Button from '../../../../components/ui/Button.jsx';
import { hearingWhen } from './detailsHelpers.js';

function TimelineItem({ number, hearing, isLast, onAddSummary }) {
  const done = hearing.status === 'Completed';

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center" aria-hidden="true">
        {done ? (
          <span className="mt-3 flex size-5 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-inverse">
            <Check size={12} strokeWidth={3} />
          </span>
        ) : (
          <span className="mt-3 size-5 shrink-0 rounded-full border-2 border-action-primary bg-bg-surface" />
        )}
        {!isLast && <span className="w-px flex-1 bg-border-default" />}
      </div>

      <div
        className={`mb-3 flex min-w-0 flex-1 flex-col gap-2 rounded-md border border-border-default p-4 ${
          done ? 'bg-bg-surface' : 'bg-bg-page'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-body">
            <span className="font-medium text-text-primary">Hearing {number}</span>
            <span className="ml-3 text-text-secondary">{hearingWhen(hearing)}</span>
          </p>
          <Badge variant={done ? 'outline' : 'muted'}>{done ? 'Completed' : 'Upcoming'}</Badge>
        </div>
        <p className="text-caption text-text-secondary">
          {hearing.courtRoom} <span className="mx-1">|</span> {hearing.judge}
        </p>

        {done ? (
          <div className="flex flex-col gap-1 rounded-sm bg-bg-page px-3 py-2.5">
            <p className="text-label font-semibold tracking-[0.06em] text-text-secondary">SUMMARY</p>
            <p className="text-caption text-text-primary">{hearing.summary}</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-dashed border-border-default px-3 py-3">
            <p className="text-caption text-text-secondary">Summary can be added once this hearing is completed.</p>
            <Button
              type="button"
              variant="secondary"
              fullWidth={false}
              onClick={() => onAddSummary(hearing, number)}
              className="print:hidden"
            >
              Add Summary
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}

// Figma "Hearing Timeline" (JL 03.2, 03.8, 03.10). The latest hearing stays "Upcoming"
// until its summary is added; only then can the next hearing be scheduled.
export default function HearingTimeline({ hearings, onAddSummary, onSchedule }) {
  const last = hearings[hearings.length - 1];
  const canSchedule = !last || last.status === 'Completed';

  let subtitle = 'No hearings yet. Schedule the first hearing.';
  if (last?.status === 'Upcoming') {
    subtitle = `Add the summary of Hearing ${hearings.length} after it is completed to schedule the next one.`;
  } else if (last) {
    subtitle = `Hearing ${hearings.length} is complete. Schedule the next hearing.`;
  }

  return (
    <section className="flex flex-col gap-5 rounded-md border border-border-default bg-bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[26px] font-semibold text-text-primary">Hearing Timeline</h2>
          <p className="text-caption text-text-secondary">{subtitle}</p>
        </div>
        {canSchedule && (
          <Button type="button" fullWidth={false} onClick={onSchedule} className="print:hidden">
            <Plus size={16} aria-hidden="true" />
            {last ? 'Schedule Next Hearing' : 'Schedule Hearing'}
          </Button>
        )}
      </div>

      {hearings.length > 0 && (
        <ol className="flex flex-col">
          {hearings.map((hearing, index) => (
            <TimelineItem
              key={hearing.id}
              number={index + 1}
              hearing={hearing}
              isLast={index === hearings.length - 1}
              onAddSummary={onAddSummary}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
