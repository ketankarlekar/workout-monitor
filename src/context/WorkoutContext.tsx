import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutType, MuscleGroup, WorkoutSession, Stats, Exercise } from '../types';
import { cloneWorkout } from '../constants/workoutData';

interface State {
  activeWorkouts: Record<WorkoutType, MuscleGroup[]>;
  sessions: WorkoutSession[];
  stats: Stats;
  /** Free-form notes/history the user attaches to a calendar day, keyed by 'YYYY-MM-DD'. */
  dayNotes: Record<string, string>;
}

type Action =
  | { type: 'TOGGLE_MG'; wType: WorkoutType; mgId: string }
  | { type: 'TOGGLE_EX'; wType: WorkoutType; mgId: string; exId: string }
  | { type: 'UPDATE_EX'; wType: WorkoutType; mgId: string; exId: string; field: 'sets' | 'reps' | 'weight'; value: number }
  | { type: 'ADD_EX'; wType: WorkoutType; mgId: string; exercise: Exercise }
  | { type: 'DELETE_EX'; wType: WorkoutType; mgId: string; exId: string }
  | { type: 'UPDATE_NOTES'; wType: WorkoutType; mgId: string; exId: string; notes: string }
  | { type: 'SAVE_SESSION'; wType: WorkoutType }
  | { type: 'LOAD_SESSIONS'; sessions: WorkoutSession[] }
  | { type: 'SET_DAY_NOTE'; date: string; notes: string }
  | { type: 'LOAD_DAY_NOTES'; dayNotes: Record<string, string> };

