import { formatDate, toDateValue } from '../../../utils/format.js';

// Date helpers for the Court Calendar. Weeks start on Monday, like the Figma calendar.

export const VIEWS = ['month', 'week', 'day'];
export const WEEKDAYS_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const WEEKDAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// "2026-09-15" -> a Date at local midnight. Returns null for anything else.
export function fromDateValue(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// 0 = Monday ... 6 = Sunday
function weekdayIndex(date) {
  return (date.getDay() + 6) % 7;
}

// The 7 days (Monday to Sunday) of the week that contains `date`.
export function weekDays(date) {
  const monday = addDays(date, -weekdayIndex(date));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

// All days shown in a month grid, including days from the months before and after
// that fill the first and last week.
export function monthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const offset = weekdayIndex(new Date(year, month, 1));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const total = Math.ceil((offset + daysInMonth) / 7) * 7;
  return Array.from({ length: total }, (_, i) => new Date(year, month, 1 - offset + i));
}

// Moves one month, week or day forward (step 1) or back (step -1).
export function shiftDate(date, view, step) {
  if (view === 'month') return new Date(date.getFullYear(), date.getMonth() + step, 1);
  return addDays(date, view === 'week' ? 7 * step : step);
}

// "September 2026"
export function monthTitle(date) {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

// "September 14 - 20, 2026", "September 28 - October 4, 2026", or across years with both years.
export function weekTitle(date) {
  const days = weekDays(date);
  const start = days[0];
  const end = days[6];
  const startMonth = MONTHS[start.getMonth()];
  const endMonth = MONTHS[end.getMonth()];
  if (start.getFullYear() !== end.getFullYear()) {
    return `${startMonth} ${start.getDate()}, ${start.getFullYear()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
  }
  if (start.getMonth() !== end.getMonth()) {
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${end.getFullYear()}`;
}

// "Tuesday, 15 September 2026"
export function dayTitle(date) {
  return `${WEEKDAYS_LONG[weekdayIndex(date)]}, ${formatDate(toDateValue(date))}`;
}

// "1 hearing", "2 hearings"
export function hearingCount(count) {
  return `${count} ${count === 1 ? 'hearing' : 'hearings'}`;
}

// Every hearing of the user's cases, oldest first, as
// { key, caseItem, hearing, number (Hearing 1, 2...), previous (the hearing before it, or null) }.
export function collectHearings(cases, getDetails) {
  return cases
    .filter((item) => item.assignedToMe)
    .flatMap((item) => {
      const { hearings } = getDetails(item.id);
      return hearings.map((hearing, index) => ({
        key: `${item.id}-${hearing.id}`,
        caseItem: item,
        hearing,
        number: index + 1,
        previous: hearings[index - 1] ?? null,
      }));
    })
    .sort((a, b) => `${a.hearing.date} ${a.hearing.time}`.localeCompare(`${b.hearing.date} ${b.hearing.time}`));
}

// Groups the hearings by date: Map { "2026-09-22" => [entry, entry] }.
export function groupByDate(entries) {
  const map = new Map();
  entries.forEach((entry) => {
    const list = map.get(entry.hearing.date) ?? [];
    list.push(entry);
    map.set(entry.hearing.date, list);
  });
  return map;
}
