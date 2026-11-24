import { formatDate, formatTime } from '../../../../utils/format.js';

// Shown on Download for sample documents, which have no real file behind them.
export const NO_FILE_TITLE = 'Available when document storage is connected';

// "22 Sep 2026, 09:00 AM", or just the date when there is no time.
export function hearingWhen(hearing) {
  const date = formatDate(hearing.date, { short: true });
  return hearing.time ? `${date}, ${formatTime(hearing.time)}` : date;
}

// Next id for a new item in a list of { id: number }.
export function nextId(list) {
  return Math.max(0, ...list.map((item) => item.id)) + 1;
}
