import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Figma "Court Calendar" card: one month, Monday first, today in a black circle,
// and a dot under each day that has a hearing.
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// All days shown for a month, including the days from the months before and after that fill the first and last week.
function daysForMonth(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const total = Math.ceil((offset + daysInMonth) / 7) * 7;
  return Array.from({ length: total }, (_, i) => new Date(year, month, 1 - offset + i));
}

export default function MiniCalendar({ markedDates = [] }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const days = daysForMonth(view.year, view.month);
  const title = new Date(view.year, view.month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const changeMonth = (step) =>
    setView(({ year, month }) => {
      const date = new Date(year, month + step, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-body font-medium text-text-primary">{title}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="rounded-sm p-1 text-text-primary hover:bg-bg-page"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="rounded-sm p-1 text-text-primary hover:bg-bg-page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="pb-1 text-caption text-text-secondary">
            {day}
          </span>
        ))}

        {days.map((day) => {
          const inMonth = day.getMonth() === view.month;
          const isToday = isSameDay(day, today);
          const hasHearing = markedDates.some((date) => isSameDay(date, day));

          return (
            <div key={day.toISOString()} className="relative flex h-9 items-center justify-center">
              <span
                className={`flex size-[30px] items-center justify-center rounded-full text-caption ${
                  isToday
                    ? 'bg-action-primary font-semibold text-text-inverse'
                    : inMonth
                      ? 'text-text-primary'
                      : 'text-text-secondary opacity-70'
                }`}
              >
                {day.getDate()}
              </span>
              {hasHearing && (
                <span className="absolute bottom-0 size-1 rounded-full bg-text-primary" aria-label="Hearing" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
