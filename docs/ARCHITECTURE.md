# Architecture Overview

## Project Structure

```
src/
├── context/              # Global state management (Auth, Theme, Workout)
├── navigation/           # Navigation configuration and routing
├── screens/              # Screen components (pages)
├── components/           # Reusable UI components
├── utils/                # Utility functions and helpers
├── types.ts              # TypeScript type definitions
├── exercises.ts          # Exercise library data
├── storage.ts            # AsyncStorage utilities
└── theme.ts              # Design tokens and theme
```

## Core Patterns

### State Management with Context API
We use React Context for global state:
- **AuthContext** — User authentication and session
- **ThemeContext** — App theme and colors
- **WorkoutContext** — Workout data and operations

### Storage Layer
AsyncStorage is used for persistent local storage:
- User credentials (hashed)
- Workout history
- User preferences

### Navigation
React Navigation with two main stacks:
- **Auth Stack** — Login/Register screens
- **App Stack** — Main app with bottom tab navigation

## Data Flow

```
User Input
    ↓
Screen Component
    ↓
Context (State Management)
    ↓
Storage Layer (AsyncStorage)
    ↓
Persistent Local Data
```

## Component Hierarchy

```
App
├── SafeAreaProvider
├── ThemeProvider
├── AuthProvider
└── Inner
    ├── AuthScreen (if not authenticated)
    └── WorkoutProvider
        └── NavigationContainer
            └── AppNavigator
                ├── HomeScreen
                ├── LogWorkoutScreen
                ├── HistoryScreen
                └── ProfileScreen
```

## File Organization

### Screens
Each screen is a full-page component with its own logic.

### Components
Reusable UI components that can be used across multiple screens.

### Context
Global state providers and hooks for accessing state.

### Utils
Pure functions for formatting, calculations, and helpers.

## Key Technologies

- **React Native** — Cross-platform mobile development
- **Expo** — Simplified React Native development
- **TypeScript** — Type-safe JavaScript
- **React Navigation** — Navigation and routing
- **AsyncStorage** — Local data persistence

## Future Architecture Improvements

- Add testing framework (Vitest)
- Implement error boundary components
- Add analytics layer
- Create custom hooks for common patterns
- Separate business logic from UI components
- Add state management alternatives (Redux, Zustand)
