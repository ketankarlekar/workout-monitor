import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { R } from '../constants/theme';

interface Props {
  visible: boolean;
  exerciseName: string;
  initialNotes: string;
  onClose: () => void;
  onSave: (notes: string) => void;
}

export function NotesModal({ visible, exerciseName, initialNotes, onClose, onSave }: Props) {
  const { colors } = useTheme();
  const c = colors;
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => { setNotes(initialNotes); }, [initialNotes, visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
          <TouchableOpacity activeOpacity={1}>
            <View style={[styles.sheet, { backgroundColor: c.surface }]}>
              <View style={[styles.handle, { backgroundColor: c.border2 }]} />
              <Text style={[styles.title, { color: c.text }]}>📝 Exercise Notes</Text>
              <Text style={[styles.sub, { color: c.text2 }]}>{exerciseName}</Text>
              <Text style={[styles.label, { color: c.text2 }]}>NOTES</Text>
              <TextInput
                style={[styles.textarea, { backgroundColor: c.surface2, borderColor: c.border, color: c.text }]}
                multiline
                numberOfLines={4}
                placeholder="Form cues, PR targets, how it felt, tempo…"
                placeholderTextColor={c.text3}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.btnCancel, { backgroundColor: c.surface2, borderColor: c.border }]} onPress={onClose}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: c.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnConfirm, { backgroundColor: c.accent }]} onPress={() => { onSave(notes); onClose(); }}>
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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: R.xl, borderTopRightRadius: R.xl, padding: 24, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  sub: { fontSize: 13, marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  textarea: { padding: 12, borderWidth: 1, borderRadius: R.sm, fontSize: 14, marginBottom: 14, minHeight: 100 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancel: { flex: 1, padding: 13, borderRadius: R.md, borderWidth: 1, alignItems: 'center' },
  btnConfirm: { flex: 2, padding: 13, borderRadius: R.md, alignItems: 'center' },
});
