import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutType, MuscleGroup, WorkoutSession, Stats, Exercise } from '../types';
import { cloneWorkout } from '../constants/workoutData';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface State {
  activeWorkouts: Record<WorkoutType, MuscleGroup[]>;
  sessions: WorkoutSession[];
  stats: Stats;
  /** Free-form notes/history the user attaches to a calendar day, keyed by 'YYYY-MM-DD'. */
  dayNotes: Record<string, string>;
  /** ISO timestamp of the last edit per day note, same keys as dayNotes — used for last-write-wins sync. */
  dayNotesUpdatedAt: Record<string, string>;
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
  | { type: 'LOAD_DAY_NOTES'; dayNotes: Record<string, string>; dayNotesUpdatedAt: Record<string, string> };

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

function rowToSession(row: any): WorkoutSession {
  return {
    id: row.id,
    type: row.type,
    date: row.date,
    muscleGroups: row.muscle_groups,
    startedAt: row.started_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
  };
}

function sessionToRow(userId: string, s: WorkoutSession) {
  return {
    id: s.id,
    user_id: userId,
    type: s.type,
    date: s.date,
    muscle_groups: s.muscleGroups,
    started_at: s.startedAt ?? null,
    completed_at: s.completedAt ?? null,
  };
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
        dayNotesUpdatedAt: { ...state.dayNotesUpdatedAt, [action.date]: new Date().toISOString() },
      };
    }
    case 'LOAD_DAY_NOTES': {
      return { ...state, dayNotes: action.dayNotes, dayNotesUpdatedAt: action.dayNotesUpdatedAt };
    }
    default:
      return state;
  }
}

