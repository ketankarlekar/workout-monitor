import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WorkoutSet } from '../types';
import { COLORS, RADIUS } from '../theme';

type Props = {
  set: WorkoutSet;
  index: number;
  onUpdate: (field: 'weight' | 'reps', value: number) => void;
  onToggleComplete: () => void;
};

export default function SetRow({ set, index, onUpdate, onToggleComplete }: Props) {
  return (
    <View style={[styles.row, set.completed && styles.completedRow]}>
      <Text style={styles.setNum}>{index + 1}</Text>

      <View style={styles.inputGroup}>
        <TextInput
          style={[styles.input, set.completed && styles.inputDone]}
          value={set.weight === 0 ? '' : String(set.weight)}
          onChangeText={(t) => onUpdate('weight', parseFloat(t) || 0)}
          placeholder="0"
          placeholderTextColor={COLORS.disabled}
          keyboardType="decimal-pad"
          editable={!set.completed}
          returnKeyType="next"
        />
        <Text style={styles.unit}>kg</Text>
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={[styles.input, set.completed && styles.inputDone]}
          value={set.reps === 0 ? '' : String(set.reps)}
          onChangeText={(t) => onUpdate('reps', parseInt(t, 10) || 0)}
          placeholder="0"
          placeholderTextColor={COLORS.disabled}
          keyboardType="number-pad"
          editable={!set.completed}
          returnKeyType="done"
        />
        <Text style={styles.unit}>reps</Text>
      </View>

      <TouchableOpacity
        onPress={onToggleComplete}
        style={[styles.checkBtn, set.completed && styles.checkedBtn]}
        activeOpacity={0.7}
      >
        <Text style={[styles.checkText, set.completed && styles.checkedText]}>
          {set.completed ? '✓' : '○'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 8,
    borderRadius: RADIUS.sm,
  },
  completedRow: {
    backgroundColor: COLORS.successLight,
  },
  setNum: {
    width: 22,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    height: 38,
    gap: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputDone: {
    color: COLORS.textSecondary,
  },
  unit: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBtn: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  checkedText: {
    color: COLORS.surface,
    fontWeight: '700',
  },
});
