# Workout Monitor

A React Native / Expo workout tracking app with local authentication and full workout logging.

## Features

- **Auth** — Register and log in with email + password (stored locally via AsyncStorage)
- **Exercise Library** — 55 exercises across 7 muscle groups (Chest, Back, Shoulders, Biceps, Triceps, Legs, Core)
- **Workout Logging** — Add exercises, track sets with weight and reps, toggle set completion
- **Live Timer** — Tracks duration of each workout session
- **History** — Browse past workouts with full exercise breakdowns
- **Stats Dashboard** — Total workouts, sets, and muscle groups hit at a glance

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native + Expo 56 |
| Navigation | React Navigation v7 (native-stack + bottom-tabs) |
| Storage | AsyncStorage (local-only, no backend) |
| Icons | @expo/vector-icons (Ionicons) |
| Language | TypeScript |

## Getting Started

```bash
npm install
npm start        # Expo dev server (scan QR with Expo Go)
npm run web      # Run in browser
npm run android  # Run on Android emulator/device
npm run ios      # Run on iOS simulator/device
```

## Project Structure

```
src/
├── context/
│   └── AuthContext.tsx        # Auth state (user, signIn, signOut)
├── navigation/
│   └── AppNavigator.tsx       # Auth stack ↔ Main stack routing
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx         # Stats dashboard
│   ├── LogWorkoutScreen.tsx   # Active workout session
│   ├── HistoryScreen.tsx      # Past workouts list
│   └── WorkoutDetailScreen.tsx
├── components/
│   ├── SetRow.tsx             # Weight/reps input row
│   └── ExercisePicker.tsx     # Full-screen exercise search modal
├── exercises.ts               # Exercise library
├── storage.ts                 # AsyncStorage CRUD (workouts + auth)
├── theme.ts                   # Colors, radius, shadow constants
├── types.ts                   # TypeScript types
└── utils.ts                   # formatDuration, formatDate, generateId
```

## Auth Flow

All data is stored locally — no backend or internet connection required. On first launch the app shows the Login screen. After registering or logging in the session persists across app restarts.
