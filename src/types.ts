export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Core';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: string;
};

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
};

export type WorkoutExercise = {
  exercise: Exercise;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  date: string;
  durationSeconds: number;
  exercises: WorkoutExercise[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  WorkoutDetail: { workoutId: string };
};

export type TabParamList = {
  Home: undefined;
  Log: undefined;
  History: undefined;
};
