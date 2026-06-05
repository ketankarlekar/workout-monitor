import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { R } from '../constants/theme';

interface Props {
  visible: boolean;
  exerciseName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ visible, exerciseName, onClose, onConfirm }: Props) {
  const { colors } = useTheme();
  const c = colors;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}>
          <View style={[styles.sheet, { backgroundColor: c.surface }]}>
            <View style={[styles.handle, { backgroundColor: c.border2 }]} />
            <Text style={[styles.title, { color: c.text }]}>🗑 Delete Exercise?</Text>
            <Text style={[styles.sub, { color: c.text2 }]}>Remove "{exerciseName}" from your workout?</Text>
            <View style={[styles.warning, { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }]}>
              <Text style={{ color: '#fca5a5', fontSize: 13 }}>⚠️ This cannot be undone.</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btnCancel, { backgroundColor: c.surface2, borderColor: c.border }]} onPress={onClose}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: c.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDelete} onPress={() => { onConfirm(); onClose(); }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: R.xl, borderTopRightRadius: R.xl, padding: 24, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  sub: { fontSize: 13, marginBottom: 16 },
  warning: { padding: 12, borderWidth: 1, borderRadius: R.sm, marginBottom: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btnCancel: { flex: 1, padding: 13, borderRadius: R.md, borderWidth: 1, alignItems: 'center' },
  btnDelete: { flex: 2, padding: 13, borderRadius: R.md, alignItems: 'center', backgroundColor: '#ef4444' },
});
