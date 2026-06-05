import { MuscleGroup, WorkoutType } from '../types';

let _id = 0;
const uid = () => String(++_id);

function ex(name: string, emoji: string, mg: string, sets: number, reps: number, weight: number | null = null): import('../types').Exercise {
  return { id: uid(), name, muscleGroup: mg, emoji, sets, reps, weight, notes: '', completed: false };
}

export const DEFAULT_WORKOUTS: Record<WorkoutType, MuscleGroup[]> = {
  push: [
    {
      id: uid(), name: 'Chest', emoji: '🫁', color: 'rgba(249,115,22,0.15)', expanded: true,
      exercises: [
        ex('Bench Press', '🏋️', 'Chest', 4, 8, 80),
        ex('Incline Dumbbell Press', '💪', 'Chest', 3, 10, 24),
        ex('Cable Fly', '🤸', 'Chest', 3, 12, 15),
      ],
    },
    {
      id: uid(), name: 'Shoulders', emoji: '🤷', color: 'rgba(249,115,22,0.15)', expanded: false,
      exercises: [
        ex('Overhead Press', '🏅', 'Shoulders', 4, 6, 60),
        ex('Lateral Raise', '↔️', 'Shoulders', 3, 15, 10),
      ],
    },
    {
      id: uid(), name: 'Triceps', emoji: '💪', color: 'rgba(249,115,22,0.15)', expanded: false,
      exercises: [
        ex('Tricep Pushdown', '⬇️', 'Triceps', 3, 12, 30),
        ex('Overhead Tricep Extension', '🙆', 'Triceps', 3, 12, 25),
      ],
    },
  ],
  pull: [
    {
      id: uid(), name: 'Back', emoji: '🦴', color: 'rgba(59,130,246,0.15)', expanded: true,
      exercises: [
        ex('Pull-ups', '🔝', 'Back', 4, 8, null),
        ex('Barbell Row', '🔧', 'Back', 4, 6, 90),
      ],
    },
    {
      id: uid(), name: 'Rear Delts', emoji: '↩️', color: 'rgba(59,130,246,0.15)', expanded: false,
      exercises: [
        ex('Face Pulls', '🔄', 'Rear Delts', 3, 15, 20),
      ],
    },
    {
      id: uid(), name: 'Biceps', emoji: '💪', color: 'rgba(59,130,246,0.15)', expanded: false,
      exercises: [
        ex('Barbell Curl', '🥊', 'Biceps', 4, 10, 40),
      ],
    },
    {
      id: uid(), name: 'Forearms', emoji: '🤜', color: 'rgba(59,130,246,0.15)', expanded: false,
      exercises: [
        ex('Wrist Curls', '✊', 'Forearms', 3, 20, 15),
      ],
    },
  ],
  legs: [
    {
      id: uid(), name: 'Quads', emoji: '🏋️', color: 'rgba(168,85,247,0.15)', expanded: true,
      exercises: [
        ex('Squat', '🏆', 'Quads', 5, 5, 100),
        ex('Leg Press', '🦵', 'Quads', 4, 10, 180),
      ],
    },
    {
      id: uid(), name: 'Hamstrings', emoji: '🔄', color: 'rgba(168,85,247,0.15)', expanded: false,
      exercises: [
        ex('Romanian Deadlift', '🔻', 'Hamstrings', 4, 8, 80),
      ],
    },
    {
      id: uid(), name: 'Glutes', emoji: '🍑', color: 'rgba(168,85,247,0.15)', expanded: false,
      exercises: [
        ex('Hip Thrust', '🔺', 'Glutes', 4, 12, 100),
      ],
    },
    {
      id: uid(), name: 'Calves', emoji: '🦶', color: 'rgba(168,85,247,0.15)', expanded: false,
      exercises: [],
    },
    {
      id: uid(), name: 'Adductors', emoji: '🦵', color: 'rgba(168,85,247,0.15)', expanded: false,
      exercises: [],
    },
  ],
  saturday: [
    { id: uid(), name: 'Chest',     emoji: '🫁', color: 'rgba(249,115,22,0.15)',  expanded: false, exercises: [] },
    { id: uid(), name: 'Back',      emoji: '🦴', color: 'rgba(59,130,246,0.15)', expanded: false, exercises: [] },
    { id: uid(), name: 'Shoulders', emoji: '🤷', color: 'rgba(249,115,22,0.15)', expanded: false, exercises: [] },
    { id: uid(), name: 'Biceps',    emoji: '💪', color: 'rgba(59,130,246,0.15)', expanded: false, exercises: [] },
    { id: uid(), name: 'Triceps',   emoji: '💪', color: 'rgba(249,115,22,0.15)', expanded: false, exercises: [] },
    { id: uid(), name: 'Legs',      emoji: '🦵', color: 'rgba(168,85,247,0.15)', expanded: false, exercises: [] },
    { id: uid(), name: 'Core',      emoji: '⬡',  color: 'rgba(34,197,94,0.15)',  expanded: false, exercises: [] },
    { id: uid(), name: 'Forearms',  emoji: '🤜', color: 'rgba(59,130,246,0.15)', expanded: false, exercises: [] },
  ],
};

export function cloneWorkout(type: WorkoutType): MuscleGroup[] {
  return JSON.parse(JSON.stringify(DEFAULT_WORKOUTS[type]));
}
