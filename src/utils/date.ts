export const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const SHORT_DOW = ['S','M','T','W','T','F','S'];
export const FULL_DOW = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/** Build the same 'YYYY-MM-DD' key used for WorkoutSession.date / dayNotes. */
export function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** e.g. "Jun 1 – 7" or "May 28 – Jun 3" for ranges spanning two months. */
export function formatDateRange(start: string, end: string): string {
  const [, sm, sd] = start.split('-').map(Number);
  const [, em, ed] = end.split('-').map(Number);
  if (sm === em) return `${SHORT_MONTHS[sm - 1]} ${sd} – ${ed}`;
  return `${SHORT_MONTHS[sm - 1]} ${sd} – ${SHORT_MONTHS[em - 1]} ${ed}`;
}

/** 0-based month index from a 'YYYY-MM-DD' key. */
export function monthOfDateKey(dateKey: string): number {
  return Number(dateKey.split('-')[1]) - 1;
}
