import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ColorScheme, R } from '../constants/theme';
import { WeekInfo, WorkoutSession } from '../types';
import { WORKOUT_TYPE_INFO } from '../constants/workoutTypeInfo';
import { FULL_DOW, SHORT_MONTHS, formatDateRange } from '../utils/date';
import { MgIcon } from './MgIcon';
import { HBarRow } from './charts';

interface Props {
  visible: boolean;
  week: WeekInfo | null;
  onClose: () => void;
  /** Jump to the full day-detail sheet (e.g. to edit notes) for a date in this week. */
  onSelectDate: (date: string) => void;
}

function computeWeekStats(sessions: WorkoutSession[]) {
  let totalEx = 0, totalSets = 0, totalVolume = 0;
  const muscleCounts = new Map<string, number>();
  sessions.forEach(s => s.muscleGroups.forEach(mg => {
    totalEx += mg.exercises.length;
    muscleCounts.set(mg.name, (muscleCounts.get(mg.name) || 0) + mg.exercises.length);
    mg.exercises.forEach(e => {
      totalSets += e.sets;
      totalVolume += (e.weight ?? 0) * e.sets * e.reps;
    });
  }));
  const topMuscles = [...muscleCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return { totalEx, totalSets, totalVolume, topMuscles };
}

function StatBox({ label, value, c }: { label: string; value: string; c: ColorScheme }) {
  return (
    <View style={[styles.statBox, { backgroundColor: c.surface2, borderColor: c.border }]}>
      <Text style={[styles.statVal, { color: c.accent }]}>{value}</Text>
      <Text style={[styles.statLbl, { color: c.text2 }]}>{label}</Text>
    </View>
  );
}

/** Bottom sheet showing a full breakdown for a single Sun–Sat week, with per-day drill-down. */
export function WeekDetailModal({ visible, week, onClose, onSelectDate }: Props) {
  const { colors } = useTheme();
  const c = colors;

  const stats = week ? computeWeekStats(week.sessions) : null;
  const maxMuscle = stats ? Math.max(1, ...stats.topMuscles.map(([, v]) => v)) : 1;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}>
          <View style={[styles.sheet, { backgroundColor: c.surface }]}>
            <View style={[styles.handle, { backgroundColor: c.border2 }]} />

            {week && stats && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: c.text }]}>
                  📅 Week {week.index + 1} · {formatDateRange(week.dates[0], week.dates[6])}
                </Text>

                <View style={styles.statsGrid}>
                  <StatBox label="Workouts" value={String(week.sessions.length)} c={c} />
                  <StatBox label="Exercises" value={String(stats.totalEx)} c={c} />
                  <StatBox label="Sets" value={String(stats.totalSets)} c={c} />
                  <StatBox label="Volume" value={`${stats.totalVolume.toLocaleString()} kg`} c={c} />
                </View>

                {stats.topMuscles.length > 0 && (
                  <>
                    <Text style={[styles.label, { color: c.text2 }]}>MUSCLE FOCUS</Text>
                    <View style={{ marginBottom: 8 }}>
                      {stats.topMuscles.map(([name, count]) => (
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
                      ))}
                    </View>
                  </>
                )}

                <Text style={[styles.label, { color: c.text2, marginTop: 8 }]}>DAY BY DAY</Text>
                {week.dates.map((date, i) => {
                  const daySessions = week.sessions.filter(s => s.date === date);
                  const [, m, d] = date.split('-').map(Number);
                  const dayLabel = `${FULL_DOW[i]}, ${SHORT_MONTHS[m - 1]} ${d}`;
                  const hasWorkout = daySessions.length > 0;
                  return (
                    <TouchableOpacity
                      key={date}
                      disabled={!hasWorkout}
                      onPress={() => onSelectDate(date)}
                      activeOpacity={0.7}
                      style={[styles.dayRow, { borderColor: c.border, backgroundColor: hasWorkout ? c.surface2 : 'transparent' }]}
                    >
                      <Text style={[styles.dayLabel, { color: c.text }]}>{dayLabel}</Text>
                      {hasWorkout ? (
                        <View style={styles.dayBadges}>
                          {daySessions.map(s => (
                            <View key={s.id} style={[styles.typeBadge, { backgroundColor: WORKOUT_TYPE_INFO[s.type].bg }]}>
                              <Text style={{ fontSize: 11, fontWeight: '700', color: WORKOUT_TYPE_INFO[s.type].color }}>
                                {WORKOUT_TYPE_INFO[s.type].emoji} {WORKOUT_TYPE_INFO[s.type].label}
                              </Text>
                            </View>
                          ))}
                          <Text style={[styles.dayChevron, { color: c.text3 }]}>›</Text>
                        </View>
                      ) : (
                        <Text style={[styles.restTxt, { color: c.text3 }]}>Rest</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
                <View style={{ height: 8 }} />
              </ScrollView>
            )}

            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: c.surface2, borderColor: c.border }]} onPress={onClose}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: c.text }}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: R.xl, borderTopRightRadius: R.xl, padding: 24, paddingBottom: 32, maxHeight: '85%' },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  statBox: { flexBasis: '47%', flexGrow: 1, borderRadius: R.md, borderWidth: 1, padding: 12, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 20, fontWeight: '800' },
  statLbl: { fontSize: 11, fontWeight: '600' },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: R.sm, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6 },
  dayLabel: { fontSize: 13, fontWeight: '600' },
  dayBadges: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  dayChevron: { fontSize: 16, fontWeight: '700' },
  restTxt: { fontSize: 12, fontWeight: '500' },
  closeBtn: { padding: 13, borderRadius: R.md, borderWidth: 1, alignItems: 'center', marginTop: 16 },
});
