import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useWorkout } from '../context/WorkoutContext';
import { ContributionCalendar } from '../components/ContributionCalendar';
import { R } from '../constants/theme';

const WORKOUT_CARDS = [
  { type: 'push' as const, emoji: '🔥', name: 'Push', sub: 'Chest · Shoulders · Triceps', badge: '⚡ 3 muscles', bg: ['#1a0f08','#2a1505'], borderColor: 'rgba(249,115,22,0.25)', badgeBg: 'rgba(249,115,22,0.2)', badgeColor: '#fb923c' },
  { type: 'pull' as const, emoji: '🏋️', name: 'Pull', sub: 'Back · Biceps · Forearms', badge: '💧 4 muscles', bg: ['#080f1a','#051525'], borderColor: 'rgba(59,130,246,0.25)', badgeBg: 'rgba(59,130,246,0.2)', badgeColor: '#60a5fa' },
  { type: 'legs' as const, emoji: '🦵', name: 'Legs', sub: 'Quads · Hams · Glutes', badge: '🔮 5 muscles', bg: ['#120a1a','#180a24'], borderColor: 'rgba(168,85,247,0.25)', badgeBg: 'rgba(168,85,247,0.2)', badgeColor: '#c084fc' },
  { type: 'saturday' as const, emoji: '⭐', name: 'Saturday', sub: 'Mixed · Full Body', badge: '🌟 Any muscle', bg: ['#1a1608','#201a05'], borderColor: 'rgba(234,179,8,0.25)', badgeBg: 'rgba(234,179,8,0.2)', badgeColor: '#fbbf24' },
];

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { state } = useWorkout();
  const navigation = useNavigation<any>();
  const c = colors;
  const s = state.stats;

  const lastWorkoutText = s.lastWorkout
    ? `${s.lastWorkout.type.charAt(0).toUpperCase() + s.lastWorkout.type.slice(1)} 💪`
    : 'None yet';

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      {/* Top bar */}
      <View style={[styles.topbar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <View style={styles.topbarLogo}>
          <View style={[styles.topbarIcon, { backgroundColor: c.accentDim }]}>
            <Text style={{ fontSize: 18 }}>💪</Text>
          </View>
          <Text style={[styles.topbarTitle, { color: c.text }]}>Workout <Text style={{ color: c.accent }}>Monitor</Text></Text>
        </View>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: c.surface2, borderColor: c.border }]} onPress={toggleTheme}>
          <Text style={{ fontSize: 16 }}>{isDark ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Workout cards */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text3 }]}>WORKOUT TYPES</Text>
        </View>
        <View style={styles.grid}>
          {WORKOUT_CARDS.map(card => (
            <TouchableOpacity
              key={card.type}
              style={[styles.workoutCard, { borderColor: card.borderColor, backgroundColor: isDark ? card.bg[0] : c.surface2 }]}
              onPress={() => card.type === 'saturday' ? navigation.navigate('Saturday') : navigation.navigate(card.type.charAt(0).toUpperCase() + card.type.slice(1))}
              activeOpacity={0.8}
            >
              <View>
                <Text style={{ fontSize: 30, marginBottom: 8 }}>{card.emoji}</Text>
                <Text style={[styles.cardName, { color: c.text }]}>{card.name}</Text>
                <Text style={[styles.cardSub, { color: c.text2 }]}>{card.sub}</Text>
              </View>
              <View style={[styles.cardBadge, { backgroundColor: card.badgeBg }]}>
                <Text style={[styles.cardBadgeText, { color: card.badgeColor }]}>{card.badge}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text3 }]}>STATS</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard emoji="🏆" value={String(s.total)} label="Total Workouts" valueColor={c.accent} c={c} />
          <StatCard emoji="🔥" value={String(s.streak)} label="Current Streak" valueColor="#f97316" c={c} />
          <StatCard emoji="⚡" value={String(s.longestStreak)} label="Longest Streak" valueColor="#eab308" c={c} />
          <StatCard emoji="📅" value={String(s.thisWeek)} label="This Week" valueColor={c.accent} c={c} />
          <View style={[styles.statCard, styles.statCardFull, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View>
              <Text style={[styles.statLabel, { color: c.text2 }]}>Last Workout</Text>
              <Text style={[styles.statValue, { color: c.text, fontSize: 18 }]}>{lastWorkoutText}</Text>
            </View>
            <Text style={{ fontSize: 28 }}>✅</Text>
          </View>
        </View>

        {/* Contribution calendar */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text3 }]}>YEAR PROGRESS</Text>
        </View>
        <View style={styles.padH}>
          <ContributionCalendar sessions={state.sessions} />
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ emoji, value, label, valueColor, c }: { emoji: string; value: string; label: string; valueColor: string; c: any }) {
  return (
    <View style={[styles.statCard, { backgroundColor: c.surface, borderColor: c.border }]}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.text2 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
  },
  topbarLogo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topbarIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  topbarTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  scroll: { paddingBottom: 16 },
  sectionHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  padH: { paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 },
  workoutCard: {
    width: '47%', borderRadius: R.lg, padding: 18, borderWidth: 1,
    minHeight: 130, justifyContent: 'space-between',
  },
  cardName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  cardSub: { fontSize: 12 },
  cardBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, alignSelf: 'flex-start', marginTop: 8 },
  cardBadgeText: { fontSize: 11, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20 },
  statCard: {
    width: '47%', borderRadius: R.md, borderWidth: 1,
    padding: 16, gap: 6,
  },
  statCardFull: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statValue: { fontSize: 26, fontWeight: '800', letterSpacing: -1 },
  statLabel: { fontSize: 12, fontWeight: '500' },
});
