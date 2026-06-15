export type WorkoutType = 'push' | 'pull' | 'legs' | 'saturday';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  emoji: string;
  sets: number;
  reps: number;
  weight: number | null;
  notes: string;
  completed: boolean;
}

export interface MuscleGroup {
  id: string;
  name: string;
  emoji: string;
  color: string;
  exercises: Exercise[];
  expanded: boolean;
}

export interface WorkoutSession {
  id: string;
  type: WorkoutType;
  date: string;
  muscleGroups: MuscleGroup[];
  startedAt?: string;
  completedAt?: string;
}

export interface Stats {
  total: number;
  streak: number;
  longestStreak: number;
  thisWeek: number;
  lastWorkout?: { date: string; type: WorkoutType };
}

/** A Sun–Sat week shown in the History "Weekly Breakdown" / Monthly Report. */
export interface WeekInfo {
  index: number;
  /** 7 'YYYY-MM-DD' keys, Sunday first. */
  dates: string[];
  /** Completed sessions falling on any of `dates`. */
  sessions: WorkoutSession[];
  /** True if `dates` contains today. */
  isCurrent: boolean;
}
