import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useWorkout } from '../context/WorkoutContext';
import { DayDetailModal } from '../components/DayDetailModal';
import { R } from '../constants/theme';
import { WorkoutType } from '../types';

/** Build the same 'YYYY-MM-DD' key used for WorkoutSession.date / dayNotes. */
function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const TYPE_COLORS: Record<WorkoutType, { bg: string; text: string; label: string }> = {
  push:     { bg: 'rgba(249,115,22,0.2)',  text: '#fb923c', label: 'PUSH' },
  pull:     { bg: 'rgba(59,130,246,0.2)',  text: '#60a5fa', label: 'PULL' },
  legs:     { bg: 'rgba(168,85,247,0.2)',  text: '#c084fc', label: 'LEGS' },
  saturday: { bg: 'rgba(234,179,8,0.2)',   text: '#fbbf24', label: 'SAT'  },
};

const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { state, setDayNote } = useWorkout();
  const c = colors;

  const [filter, setFilter] = useState<WorkoutType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [calDate, setCalDate] = useState(new Date());

  // Currently-open "day detail" sheet (opened by tapping a green workout dot).
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedSessions = useMemo(
    () => (selectedDate ? state.sessions.filter(s => s.date === selectedDate) : []),
    [state.sessions, selectedDate]
  );
  const selectedNotes = selectedDate ? (state.dayNotes[selectedDate] ?? '') : '';

  const filteredSessions = useMemo(() => {
    return state.sessions.filter(s => {
      if (filter !== 'all' && s.type !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const exNames = s.muscleGroups.flatMap(mg => mg.exercises.map(e => e.name.toLowerCase()));
        const mgNames = s.muscleGroups.map(mg => mg.name.toLowerCase());
        if (!exNames.some(n => n.includes(q)) && !mgNames.some(n => n.includes(q))) return false;
      }
      return true;
    });
  }, [state.sessions, filter, search]);

  // Calendar
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const workoutDaysThisMonth = new Set(
    state.sessions.filter(s => {
      const d = new Date(s.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }).map(s => new Date(s.date).getDate())
  );

  // Stats for this month
  const thisMonthSessions = state.sessions.filter(s => {
    const d = new Date(s.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const avgPerWeek = thisMonthSessions.length > 0 ? (thisMonthSessions.length / 4.3).toFixed(1) : '0';

  const prevMonth = () => setCalDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCalDate(new Date(year, month + 1, 1));

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text3 }]}>WORKOUT HISTORY</Text>
          <Text style={[styles.sectionLink, { color: c.accent }]}>Export</Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={[styles.searchIcon, { color: c.text3 }]}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { backgroundColor: c.surface, borderColor: c.border, color: c.text }]}
            placeholder="Search exercises, muscles…"
            placeholderTextColor={c.text3}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {(['all','push','pull','legs','saturday'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, { backgroundColor: filter === f ? c.accent : c.surface, borderColor: filter === f ? c.accent : c.border }]}
              onPress={() => setFilter(f)}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: filter === f ? '#000' : c.text }}>
                {f === 'all' ? 'All' : f === 'push' ? 'Push 🔥' : f === 'pull' ? 'Pull 💧' : f === 'legs' ? 'Legs 🦵' : 'Saturday ⭐'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mini Calendar */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text3 }]}>{MONTHS[month].toUpperCase()} {year}</Text>
        </View>
        <View style={[styles.miniCal, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={styles.calHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.calNav}>
              <Text style={[styles.calNavTxt, { color: c.text2 }]}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.calMonth, { color: c.text }]}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.calNav}>
              <Text style={[styles.calNavTxt, { color: c.text2 }]}>›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calGrid}>
            {DAYS.map(d => (
              <View key={d} style={styles.calDow}>
                <Text style={[styles.calDowTxt, { color: c.text3 }]}>{d}</Text>
              </View>
            ))}
            {Array(firstDay).fill(null).map((_, i) => <View key={`e${i}`} style={styles.calDay} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const hasWorkout = workoutDaysThisMonth.has(day);
              return (
                <TouchableOpacity
                  key={day}
                  disabled={!hasWorkout}
                  activeOpacity={hasWorkout ? 0.6 : 1}
                  onPress={() => setSelectedDate(dateKey(year, month, day))}
                  style={[styles.calDay, isToday && [styles.calDayToday, { backgroundColor: c.accent }]]}
                >
                  <Text style={[styles.calDayTxt, { color: isToday ? '#000' : c.text }, isToday && { fontWeight: '800' }]}>{day}</Text>
                  {hasWorkout && !isToday && <View style={[styles.calDot, { backgroundColor: c.accent }]} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Monthly summary */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text3 }]}>MONTHLY SUMMARY</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={{ fontSize: 20 }}>📊</Text>
            <Text style={[styles.statVal, { color: c.accent }]}>{thisMonthSessions.length}</Text>
            <Text style={[styles.statLbl, { color: c.text2 }]}>Monthly Workouts</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={{ fontSize: 20 }}>📈</Text>
            <Text style={[styles.statVal, { color: c.text }]}>{avgPerWeek}</Text>
            <Text style={[styles.statLbl, { color: c.text2 }]}>Per Week</Text>
          </View>
        </View>

        {/* Session list */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text3 }]}>RECENT SESSIONS</Text>
        </View>
        <View style={styles.list}>
          {filteredSessions.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 52 }}>📭</Text>
              <Text style={[styles.emptyTitle, { color: c.text }]}>No sessions yet</Text>
              <Text style={[styles.emptySub, { color: c.text2 }]}>Complete a workout to see it here</Text>
            </View>
          ) : (
            filteredSessions.map(session => {
              const tc = TYPE_COLORS[session.type];
              const muscles = [...new Set(session.muscleGroups.filter(mg => mg.exercises.length > 0).map(mg => mg.name))];
              const exNames = session.muscleGroups.flatMap(mg => mg.exercises.map(e => e.name)).slice(0, 5).join(' · ');
              const dateStr = new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const totalEx = session.muscleGroups.reduce((s, mg) => s + mg.exercises.length, 0);
              return (
                <View key={session.id} style={[styles.sessionCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                  <View style={styles.sessionTop}>
                    <View style={[styles.badge, { backgroundColor: tc.bg }]}>
                      <Text style={[styles.badgeTxt, { color: tc.text }]}>{tc.label}</Text>
                    </View>
                    <Text style={[styles.sessionDate, { color: c.text3 }]}>{dateStr}</Text>
                    <Text style={[styles.sessionEx, { color: c.text2 }]}>{totalEx} exercises</Text>
                  </View>
                  {muscles.length > 0 && (
                    <View style={styles.tags}>
                      {muscles.map(m => (
                        <View key={m} style={[styles.tag, { backgroundColor: c.surface2, borderColor: c.border2 }]}>
                          <Text style={[styles.tagTxt, { color: c.text2 }]}>{m}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {exNames ? <Text style={[styles.exList, { color: c.text3 }]}>{exNames}…</Text> : null}
                </View>
              );
            })
          )}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Tapping a green "workout logged" dot opens this sheet: shows that day's
          plan (exercises/sets/reps) plus an editable, persisted notes/history field. */}
      <DayDetailModal
        visible={!!selectedDate}
        date={selectedDate}
        sessions={selectedSessions}
        initialNotes={selectedNotes}
        onClose={() => setSelectedDate(null)}
        onSave={notes => { if (selectedDate) setDayNote(selectedDate, notes); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionLink: { fontSize: 13, fontWeight: '500' },
  searchWrap: { paddingHorizontal: 20, paddingBottom: 8, position: 'relative' },
  searchIcon: { position: 'absolute', left: 32, top: 13, fontSize: 16, zIndex: 1 },
  searchInput: { padding: 12, paddingLeft: 40, borderWidth: 1, borderRadius: R.md, fontSize: 14 },
  filterRow: { marginBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99, borderWidth: 1 },
  miniCal: { marginHorizontal: 20, borderRadius: R.lg, borderWidth: 1, padding: 16 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calNav: { padding: 4 },
  calNavTxt: { fontSize: 20 },
  calMonth: { fontSize: 15, fontWeight: '700' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDow: { width: '14.28%', alignItems: 'center', paddingVertical: 4 },
  calDowTxt: { fontSize: 11, fontWeight: '600' },
  calDay: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8, position: 'relative' },
  calDayToday: { borderRadius: 8 },
  calDayTxt: { fontSize: 12, fontWeight: '500' },
  calDot: { position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: 2 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  statCard: { flex: 1, borderRadius: R.md, borderWidth: 1, padding: 16, gap: 6 },
  statVal: { fontSize: 26, fontWeight: '800', letterSpacing: -1 },
  statLbl: { fontSize: 12, fontWeight: '500' },
  list: { paddingHorizontal: 20, gap: 10, flexDirection: 'column' },
  sessionCard: { borderRadius: R.md, borderWidth: 1, padding: 16 },
  sessionTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  badgeTxt: { fontSize: 11, fontWeight: '700' },
  sessionDate: { flex: 1, fontSize: 12 },
  sessionEx: { fontSize: 12, fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, borderWidth: 1 },
  tagTxt: { fontSize: 11 },
  exList: { fontSize: 12, lineHeight: 18 },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700' },
  emptySub: { fontSize: 14, textAlign: 'center' },
});
