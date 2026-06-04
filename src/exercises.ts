import { Exercise, MuscleGroup } from './types';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Core',
];

export const EXERCISES: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { id: 'incline-bench', name: 'Incline Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { id: 'decline-bench', name: 'Decline Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { id: 'dumbbell-press', name: 'Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  { id: 'dumbbell-fly', name: 'Dumbbell Fly', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  { id: 'cable-fly', name: 'Cable Fly', muscleGroup: 'Chest', equipment: 'Cable' },
  { id: 'push-up', name: 'Push Up', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  { id: 'chest-dip', name: 'Chest Dip', muscleGroup: 'Chest', equipment: 'Bodyweight' },

  // Back
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell' },
  { id: 'bent-over-row', name: 'Bent Over Row', muscleGroup: 'Back', equipment: 'Barbell' },
  { id: 'pull-up', name: 'Pull Up', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { id: 'chin-up', name: 'Chin Up', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', muscleGroup: 'Back', equipment: 'Cable' },
  { id: 'dumbbell-row', name: 'Single Arm Dumbbell Row', muscleGroup: 'Back', equipment: 'Dumbbell' },
  { id: 't-bar-row', name: 'T-Bar Row', muscleGroup: 'Back', equipment: 'Barbell' },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell' },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { id: 'front-raise', name: 'Front Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'Shoulders', equipment: 'Cable' },
  { id: 'upright-row', name: 'Upright Row', muscleGroup: 'Shoulders', equipment: 'Barbell' },
  { id: 'arnold-press', name: 'Arnold Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },

  // Biceps
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'Biceps', equipment: 'Barbell' },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
  { id: 'concentration-curl', name: 'Concentration Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
  { id: 'preacher-curl', name: 'Preacher Curl', muscleGroup: 'Biceps', equipment: 'Barbell' },
  { id: 'cable-curl', name: 'Cable Curl', muscleGroup: 'Biceps', equipment: 'Cable' },

  // Triceps
  { id: 'tricep-dip', name: 'Tricep Dip', muscleGroup: 'Triceps', equipment: 'Bodyweight' },
  { id: 'skull-crusher', name: 'Skull Crusher', muscleGroup: 'Triceps', equipment: 'Barbell' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscleGroup: 'Triceps', equipment: 'Cable' },
  { id: 'overhead-tricep-ext', name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', equipment: 'Dumbbell' },
  { id: 'close-grip-bench', name: 'Close Grip Bench Press', muscleGroup: 'Triceps', equipment: 'Barbell' },
  { id: 'kickback', name: 'Tricep Kickback', muscleGroup: 'Triceps', equipment: 'Dumbbell' },

  // Legs
  { id: 'squat', name: 'Squat', muscleGroup: 'Legs', equipment: 'Barbell' },
  { id: 'front-squat', name: 'Front Squat', muscleGroup: 'Legs', equipment: 'Barbell' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: 'lunges', name: 'Lunges', muscleGroup: 'Legs', equipment: 'Bodyweight' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'Legs', equipment: 'Barbell' },
  { id: 'leg-curl', name: 'Leg Curl', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: 'calf-raise', name: 'Calf Raise', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: 'goblet-squat', name: 'Goblet Squat', muscleGroup: 'Legs', equipment: 'Dumbbell' },
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'Legs', equipment: 'Barbell' },

  // Core
  { id: 'plank', name: 'Plank', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { id: 'crunch', name: 'Crunch', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { id: 'leg-raise', name: 'Leg Raise', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { id: 'russian-twist', name: 'Russian Twist', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { id: 'cable-crunch', name: 'Cable Crunch', muscleGroup: 'Core', equipment: 'Cable' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', muscleGroup: 'Core', equipment: 'Ab Wheel' },
  { id: 'hanging-knee-raise', name: 'Hanging Knee Raise', muscleGroup: 'Core', equipment: 'Bodyweight' },
];
