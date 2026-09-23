export const SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];

export const TIMEZONE_OFFSET = '-03:00';
const OFFSET_MINUTES = -180;

export function toScheduledAt(date, slot) {
  return new Date(`${date}T${slot}:00${TIMEZONE_OFFSET}`);
}

export function toLocalParts(value) {
  const shifted = new Date(new Date(value).getTime() + OFFSET_MINUTES * 60_000);
  const iso = shifted.toISOString();
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
}

export function getDayRange(date) {
  const start = toScheduledAt(date, '00:00');
  const end = new Date(start.getTime() + 24 * 60 * 60_000);
  return { start, end };
}

export function isValidSlot(value) {
  const date = new Date(value);
  if (date.getUTCSeconds() !== 0 || date.getUTCMilliseconds() !== 0) return false;
  return SLOTS.includes(toLocalParts(date).time);
}
