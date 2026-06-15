import { Exercise, MuscleGroup, WorkoutSession, WorkoutType } from '../../types';

let uid = 0;

function exercise(name: string, muscleGroup: string, emoji: string, completed: boolean): Exercise {
  return { id: `ex-${++uid}`, name, muscleGroup, emoji, sets: 3, reps: 10, weight: 20, notes: '', completed };
}

function group(name: string, emoji: string, color: string, exercises: Exercise[]): MuscleGroup {
  return { id: `mg-${++uid}`, name, emoji, color, exercises, expanded: false };
}

/** Push day: 4 completed exercises across Chest / Shoulders / Triceps. */
function pushGroups(completed: boolean): MuscleGroup[] {
  return [
    group('Chest', '🫁', 'rgba(249,115,22,0.15)', [
      exercise('Barbell Bench Press', 'Chest', '🏋️', completed),
      exercise('Incline Dumbbell Press', 'Chest', '💪', completed),
    ]),
    group('Shoulders', '🤷', 'rgba(249,115,22,0.15)', [
      exercise('Dumbbell Lateral Raise', 'Shoulders', '↔️', completed),
    ]),
    group('Triceps', '💪', 'rgba(249,115,22,0.15)', [
      exercise('Cable Pushdown (Rope)', 'Triceps', '⬇️', completed),
    ]),
  ];
}

/** Pull day: 3 completed exercises across Back / Biceps. */
function pullGroups(completed: boolean): MuscleGroup[] {
  return [
    group('Back', '🦴', 'rgba(59,130,246,0.15)', [
      exercise('Pull-Up', 'Back', '🔝', completed),
      exercise('Barbell Row', 'Back', '🔧', completed),
    ]),
    group('Biceps', '💪', 'rgba(59,130,246,0.15)', [
      exercise('Barbell Curl', 'Biceps', '🥊', completed),
    ]),
  ];
}

/** Legs day: 3 completed exercises across Quads / Hamstrings. */
function legsGroups(completed: boolean): MuscleGroup[] {
  return [
    group('Quads', '🏋️', 'rgba(168,85,247,0.15)', [
      exercise('Squat', 'Quads', '🏆', completed),
      exercise('Leg Press', 'Quads', '🦵', completed),
    ]),
    group('Hamstrings', '🔄', 'rgba(168,85,247,0.15)', [
      exercise('Romanian Deadlift', 'Hamstrings', '🔻', completed),
    ]),
  ];
}

/** Saturday day: 2 completed exercises across Core / Legs. */
function saturdayGroups(completed: boolean): MuscleGroup[] {
  return [
    group('Core', '⬡', 'rgba(34,197,94,0.15)', [
      exercise('Hanging Leg Raise', 'Core', '🦵', completed),
    ]),
    group('Legs', '🦵', 'rgba(168,85,247,0.15)', [
      exercise('Step-Up', 'Legs', '🦶', completed),
    ]),
  ];
}

/**
 * 30 days of WorkoutSession data, May 1–30, 2026.
 * Mon/Thu = push, Tue/Fri = pull, Wed = legs, Sat = saturday — each fully completed.
 * Sun is a "rest day": a session exists but every exercise is marked incomplete, so it
 * has zero value once filtered down to completed work (`filterCompletedWork`).
 */
export const DUMMY_SESSIONS: WorkoutSession[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const date = `2026-05-${String(day).padStart(2, '0')}`;
  const dow = new Date(2026, 4, day).getDay(); // 0 = Sun .. 6 = Sat

  let type: WorkoutType;
  let muscleGroups: MuscleGroup[];
  switch (dow) {
    case 0: type = 'push'; muscleGroups = pushGroups(false); break; // rest day, nothing completed
    case 1: type = 'push'; muscleGroups = pushGroups(true); break;
    case 2: type = 'pull'; muscleGroups = pullGroups(true); break;
    case 3: type = 'legs'; muscleGroups = legsGroups(true); break;
    case 4: type = 'push'; muscleGroups = pushGroups(true); break;
    case 5: type = 'pull'; muscleGroups = pullGroups(true); break;
    default: type = 'saturday'; muscleGroups = saturdayGroups(true); break; // 6 = Sat
  }

  return {
    id: `session-${date}`,
    type,
    date,
    muscleGroups,
    completedAt: `${date}T18:00:00.000Z`,
  };
});
