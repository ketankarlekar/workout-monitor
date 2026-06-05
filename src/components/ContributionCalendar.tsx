import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { WorkoutSession } from '../types';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKS = 53;
const DAYS = 7;

interface Props {
  sessions: WorkoutSession[];
}

export function ContributionCalendar({ sessions }: Props) {
  const { colors } = useTheme();
  const [innerWidth, setInnerWidth] = useState(0);
  const c = colors;
  const cellSize = innerWidth > 0 ? Math.floor((innerWidth - WEEKS * 2) / WEEKS) : 6;

  const grid = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach(s => { counts[s.date] = (counts[s.date] || 0) + 1; });

    const today = new Date();
    const year = today.getFullYear();
    const jan1 = new Date(year, 0, 1);
    const startDow = jan1.getDay();

    const cells: { date: string; level: number }[] = [];
    for (let w = 0; w < WEEKS; w++) {
      for (let d = 0; d < DAYS; d++) {
        const dayOffset = w * 7 + d - startDow;
        const date = new Date(year, 0, 1 + dayOffset);
        const dateStr = date.toISOString().slice(0, 10);
        const n = counts[dateStr] || 0;
        const level = n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n === 3 ? 3 : 4;
        cells.push({ date: dateStr, level });
      }
    }
    return cells;
  }, [sessions]);

  const levelColors = [c.surface3, '#166534', '#16a34a', '#22c55e', '#4ade80'];

  return (
    <View
      style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
      onLayout={e => setInnerWidth(e.nativeEvent.layout.width - 32)}
    >
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: c.text }]}>Year Progress</Text>
        <Text style={[styles.count, { color: c.text3 }]}>{sessions.length} workouts</Text>
      </View>
      <View style={styles.months}>
        {MONTHS.map(m => (
          <Text key={m} style={[styles.month, { color: c.text3, width: (cellSize + 2) * 4.4 }]}>{m}</Text>
        ))}
      </View>
      <View style={[styles.grid, { width: WEEKS * (cellSize + 2) }]}>
        {grid.map((cell, i) => (
          <View
            key={i}
            style={[styles.cell, { width: cellSize, height: cellSize, backgroundColor: levelColors[cell.level] }]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={[styles.legendTxt, { color: c.text3 }]}>Less</Text>
        {levelColors.map((bg, i) => (
          <View key={i} style={[styles.legendCell, { backgroundColor: bg }]} />
        ))}
        <Text style={[styles.legendTxt, { color: c.text3 }]}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '600' },
  count: { fontSize: 12 },
  months: { flexDirection: 'row', marginBottom: 4 },
  month: { fontSize: 9, textAlign: 'left' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  cell: { borderRadius: 2, margin: 1 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, justifyContent: 'flex-end' },
  legendTxt: { fontSize: 11 },
  legendCell: { width: 10, height: 10, borderRadius: 2 },
});
