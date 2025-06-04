import { Easing } from 'react-native-reanimated';

import {
  SpringBaseConfig,
  SpringConfig,
  SpringPreset,
  TimingBaseConfig,
  TimingConfig,
  TimingPreset,
} from './types';

// Base timing configuration
const timingBaseConfig: TimingBaseConfig = {
  easing: Easing.inOut(Easing.ease),
};

// Base spring configuration
const springBaseConfig: SpringBaseConfig = {
  mass: 1,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// Preset configurations for timing
export const timingConfigs: Record<TimingPreset, TimingConfig> = {
  gentle: {
    ...timingBaseConfig,
    duration: 300,
  },
  default: {
    ...timingBaseConfig,
    duration: 200,
  },
  quick: {
    ...timingBaseConfig,
    duration: 150,
  },
  instant: {
    ...timingBaseConfig,
    duration: 100,
  },
};

// Preset configurations for spring
export const springConfigs: Record<SpringPreset, SpringConfig> = {
  playful: {
    ...springBaseConfig,
    stiffness: 280,
    damping: 20,
    overshootClamping: false,
  },
  playfulFast: {
    ...springBaseConfig,
    stiffness: 480,
    damping: 30,
    overshootClamping: false,
  },
  default: {
    ...springBaseConfig,
    stiffness: 420,
    damping: 35,
    overshootClamping: false,
  },
  snappy: {
    ...springBaseConfig,
    stiffness: 650,
    damping: 45,
    overshootClamping: true,
  },
  rigid: {
    ...springBaseConfig,
    stiffness: 1000,
    damping: 70,
    overshootClamping: true,
  },
};

// Spring durations for each preset
export const springDurations: Record<SpringPreset, number> = {
  playfulFast: 150,
  playful: 300,
  default: 240,
  snappy: 180,
  rigid: 140,
};
