import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, label, focused, color }: { emoji: string; label: string; focused: boolean; color: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 3 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, fontWeight: '500', color }}>{label}</Text>
    </View>
  );
}

const PushScreen = () => <WorkoutScreen workoutType="push" />;
const PullScreen = () => <WorkoutScreen workoutType="pull" />;
const LegsScreen = () => <WorkoutScreen workoutType="legs" />;
const SaturdayScreen = () => <WorkoutScreen workoutType="saturday" />;

function MainTabs() {
  const { colors } = useTheme();
  const c = colors;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🏠" label="Home" focused={focused} color={color} />,
          tabBarActiveTintColor: c.accent,
          tabBarInactiveTintColor: c.text3,
        }}
      />
      <Tab.Screen
        name="Push"
        component={PushScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🔥" label="Push" focused={focused} color={color} />,
          tabBarActiveTintColor: '#f97316',
          tabBarInactiveTintColor: c.text3,
        }}
      />
      <Tab.Screen
        name="Pull"
        component={PullScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="💧" label="Pull" focused={focused} color={color} />,
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: c.text3,
        }}
      />
      <Tab.Screen
        name="Legs"
        component={LegsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🦵" label="Legs" focused={focused} color={color} />,
          tabBarActiveTintColor: '#a855f7',
          tabBarInactiveTintColor: c.text3,
        }}
      />
      <Tab.Screen
        name="Saturday"
        component={SaturdayScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="⭐" label="Sat" focused={focused} color={color} />,
          tabBarActiveTintColor: '#eab308',
          tabBarInactiveTintColor: c.text3,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="📊" label="History" focused={focused} color={color} />,
          tabBarActiveTintColor: c.accent,
          tabBarInactiveTintColor: c.text3,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors } = useTheme();
  const c = colors;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
