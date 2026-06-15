import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColorScheme } from '../constants/theme';

interface Segment {
  value: number;
  color: string;
}

/** A single-row horizontal bar split into colored segments proportional to `value`. */
export function StackedBar({ segments, c, height = 14 }: { segments: Segment[]; c: ColorScheme; height?: number }) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  return (
    <View style={[styles.track, { height, borderRadius: height / 2, backgroundColor: c.surface2 }]}>
      {total > 0 && segments.filter(seg => seg.value > 0).map((seg, i) => (
        <View key={i} style={{ flex: seg.value, backgroundColor: seg.color }} />
      ))}
    </View>
  );
}

/** A labeled horizontal bar row, e.g. "Chest [=====    ] 8 ex". */
export function HBarRow({ icon, label, value, max, color, c, suffix = '' }: {
  icon?: React.ReactNode;
  label: string;
  value: number;
  max: number;
  color: string;
  c: ColorScheme;
  suffix?: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <View style={styles.hRow}>
      <View style={styles.hLabelWrap}>
        {icon}
        <Text style={[styles.hLabel, { color: c.text }]} numberOfLines={1}>{label}</Text>
      </View>
      <View style={[styles.hTrack, { backgroundColor: c.surface2 }]}>
        <View style={[styles.hFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.hValue, { color: c.text2 }]}>{value}{suffix}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', overflow: 'hidden', width: '100%' },
  hRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  hLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 96 },
  hLabel: { fontSize: 12, fontWeight: '600', flexShrink: 1 },
  hTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  hFill: { height: '100%', borderRadius: 4 },
  hValue: { fontSize: 12, fontWeight: '700', width: 32, textAlign: 'right' },
});
