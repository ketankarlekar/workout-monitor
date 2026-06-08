import { MuscleGroup, WorkoutType } from '../types';

let _id = 0;
const uid = () => String(++_id);

function ex(name: string, emoji: string, mg: string, sets: number, reps: number, weight: number | null = null): import('../types').Exercise {
  return { id: uid(), name, muscleGroup: mg, emoji, sets, reps, weight, notes: '', completed: false };
}

export const EXERCISE_SUGGESTIONS: Record<string, string[]> = {
  Chest: [
    'Barbell Bench Press', 'Incline Barbell Bench Press', 'Decline Barbell Bench Press',
    'Dumbbell Bench Press', 'Incline Dumbbell Bench Press', 'Decline Dumbbell Bench Press',
    'Push-Up', 'Wide Push-Up', 'Narrow Push-Up', 'Decline Push-Up', 'Incline Push-Up', 'Weighted Push-Up',
    'Chest Dip', 'Machine Chest Press', 'Smith Machine Bench Press',
    'Cable Crossover (High)', 'Cable Crossover (Low)', 'Cable Crossover (Mid)',
    'Pec Deck', 'Floor Press', 'Svend Press', 'Landmine Press', 'Guillotine Press',
    'Dumbbell Fly', 'Incline Dumbbell Fly', 'Decline Dumbbell Fly',
    'Cable Fly', 'Reverse Grip Bench Press', 'Close-Grip Bench Press',
  ],
  Shoulders: [
    'Barbell Overhead Press', 'Dumbbell Overhead Press', 'Seated Overhead Press',
    'Arnold Press', 'Push Press', 'Behind-the-Neck Press',
    'Machine Shoulder Press', 'Smith Machine Overhead Press', 'Landmine Shoulder Press',
    'Dumbbell Lateral Raise', 'Front Raise', 'Cable Front Raise', 'Barbell Front Raise', 'Plate Front Raise',
    'Upright Row', 'Lu Raises', 'Single-Arm Cable Shoulder Press',
    'Pike Push-Up', 'Handstand Push-Up',
  ],
  Triceps: [
    'Close-Grip Bench Press', 'Triceps Dip', 'Bench Dip', 'Diamond Push-Up',
    'Skull Crusher', 'EZ Bar Skull Crusher', 'Dumbbell Skull Crusher', 'Floor Skull Crusher',
    'Overhead Triceps Extension', 'Cable Overhead Triceps Extension',
    'Cable Pushdown (Rope)', 'Cable Pushdown (V-Bar)', 'Cable Pushdown (Straight Bar)',
    'Reverse Grip Pushdown', 'Single-Arm Cable Pushdown',
    'Machine Triceps Dip', 'JM Press', 'Tate Press', 'Triceps Kickback',
  ],
  Back: [
    'Pull-Up', 'Chin-Up', 'Barbell Row', 'Dumbbell Row', 'Cable Row',
    'T-Bar Row', 'Pendlay Row', 'Meadows Row', 'Lat Pulldown',
    'Straight-Arm Pulldown', 'Seated Cable Row', 'Single-Arm Cable Row',
    'Deadlift', 'Rack Pull', 'Hyperextension',
  ],
  'Rear Delts': [
    'Face Pulls', 'Reverse Fly', 'Dumbbell Reverse Fly', 'Cable Reverse Fly',
    'Band Pull-Apart', 'Prone Y Raise', 'Prone T Raise',
  ],
  Biceps: [
    'Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl',
    'Concentration Curl', 'Incline Dumbbell Curl', 'Cable Curl',
    'EZ Bar Curl', 'Spider Curl', 'Zottman Curl',
  ],
  Forearms: [
    'Wrist Curls', 'Reverse Wrist Curls', 'Farmers Walk', 'Dead Hang',
    'Plate Pinch', 'Reverse Curl',
  ],
  Quads: [
    'Squat', 'Front Squat', 'Hack Squat', 'Leg Press', 'Leg Extension',
    'Bulgarian Split Squat', 'Lunge', 'Walking Lunge', 'Step-Up',
    'Smith Machine Squat', 'Box Squat',
  ],
  Hamstrings: [
    'Romanian Deadlift', 'Leg Curl (Lying)', 'Leg Curl (Seated)', 'Good Morning',
    'Nordic Hamstring Curl', 'Stiff-Leg Deadlift', 'Glute-Ham Raise',
  ],
  Glutes: [
    'Hip Thrust', 'Barbell Glute Bridge', 'Cable Kickback', 'Donkey Kick',
    'Sumo Squat', 'Romanian Deadlift', 'Step-Up',
  ],
  Calves: [
    'Standing Calf Raise', 'Seated Calf Raise', 'Leg Press Calf Raise',
    'Single-Leg Calf Raise', 'Donkey Calf Raise',
  ],
  Adductors: [
    'Adductor Machine', 'Sumo Squat', 'Copenhagen Plank', 'Side Lunge',
  ],
  Core: [
    'Plank', 'Side Plank', 'Crunch', 'Sit-Up', 'Leg Raise', 'Hanging Leg Raise',
    'Ab Wheel Rollout', 'Cable Crunch', 'Russian Twist', 'Dragon Flag',
    'Pallof Press', 'Dead Bug', 'Hollow Body Hold',
  ],
};

