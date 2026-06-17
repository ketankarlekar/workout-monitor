import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useWorkout } from '../context/WorkoutContext';
import { MuscleGroupAccordion } from '../components/MuscleGroupAccordion';
import { AddExerciseModal } from '../components/AddExerciseModal';
import { NotesModal } from '../components/NotesModal';
import { DeleteModal } from '../components/DeleteModal';
import { Toast, ToastRef } from '../components/Toast';
import { R } from '../constants/theme';
import { WorkoutType, Exercise } from '../types';

const CONFIGS: Record<WorkoutType, { title: string; emoji: string; sub: string; color: string; gradientBg: [string, string] }> = {
  push:     { title: 'Push Day',     emoji: '🔥', sub: 'Chest · Shoulders · Triceps', color: '#f97316', gradientBg: ['#1d4ed8', '#f97316'] },
  pull:     { title: 'Pull Day',     emoji: '🏋️', sub: 'Back · Rear Delts · Biceps · Forearms', color: '#3b82f6', gradientBg: ['#1d4ed8', '#3b82f6'] },
  legs:     { title: 'Legs Day',     emoji: '🦵', sub: 'Quads · Hams · Glutes · Calves · Adductors', color: '#a855f7', gradientBg: ['#7e22ce', '#a855f7'] },
  saturday: { title: 'Saturday Mix', emoji: '⭐', sub: 'Custom mixed workout', color: '#eab308', gradientBg: ['#854d0e', '#eab308'] },
};

interface Props { workoutType: WorkoutType; }

export default function WorkoutScreen({ workoutType }: Props) {
  const navigation = useNavigation<any>();
  const canGoBack = navigation.canGoBack();
  const { colors } = useTheme();
  const { state, addEx, deleteEx, updateNotes, saveSession } = useWorkout();
  const toastRef = useRef<ToastRef>(null);
  const c = colors;
  const cfg = CONFIGS[workoutType];
  const muscleGroups = state.activeWorkouts[workoutType];

  const [addModal, setAddModal] = useState<{ mgName: string; mgId: string } | null>(null);
  const [notesModal, setNotesModal] = useState<{ ex: Exercise; mgId: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ ex: Exercise; mgId: string } | null>(null);

  const totalEx = muscleGroups.reduce((sum, mg) => sum + mg.exercises.length, 0);
  const doneEx = muscleGroups.reduce((sum, mg) => sum + mg.exercises.filter(e => e.completed).length, 0);
  const pct = totalEx > 0 ? Math.round((doneEx / totalEx) * 100) : 0;
  const totalVolume = muscleGroups.reduce((sum, mg) =>
    sum + mg.exercises.reduce((s, e) => s + (e.weight ? e.sets * e.reps * e.weight : 0), 0), 0
  );

  const handleSave = () => {
    saveSession(workoutType);
    toastRef.current?.show('Workout saved! ✅');
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        {canGoBack && (
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: c.surface2, borderColor: c.border }]} onPress={() => navigation.goBack()}>
            <Text style={{ color: c.text, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: cfg.color }]}>{cfg.emoji} {cfg.title}</Text>
          <Text style={[styles.headerSub, { color: c.text2 }]}>{cfg.sub}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressWrap, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <View style={[styles.progressBg, { backgroundColor: c.surface3 }]}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: cfg.color }]} />
        </View>
        <View style={styles.progressLabel}>
          <Text style={[styles.progressTxt, { color: c.text3 }]}>
            {doneEx} / {totalEx} done{totalVolume > 0 ? ` · ${totalVolume.toLocaleString()} kg vol` : ''}
          </Text>
          <Text style={[styles.progressTxt, { color: c.text3 }]}>{pct}%</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {muscleGroups.map(mg => (
          <MuscleGroupAccordion
            key={mg.id}
            mg={mg}
            wType={workoutType}
            accentColor={cfg.color}
            onAddExercise={(mgName, mgId) => setAddModal({ mgName, mgId })}
            onNotes={(ex) => setNotesModal({ ex, mgId: mg.id })}
            onDelete={(ex) => setDeleteModal({ ex, mgId: mg.id })}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: cfg.color }]}
        onPress={() => setAddModal({ mgName: muscleGroups[0]?.name || 'Exercise', mgId: muscleGroups[0]?.id || '' })}
      >
        <Text style={{ fontSize: 26, color: '#000', lineHeight: 30 }}>＋</Text>
      </TouchableOpacity>

      {/* Save button */}
      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: c.accent }]} onPress={handleSave}>
        <Text style={{ color: '#000', fontSize: 14, fontWeight: '700' }}>Complete & Save ✅</Text>
      </TouchableOpacity>

      <AddExerciseModal
        visible={!!addModal}
        initialMuscleGroup={addModal?.mgName}
        onClose={() => setAddModal(null)}
        onAdd={(ex) => {
          if (addModal) {
            addEx(workoutType, addModal.mgId, ex);
            toastRef.current?.show('Exercise added ✓');
          }
        }}
      />
      <NotesModal
        visible={!!notesModal}
        exerciseName={notesModal?.ex.name || ''}
        initialNotes={notesModal?.ex.notes || ''}
        onClose={() => setNotesModal(null)}
        onSave={(notes) => {
          if (notesModal) {
            updateNotes(workoutType, notesModal.mgId, notesModal.ex.id, notes);
            toastRef.current?.show('Notes saved ✓');
          }
        }}
      />
      <DeleteModal
        visible={!!deleteModal}
        exerciseName={deleteModal?.ex.name || ''}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => {
          if (deleteModal) {
            deleteEx(workoutType, deleteModal.mgId, deleteModal.ex.id);
            toastRef.current?.show('Exercise deleted');
          }
        }}
      />
      <Toast ref={toastRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  progressWrap: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1 },
  progressBg: { height: 6, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  progressTxt: { fontSize: 12 },
  fab: {
    position: 'absolute', bottom: 70, right: 24,
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#22c55e', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  saveBtn: {
    position: 'absolute', bottom: 16, left: 20, right: 20,
    padding: 14, borderRadius: R.md, alignItems: 'center',
  },
});