const SESSIONS_KEY = 'workout_sessions';
const DAY_NOTES_KEY = 'workout_day_notes';
const DAY_NOTES_UPDATED_AT_KEY = 'workout_day_notes_updated_at';

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
  dayNotesUpdatedAt: {},
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
  const { session } = useAuth();
  const loaded = useRef(false);
  const notesLoaded = useRef(false);
  const synced = useRef(false);
  const pushedSessionIds = useRef<Set<string>>(new Set());
  const pushedNoteTimestamps = useRef<Record<string, string>>({});

  // Load the local cache, then pull the user's remote data, merge it in, and push back
  // anything that only exists locally (e.g. sessions saved while offline).
  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    (async () => {
      const [sessionsRaw, notesRaw, notesUpdatedRaw] = await Promise.all([
        AsyncStorage.getItem(SESSIONS_KEY),
        AsyncStorage.getItem(DAY_NOTES_KEY),
        AsyncStorage.getItem(DAY_NOTES_UPDATED_AT_KEY),
      ]);
      if (cancelled) return;

      let localSessions: WorkoutSession[] = [];
      let localNotes: Record<string, string> = {};
      let localNotesUpdatedAt: Record<string, string> = {};
      try { if (sessionsRaw) localSessions = JSON.parse(sessionsRaw); } catch {}
      try { if (notesRaw) localNotes = JSON.parse(notesRaw); } catch {}
      try { if (notesUpdatedRaw) localNotesUpdatedAt = JSON.parse(notesUpdatedRaw); } catch {}

      loaded.current = true;
      notesLoaded.current = true;
      dispatch({ type: 'LOAD_SESSIONS', sessions: localSessions });
      dispatch({ type: 'LOAD_DAY_NOTES', dayNotes: localNotes, dayNotesUpdatedAt: localNotesUpdatedAt });

      const userId = session.user.id;
      const [sessionsRes, notesRes] = await Promise.all([
        supabase.from('sessions').select('*').eq('user_id', userId),
        supabase.from('day_notes').select('*').eq('user_id', userId),
      ]);
      if (cancelled) return;

      // Sessions are append-only (created once in SAVE_SESSION, never edited) — union by id.
      const remoteSessions = (sessionsRes.data ?? []).map(rowToSession);
      const remoteSessionIds = new Set(remoteSessions.map(s => s.id));
      const sessionMap = new Map<string, WorkoutSession>();
      for (const s of remoteSessions) sessionMap.set(s.id, s);
      for (const s of localSessions) sessionMap.set(s.id, s);
      const mergedSessions = [...sessionMap.values()].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
      const sessionsToPush = localSessions.filter(s => !remoteSessionIds.has(s.id));

      // Day notes are editable — per date, whichever side has the newer updated_at wins.
      const remoteNotes = new Map<string, { notes: string; updated_at: string }>(
        (notesRes.data ?? []).map((row: any) => [row.date as string, row])
      );
      const mergedNotes = { ...localNotes };
      const mergedNotesUpdatedAt = { ...localNotesUpdatedAt };
      const notesToPush: { date: string; notes: string; updated_at: string }[] = [];

      for (const [date, row] of remoteNotes) {
        const localUpdated = localNotesUpdatedAt[date];
        if (!localUpdated || row.updated_at > localUpdated) {
          mergedNotes[date] = row.notes;
          mergedNotesUpdatedAt[date] = row.updated_at;
        }
      }
      for (const date of Object.keys(localNotes)) {
        const remote = remoteNotes.get(date);
        const localUpdated = localNotesUpdatedAt[date];
        if (localUpdated && (!remote || localUpdated > remote.updated_at)) {
          notesToPush.push({ date, notes: localNotes[date], updated_at: localUpdated });
        }
      }

      dispatch({ type: 'LOAD_SESSIONS', sessions: mergedSessions });
      dispatch({ type: 'LOAD_DAY_NOTES', dayNotes: mergedNotes, dayNotesUpdatedAt: mergedNotesUpdatedAt });

      // Seed the "already synced" trackers before flipping `synced` so the push-on-mutation
      // effects below don't immediately re-push everything we just merged in.
      pushedSessionIds.current = new Set(mergedSessions.map(s => s.id));
      pushedNoteTimestamps.current = { ...mergedNotesUpdatedAt };
      synced.current = true;

      if (sessionsToPush.length) {
        supabase.from('sessions').upsert(sessionsToPush.map(s => sessionToRow(userId, s))).then(() => {});
      }
      if (notesToPush.length) {
        supabase.from('day_notes').upsert(notesToPush.map(n => ({ user_id: userId, ...n }))).then(() => {});
      }
    })();

    return () => { cancelled = true; };
  }, [session?.user.id]);

  useEffect(() => {
    if (loaded.current) {
      AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(state.sessions));
    }
  }, [state.sessions]);

  useEffect(() => {
    // Guard against overwriting saved notes with the empty initial state before the load above resolves.
    if (notesLoaded.current) {
      AsyncStorage.setItem(DAY_NOTES_KEY, JSON.stringify(state.dayNotes));
      AsyncStorage.setItem(DAY_NOTES_UPDATED_AT_KEY, JSON.stringify(state.dayNotesUpdatedAt));
    }
  }, [state.dayNotes, state.dayNotesUpdatedAt]);

  // Push newly-saved sessions to Supabase as they happen. Fire-and-forget: if this fails
  // (e.g. offline), the launch-time reconciliation above will pick it up and retry later.
  useEffect(() => {
    if (!synced.current || !session) return;
    const toPush = state.sessions.filter(s => !pushedSessionIds.current.has(s.id));
    if (!toPush.length) return;
    toPush.forEach(s => pushedSessionIds.current.add(s.id));
    supabase.from('sessions').upsert(toPush.map(s => sessionToRow(session.user.id, s))).then(() => {});
  }, [state.sessions, session]);

  // Push edited day notes the same fire-and-forget + reconcile-on-launch way.
  useEffect(() => {
    if (!synced.current || !session) return;
    const toPush = Object.entries(state.dayNotesUpdatedAt).filter(
      ([date, ts]) => pushedNoteTimestamps.current[date] !== ts
    );
    if (!toPush.length) return;
    toPush.forEach(([date, ts]) => { pushedNoteTimestamps.current[date] = ts; });
    supabase.from('day_notes').upsert(
      toPush.map(([date, ts]) => ({ user_id: session.user.id, date, notes: state.dayNotes[date], updated_at: ts }))
    ).then(() => {});
  }, [state.dayNotesUpdatedAt, session]);

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
