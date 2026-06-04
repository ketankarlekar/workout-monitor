import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../theme';
import { saveWorkout } from '../storage';
import { Exercise, WorkoutExercise, WorkoutSet, Workout } from '../types';
import { formatDuration, generateId } from '../utils';
import SetRow from '../components/SetRow';
import ExercisePicker from '../components/ExercisePicker';

type ActiveWorkout = {
  exercises: WorkoutExercise[];
};

export default function LogWorkoutScreen() {
  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!workout) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [workout]);

  function startWorkout() {
    startTimeRef.current = Date.now();
    setElapsed(0);
    setWorkout({ exercises: [] });
  }

  function handleFinish() {
    if (!workout) return;
    if (workout.exercises.length === 0) {
      Alert.alert('No exercises added', 'Add at least one exercise before finishing.');
      return;
    }
    Alert.alert('Finish Workout?', `Duration: ${formatDuration(elapsed)}`, [
      { text: 'Keep Going', style: 'cancel' },
      {
        text: 'Save',
        onPress: async () => {
          const saved: Workout = {
            id: generateId(),
            date: new Date().toISOString(),
            durationSeconds: elapsed,
            exercises: workout.exercises,
          };
          await saveWorkout(saved);
          setWorkout(null);
          setElapsed(0);
          Alert.alert('Saved!', 'Great workout. Check your history to review it.');
        },
      },
    ]);
  }

  function handleDiscard() {
    Alert.alert('Discard Workout?', 'All progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setWorkout(null);
          setElapsed(0);
        },
      },
    ]);
  }

  function addExercise(exercise: Exercise) {
    const newEx: WorkoutExercise = {
      exercise,
      sets: [{ id: generateId(), reps: 0, weight: 0, completed: false }],
    };
    setWorkout((w) => (w ? { ...w, exercises: [...w.exercises, newEx] } : null));
  }

  function addSet(exIdx: number) {
    setWorkout((w) => {
      if (!w) return null;
      const exercises = [...w.exercises];
      exercises[exIdx] = {
        ...exercises[exIdx],
        sets: [
          ...exercises[exIdx].sets,
          { id: generateId(), reps: 0, weight: 0, completed: false },
        ],
      };
      return { ...w, exercises };
    });
  }

  function updateSet(exIdx: number, setIdx: number, field: 'weight' | 'reps', value: number) {
    setWorkout((w) => {
      if (!w) return null;
      const exercises = [...w.exercises];
      const sets = [...exercises[exIdx].sets];
      sets[setIdx] = { ...sets[setIdx], [field]: value };
      exercises[exIdx] = { ...exercises[exIdx], sets };
      return { ...w, exercises };
    });
  }

  function toggleComplete(exIdx: number, setIdx: number) {
    setWorkout((w) => {
      if (!w) return null;
      const exercises = [...w.exercises];
      const sets = [...exercises[exIdx].sets];
      sets[setIdx] = { ...sets[setIdx], completed: !sets[setIdx].completed };
      exercises[exIdx] = { ...exercises[exIdx], sets };
      return { ...w, exercises };
    });
  }

  function removeExercise(exIdx: number) {
    Alert.alert('Remove Exercise?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          setWorkout((w) => {
            if (!w) return null;
            const exercises = [...w.exercises];
            exercises.splice(exIdx, 1);
            return { ...w, exercises };
          }),
      },
    ]);
  }

  if (!workout) {
    return (
      <View style={styles.idleContainer}>
        <View style={styles.idleIcon}>
          <Ionicons name="barbell" size={48} color={COLORS.primary} />
        </View>
        <Text style={styles.idleTitle}>Ready to Train?</Text>
        <Text style={styles.idleSubtitle}>
          Start a new session and track every set and rep
        </Text>
        <TouchableOpacity style={styles.startBtn} onPress={startWorkout} activeOpacity={0.85}>
          <Ionicons name="play" size={20} color={COLORS.surface} />
          <Text style={styles.startBtnText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const completedSets = workout.exercises.reduce(
    (acc, e) => acc + e.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = workout.exercises.reduce((acc, e) => acc + e.sets.length, 0);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.timerBar}>
        <View>
          <Text style={styles.timerLabel}>Elapsed</Text>
          <Text style={styles.timerValue}>{formatDuration(elapsed)}</Text>
        </View>
        <View style={styles.timerRight}>
          <Text style={styles.setsProgress}>
            {completedSets}/{totalSets} sets done
          </Text>
          <TouchableOpacity onPress={handleDiscard} style={styles.discardBtn}>
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {workout.exercises.length === 0 && (
          <View style={styles.noExercises}>
            <Ionicons name="add-circle-outline" size={36} color={COLORS.disabled} />
            <Text style={styles.noExercisesText}>Tap "Add Exercise" to begin</Text>
          </View>
        )}

        {workout.exercises.map((workoutEx, exIdx) => (
          <View key={`${workoutEx.exercise.id}-${exIdx}`} style={[styles.exerciseCard, SHADOW.sm]}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseTitleGroup}>
                <Text style={styles.exerciseName}>{workoutEx.exercise.name}</Text>
                <Text style={styles.exerciseSub}>
                  {workoutEx.exercise.muscleGroup} · {workoutEx.exercise.equipment}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeExercise(exIdx)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={22} color={COLORS.disabled} />
              </TouchableOpacity>
            </View>

            <View style={styles.setHeader}>
              <Text style={[styles.setColLabel, { width: 22 }]}>#</Text>
              <Text style={[styles.setColLabel, { flex: 1, textAlign: 'center' }]}>Weight</Text>
              <Text style={[styles.setColLabel, { flex: 1, textAlign: 'center' }]}>Reps</Text>
              <Text style={[styles.setColLabel, { width: 36, textAlign: 'center' }]}>Done</Text>
            </View>

            {workoutEx.sets.map((set, setIdx) => (
              <SetRow
                key={set.id}
                set={set}
                index={setIdx}
                onUpdate={(field, value) => updateSet(exIdx, setIdx, field, value)}
                onToggleComplete={() => toggleComplete(exIdx, setIdx)}
              />
            ))}

            <TouchableOpacity
              style={styles.addSetBtn}
              onPress={() => addSet(exIdx)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
              <Text style={styles.addSetText}>Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addExerciseBtn}
          onPress={() => setPickerVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.addExerciseText}>Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.surface} />
          <Text style={styles.finishBtnText}>Finish Workout</Text>
        </TouchableOpacity>
      </View>

      <ExercisePicker
        visible={pickerVisible}
        onSelect={addExercise}
        onClose={() => setPickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  idleContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  idleIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  idleTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  idleSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 40,
    marginTop: 8,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
  },
  timerBar: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  timerLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timerValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  timerRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  setsProgress: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  discardBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  noExercises: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  noExercisesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  exerciseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    gap: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseTitleGroup: {
    flex: 1,
    gap: 2,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  exerciseSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  setHeader: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  setColLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addSetText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addExerciseText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  footer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  finishBtn: {
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.lg,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  finishBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
  },
});
