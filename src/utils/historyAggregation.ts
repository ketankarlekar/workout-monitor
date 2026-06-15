import { WorkoutSession, WeekInfo } from '../types';
import { fmtDate } from './date';

/**
 * Sessions reduced to only the exercises the user actually completed — this is
 * "the workout" for that day, as opposed to the full default exercise template.
 * Sessions with no completed exercises are dropped entirely.
 */
export function filterCompletedWork(sessions: WorkoutSession[]): WorkoutSession[] {
  return sessions
    .map(s => ({
      ...s,
      muscleGroups: s.muscleGroups
        .map(mg => ({ ...mg, exercises: mg.exercises.filter(e => e.completed) }))
        .filter(mg => mg.exercises.length > 0),
    }))
    .filter(s => s.muscleGroups.length > 0);
}

/** Sun–Sat weeks covering `month` (0-based) of `year`, each with the sessions that fall on its dates. */
export function buildSunSatWeeks(sessions: WorkoutSession[], year: number, month: number, todayKey: string): WeekInfo[] {
  const lastOfMonth = new Date(year, month + 1, 0);
  const weekStart = new Date(year, month, 1);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const result: WeekInfo[] = [];
  let cur = new Date(weekStart);
  let idx = 0;
  while (cur <= lastOfMonth) {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(cur);
      d.setDate(d.getDate() + i);
      dates.push(fmtDate(d));
    }
    result.push({
      index: idx++,
      dates,
      sessions: sessions.filter(s => dates.includes(s.date)),
      isCurrent: dates.includes(todayKey),
    });
    cur = new Date(cur);
    cur.setDate(cur.getDate() + 7);
  }
  return result;
}

/** Sessions whose date falls within `month` (0-based) of `year`. */
export function filterSessionsInMonth(sessions: WorkoutSession[], year: number, month: number): WorkoutSession[] {
  return sessions.filter(s => {
    const d = new Date(`${s.date}T00:00:00`);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

/** Counts sessions per workout type, for the "Workout Split" diagram. */
export function computeTypeCounts(sessions: WorkoutSession[]): Record<WorkoutSession['type'], number> {
  const counts: Record<WorkoutSession['type'], number> = { push: 0, pull: 0, legs: 0, saturday: 0 };
  sessions.forEach(s => { counts[s.type]++; });
  return counts;
}

/** Completed-exercise counts per muscle group, sorted descending, for the "Muscle Focus" diagram. */
export function computeMuscleCounts(sessions: WorkoutSession[]): [string, number][] {
  const counts = new Map<string, number>();
  sessions.forEach(s => s.muscleGroups.forEach(mg => {
    counts.set(mg.name, (counts.get(mg.name) || 0) + mg.exercises.length);
  }));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}
