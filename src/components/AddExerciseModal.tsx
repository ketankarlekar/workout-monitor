import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { R } from '../constants/theme';
import { Exercise } from '../types';

const MUSCLE_GROUPS = [
  'Chest','Shoulders','Triceps','Back','Rear Delts','Biceps','Forearms',
  'Quads','Hamstrings','Glutes','Calves','Adductors','Core',
];
const EMOJIS: Record<string, string> = {
  Chest:'🫁', Shoulders:'🤷', Triceps:'💪', Back:'🦴',
  'Rear Delts':'↩️', Biceps:'🥊', Forearms:'🤜', Quads:'🏋️',
  Hamstrings:'🔄', Glutes:'🍑', Calves:'🦶', Adductors:'🦵', Core:'⬡',
};

interface Props {
  visible: boolean;
  initialMuscleGroup?: string;
  onClose: () => void;
  onAdd: (exercise: Exercise) => void;
}

export function AddExerciseModal({ visible, initialMuscleGroup, onClose, onAdd }: Props) {
  const { colors } = useTheme();
  const c = colors;
  const [mg, setMg] = useState(initialMuscleGroup || 'Chest');
  const [name, setName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (visible && initialMuscleGroup) setMg(initialMuscleGroup);
  }, [visible, initialMuscleGroup]);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      muscleGroup: mg,
      emoji: EMOJIS[mg] || '💪',
      sets: parseInt(sets) || 3,
      reps: parseInt(reps) || 10,
      weight: weight ? parseFloat(weight) : null,
      notes: '',
      completed: false,
    });
    setName(''); setWeight(''); setSets('3'); setReps('10');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
          <TouchableOpacity activeOpacity={1}>
            <View style={[styles.sheet, { backgroundColor: c.surface }]}>
              <View style={[styles.handle, { backgroundColor: c.border2 }]} />
              <Text style={[styles.title, { color: c.text }]}>Add Exercise</Text>
              <Text style={[styles.sub, { color: c.text2 }]}>Adding to: {mg}</Text>

              <Text style={[styles.fieldLabel, { color: c.text2 }]}>MUSCLE GROUP</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {MUSCLE_GROUPS.map(g => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.chip, { backgroundColor: g === mg ? c.accent : c.surface2, borderColor: g === mg ? c.accent : c.border }]}
                      onPress={() => setMg(g)}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: g === mg ? '#000' : c.text }}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={[styles.fieldLabel, { color: c.text2 }]}>EXERCISE NAME</Text>
              <TextInput
                style={[styles.input, { backgroundColor: c.surface2, borderColor: c.border, color: c.text }]}
                placeholder="e.g. Incline Bench Press"
                placeholderTextColor={c.text3}
                value={name}
                onChangeText={setName}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: c.text2 }]}>SETS</Text>
                  <TextInput style={[styles.input, { backgroundColor: c.surface2, borderColor: c.border, color: c.text }]} value={sets} onChangeText={setSets} keyboardType="numeric" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: c.text2 }]}>REPS</Text>
                  <TextInput style={[styles.input, { backgroundColor: c.surface2, borderColor: c.border, color: c.text }]} value={reps} onChangeText={setReps} keyboardType="numeric" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: c.text2 }]}>WEIGHT (kg)</Text>
                  <TextInput style={[styles.input, { backgroundColor: c.surface2, borderColor: c.border, color: c.text }]} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="opt" placeholderTextColor={c.text3} />
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={[styles.btnCancel, { backgroundColor: c.surface2, borderColor: c.border }]} onPress={onClose}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: c.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnConfirm, { backgroundColor: c.accent }]} onPress={handleAdd}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>Add Exercise ＋</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: R.xl, borderTopRightRadius: R.xl, padding: 24, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  sub: { fontSize: 13, marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1 },
  input: { padding: 12, borderWidth: 1, borderRadius: R.sm, fontSize: 14, marginBottom: 14 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancel: { flex: 1, padding: 13, borderRadius: R.md, borderWidth: 1, alignItems: 'center' },
  btnConfirm: { flex: 2, padding: 13, borderRadius: R.md, alignItems: 'center' },
});
