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
