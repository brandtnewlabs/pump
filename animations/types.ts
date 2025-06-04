import { EasingFunction } from 'react-native-reanimated';

export interface TimingBaseConfig {
  easing: EasingFunction;
}

export interface TimingConfig extends TimingBaseConfig {
  duration: number;
}

export interface SpringBaseConfig {
  mass: number;
  restDisplacementThreshold: number;
  restSpeedThreshold: number;
}

export interface SpringConfig extends SpringBaseConfig {
  damping: number;
  stiffness: number;
  overshootClamping: boolean;
}

export type TimingPreset = 'gentle' | 'default' | 'quick' | 'instant';

export type SpringPreset = 'default' | 'playful' | 'playfulFast' | 'snappy' | 'rigid';
