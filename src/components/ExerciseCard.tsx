import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { R } from '../constants/theme';
import { Exercise } from '../types';

interface Props {
  exercise: Exercise;
  accentColor: string;
  onToggle: () => void;
  onUpdate: (field: 'sets' | 'reps' | 'weight', value: number) => void;
  onNotes: () => void;
  onDelete: () => void;
}

export function ExerciseCard({ exercise, accentColor, onToggle, onUpdate, onNotes, onDelete }: Props) {
  const { colors } = useTheme();
  const c = colors;

  const volume = exercise.weight ? exercise.sets * exercise.reps * exercise.weight : null;

  return (
    <View style={[
      styles.card,
      { backgroundColor: c.surface, borderColor: exercise.completed ? `${accentColor}66` : c.border },
      exercise.completed && { backgroundColor: `${accentColor}0a` },
    ]}>
      <View style={[styles.thumb, { backgroundColor: c.surface3 }]}>
        <Text style={styles.thumbEmoji}>{exercise.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: c.text }]}>{exercise.name}</Text>
        <View style={styles.muscleRow}>
          <Text style={[styles.muscle, { color: c.text2 }]}>{exercise.muscleGroup}</Text>
          {volume !== null && (
            <Text style={[styles.volume, { color: accentColor }]}>{volume.toLocaleString()} kg</Text>
          )}
        </View>
        <View style={styles.row}>
          <InputField label="Sets" value={exercise.sets} min={1} colors={c} onChange={v => onUpdate('sets', v)} />
          <InputField label="Reps" value={exercise.reps} min={1} colors={c} onChange={v => onUpdate('reps', v)} />
          <InputField label="kg" value={exercise.weight ?? 0} min={0} colors={c} onChange={v => onUpdate('weight', v)} />
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.check, { borderColor: exercise.completed ? accentColor : c.border2, backgroundColor: exercise.completed ? accentColor : 'transparent' }]}
          onPress={onToggle}
        >
          <Text style={{ color: exercise.completed ? '#000' : c.text3, fontSize: 13, fontWeight: '700' }}>
            {exercise.completed ? '✓' : '○'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: c.surface2, borderColor: c.border }]} onPress={onNotes}>
          <Text style={{ fontSize: 13 }}>📝</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: c.surface2, borderColor: c.border }]} onPress={onDelete}>
          <Text style={{ fontSize: 13 }}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InputField({ label, value, min, colors, onChange }: {
  label: string; value: number; min: number; colors: any; onChange: (v: number) => void;
}) {
  const [text, setText] = useState(String(value === 0 && label === 'kg' ? '' : value));

  useEffect(() => {
    setText(value === 0 && label === 'kg' ? '' : String(value));
  }, [value, label]);

  return (
    <View style={styles.inputWrap}>
      <Text style={[styles.inputLabel, { color: colors.text3 }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.text }]}
        value={text}
        keyboardType="numeric"
        onChangeText={setText}
        onBlur={() => {
          const n = parseFloat(text);
          const val = isNaN(n) ? min : Math.max(min, n);
          setText(val === 0 && label === 'kg' ? '' : String(val));
          onChange(val);
        }}
        selectTextOnFocus
        placeholder={label === 'kg' ? '—' : undefined}
        placeholderTextColor={colors.text3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: R.md, borderWidth: 1,
    padding: 14, flexDirection: 'row', gap: 12,
  },
  thumb: {
    width: 50, height: 50, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 24 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  muscleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  muscle: { fontSize: 12 },
  volume: { fontSize: 11, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  inputWrap: { alignItems: 'center', gap: 2 },
  inputLabel: { fontSize: 11, fontWeight: '600' },
  input: {
    width: 44, paddingVertical: 4, paddingHorizontal: 6,
    borderWidth: 1, borderRadius: 6,
    fontSize: 13, fontWeight: '600', textAlign: 'center',
  },
  actions: { flexDirection: 'column', gap: 6, alignItems: 'flex-end' },
  check: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtn: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
});
