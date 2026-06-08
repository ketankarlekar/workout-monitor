import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { R } from '../constants/theme';

export default function AuthScreen() {
  const { colors } = useTheme();
  const c = colors;
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    const fn = mode === 'signIn' ? signIn : signUp;
    const message = await fn(email.trim(), password);
    setBusy(false);
    if (message) setError(message);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={[styles.logo, { backgroundColor: c.accentDim }]}>
            <Text style={{ fontSize: 30 }}>💪</Text>
          </View>
          <Text style={[styles.title, { color: c.text }]}>Workout <Text style={{ color: c.accent }}>Monitor</Text></Text>
          <Text style={[styles.sub, { color: c.text2 }]}>
            {mode === 'signIn' ? 'Sign in to sync your workouts' : 'Create an account to back up your workouts'}
          </Text>

          <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.label, { color: c.text2 }]}>EMAIL</Text>
            <TextInput
              style={[styles.input, { backgroundColor: c.surface2, borderColor: c.border, color: c.text }]}
              placeholder="you@example.com"
              placeholderTextColor={c.text3}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={[styles.label, { color: c.text2, marginTop: 14 }]}>PASSWORD</Text>
            <TextInput
              style={[styles.input, { backgroundColor: c.surface2, borderColor: c.border, color: c.text }]}
              placeholder="••••••••"
              placeholderTextColor={c.text3}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}

            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: c.accent, opacity: busy || !email || !password ? 0.6 : 1 }]}
              onPress={submit}
              disabled={busy || !email || !password}
            >
              {busy
                ? <ActivityIndicator color="#000" />
                : <Text style={styles.btnPrimaryText}>{mode === 'signIn' ? 'Sign In' : 'Create Account'}</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.toggle}
            onPress={() => { setMode(m => m === 'signIn' ? 'signUp' : 'signIn'); setError(null); }}
          >
            <Text style={{ color: c.text2, fontSize: 13 }}>
              {mode === 'signIn' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={{ color: c.accent, fontWeight: '700' }}>{mode === 'signIn' ? 'Sign up' : 'Sign in'}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { width: 56, height: 56, borderRadius: R.lg, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  sub: { fontSize: 13, textAlign: 'center', marginBottom: 28 },
  card: { borderWidth: 1, borderRadius: R.lg, padding: 20 },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input: { padding: 13, borderWidth: 1, borderRadius: R.sm, fontSize: 14 },
  error: { fontSize: 13, marginTop: 14 },
  btnPrimary: { marginTop: 20, padding: 14, borderRadius: R.md, alignItems: 'center' },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#000' },
  toggle: { marginTop: 20, alignItems: 'center' },
});
