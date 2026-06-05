import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { WorkoutProvider } from './src/context/WorkoutContext';
import AppNavigator from './src/navigation/AppNavigator';

function Inner() {
  const { colors } = useTheme();
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <WorkoutProvider>
          <Inner />
        </WorkoutProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
