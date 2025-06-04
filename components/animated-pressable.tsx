import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import { GestureResponderEvent, Pressable, PressableProps } from "react-native";
import Animated, {
  AnimatedProps,
  WithSpringConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { configs } from "@/animations";
import { useHaptics } from "@/hooks/useHaptics";

type SpringPreset = keyof typeof configs.springConfigs;
type PressableEvent = GestureResponderEvent;
type PressHandler = (event: PressableEvent) => void;

const SCALE_DEFAULT = 1;
const SCALE_TO = 0.95;

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps
  extends Omit<
    AnimatedProps<PressableProps>,
    "onPress" | "onPressIn" | "onPressOut"
  > {
  springPreset?: SpringPreset;
  springConfig?: WithSpringConfig;
  scaleTo?: number;
  onPressIn?: PressHandler;
  onPressOut?: PressHandler;
  haptic?: boolean;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  onPress?: PressHandler;
}

export default React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  AnimatedPressableProps
>(function AnimatedPressable(
  {
    children,
    springPreset = "snappy",
    springConfig,
    scaleTo = SCALE_TO,
    onPressIn,
    onPressOut,
    haptic = false,
    hapticStyle = Haptics.ImpactFeedbackStyle.Light,
    onPress,
    ...props
  }: AnimatedPressableProps,
  ref
) {
  const scale = useSharedValue(SCALE_DEFAULT);
  const { impact } = useHaptics();

  const resolvedSpringConfig = useMemo(
    () => springConfig ?? configs.springConfigs[springPreset],
    [springConfig, springPreset]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (event: PressableEvent) => {
      scale.value = withSpring(scaleTo, resolvedSpringConfig);
      onPressIn?.(event);
    },
    [scaleTo, resolvedSpringConfig, onPressIn, scale]
  );

  const handlePressOut = useCallback(
    (event: PressableEvent) => {
      scale.value = withSpring(SCALE_DEFAULT, resolvedSpringConfig);
      onPressOut?.(event);
    },
    [resolvedSpringConfig, onPressOut, scale]
  );

  const handlePress = useCallback(
    (event: PressableEvent) => {
      if (haptic) {
        impact(hapticStyle);
      }
      onPress?.(event);
    },
    [haptic, hapticStyle, impact, onPress]
  );

  return (
    <AnimatedPressableComponent
      ref={ref}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={animatedStyle}
      {...props}
    >
      {children}
    </AnimatedPressableComponent>
  );
});
