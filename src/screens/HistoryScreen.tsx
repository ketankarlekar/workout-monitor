import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../theme';
import { loadWorkouts } from '../storage';
import { Workout, RootStackParamList } from '../types';
import { formatDate, formatDuration } from '../utils';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const navigation = useNavigation<NavProp>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    const data = await loadWorkouts();
    setWorkouts(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function onRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  function getMuscleGroups(workout: Workout) {
    return [...new Set(workout.exercises.map((e) => e.exercise.muscleGroup))];
  }

  function getTotalSets(workout: Workout) {
    return workout.exercises.reduce((acc, e) => acc + e.sets.length, 0);
  }

  if (workouts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={56} color={COLORS.disabled} />
        <Text style={styles.emptyTitle}>No workouts yet</Text>
        <Text style={styles.emptySubtitle}>Your completed sessions will appear here</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={workouts}
      style={styles.list}
      contentContainerStyle={styles.content}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => {
        const groups = getMuscleGroups(item);
        const totalSets = getTotalSets(item);
        return (
          <TouchableOpacity
            style={[styles.card, SHADOW.sm]}
            onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
            activeOpacity={0.7}
          >
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
                <View style={styles.cardMeta}>
                  <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
                  <Text style={styles.metaText}>{formatDuration(item.durationSeconds)}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.metaText}>
                    {item.exercises.length} exercise{item.exercises.length !== 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.metaText}>{totalSets} sets</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
            <View style={styles.tags}>
              {groups.map((g) => (
                <View key={g} style={styles.tag}>
                  <Text style={styles.tagText}>{g}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  dot: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.xl,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
