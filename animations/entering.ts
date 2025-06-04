import { Keyframe } from 'react-native-reanimated';

import { springDurations, timingConfigs } from './configs';
import {
  fadeInAnimation,
  fadeRiseUpAnimation,
  fadeScaleUpAnimation,
  fadeSlideDownFromTopAnimation,
  fadeSlideUpAnimation,
  popInScaleAnimation,
  slideInFromLeftAnimation,
  slideInFromRightAnimation,
} from './constants';

export const fadeScaleUp = new Keyframe({
  from: fadeScaleUpAnimation.from,
  to: {
    ...fadeScaleUpAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const fadeScaleUpGentle = new Keyframe({
  from: fadeScaleUpAnimation.from,
  to: {
    ...fadeScaleUpAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const fadeScaleUpQuick = new Keyframe({
  from: fadeScaleUpAnimation.from,
  to: {
    ...fadeScaleUpAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const fadeScaleUpInstant = new Keyframe({
  from: fadeScaleUpAnimation.from,
  to: {
    ...fadeScaleUpAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const fadeSlideUp = new Keyframe({
  from: fadeSlideUpAnimation.from,
  to: {
    ...fadeSlideUpAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const fadeSlideUpGentle = new Keyframe({
  from: fadeSlideUpAnimation.from,
  to: {
    ...fadeSlideUpAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const fadeSlideUpQuick = new Keyframe({
  from: fadeSlideUpAnimation.from,
  to: {
    ...fadeSlideUpAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const fadeSlideUpInstant = new Keyframe({
  from: fadeSlideUpAnimation.from,
  to: {
    ...fadeSlideUpAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const fadeSlideDownFromTop = new Keyframe({
  from: fadeSlideDownFromTopAnimation.from,
  to: {
    ...fadeSlideDownFromTopAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const fadeSlideDownFromTopGentle = new Keyframe({
  from: fadeSlideDownFromTopAnimation.from,
  to: {
    ...fadeSlideDownFromTopAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const fadeSlideDownFromTopQuick = new Keyframe({
  from: fadeSlideDownFromTopAnimation.from,
  to: {
    ...fadeSlideDownFromTopAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const fadeSlideDownFromTopInstant = new Keyframe({
  from: fadeSlideDownFromTopAnimation.from,
  to: {
    ...fadeSlideDownFromTopAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const fadeRiseUp = new Keyframe({
  from: fadeRiseUpAnimation.from,
  to: {
    ...fadeRiseUpAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const fadeRiseUpGentle = new Keyframe({
  from: fadeRiseUpAnimation.from,
  to: {
    ...fadeRiseUpAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const fadeRiseUpQuick = new Keyframe({
  from: fadeRiseUpAnimation.from,
  to: {
    ...fadeRiseUpAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const fadeRiseUpInstant = new Keyframe({
  from: fadeRiseUpAnimation.from,
  to: {
    ...fadeRiseUpAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const slideInFromLeft = new Keyframe({
  from: slideInFromLeftAnimation.from,
  to: {
    ...slideInFromLeftAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const slideInFromLeftGentle = new Keyframe({
  from: slideInFromLeftAnimation.from,
  to: {
    ...slideInFromLeftAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const slideInFromLeftQuick = new Keyframe({
  from: slideInFromLeftAnimation.from,
  to: {
    ...slideInFromLeftAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const slideInFromLeftInstant = new Keyframe({
  from: slideInFromLeftAnimation.from,
  to: {
    ...slideInFromLeftAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const slideInFromRight = new Keyframe({
  from: slideInFromRightAnimation.from,
  to: {
    ...slideInFromRightAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const slideInFromRightGentle = new Keyframe({
  from: slideInFromRightAnimation.from,
  to: {
    ...slideInFromRightAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const slideInFromRightQuick = new Keyframe({
  from: slideInFromRightAnimation.from,
  to: {
    ...slideInFromRightAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const slideInFromRightInstant = new Keyframe({
  from: slideInFromRightAnimation.from,
  to: {
    ...slideInFromRightAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const fadeIn = new Keyframe({
  from: fadeInAnimation.from,
  to: {
    ...fadeInAnimation.to,
    easing: timingConfigs.default.easing,
  },
}).duration(timingConfigs.default.duration);

export const fadeInQuick = new Keyframe({
  from: fadeInAnimation.from,
  to: {
    ...fadeInAnimation.to,
    easing: timingConfigs.quick.easing,
  },
}).duration(timingConfigs.quick.duration);

export const fadeInGentle = new Keyframe({
  from: fadeInAnimation.from,
  to: {
    ...fadeInAnimation.to,
    easing: timingConfigs.gentle.easing,
  },
}).duration(timingConfigs.gentle.duration);

export const fadeInInstant = new Keyframe({
  from: fadeInAnimation.from,
  to: {
    ...fadeInAnimation.to,
    easing: timingConfigs.instant.easing,
  },
}).duration(timingConfigs.instant.duration);

export const popInScale = new Keyframe({
  0: popInScaleAnimation[0],
  60: popInScaleAnimation[60],
  100: popInScaleAnimation[100],
}).duration(springDurations.default);

export const popInScalePlayful = new Keyframe({
  0: popInScaleAnimation[0],
  60: popInScaleAnimation[60],
  100: popInScaleAnimation[100],
}).duration(springDurations.playful);

export const popInScalePlayfulFast = new Keyframe({
  0: popInScaleAnimation[0],
  60: popInScaleAnimation[60],
  100: popInScaleAnimation[100],
}).duration(springDurations.playfulFast);

export const popInScaleSnappy = new Keyframe({
  0: popInScaleAnimation[0],
  60: popInScaleAnimation[60],
  100: popInScaleAnimation[100],
}).duration(springDurations.snappy);

export const popInScaleRigid = new Keyframe({
  0: popInScaleAnimation[0],
  60: popInScaleAnimation[60],
  100: popInScaleAnimation[100],
}).duration(springDurations.rigid);
