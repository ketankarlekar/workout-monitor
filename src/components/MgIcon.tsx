import React from 'react';
import { Image, ImageStyle } from 'react-native';

const MUSCLE_IMAGES: Record<string, ReturnType<typeof require>> = {
  Chest:        require('../../assets/muscle-icons/chest_icon.png'),
  Back:         require('../../assets/muscle-icons/back_icon.png'),
  Shoulders:    require('../../assets/muscle-icons/shoulders_icon.png'),
  Triceps:      require('../../assets/muscle-icons/triceps_icon.png'),
  Biceps:       require('../../assets/muscle-icons/biceps_icon.png'),
  Forearms:     require('../../assets/muscle-icons/forearms_icon.png'),
  'Rear Delts': require('../../assets/muscle-icons/rear_delts_icon.png'),
  Quads:        require('../../assets/muscle-icons/quads_icon.png'),
  Hamstrings:   require('../../assets/muscle-icons/hamstrings_icon.png'),
  Glutes:       require('../../assets/muscle-icons/glutes_icon.png'),
  Calves:       require('../../assets/muscle-icons/calves_icon.png'),
  Adductors:    require('../../assets/muscle-icons/adductors_icon.png'),
  Core:         require('../../assets/muscle-icons/core_icon.png'),
};

interface Props {
  name: string;
  size?: number;
  style?: ImageStyle;
}

export function MgIcon({ name, size = 24, style }: Props) {
  const img = MUSCLE_IMAGES[name];
  return (
    <Image
      source={img}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      resizeMode="cover"
    />
  );
}
