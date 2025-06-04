import { Keyframe } from 'react-native-reanimated';

import { springDurations, timingConfigs } from './configs';
import {
  fadeOutAnimation,
  fadeRiseDownAnimation,
  fadeScaleDownAnimation,
  fadeSlideDownAnimation,
  popOutScaleAnimation,
  slideOutToLeftAnimation,
} from './constants';

export const fadeScaleDown = new Keyframe({
  from: fadeScaleDownAnimation.from,
  to: {
    ...fadeScaleDownAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const fadeScaleDownGentle = new Keyframe({
  from: fadeScaleDownAnimation.from,
  to: {
    ...fadeScaleDownAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const fadeScaleDownQuick = new Keyframe({
  from: fadeScaleDownAnimation.from,
  to: {
    ...fadeScaleDownAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const fadeScaleDownInstant = new Keyframe({
  from: fadeScaleDownAnimation.from,
  to: {
    ...fadeScaleDownAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const fadeSlideDown = new Keyframe({
  from: fadeSlideDownAnimation.from,
  to: {
    ...fadeSlideDownAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const fadeSlideDownGentle = new Keyframe({
  from: fadeSlideDownAnimation.from,
  to: {
    ...fadeSlideDownAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const fadeSlideDownQuick = new Keyframe({
  from: fadeSlideDownAnimation.from,
  to: {
    ...fadeSlideDownAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const fadeSlideDownInstant = new Keyframe({
  from: fadeSlideDownAnimation.from,
  to: {
    ...fadeSlideDownAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const fadeRiseDown = new Keyframe({
  from: fadeRiseDownAnimation.from,
  to: {
    ...fadeRiseDownAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const fadeRiseDownGentle = new Keyframe({
  from: fadeRiseDownAnimation.from,
  to: {
    ...fadeRiseDownAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const fadeRiseDownQuick = new Keyframe({
  from: fadeRiseDownAnimation.from,
  to: {
    ...fadeRiseDownAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const fadeRiseDownInstant = new Keyframe({
  from: fadeRiseDownAnimation.from,
  to: {
    ...fadeRiseDownAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const slideOutToLeft = new Keyframe({
  from: slideOutToLeftAnimation.from,
  to: {
    ...slideOutToLeftAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const slideOutToLeftGentle = new Keyframe({
  from: slideOutToLeftAnimation.from,
  to: {
    ...slideOutToLeftAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const slideOutToLeftQuick = new Keyframe({
  from: slideOutToLeftAnimation.from,
  to: {
    ...slideOutToLeftAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const slideOutToLeftInstant = new Keyframe({
  from: slideOutToLeftAnimation.from,
  to: {
    ...slideOutToLeftAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const fadeOut = new Keyframe({
  from: fadeOutAnimation.from,
  to: {
    ...fadeOutAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const fadeOutQuick = new Keyframe({
  from: fadeOutAnimation.from,
  to: {
    ...fadeOutAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const fadeOutGentle = new Keyframe({
  from: fadeOutAnimation.from,
  to: {
    ...fadeOutAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const fadeOutInstant = new Keyframe({
  from: fadeOutAnimation.from,
  to: {
    ...fadeOutAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const popOutScale = new Keyframe({
  0: popOutScaleAnimation[0],
  100: popOutScaleAnimation[100],
}).duration(springDurations.default);

export const popOutScalePlayful = new Keyframe({
  0: popOutScaleAnimation[0],
  100: popOutScaleAnimation[100],
}).duration(springDurations.playful);

export const popOutScalePlayfulFast = new Keyframe({
  0: popOutScaleAnimation[0],
  100: popOutScaleAnimation[100],
}).duration(springDurations.playfulFast);

export const popOutScaleSnappy = new Keyframe({
  0: popOutScaleAnimation[0],
  100: popOutScaleAnimation[100],
}).duration(springDurations.snappy);

export const popOutScaleRigid = new Keyframe({
  0: popOutScaleAnimation[0],
  100: popOutScaleAnimation[100],
}).duration(springDurations.rigid);
