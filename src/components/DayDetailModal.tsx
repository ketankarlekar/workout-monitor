import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, useWindowDimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { R } from '../constants/theme';
import { WorkoutSession, WorkoutType } from '../types';
import { MgIcon } from './MgIcon';

const TYPE_INFO: Record<WorkoutType, { label: string; emoji: string; color: string }> = {
  push:     { label: 'Push Day',     emoji: '🔥', color: '#fb923c' },
  pull:     { label: 'Pull Day',     emoji: '💧', color: '#60a5fa' },
  legs:     { label: 'Legs Day',     emoji: '🦵', color: '#c084fc' },
  saturday: { label: 'Saturday',     emoji: '⭐', color: '#fbbf24' },
};

interface Props {
  visible: boolean;
  /** Selected calendar day in 'YYYY-MM-DD' form, or null when nothing is selected. */
  date: string | null;
  /** Sessions logged on `date`, reduced to only the exercises the user actually completed. */
  sessions: WorkoutSession[];
  /** Previously saved notes/history text for this day, if any. */
  initialNotes: string;
  onClose: () => void;
  onSave: (notes: string) => void;
}

/**
 * Centered dialog shown when the user taps a green "has workout" dot on the calendar.
 * Displays the exercises/sets/reps logged that day and lets the user attach their
 * own free-text history notes, which are persisted (via WorkoutContext -> AsyncStorage)
 * and shown again the next time the same day is opened.
 */
export function DayDetailModal({ visible, date, sessions, initialNotes, onClose, onSave }: Props) {
  const { colors } = useTheme();
  const c = colors;
  const { height: windowHeight } = useWindowDimensions();
  const [notes, setNotes] = useState(initialNotes);

  // Re-seed the draft whenever a new day is opened (or its saved notes change underneath us).
  useEffect(() => { setNotes(initialNotes); }, [initialNotes, date, visible]);

  const dateLabel = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetWrapper}>
          <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}>
            <View style={[styles.sheet, { backgroundColor: c.surface, maxHeight: windowHeight - 48 }]}>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={[styles.title, { color: c.text }]}>📅 {dateLabel}</Text>

                {/* ---- 1. The workout actually completed this day ---- */}
                <Text style={[styles.label, { color: c.text2 }]}>WORKOUT COMPLETED</Text>
                {sessions.length === 0 ? (
                  <Text style={[styles.emptyTxt, { color: c.text3 }]}>No workout logged for this day.</Text>
                ) : (
                  sessions.map(session => {
                    const t = TYPE_INFO[session.type];
                    const groups = session.muscleGroups.filter(mg => mg.exercises.length > 0);
                    return (
                      <View key={session.id} style={[styles.planCard, { backgroundColor: c.surface2, borderColor: c.border }]}>
                        <View style={styles.planHeader}>
                          <Text style={{ fontSize: 16 }}>{t.emoji}</Text>
                          <Text style={[styles.planType, { color: t.color }]}>{t.label}</Text>
                        </View>
                        {groups.map(mg => (
                          <View key={mg.id} style={styles.mgBlock}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <MgIcon name={mg.name} size={18} />
                              <Text style={[styles.mgName, { color: c.text }]}>{mg.name}</Text>
                            </View>
                            {mg.exercises.map(e => (
                              <View key={e.id} style={styles.exRow}>
                                <Text style={[styles.exName, { color: c.text2 }]} numberOfLines={1}>{e.emoji} {e.name}</Text>
                                <Text style={[styles.exDetail, { color: c.text3 }]}>
                                  {e.sets} × {e.reps}{e.weight ? ` @ ${e.weight}kg` : ''}
                                </Text>
                              </View>
                            ))}
                          </View>
                        ))}
                      </View>
                    );
                  })
                )}

                {/* ---- 2. User's personal history notes for this day ---- */}
                <Text style={[styles.label, { color: c.text2, marginTop: 18 }]}>YOUR NOTES</Text>
                <TextInput
                  style={[styles.textarea, { backgroundColor: c.surface2, borderColor: c.border, color: c.text }]}
                  multiline
                  numberOfLines={5}
                  placeholder="How did this day go? PRs, energy levels, things to remember next time…"
                  placeholderTextColor={c.text3}
                  value={notes}
                  onChangeText={setNotes}
                  textAlignVertical="top"
                />
              </ScrollView>

              <View style={styles.actions}>
                <TouchableOpacity style={[styles.btnCancel, { backgroundColor: c.surface2, borderColor: c.border }]} onPress={onClose}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: c.text }}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnConfirm, { backgroundColor: c.accent }]} onPress={handleSave}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>Save Notes</Text>
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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  sheetWrapper: { width: '100%', maxWidth: 600 },
  sheet: { width: '100%', borderRadius: R.xl, padding: 24, paddingBottom: 32 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  emptyTxt: { fontSize: 13, marginBottom: 4 },
  planCard: { borderRadius: R.md, borderWidth: 1, padding: 14, marginBottom: 10 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  planType: { fontSize: 14, fontWeight: '700' },
  mgBlock: { marginBottom: 8 },
  mgName: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  exRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 3, paddingLeft: 8, gap: 8 },
  exName: { fontSize: 13, flex: 1 },
  exDetail: { fontSize: 12, fontWeight: '600' },
  textarea: { padding: 12, borderWidth: 1, borderRadius: R.sm, fontSize: 14, minHeight: 110, marginBottom: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnCancel: { flex: 1, padding: 13, borderRadius: R.md, borderWidth: 1, alignItems: 'center' },
  btnConfirm: { flex: 2, padding: 13, borderRadius: R.md, alignItems: 'center' },
});
