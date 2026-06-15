import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ColorScheme, R } from '../constants/theme';
import { WeekInfo } from '../types';
import { WORKOUT_TYPE_INFO } from '../constants/workoutTypeInfo';
import { SHORT_DOW, formatDateRange, monthOfDateKey } from '../utils/date';

interface Props {
  colors: ColorScheme;
  weeks: WeekInfo[];
  /** 0-based month currently displayed, used to dim days that spill into the next/previous month. */
  monthIndex: number;
  todayKey: string;
  onSelectWeek: (index: number) => void;
}

/** Clickable per-week cards: date range, a day-by-day dot strip, and a quick summary. */
export function WeeklyBreakdown({ colors: c, weeks, monthIndex, todayKey, onSelectWeek }: Props) {
  return (
    <View style={{ gap: 10 }}>
      {weeks.map(week => {
        const totalEx = week.sessions.reduce((sum, s) => sum + s.muscleGroups.reduce((m, mg) => m + mg.exercises.length, 0), 0);
        return (
          <TouchableOpacity
            key={week.index}
            style={[styles.card, { backgroundColor: c.surface, borderColor: week.isCurrent ? c.accent : c.border }]}
            onPress={() => onSelectWeek(week.index)}
            activeOpacity={0.7}
          >
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: c.text }]}>
                Week {week.index + 1} <Text style={{ color: c.text3, fontWeight: '500' }}>· {formatDateRange(week.dates[0], week.dates[6])}</Text>
              </Text>
              {week.isCurrent && (
                <View style={[styles.badge, { backgroundColor: c.accentDim }]}>
                  <Text style={styles.badgeTxt}>This Week</Text>
                </View>
              )}
            </View>

            <View style={styles.dotsRow}>
              {week.dates.map((date, i) => {
                const daySessions = week.sessions.filter(s => s.date === date);
                const hasWorkout = daySessions.length > 0;
                const inMonth = monthOfDateKey(date) === monthIndex;
                const isToday = date === todayKey;
                const tColor = hasWorkout ? WORKOUT_TYPE_INFO[daySessions[0].type].color : c.surface3;
                return (
                  <View key={date} style={styles.dotCol}>
                    <View style={[
                      styles.dot,
                      { backgroundColor: hasWorkout ? tColor : 'transparent', borderColor: hasWorkout ? tColor : c.border2 },
                      isToday && { borderColor: c.accent, borderWidth: 2 },
                      !inMonth && { opacity: 0.35 },
                    ]}>
                      {hasWorkout && <Text style={styles.dotEmoji}>{WORKOUT_TYPE_INFO[daySessions[0].type].emoji}</Text>}
                    </View>
                    <Text style={[styles.dow, { color: c.text3 }, !inMonth && { opacity: 0.35 }]}>{SHORT_DOW[i]}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.footerRow}>
              <Text style={[styles.footerTxt, { color: week.sessions.length > 0 ? c.accent : c.text3 }]}>
                {week.sessions.length === 0
                  ? 'Rest week'
                  : `${week.sessions.length} workout${week.sessions.length === 1 ? '' : 's'} · ${totalEx} exercise${totalEx === 1 ? '' : 's'}`}
              </Text>
              <Text style={[styles.chevron, { color: c.text3 }]}>›</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: R.lg, borderWidth: 1, padding: 14, gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 14, fontWeight: '700' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  badgeTxt: { fontSize: 10, fontWeight: '700', color: '#000' },
  dotsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dotCol: { alignItems: 'center', gap: 4 },
  dot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  dotEmoji: { fontSize: 13 },
  dow: { fontSize: 10, fontWeight: '600' },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerTxt: { fontSize: 12, fontWeight: '600' },
  chevron: { fontSize: 18, fontWeight: '700' },
});