function localDateStr(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function computeStats(sessions: WorkoutSession[]): Stats {
  const total = sessions.length;
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const thisWeek = sessions.filter(s => s.date >= localDateStr(weekAgo)).length;
  const last = sorted[0];

  let streak = 0;
  let longestStreak = 0;
  let cur = 0;
  const datesSet = new Set(sessions.map(s => s.date));
  let d = new Date();
  while (datesSet.has(localDateStr(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  let prev = '';
  // Deduplicate dates so two workouts on the same day count as one streak day
  const uniqueDates = [...new Set(sessions.map(s => s.date))].sort((a, b) => b.localeCompare(a));
  for (const date of uniqueDates) {
    if (!prev) { cur = 1; prev = date; }
    else {
      const diff = (new Date(prev).getTime() - new Date(date).getTime()) / 86400000;
      if (diff === 1) cur++;
      else cur = 1;
      prev = date;
    }
    if (cur > longestStreak) longestStreak = cur;
  }

  return {
    total,
    streak,
    longestStreak,
    thisWeek,
    lastWorkout: last ? { date: last.date, type: last.type } : undefined,
  };
}

function updateMGs(mgs: MuscleGroup[], mgId: string, fn: (mg: MuscleGroup) => MuscleGroup): MuscleGroup[] {
  return mgs.map(mg => mg.id === mgId ? fn(mg) : mg);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_MG': {
      const mgs = state.activeWorkouts[action.wType];
      return {
        ...state,
        activeWorkouts: {
          ...state.activeWorkouts,
          [action.wType]: updateMGs(mgs, action.mgId, mg => ({ ...mg, expanded: !mg.expanded })),
        },
      };
    }
    case 'TOGGLE_EX': {
      const mgs = state.activeWorkouts[action.wType];
      return {
        ...state,
        activeWorkouts: {
          ...state.activeWorkouts,
          [action.wType]: updateMGs(mgs, action.mgId, mg => ({
            ...mg,
            exercises: mg.exercises.map(e =>
              e.id === action.exId ? { ...e, completed: !e.completed } : e
            ),
          })),
        },
      };
    }
    case 'UPDATE_EX': {
      const mgs = state.activeWorkouts[action.wType];
      return {
        ...state,
        activeWorkouts: {
          ...state.activeWorkouts,
          [action.wType]: updateMGs(mgs, action.mgId, mg => ({
            ...mg,
            exercises: mg.exercises.map(e =>
              e.id === action.exId ? { ...e, [action.field]: action.value } : e
            ),
          })),
        },
      };
    }
    case 'ADD_EX': {
      const mgs = state.activeWorkouts[action.wType];
      return {
        ...state,
        activeWorkouts: {
          ...state.activeWorkouts,
          [action.wType]: updateMGs(mgs, action.mgId, mg => ({
            ...mg,
            exercises: [...mg.exercises, action.exercise],
          })),
        },
      };
    }
    case 'DELETE_EX': {
      const mgs = state.activeWorkouts[action.wType];
      return {
        ...state,
        activeWorkouts: {
          ...state.activeWorkouts,
          [action.wType]: updateMGs(mgs, action.mgId, mg => ({
            ...mg,
            exercises: mg.exercises.filter(e => e.id !== action.exId),
          })),
        },
      };
    }
    case 'UPDATE_NOTES': {
      const mgs = state.activeWorkouts[action.wType];
      return {
        ...state,
        activeWorkouts: {
          ...state.activeWorkouts,
          [action.wType]: updateMGs(mgs, action.mgId, mg => ({
            ...mg,
            exercises: mg.exercises.map(e =>
              e.id === action.exId ? { ...e, notes: action.notes } : e
            ),
          })),
        },
      };
    }
    case 'SAVE_SESSION': {
      const session: WorkoutSession = {
        id: Date.now().toString(),
        type: action.wType,
        date: localDateStr(),
        muscleGroups: state.activeWorkouts[action.wType],
        completedAt: new Date().toISOString(),
      };
      const sessions = [session, ...state.sessions];
      return {
        ...state,
        sessions,
        stats: computeStats(sessions),
        activeWorkouts: {
          ...state.activeWorkouts,
          [action.wType]: cloneWorkout(action.wType),
        },
      };
    }
    case 'LOAD_SESSIONS': {
      return {
        ...state,
        sessions: action.sessions,
        stats: computeStats(action.sessions),
      };
    }
    case 'SET_DAY_NOTE': {
      return {
        ...state,
        dayNotes: { ...state.dayNotes, [action.date]: action.notes },
      };
    }
    case 'LOAD_DAY_NOTES': {
      return { ...state, dayNotes: action.dayNotes };
    }
    default:
      return state;
  }
}

const SESSIONS_KEY = 'workout_sessions';
const DAY_NOTES_KEY = 'workout_day_notes';

const initialState: State = {
  activeWorkouts: {
    push: cloneWorkout('push'),
    pull: cloneWorkout('pull'),
    legs: cloneWorkout('legs'),
    saturday: cloneWorkout('saturday'),
  },
  sessions: [],
  stats: { total: 0, streak: 0, longestStreak: 0, thisWeek: 0 },
  dayNotes: {},
};

interface WorkoutContextType {
  state: State;
  toggleMG: (wType: WorkoutType, mgId: string) => void;
  toggleEx: (wType: WorkoutType, mgId: string, exId: string) => void;
  updateEx: (wType: WorkoutType, mgId: string, exId: string, field: 'sets' | 'reps' | 'weight', value: number) => void;
  addEx: (wType: WorkoutType, mgId: string, exercise: Exercise) => void;
  deleteEx: (wType: WorkoutType, mgId: string, exId: string) => void;
  updateNotes: (wType: WorkoutType, mgId: string, exId: string, notes: string) => void;
  saveSession: (wType: WorkoutType) => void;
  setDayNote: (date: string, notes: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType>({} as WorkoutContextType);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const loaded = useRef(false);
  const notesLoaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(SESSIONS_KEY).then(raw => {
      if (raw) {
        try { dispatch({ type: 'LOAD_SESSIONS', sessions: JSON.parse(raw) }); } catch {}
      }
      loaded.current = true;
    });
    AsyncStorage.getItem(DAY_NOTES_KEY).then(raw => {
      if (raw) {
        try { dispatch({ type: 'LOAD_DAY_NOTES', dayNotes: JSON.parse(raw) }); } catch {}
      }
      notesLoaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (loaded.current) {
      AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(state.sessions));
    }
  }, [state.sessions]);

  useEffect(() => {
    // Guard against overwriting saved notes with the empty initial state before the load above resolves.
    if (notesLoaded.current) {
      AsyncStorage.setItem(DAY_NOTES_KEY, JSON.stringify(state.dayNotes));
    }
  }, [state.dayNotes]);

  return (
    <WorkoutContext.Provider value={{
      state,
      toggleMG: (wType, mgId) => dispatch({ type: 'TOGGLE_MG', wType, mgId }),
      toggleEx: (wType, mgId, exId) => dispatch({ type: 'TOGGLE_EX', wType, mgId, exId }),
      updateEx: (wType, mgId, exId, field, value) => dispatch({ type: 'UPDATE_EX', wType, mgId, exId, field, value }),
      addEx: (wType, mgId, exercise) => dispatch({ type: 'ADD_EX', wType, mgId, exercise }),
      deleteEx: (wType, mgId, exId) => dispatch({ type: 'DELETE_EX', wType, mgId, exId }),
      updateNotes: (wType, mgId, exId, notes) => dispatch({ type: 'UPDATE_NOTES', wType, mgId, exId, notes }),
      saveSession: (wType) => dispatch({ type: 'SAVE_SESSION', wType }),
      setDayNote: (date, notes) => dispatch({ type: 'SET_DAY_NOTE', date, notes }),
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export const useWorkout = () => useContext(WorkoutContext);
