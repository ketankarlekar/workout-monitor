import { WorkoutType } from '../types';

export const WORKOUT_TYPE_INFO: Record<WorkoutType, { color: string; bg: string; emoji: string; label: string; full: string }> = {
  push:     { color: '#fb923c', bg: 'rgba(249,115,22,0.2)', emoji: '🔥', label: 'PUSH', full: 'Push Day' },
  pull:     { color: '#60a5fa', bg: 'rgba(59,130,246,0.2)', emoji: '💧', label: 'PULL', full: 'Pull Day' },
  legs:     { color: '#c084fc', bg: 'rgba(168,85,247,0.2)', emoji: '🦵', label: 'LEGS', full: 'Legs Day' },
  saturday: { color: '#fbbf24', bg: 'rgba(234,179,8,0.2)',  emoji: '⭐', label: 'SAT',  full: 'Saturday' },
};

export const WORKOUT_TYPE_ORDER: WorkoutType[] = ['push', 'pull', 'legs', 'saturday'];
