import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../theme';
import { getWorkoutById, deleteWorkout } from '../storage';
import { Workout, RootStackParamList } from '../types';
import { formatDate, formatDuration } from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetail'>;

export default function WorkoutDetailScreen({ route, navigation }: Props) {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    getWorkoutById(workoutId).then(setWorkout);
  }, [workoutId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={22} color={COLORS.error} />
        </TouchableOpacity>
      ),
    });
  }, [workout]);

  function handleDelete() {
    Alert.alert('Delete Workout', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteWorkout(workoutId);
          navigation.goBack();
        },
      },
    ]);
  }

  if (!workout) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Workout not found.</Text>
      </View>
    );
  }

  const totalSets = workout.exercises.reduce((acc, e) => acc + e.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (acc, e) => acc + e.sets.filter((s) => s.completed).length,
    0
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.summaryCard, SHADOW.md]}>
        <Text style={styles.dateText}>{formatDate(workout.date)}</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.summaryValue}>{formatDuration(workout.durationSeconds)}</Text>
            <Text style={styles.summaryLabel}>Duration</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Ionicons name="barbell-outline" size={20} color={COLORS.primary} />
            <Text style={styles.summaryValue}>{workout.exercises.length}</Text>
            <Text style={styles.summaryLabel}>Exercises</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-done-outline" size={20} color={COLORS.primary} />
            <Text style={styles.summaryValue}>
              {completedSets}/{totalSets}
            </Text>
            <Text style={styles.summaryLabel}>Sets Done</Text>
          </View>
        </View>
      </View>

      {workout.exercises.map((workoutEx, exIdx) => (
        <View key={`${workoutEx.exercise.id}-${exIdx}`} style={[styles.exerciseCard, SHADOW.sm]}>
          <View style={styles.exerciseHeader}>
            <View>
              <Text style={styles.exerciseName}>{workoutEx.exercise.name}</Text>
              <Text style={styles.exerciseMeta}>
                {workoutEx.exercise.muscleGroup} · {workoutEx.exercise.equipment}
              </Text>
            </View>
          </View>

          <View style={styles.setTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.colLabel, { width: 32 }]}>Set</Text>
              <Text style={[styles.colLabel, { flex: 1, textAlign: 'center' }]}>Weight</Text>
              <Text style={[styles.colLabel, { flex: 1, textAlign: 'center' }]}>Reps</Text>
              <Text style={[styles.colLabel, { width: 40, textAlign: 'center' }]}>Done</Text>
            </View>
            {workoutEx.sets.map((set, setIdx) => (
              <View
                key={set.id}
                style={[styles.setRow, set.completed && styles.setRowDone]}
              >
                <Text style={[styles.setNum, { width: 32 }]}>{setIdx + 1}</Text>
                <Text style={[styles.setVal, { flex: 1, textAlign: 'center' }]}>
                  {set.weight > 0 ? `${set.weight} kg` : '—'}
                </Text>
                <Text style={[styles.setVal, { flex: 1, textAlign: 'center' }]}>
                  {set.reps > 0 ? set.reps : '—'}
                </Text>
                <View style={{ width: 40, alignItems: 'center' }}>
                  <Ionicons
                    name={set.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={set.completed ? COLORS.success : COLORS.disabled}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 20,
    gap: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  exerciseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  exerciseMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  setTable: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 4,
  },
  colLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 4,
  },
  setRowDone: {
    backgroundColor: COLORS.successLight,
  },
  setNum: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  setVal: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
});
