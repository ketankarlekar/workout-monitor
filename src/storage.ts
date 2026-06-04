import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, User } from './types';
import { generateId } from './utils';

const KEY = '@wm:workouts';

export async function loadWorkouts(): Promise<Workout[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveWorkout(workout: Workout): Promise<void> {
  const all = await loadWorkouts();
  all.unshift(workout);
  await AsyncStorage.setItem(KEY, JSON.stringify(all));
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  const all = await loadWorkouts();
  return all.find(w => w.id === id) ?? null;
}

export async function deleteWorkout(id: string): Promise<void> {
  const all = await loadWorkouts();
  await AsyncStorage.setItem(KEY, JSON.stringify(all.filter(w => w.id !== id)));
}

const USERS_KEY = '@wm:users';
const SESSION_KEY = '@wm:session';

async function getUsers(): Promise<User[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ user?: User; error?: string }> {
  const users = await getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'An account with this email already exists.' };
  }
  const user: User = { id: generateId(), name, email: email.toLowerCase(), password };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return { user };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ user?: User; error?: string }> {
  const users = await getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) return { error: 'Invalid email or password.' };
  return { user };
}

export async function saveSession(user: User): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export async function loadSession(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
