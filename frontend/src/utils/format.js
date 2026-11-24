// Small text helpers shared by several screens.

// "Nimal Perera" -> "NP"
export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

// Written out by hand: some browsers shorten September to "Sept", Figma uses "Sep".
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

// Date input value (yyyy-mm-dd) to display text:
// "2026-01-08" -> "08 January 2026", or with { short: true } -> "08 Jan 2026".
export function formatDate(value, { short = false } = {}) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  const monthName = short ? MONTHS[month - 1].slice(0, 3) : MONTHS[month - 1];
  return `${String(day).padStart(2, '0')} ${monthName} ${year}`;
}

// A Date to the date input format: today -> "2026-11-24".
export function toDateValue(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Time input value (24-hour "HH:MM") to display text: "09:00" -> "09:00 AM", "14:30" -> "02:30 PM".
export function formatTime(value) {
  if (!value) return '';
  const [hours, minutes] = value.split(':').map(Number);
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
}

// File size in bytes to display text: 250880 -> "245 KB", 1468006 -> "1.4 MB".
export function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
