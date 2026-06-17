# Development Guide

## Local Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (Mac only)
- For Android: Android Studio or Android SDK

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/workout-monitor.git
cd workout-monitor

# Install dependencies
npm install

# Start development server
npm start
```

## Development Commands

### Running the App

```bash
# Expo development server
npm start

# iOS simulator (macOS only)
npm run ios

# Android emulator
npm run android

# Web browser
npm run web
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## Project Structure Details

### src/context/
Global state providers. Each context typically exports:
- **Provider** — Wrapper component
- **useContext hook** — Hook to access context values

### src/screens/
Full-page components. Typically include:
- Navigation handling
- Context consumption
- Complex layout logic

### src/components/
Reusable UI components. Should be:
- Small and focused
- Well-typed with Props interface
- Documented with JSDoc comments

### src/utils/
Pure functions and helpers:
- No side effects
- Fully testable
- Reusable across components

## Debugging

### Console Logging
```typescript
import { LogBox } from 'react-native';

// Suppress specific warnings
LogBox.ignoreLogs(['Warning: ...']);

// View logs
console.log('message');
console.error('error');
console.warn('warning');
```

### React DevTools
Install React DevTools browser extension for web debugging.

### Expo DevTools
Press `d` in Expo CLI terminal to open DevTools.

## Adding a New Feature

1. **Plan** — Define the feature requirements
2. **Create context** — Add state management if needed
3. **Create screens/components** — Build UI components
4. **Add styles** — Use theme tokens
5. **Test** — Write and run tests
6. **Document** — Update README and docs

## Common Tasks

### Adding a New Screen
1. Create component in `src/screens/YourScreen.tsx`
2. Add to navigation in `src/navigation/AppNavigator.tsx`
3. Create route params type if needed

### Adding Global State
1. Create context in `src/context/YourContext.tsx`
2. Export provider and hook
3. Wrap app with provider in `App.tsx`

### Adding a New Utility Function
1. Add to `src/utils.ts` or create new file
2. Export function
3. Add TypeScript types
4. Write tests

### Styling Components
1. Use colors from `src/theme.ts`
2. Use StyleSheet for performance
3. Support different screen sizes
4. Test on multiple devices

## Performance Tips

- Use `React.memo` for pure components
- Optimize re-renders with `useMemo` and `useCallback`
- Lazy load screens with React Navigation
- Keep component trees shallow
- Avoid inline function definitions in JSX

## Version Control

### Branch Naming
- `feature/description` — New features
- `fix/description` — Bug fixes
- `docs/description` — Documentation
- `refactor/description` — Code refactoring

### Commit Messages
```
type(scope): description

feat(auth): add password reset
fix(workout): correct timer calculation
docs(readme): add setup instructions
```

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Getting Help

- Check existing issues and discussions
- Review similar code patterns in the project
- Ask in GitHub discussions
- Check framework documentation

---

Happy coding! 🚀
