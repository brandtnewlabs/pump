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

// =============================================
// Types & Constants
// =============================================

type SpringPreset = keyof typeof configs.springConfigs;
type PressableEvent = GestureResponderEvent;
type PressHandler = (event: PressableEvent) => void;

/** Default scale value when component is at rest */
const SCALE_DEFAULT = 1;
/** Scale value when component is pressed (slightly smaller for feedback) */
const SCALE_TO = 0.95;

// Create the animated component once to avoid recreation on every render
const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

// =============================================
// Component Interface
// =============================================

/**
 * Props for the AnimatedPressable component.
 * Extends React Native's PressableProps with animation and haptic feedback options.
 */
interface AnimatedPressableProps
  extends Omit<
    AnimatedProps<PressableProps>,
    "onPress" | "onPressIn" | "onPressOut"
  > {
  /** Predefined spring animation preset from configs */
  springPreset?: SpringPreset;
  /** Custom spring configuration (overrides springPreset if provided) */
  springConfig?: WithSpringConfig;
  /** Target scale value when pressed (default: 0.95) */
  scaleTo?: number;
  /** Handler called when press begins */
  onPressIn?: PressHandler;
  /** Handler called when press ends */
  onPressOut?: PressHandler;
  /** Whether to trigger haptic feedback on press */
  haptic?: boolean;
  /** Style of haptic feedback (light, medium, heavy) */
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  /** Handler called when press is completed */
  onPress?: PressHandler;
}

// =============================================
// Main Component
// =============================================

/**
 * AnimatedPressable - A pressable component with smooth scale animation and haptic feedback
 *
 * Features:
 * - Smooth spring-based scale animation on press
 * - Configurable animation presets and custom spring configs
 * - Optional haptic feedback with customizable intensity
 * - Performance optimized with proper memoization
 * - Forwards ref to underlying Pressable component
 *
 * @example
 * ```tsx
 * <AnimatedPressable
 *   onPress={() => console.log('Pressed!')}
 *   haptic={true}
 *   springPreset="bouncy"
 * >
 *   <Text>Press me!</Text>
 * </AnimatedPressable>
 * ```
 */
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
  ref,
) {
  // =============================================
  // Animation State & Hooks
  // =============================================

  /** Shared value for scale animation - starts at default scale */
  const scale = useSharedValue(SCALE_DEFAULT);

  /** Haptic feedback utilities */
  const { impact } = useHaptics();

  // =============================================
  // Memoized Values
  // =============================================

  /**
   * Resolve the spring configuration to use for animations.
   * Priority: custom springConfig > preset from configs
   * Memoized to prevent unnecessary recalculations.
   */
  const resolvedSpringConfig = useMemo(
    () => springConfig ?? configs.springConfigs[springPreset],
    [springConfig, springPreset],
  );

  /**
   * Animated style that applies the scale transformation.
   * Only re-runs when scale.value changes.
   */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // =============================================
  // Event Handlers
  // =============================================

  /**
   * Handle press start - animate scale down to provide visual feedback
   */
  const handlePressIn = useCallback(
    (event: PressableEvent) => {
      // Animate to the target scale with spring physics
      scale.value = withSpring(scaleTo, resolvedSpringConfig);

      // Call parent handler if provided
      onPressIn?.(event);
    },
    [scaleTo, resolvedSpringConfig, onPressIn, scale],
  );

  /**
   * Handle press end - animate scale back to default
   */
  const handlePressOut = useCallback(
    (event: PressableEvent) => {
      // Animate back to default scale
      scale.value = withSpring(SCALE_DEFAULT, resolvedSpringConfig);

      // Call parent handler if provided
      onPressOut?.(event);
    },
    [resolvedSpringConfig, onPressOut, scale],
  );

  /**
   * Handle press completion - trigger haptic feedback and call onPress
   */
  const handlePress = useCallback(
    (event: PressableEvent) => {
      // Trigger haptic feedback if enabled
      if (haptic) {
        impact(hapticStyle);
      }

      // Call parent press handler
      onPress?.(event);
    },
    [haptic, hapticStyle, impact, onPress],
  );

  // =============================================
  // Render
  // =============================================

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
