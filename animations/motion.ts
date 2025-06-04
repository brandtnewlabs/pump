import {
  WithSpringConfig,
  WithTimingConfig,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { springConfigs, timingConfigs } from './configs';
import { SpringPreset, TimingPreset } from './types';

// Helper Functions
export const getTimingConfig = (preset: TimingPreset): WithTimingConfig => {
  'worklet';
  return timingConfigs[preset] || timingConfigs.default;
};

export const getSpringConfig = (preset: SpringPreset): WithSpringConfig => {
  'worklet';
  return springConfigs[preset] || springConfigs.default;
};

// Animation Creators
export const createTiming = (toValue: number, preset: TimingPreset = 'default') => {
  'worklet';
  return withTiming(toValue, getTimingConfig(preset));
};

export const createSpring = (toValue: number, preset: SpringPreset = 'default') => {
  'worklet';
  return withSpring(toValue, getSpringConfig(preset));
};

// Fade Helpers
export const withTimingDefault = (toValue: number) => {
  'worklet';
  return createTiming(toValue, 'default');
};

export const withTimingQuick = (toValue: number) => {
  'worklet';
  return createTiming(toValue, 'quick');
};

export const withTimingGentle = (toValue: number) => {
  'worklet';
  return createTiming(toValue, 'gentle');
};

export const withTimingInstant = (toValue: number) => {
  'worklet';
  return createTiming(toValue, 'instant');
};

// Spring Presets Helpers
export const withSpringDefault = (toValue: number) => {
  'worklet';
  return createSpring(toValue, 'default');
};

export const withSpringPlayful = (toValue: number) => {
  'worklet';
  return createSpring(toValue, 'playful');
};

export const withSpringPlayfulFast = (toValue: number) => {
  'worklet';
  return createSpring(toValue, 'playfulFast');
};

export const withSpringSnappy = (toValue: number) => {
  'worklet';
  return createSpring(toValue, 'snappy');
};

export const withSpringRigid = (toValue: number) => {
  'worklet';
  return createSpring(toValue, 'rigid');
};
