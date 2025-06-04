import { LinearTransition } from 'react-native-reanimated';

import { springConfigs } from './configs';

// Helper function to create spring transitions
const createLayoutSpring = (config: typeof springConfigs.default) => {
  return LinearTransition.springify()
    .damping(config.damping)
    .stiffness(config.stiffness)
    .mass(config.mass)
    .overshootClamping(config.overshootClamping ? 1 : 0)
    .restDisplacementThreshold(config.restDisplacementThreshold)
    .restSpeedThreshold(config.restSpeedThreshold);
};

export const layoutSpring = createLayoutSpring(springConfigs.default);
export const layoutSpringPlayful = createLayoutSpring(springConfigs.playful);
export const layoutSpringPlayfulFast = createLayoutSpring(springConfigs.playfulFast);
export const layoutSpringSnappy = createLayoutSpring(springConfigs.snappy);
export const layoutSpringRigid = createLayoutSpring(springConfigs.rigid);
