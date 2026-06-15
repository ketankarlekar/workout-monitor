import { describe, it, expect } from 'vitest';
import { DUMMY_SESSIONS } from '../__fixtures__/dummySessions';
import { filterCompletedWork, buildSunSatWeeks, filterSessionsInMonth, computeTypeCounts, computeMuscleCounts } from '../historyAggregation';

/** Total completed exercises across all muscle groups in a set of sessions. */
function totalCompletedExercises(sessions: ReturnType<typeof filterCompletedWork>): number {
  return sessions.reduce((sum, s) => sum + s.muscleGroups.reduce((m, mg) => m + mg.exercises.length, 0), 0);
}

describe('filterCompletedWork', () => {
  it('drops the 4 Sundays (rest days with nothing completed) and keeps the other 26 days', () => {
    const completed = filterCompletedWork(DUMMY_SESSIONS);
    expect(completed).toHaveLength(26);
    expect(completed.some(s => s.date === '2026-05-03')).toBe(false); // Sunday
    expect(completed.some(s => s.date === '2026-05-11')).toBe(true); // Monday
  });
});

describe('Week view — buildSunSatWeeks', () => {
  const completed = filterCompletedWork(DUMMY_SESSIONS);
  const weeks = buildSunSatWeeks(completed, 2026, 4, '2099-01-01');

  it('splits May 2026 into 6 Sun-Sat weeks with the correct date ranges', () => {
    expect(weeks).toHaveLength(6);
    expect(weeks[0].dates).toEqual(['2026-04-26', '2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30', '2026-05-01', '2026-05-02']);
    expect(weeks[2].dates).toEqual(['2026-05-10', '2026-05-11', '2026-05-12', '2026-05-13', '2026-05-14', '2026-05-15', '2026-05-16']);
    expect(weeks[5].dates).toEqual(['2026-05-31', '2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05', '2026-06-06']);
  });

  it('Test Case A: week of May 10-16 sums/filters only that week\'s 7 days', () => {
    const week = weeks[2];

    // May 10 (Sun) was a rest day and was dropped by filterCompletedWork, so only 6 remain.
    expect(week.sessions.map(s => s.date)).toEqual([
      '2026-05-11', '2026-05-12', '2026-05-13', '2026-05-14', '2026-05-15', '2026-05-16',
    ]);
    expect(week.sessions).toHaveLength(6);

    // 4 (push) + 3 (pull) + 3 (legs) + 4 (push) + 3 (pull) + 2 (saturday) = 19
    expect(totalCompletedExercises(week.sessions)).toBe(19);
  });

  it('does not leak sessions from adjacent weeks into week 2', () => {
    const week2Dates = new Set(weeks[2].dates);
    weeks[1].sessions.forEach(s => expect(week2Dates.has(s.date)).toBe(false));
    weeks[3].sessions.forEach(s => expect(week2Dates.has(s.date)).toBe(false));
  });

  it('marks isCurrent based on the provided "today" key', () => {
    const weeksWithToday = buildSunSatWeeks(completed, 2026, 4, '2026-05-12');
    expect(weeksWithToday[2].isCurrent).toBe(true);
    expect(weeksWithToday[1].isCurrent).toBe(false);
    expect(weeksWithToday[3].isCurrent).toBe(false);
  });
});

describe('Month view — filterSessionsInMonth / computeTypeCounts / computeMuscleCounts', () => {
  const completed = filterCompletedWork(DUMMY_SESSIONS);
  const monthSessions = filterSessionsInMonth(completed, 2026, 4); // May = month index 4

  it('Test Case B: aggregates all of May 2026 (26 of the 30 dummy days have completed work)', () => {
    expect(monthSessions).toHaveLength(26);
    expect(monthSessions.every(s => s.date.startsWith('2026-05'))).toBe(true);
  });

  it('counts sessions per workout type for the Workout Split diagram', () => {
    expect(computeTypeCounts(monthSessions)).toEqual({ push: 8, pull: 9, legs: 4, saturday: 5 });
  });

  it('sums completed exercises across the whole month', () => {
    // push: 8*4 + pull: 9*3 + legs: 4*3 + saturday: 5*2 = 32 + 27 + 12 + 10 = 81
    expect(totalCompletedExercises(monthSessions)).toBe(81);
  });

  it('ranks the top 5 muscle groups by completed-exercise count for the Muscle Focus diagram', () => {
    expect(computeMuscleCounts(monthSessions)).toEqual([
      ['Back', 18],
      ['Chest', 16],
      ['Biceps', 9],
      ['Shoulders', 8],
      ['Triceps', 8],
    ]);
  });

  it('a different month returns no sessions from the May fixture', () => {
    expect(filterSessionsInMonth(completed, 2026, 5)).toHaveLength(0); // June
  });
});
