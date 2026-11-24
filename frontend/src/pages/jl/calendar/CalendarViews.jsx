import Badge from '../../../components/ui/Badge.jsx';
import { formatTime, toDateValue } from '../../../utils/format.js';
import HearingCard from './HearingCard.jsx';
import { WEEKDAYS_SHORT, monthDays, weekDays } from './calendarHelpers.js';

const MAX_CHIPS = 2; // hearings shown in a month cell before "+N more"

// Completed hearings are grey and upcoming ones black, like the Figma month view.
function chipClass(entry) {
  return entry.hearing.status === 'Completed'
    ? 'bg-border-default text-text-primary hover:bg-neutral-300'
    : 'bg-action-primary text-text-inverse hover:bg-neutral-800';
}

function hearingLabel(entry) {
  return `${entry.caseItem.id}, hearing ${entry.number}, ${entry.hearing.status.toLowerCase()}`;
}

// Figma "JL 04 Court Calendar" month grid. Clicking a hearing opens that day's hearings.
export function MonthView({ date, byDate, todayValue, onOpenDay }) {
  const days = monthDays(date);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-7 pb-2">
          {WEEKDAYS_SHORT.map((day) => (
            <span key={day} className="px-2 text-label font-semibold tracking-[0.06em] text-text-secondary">
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 overflow-hidden rounded-md border border-border-default">
          {days.map((day, index) => {
            const value = toDateValue(day);
            const inMonth = day.getMonth() === date.getMonth();
            const entries = byDate.get(value) ?? [];
            return (
              <div
                key={value}
                className={`flex min-h-[96px] flex-col gap-1 border-border-default p-2 ${index % 7 ? 'border-l' : ''} ${
                  index >= 7 ? 'border-t' : ''
                } ${inMonth ? 'bg-bg-surface' : 'bg-bg-page'}`}
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-caption ${
                    value === todayValue
                      ? 'bg-action-primary font-semibold text-text-inverse'
                      : inMonth
                        ? 'text-text-primary'
                        : 'text-neutral-300'
                  }`}
                >
                  {day.getDate()}
                </span>
                {entries.slice(0, MAX_CHIPS).map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => onOpenDay(value)}
                    aria-label={hearingLabel(entry)}
                    className={`truncate rounded-sm px-2 py-1 text-left text-caption font-medium ${chipClass(entry)}`}
                  >
                    {entry.caseItem.id}
                  </button>
                ))}
                {entries.length > MAX_CHIPS && (
                  <button
                    type="button"
                    onClick={() => onOpenDay(value)}
                    className="text-left text-caption text-text-secondary hover:underline"
                  >
                    +{entries.length - MAX_CHIPS} more
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Figma "JL 04.3 - 04.5 Week" view: one column per day with a card for each hearing.
export function WeekView({ date, byDate, todayValue, onOpenDay }) {
  const days = weekDays(date);

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[720px] grid-cols-7 overflow-hidden rounded-md border border-border-default">
        {days.map((day, index) => {
          const value = toDateValue(day);
          const entries = byDate.get(value) ?? [];
          return (
            <div key={value} className={`flex flex-col border-border-default ${index ? 'border-l' : ''}`}>
              <div className="flex flex-col items-center gap-1 bg-bg-page py-3">
                <span className="text-label font-semibold tracking-[0.06em] text-text-secondary">
                  {WEEKDAYS_SHORT[index]}
                </span>
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-body ${
                    value === todayValue ? 'bg-action-primary font-semibold text-text-inverse' : 'text-text-primary'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>
              <div className="flex min-h-[340px] flex-col gap-2 p-2">
                {entries.map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => onOpenDay(value)}
                    aria-label={hearingLabel(entry)}
                    className="flex flex-col items-start gap-1 rounded-sm border-l-2 border-action-primary bg-bg-page p-2 text-left hover:bg-border-default"
                  >
                    <span className="text-caption text-text-secondary">{formatTime(entry.hearing.time)}</span>
                    <span className="text-body font-medium text-text-primary">{entry.caseItem.id}</span>
                    <Badge>{entry.caseItem.type}</Badge>
                    <span className="text-caption text-text-secondary">{entry.hearing.courtRoom}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Figma "JL 04.6 - 04.8 Day" view: the day's hearings with time on the left and full details.
export function DayView({ entries, onOpenCase }) {
  if (entries.length === 0) {
    return <p className="py-10 text-center text-body text-text-secondary">No hearings on this day.</p>;
  }

  return (
    <ol className="flex flex-col gap-4">
      {entries.map((entry) => (
        <li key={entry.key} className="grid grid-cols-1 gap-3 sm:grid-cols-[96px_1fr]">
          <div className="flex flex-col sm:items-end sm:pt-4">
            <span className="text-body font-semibold text-text-primary">{formatTime(entry.hearing.time) || '—'}</span>
            <span className="text-caption text-text-secondary">Hearing {entry.number}</span>
          </div>
          <HearingCard entry={entry} highlighted onOpenCase={onOpenCase} />
        </li>
      ))}
    </ol>
  );
}