export const DEFAULT_WORKOUTS: Record<WorkoutType, MuscleGroup[]> = {
  push: [
    {
      id: uid(), name: 'Chest', emoji: '🫁', color: 'rgba(249,115,22,0.15)', expanded: true,
      exercises: [
        // Barbell
        ex('Barbell Bench Press', '🏋️', 'Chest', 4, 8, 80),
        ex('Incline Barbell Bench Press', '🏋️', 'Chest', 3, 8, 70),
        ex('Decline Barbell Bench Press', '🏋️', 'Chest', 3, 8, 75),
        ex('Guillotine Press', '🏋️', 'Chest', 3, 10, 60),
        ex('Reverse Grip Bench Press', '🏋️', 'Chest', 3, 10, 60),
        ex('Close-Grip Bench Press', '🏋️', 'Chest', 3, 10, 60),
        // Dumbbell
        ex('Dumbbell Bench Press', '💪', 'Chest', 3, 10, 30),
        ex('Incline Dumbbell Bench Press', '💪', 'Chest', 3, 10, 24),
        ex('Decline Dumbbell Bench Press', '💪', 'Chest', 3, 10, 26),
        ex('Dumbbell Fly', '💪', 'Chest', 3, 12, 14),
        ex('Incline Dumbbell Fly', '💪', 'Chest', 3, 12, 12),
        ex('Decline Dumbbell Fly', '💪', 'Chest', 3, 12, 14),
        ex('Svend Press', '💪', 'Chest', 3, 15, 10),
        // Push-Ups
        ex('Push-Up', '🤸', 'Chest', 3, 20, null),
        ex('Wide Push-Up', '🤸', 'Chest', 3, 15, null),
        ex('Narrow Push-Up', '🤸', 'Chest', 3, 15, null),
        ex('Decline Push-Up', '🤸', 'Chest', 3, 15, null),
        ex('Incline Push-Up', '🤸', 'Chest', 3, 15, null),
        ex('Weighted Push-Up', '🤸', 'Chest', 3, 12, 10),
        // Machine & Smith
        ex('Machine Chest Press', '🤖', 'Chest', 3, 12, 60),
        ex('Smith Machine Bench Press', '🤖', 'Chest', 3, 10, 70),
        ex('Pec Deck', '🤖', 'Chest', 3, 15, 40),
        // Cable
        ex('Cable Crossover (High)', '🤸', 'Chest', 3, 15, 15),
        ex('Cable Crossover (Low)', '🤸', 'Chest', 3, 15, 15),
        ex('Cable Crossover (Mid)', '🤸', 'Chest', 3, 15, 15),
        ex('Cable Fly', '🤸', 'Chest', 3, 12, 15),
        // Other
        ex('Chest Dip', '🏅', 'Chest', 3, 12, null),
        ex('Floor Press', '🏋️', 'Chest', 3, 10, 70),
        ex('Landmine Press', '🏋️', 'Chest', 3, 12, 30),
      ],
    },
    {
      id: uid(), name: 'Shoulders', emoji: '🤷', color: 'rgba(249,115,22,0.15)', expanded: false,
      exercises: [
        // Barbell / Compound Press
        ex('Barbell Overhead Press', '🏅', 'Shoulders', 4, 6, 60),
        ex('Seated Barbell Overhead Press', '🏅', 'Shoulders', 4, 6, 55),
        ex('Push Press', '🏅', 'Shoulders', 3, 6, 65),
        ex('Behind-the-Neck Press', '🏅', 'Shoulders', 3, 10, 50),
        // Dumbbell Press
        ex('Dumbbell Overhead Press', '💪', 'Shoulders', 4, 8, 22),
        ex('Seated Dumbbell Overhead Press', '💪', 'Shoulders', 3, 10, 20),
        ex('Arnold Press', '💪', 'Shoulders', 3, 10, 18),
        // Machine & Smith
        ex('Machine Shoulder Press', '🤖', 'Shoulders', 3, 12, 50),
        ex('Smith Machine Overhead Press', '🤖', 'Shoulders', 3, 10, 55),
        // Landmine
        ex('Landmine Shoulder Press', '🏋️', 'Shoulders', 3, 12, 30),
        ex('Single-Arm Landmine Press', '🏋️', 'Shoulders', 3, 12, 20),
        // Raises
        ex('Dumbbell Lateral Raise', '↔️', 'Shoulders', 3, 15, 10),
        ex('Cable Lateral Raise', '↔️', 'Shoulders', 3, 15, 8),
        ex('Front Raise', '⬆️', 'Shoulders', 3, 12, 10),
        ex('Cable Front Raise', '⬆️', 'Shoulders', 3, 12, 10),
        ex('Barbell Front Raise', '⬆️', 'Shoulders', 3, 12, 20),
        ex('Plate Front Raise', '⬆️', 'Shoulders', 3, 15, 10),
        ex('Lu Raises', '↔️', 'Shoulders', 3, 15, 6),
        // Cable Press
        ex('Single-Arm Cable Shoulder Press', '🤸', 'Shoulders', 3, 12, 15),
        // Bodyweight
        ex('Pike Push-Up', '🤸', 'Shoulders', 3, 15, null),
        ex('Handstand Push-Up', '🤸', 'Shoulders', 3, 8, null),
        // Hybrid
        ex('Upright Row', '🔝', 'Shoulders', 3, 12, 40),
      ],
    },
    {
      id: uid(), name: 'Triceps', emoji: '💪', color: 'rgba(249,115,22,0.15)', expanded: false,
      exercises: [
        // Compound / Close-Grip
        ex('Close-Grip Bench Press', '🏋️', 'Triceps', 3, 10, 60),
        ex('JM Press', '🏋️', 'Triceps', 3, 10, 50),
        // Dips
        ex('Triceps Dip', '🏅', 'Triceps', 3, 12, null),
        ex('Bench Dip', '🏅', 'Triceps', 3, 15, null),
        ex('Machine Triceps Dip', '🤖', 'Triceps', 3, 12, 50),
        // Skull Crushers
        ex('Skull Crusher', '🏋️', 'Triceps', 3, 12, 30),
        ex('EZ Bar Skull Crusher', '🏋️', 'Triceps', 3, 12, 25),
        ex('Dumbbell Skull Crusher', '💪', 'Triceps', 3, 12, 12),
        ex('Floor Skull Crusher', '🏋️', 'Triceps', 3, 12, 25),
        // Overhead Extensions
        ex('Overhead Triceps Extension', '🙆', 'Triceps', 3, 12, 25),
        ex('Cable Overhead Triceps Extension', '🤸', 'Triceps', 3, 12, 20),
        // Cable Pushdowns
        ex('Cable Pushdown (Rope)', '⬇️', 'Triceps', 3, 12, 30),
        ex('Cable Pushdown (V-Bar)', '⬇️', 'Triceps', 3, 12, 32),
        ex('Cable Pushdown (Straight Bar)', '⬇️', 'Triceps', 3, 12, 30),
        ex('Reverse Grip Pushdown', '⬇️', 'Triceps', 3, 15, 20),
        ex('Single-Arm Cable Pushdown', '⬇️', 'Triceps', 3, 12, 15),
        // Isolation
        ex('Tate Press', '💪', 'Triceps', 3, 12, 14),
        ex('Triceps Kickback', '💪', 'Triceps', 3, 15, 10),
        // Bodyweight
        ex('Diamond Push-Up', '🤸', 'Triceps', 3, 15, null),
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
