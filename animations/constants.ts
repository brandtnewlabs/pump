import { Easing } from 'react-native-reanimated';

const springEasing = Easing.out(Easing.exp); // Spring feel

// Entering Animations

export const fadeScaleUpAnimation = {
  from: {
    opacity: 0,
    transform: [{ scale: 0.95 }],
  },
  to: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
};

export const fadeSlideUpAnimation = {
  from: {
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
  to: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
};

export const fadeSlideDownFromTopAnimation = {
  from: {
    opacity: 0,
    transform: [{ translateY: -20 }],
  },
  to: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
};

export const fadeRiseUpAnimation = {
  from: {
    opacity: 0,
    transform: [{ translateY: 12 }],
  },
  to: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
};

export const slideInFromLeftAnimation = {
  from: {
    opacity: 0,
    transform: [{ translateX: -20 }],
  },
  to: {
    opacity: 1,
    transform: [{ translateX: 0 }],
  },
};

export const slideInFromRightAnimation = {
  from: {
    opacity: 0,
    transform: [{ translateX: 20 }],
  },
  to: {
    opacity: 1,
    transform: [{ translateX: 0 }],
  },
};

export const fadeInAnimation = {
  from: { opacity: 0 },
  to: { opacity: 1 },
};

export const popInScaleAnimation = {
  0: {
    opacity: 0,
    transform: [{ scale: 0.7 }],
  },
  60: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
    easing: springEasing,
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: springEasing,
  },
};

// Exiting Animations

export const fadeScaleDownAnimation = {
  from: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  to: {
    opacity: 0,
    transform: [{ scale: 0.95 }],
  },
};

export const fadeSlideDownAnimation = {
  from: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  to: {
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
};

export const fadeRiseDownAnimation = {
  from: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  to: {
    opacity: 0,
    transform: [{ translateY: 12 }],
  },
};

export const slideOutToLeftAnimation = {
  from: {
    opacity: 1,
    transform: [{ translateX: 0 }],
  },
  to: {
    opacity: 0,
    transform: [{ translateX: -20 }],
  },
};

export const slideOutToRightAnimation = {
  from: {
    opacity: 1,
    transform: [{ translateX: 0 }],
  },
};

export const fadeOutAnimation = {
  from: { opacity: 1 },
  to: {
    opacity: 0,
  },
};

export const popOutScaleAnimation = {
  0: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  100: {
    opacity: 0,
    transform: [{ scale: 0.7 }],
    easing: springEasing,
  },
};
