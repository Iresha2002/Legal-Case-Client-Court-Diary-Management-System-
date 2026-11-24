import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { useCases } from '../../../state/casesContext.js';
import { formatDate, toDateValue } from '../../../utils/format.js';
import HearingCard from './HearingCard.jsx';
import { DayView, MonthView, WeekView } from './CalendarViews.jsx';
import {
  VIEWS,
  collectHearings,
  dayTitle,
  fromDateValue,
  groupByDate,
  hearingCount,
  monthTitle,
  shiftDate,
  weekDays,
  weekTitle,
} from './calendarHelpers.js';

const VIEW_LABELS = { month: 'Month', week: 'Week', day: 'Day' };
const SUBTITLE_SUFFIX = 'Your cases only';

const arrowButton =
  'flex size-11 items-center justify-center rounded-sm border border-border-strong bg-bg-surface text-text-primary hover:bg-neutral-100';

// Figma "JL 04 Court Calendar": hearings of the user's cases in Month, Week or Day view.
// The view and date are kept in the URL (?view=week&date=2026-09-15), so a reload keeps them.
// Hearings come from the cases data, so hearings scheduled on Case Details show up here.
export default function CourtCalendarPage() {
  const { cases, getDetails } = useCases();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDay, setOpenDay] = useState(null); // "yyyy-mm-dd" of the date dialog, or null

  const today = new Date();
  const todayValue = toDateValue(today);
  const view = VIEWS.includes(searchParams.get('view')) ? searchParams.get('view') : 'month';
  const date = fromDateValue(searchParams.get('date')) ?? today;

  const byDate = groupByDate(collectHearings(cases, getDetails));
  const entriesOn = (value) => byDate.get(value) ?? [];

  const show = (nextView, nextDate) => setSearchParams({ view: nextView, date: toDateValue(nextDate) });
  const openCase = (caseId) => navigate(`/cases/${caseId}`);

  let title = monthTitle(date);
  let subtitle = null;
  if (view === 'week') {
    title = weekTitle(date);
    subtitle = hearingCount(weekDays(date).reduce((sum, day) => sum + entriesOn(toDateValue(day)).length, 0));
  } else if (view === 'day') {
    title = dayTitle(date);
    subtitle = hearingCount(entriesOn(toDateValue(date)).length);
  }

  const dialogEntries = openDay ? entriesOn(openDay) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Court Calendar</h1>
        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" fullWidth={false} onClick={() => show(view, today)}>
            Today
          </Button>
          <button
            type="button"
            onClick={() => show(view, shiftDate(date, view, -1))}
            aria-label={`Previous ${view}`}
            className={arrowButton}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => show(view, shiftDate(date, view, 1))}
            aria-label={`Next ${view}`}
            className={arrowButton}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <section className="flex flex-col gap-5 rounded-md border border-border-default bg-bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[18px] leading-[26px] font-semibold text-text-primary" aria-live="polite">
              {title}
            </h2>
            {subtitle && (
              <p className="text-caption text-text-secondary">
                {subtitle} <span className="mx-1">|</span> {SUBTITLE_SUFFIX}
              </p>
            )}
          </div>
          <div className="flex rounded-sm bg-bg-page p-1" role="group" aria-label="Calendar view">
            {VIEWS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => show(option, date)}
                aria-pressed={option === view}
                className={`rounded-sm px-4 py-1.5 text-caption font-medium transition-colors ${
                  option === view
                    ? 'bg-action-primary text-text-inverse'
                    : 'text-text-primary hover:bg-border-default'
                }`}
              >
                {VIEW_LABELS[option]}
              </button>
            ))}
          </div>
        </div>

        {view === 'month' && <MonthView date={date} byDate={byDate} todayValue={todayValue} onOpenDay={setOpenDay} />}
        {view === 'week' && <WeekView date={date} byDate={byDate} todayValue={todayValue} onOpenDay={setOpenDay} />}
        {view === 'day' && <DayView entries={entriesOn(toDateValue(date))} onOpenCase={openCase} />}
      </section>

      {openDay && (
        <Modal
          title={formatDate(openDay)}
          subtitle={`${hearingCount(dialogEntries.length)}  |  ${SUBTITLE_SUFFIX}`}
          onClose={() => setOpenDay(null)}
        >
          <div className="flex flex-col gap-3">
            {dialogEntries.map((entry) => (
              <HearingCard key={entry.key} entry={entry} showStatus onOpenCase={openCase} />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
