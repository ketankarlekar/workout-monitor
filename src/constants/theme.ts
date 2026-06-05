export const Colors = {
  accent: '#22c55e',
  accentDim: '#16a34a',
  push: '#f97316',
  pull: '#3b82f6',
  legs: '#a855f7',
  saturday: '#eab308',
  bg: '#0f0f11',
  surface: '#18181b',
  surface2: '#212126',
  surface3: '#2c2c33',
  border: '#2e2e38',
  border2: '#3f3f4a',
  text: '#f4f4f5',
  text2: '#a1a1aa',
  text3: '#71717a',
  danger: '#ef4444',
};

export const LightColors = {
  ...Colors,
  bg: '#f8fafc',
  surface: '#ffffff',
  surface2: '#f1f5f9',
  surface3: '#e2e8f0',
  border: '#e2e8f0',
  border2: '#cbd5e1',
  text: '#0f172a',
  text2: '#475569',
  text3: '#94a3b8',
};

export const R = { sm: 8, md: 14, lg: 20, xl: 28 };

export type ColorScheme = typeof Colors;
