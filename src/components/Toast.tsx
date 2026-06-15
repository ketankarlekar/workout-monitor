import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { R } from '../constants/theme';

export interface ToastRef {
  show: (msg: string) => void;
}

export const Toast = forwardRef<ToastRef, object>((_, ref) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [msg, setMsg] = React.useState('');

  useImperativeHandle(ref, () => ({
    show(message: string) {
      setMsg(message);
      if (timer.current) clearTimeout(timer.current);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
      timer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 20, duration: 200, useNativeDriver: true }),
        ]).start();
      }, 2200);
    },
  }));

  return (
    <Animated.View style={[styles.toast, { backgroundColor: colors.surface, borderColor: colors.border, opacity, transform: [{ translateY }] }]}>
      <Text style={[styles.text, { color: colors.text }]}>{msg}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  toast: {
    position: 'absolute', bottom: 80, alignSelf: 'center',
    paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: R.md, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 8, zIndex: 500,
  },
  text: { fontSize: 14, fontWeight: '600' },
});
