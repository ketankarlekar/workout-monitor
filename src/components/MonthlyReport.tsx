import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ColorScheme, R } from '../constants/theme';
import { WorkoutType, WeekInfo } from '../types';
import { WORKOUT_TYPE_INFO, WORKOUT_TYPE_ORDER } from '../constants/workoutTypeInfo';
import { MgIcon } from './MgIcon';
import { StackedBar, HBarRow } from './charts';

interface Props {
  colors: ColorScheme;
  typeCounts: Record<WorkoutType, number>;
  muscleCounts: [string, number][];
  weeks: WeekInfo[];
  onSelectWeek: (index: number) => void;
}

/** Monthly diagrams: workout-type split, muscle focus, and a clickable per-week activity chart. */
export function MonthlyReport({ colors: c, typeCounts, muscleCounts, weeks, onSelectWeek }: Props) {
  const totalSessions = WORKOUT_TYPE_ORDER.reduce((sum, t) => sum + typeCounts[t], 0);
  const maxMuscle = Math.max(1, ...muscleCounts.map(([, v]) => v));
  const maxWeek = Math.max(1, ...weeks.map(w => w.sessions.length));

  return (
    <View style={{ gap: 14 }}>
      {/* Workout type split */}
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[styles.cardTitle, { color: c.text }]}>🧩 Workout Split</Text>
        {totalSessions === 0 ? (
          <Text style={[styles.emptyTxt, { color: c.text3 }]}>No workouts logged this month yet.</Text>
        ) : (
          <>
            <StackedBar
              c={c}
              segments={WORKOUT_TYPE_ORDER.map(t => ({ value: typeCounts[t], color: WORKOUT_TYPE_INFO[t].color }))}
            />
            <View style={styles.legendRow}>
              {WORKOUT_TYPE_ORDER.filter(t => typeCounts[t] > 0).map(t => (
                <View key={t} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: WORKOUT_TYPE_INFO[t].color }]} />
                  <Text style={[styles.legendTxt, { color: c.text2 }]}>
                    {WORKOUT_TYPE_INFO[t].full} · {typeCounts[t]} ({Math.round((typeCounts[t] / totalSessions) * 100)}%)
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Muscle focus */}
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[styles.cardTitle, { color: c.text }]}>🎯 Muscle Focus</Text>
        {muscleCounts.length === 0 ? (
          <Text style={[styles.emptyTxt, { color: c.text3 }]}>Complete some exercises to see your focus areas.</Text>
        ) : (
          muscleCounts.map(([name, count]) => (
            <HBarRow
              key={name}
              c={c}
              icon={<MgIcon name={name} size={18} />}
              label={name}
              value={count}
              max={maxMuscle}
              color={c.accent}
              suffix=" ex"
            />
          ))
        )}
      </View>

      {/* Weekly activity */}
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[styles.cardTitle, { color: c.text }]}>📈 Weekly Activity</Text>
        <Text style={[styles.cardHint, { color: c.text3 }]}>Tap a week for the full breakdown</Text>
        <View style={styles.weekBars}>
          {weeks.map(w => {
            const count = w.sessions.length;
            const h = count === 0 ? 6 : 8 + (count / maxWeek) * 64;
            return (
              <TouchableOpacity key={w.index} style={styles.weekBarCol} onPress={() => onSelectWeek(w.index)} activeOpacity={0.7}>
                <Text style={[styles.weekBarVal, { color: c.text2 }]}>{count}</Text>
                <View style={[
                  styles.weekBar,
                  { height: h, backgroundColor: w.isCurrent ? c.accent : c.surface3 },
                ]} />
                <Text style={[styles.weekBarLbl, { color: w.isCurrent ? c.accent : c.text3 }]}>W{w.index + 1}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: R.lg, borderWidth: 1, padding: 16 },
  cardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  cardHint: { fontSize: 11, marginTop: -8, marginBottom: 12 },
  emptyTxt: { fontSize: 13 },
  legendRow: { marginTop: 12, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { fontSize: 12, fontWeight: '500' },
  weekBars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 110, paddingTop: 4 },
  weekBarCol: { alignItems: 'center', gap: 6, flex: 1 },
  weekBarVal: { fontSize: 11, fontWeight: '700' },
  weekBar: { width: 22, borderRadius: 6 },
  weekBarLbl: { fontSize: 11, fontWeight: '600' },
});
