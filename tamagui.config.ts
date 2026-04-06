import { createAnimations } from '@tamagui/animations-react-native';
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

const animations = createAnimations({
  fast: { type: 'spring', damping: 20, stiffness: 250 },
  medium: { type: 'spring', damping: 10, stiffness: 100 },
});

const config = createTamagui({
  ...defaultConfig,
  animations,
});

export type AppTamaguiConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default config;
