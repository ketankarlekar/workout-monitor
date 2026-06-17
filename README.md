# 💪 Workout Monitor

A mobile-first workout tracking app built with React Native and Expo. Track your exercises, monitor progress, and maintain a detailed workout history—all stored locally on your device with zero internet dependency.

---

## ✨ Features

- **🔐 Local Authentication** — Secure email/password registration and login with data stored locally via AsyncStorage
- **🏋️ Exercise Library** — 55 pre-built exercises organized across 7 muscle groups (Chest, Back, Shoulders, Biceps, Triceps, Legs, Core)
- **📝 Workout Logging** — Add exercises to active sessions, track sets with weight and reps, mark sets as complete
- **⏱️ Live Timer** — Real-time duration tracking for each workout session
- **📊 Stats Dashboard** — Quick overview of total workouts, total sets, and muscle groups trained
- **📚 Workout History** — Browse and review all past workouts with detailed exercise breakdowns
- **📱 Cross-Platform** — Run on iOS, Android, and web browsers

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|----------|
| **Framework** | React Native + Expo 56 |
| **Navigation** | React Navigation v7 (native-stack + bottom-tabs) |
| **Storage** | AsyncStorage (local-only, no backend) |
| **UI Icons** | @expo/vector-icons (Ionicons) |
| **Language** | TypeScript |
| **License** | MIT |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for advanced features)
- [Expo Go app](https://expo.dev/client) on your phone (optional, for mobile testing)

### Installation & Running

```bash
# Install dependencies
npm install

# Start Expo dev server (scan QR code with Expo Go app)
npm start

# Run in browser (web)
npm run web

# Run on Android emulator/device
npm run android

# Run on iOS simulator/device
npm run ios
```

---

## 📂 Project Structure

```
src/
├── context/
│   └── AuthContext.tsx              # Auth state management (user, signIn, signOut)
├── navigation/
│   └── AppNavigator.tsx             # Conditional navigation (Auth stack ↔ Main stack)
├── screens/
│   ├── LoginScreen.tsx              # User login interface
│   ├── RegisterScreen.tsx           # User registration interface
│   ├── HomeScreen.tsx               # Stats dashboard & main hub
│   ├── LogWorkoutScreen.tsx         # Active workout session interface
│   ├── HistoryScreen.tsx            # List of past workouts
│   └── WorkoutDetailScreen.tsx      # Detailed view of a single workout
├── components/
│   ├── SetRow.tsx                   # Reusable component for weight/reps input
│   └── ExercisePicker.tsx           # Full-screen modal for exercise selection
├── exercises.ts                     # Exercise library with 55 exercises
├── storage.ts                       # AsyncStorage CRUD operations (workouts + auth)
├── theme.ts                         # Design tokens (colors, border radius, shadows)
├── types.ts                         # TypeScript type definitions
├── utils.ts                         # Utility functions (formatDuration, formatDate, generateId)
└── App.tsx                          # Root component
```

---

## 🔐 Authentication & Data Flow

### How It Works
- **First Launch**: App displays the login/registration screen
- **Registration**: Users create an account with email and password
- **Local Storage**: All user data and workouts are stored locally on the device using AsyncStorage
- **Persistence**: Session data persists across app restarts
- **Offline-First**: Fully functional without internet connection

### Data Structure
```typescript
// User Account
{
  id: string;
  email: string;
  password: string; // hashed
}

// Workout Session
{
  id: string;
  date: string;
  duration: number; // milliseconds
  exercises: Exercise[];
  completed: boolean;
}

// Exercise Log
{
  exerciseId: string;
  name: string;
  sets: Set[];
}

// Set
{
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}
```

---

## 📖 Usage Guide

### Logging a Workout
1. Navigate to the **LogWorkout** screen
2. Tap "Add Exercise" to select from the exercise library
3. Enter weight and reps for each set
4. Toggle set completion as you finish sets
5. The timer automatically tracks session duration
6. Save your workout when complete

### Viewing History
1. Navigate to the **History** screen
2. Tap any workout to view detailed breakdown
3. See all exercises, sets, and muscle groups worked

### Checking Stats
1. Open the **Home** screen (Stats Dashboard)
2. View total workouts, total sets, and muscle groups trained

---

## 🎨 Design & Theme

The app uses a consistent design system defined in `theme.ts`:
- **Color Scheme**: Custom colors for primary, secondary, backgrounds
- **Border Radius**: Consistent rounded corners across all components
- **Shadows**: iOS/Android-appropriate shadow definitions

---

## 🔧 Development

### Adding New Exercises
Edit `src/exercises.ts` and add entries to the exercise library:
```typescript
{
  id: "new-exercise",
  name: "Exercise Name",
  muscleGroup: "Chest", // or other muscle groups
}
```

### Extending Auth
Modify `src/context/AuthContext.tsx` to add features like password reset or email verification.

### Styling
Reusable theme values are in `src/theme.ts`. Update colors, shadows, and spacing there.

---

## 🚧 Roadmap & Future Features

Potential improvements for future versions:
- Cloud synchronization (Firebase, Supabase)
- Exercise photos and form guides
- Personal records (PRs) tracking
- Workout templates and programs
- Social features (share workouts, follow friends)
- Data export (CSV, PDF)
- Dark mode support

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 💬 Support & Feedback

Have questions or suggestions? Feel free to:
- Open an [issue](https://github.com/ketankarlekar/workout-monitor/issues) for bug reports
- Start a [discussion](https://github.com/ketankarlekar/workout-monitor/discussions) for feature requests
- Contact the maintainer via GitHub

---

**Happy Training! 🏃‍♂️**
