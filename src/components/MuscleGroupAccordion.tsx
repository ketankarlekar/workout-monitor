import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MuscleGroup, WorkoutType, Exercise } from '../types';
import { ExerciseCard } from './ExerciseCard';
import { useWorkout } from '../context/WorkoutContext';

interface Props {
  mg: MuscleGroup;
  wType: WorkoutType;
  accentColor: string;
  onAddExercise: (mgName: string, mgId: string) => void;
  onNotes: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise, mgId: string) => void;
}

export function MuscleGroupAccordion({ mg, wType, accentColor, onAddExercise, onNotes, onDelete }: Props) {
  const { colors } = useTheme();
  const { toggleMG, toggleEx, updateEx } = useWorkout();
  const c = colors;

  return (
    <View style={[styles.group, { borderBottomColor: c.border }]}>
      <TouchableOpacity style={[styles.toggle, { borderBottomColor: c.border }]} onPress={() => toggleMG(wType, mg.id)} activeOpacity={0.7}>
        <View style={[styles.icon, { backgroundColor: mg.color }]}>
          <Text style={{ fontSize: 20 }}>{mg.emoji}</Text>
        </View>
        <Text style={[styles.label, { color: c.text }]}>{mg.name}</Text>
        <Text style={[styles.count, { color: c.text3 }]}>{mg.exercises.length} exercises</Text>
        <Text style={[styles.chevron, { color: c.text3, transform: [{ rotate: mg.expanded ? '90deg' : '0deg' }] }]}>›</Text>
      </TouchableOpacity>

      {mg.expanded && (
        <View style={styles.body}>
          {mg.exercises.map(ex => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              accentColor={accentColor}
              onToggle={() => toggleEx(wType, mg.id, ex.id)}
              onUpdate={(field, val) => updateEx(wType, mg.id, ex.id, field, val)}
              onNotes={() => onNotes(ex)}
              onDelete={() => onDelete(ex, mg.id)}
            />
          ))}
          <TouchableOpacity
            style={[styles.addBtn, { borderColor: accentColor }]}
            onPress={() => onAddExercise(mg.name, mg.id)}
          >
            <Text style={{ fontSize: 16, color: accentColor }}>＋</Text>
            <Text style={[styles.addText, { color: accentColor }]}>Add {mg.name} Exercise</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { borderBottomWidth: 1 },
  toggle: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, gap: 14,
  },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontWeight: '700', fontSize: 15 },
  count: { fontSize: 12, marginRight: 8 },
  chevron: { fontSize: 16, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingBottom: 16, gap: 10, flexDirection: 'column' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderWidth: 1, borderStyle: 'dashed', borderRadius: 10,
    paddingVertical: 12,
  },
  addText: { fontSize: 13, fontWeight: '600' },
});
