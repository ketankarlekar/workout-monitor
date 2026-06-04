import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../theme';
import { loadWorkouts } from '../storage';
import { useAuth } from '../context/AuthContext';
import { Workout, TabParamList } from '../types';
import { formatDate, formatDuration } from '../utils';

type NavProp = BottomTabNavigationProp<TabParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { signOut } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts().then(setWorkouts);
    }, [])
  );

  const last = workouts[0];
  const totalSets = workouts.reduce(
    (acc, w) => acc + w.exercises.reduce((a, e) => a + e.sets.length, 0),
    0
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Workout Monitor</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, SHADOW.sm]}>
          <Ionicons name="barbell-outline" size={22} color={COLORS.primary} />
          <Text style={styles.statValue}>{workouts.length}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={[styles.statCard, SHADOW.sm]}>
          <Ionicons name="checkmark-circle-outline" size={22} color={COLORS.success} />
          <Text style={styles.statValue}>{totalSets}</Text>
          <Text style={styles.statLabel}>Total Sets</Text>
        </View>
        <View style={[styles.statCard, SHADOW.sm]}>
          <Ionicons name="body-outline" size={22} color={COLORS.accent} />
          <Text style={styles.statValue}>
            {new Set(workouts.flatMap((w) => w.exercises.map((e) => e.exercise.muscleGroup))).size}
          </Text>
          <Text style={styles.statLabel}>Muscles Hit</Text>
        </View>
      </View>

      {last ? (
        <View style={[styles.lastCard, SHADOW.md]}>
          <Text style={styles.sectionLabel}>Last Workout</Text>
          <Text style={styles.lastDate}>{formatDate(last.date)}</Text>
          <View style={styles.lastMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={15} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{formatDuration(last.durationSeconds)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="list-outline" size={15} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{last.exercises.length} exercises</Text>
            </View>
          </View>
          <View style={styles.exerciseList}>
            {last.exercises.slice(0, 4).map((ex) => (
              <Text key={ex.exercise.id} style={styles.exerciseLine}>
                · {ex.exercise.name}{' '}
                <Text style={styles.setsCount}>({ex.sets.length} sets)</Text>
              </Text>
            ))}
            {last.exercises.length > 4 && (
              <Text style={styles.more}>+{last.exercises.length - 4} more</Text>
            )}
          </View>
        </View>
      ) : (
        <View style={[styles.emptyCard, SHADOW.sm]}>
          <Ionicons name="fitness-outline" size={48} color={COLORS.disabled} />
          <Text style={styles.emptyTitle}>No workouts yet</Text>
          <Text style={styles.emptySubtitle}>Log your first session to get started</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => navigation.navigate('Log')}
        activeOpacity={0.85}
      >
        <Ionicons name="play" size={20} color={COLORS.surface} />
        <Text style={styles.startBtnText}>Start Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  lastCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 18,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  lastDate: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  lastMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  exerciseList: {
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  exerciseLine: {
    fontSize: 14,
    color: COLORS.text,
  },
  setsCount: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  more: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 32,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
  },
});
