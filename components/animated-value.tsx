import React, { useCallback, useEffect, useRef } from "react";
import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { motion } from "@/animations";
import { cn } from "@/lib/cn";

// Animation configuration constants - centralized for easy maintenance
const ANIMATION_CONFIG = {
  // Intermediate opacity during transition (creates a subtle flash effect)
  FADE_OPACITY: 0.7,
  // Intermediate scale during transition (creates a subtle shrink effect)
  SCALE_VALUE: 0.95,
} as const;

interface AnimatedValueProps {
  /** The value to display and animate. When this changes, the component triggers animation */
  value: string;
  /** Optional Tailwind className for the container wrapper */
  containerClassName?: string;
  /** Optional Tailwind className for the text element */
  textClassName?: string;
}

/**
 * AnimatedValue Component
 *
 * A performant component that displays a value with smooth fade and scale animations
 * when the value changes. Uses react-native-reanimated for 60fps animations.
 *
 * Animation behavior:
 * - When value changes: fades to 70% opacity and scales to 95%
 * - Then returns to full opacity and normal scale
 * - Uses the app's centralized animation system for consistent timing
 *
 * Performance optimizations:
 * - Wrapped in React.memo to prevent unnecessary re-renders
 * - Uses useRef to track previous value without causing re-renders
 * - Uses react-native-reanimated for native thread animations
 * - Animation callbacks are memoized with useCallback
 */
export const AnimatedValue = React.memo<AnimatedValueProps>(
  ({ value, containerClassName, textClassName }) => {
    // Shared values for native thread animations (better performance than Animated API)
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    // Track previous value to detect changes without causing re-renders
    const prevValue = useRef(value);

    // Memoized animation sequence to prevent recreation on every render
    const triggerAnimation = useCallback(() => {
      // First phase: fade out and scale down using centralized animation system
      opacity.value = motion.withTimingQuick(ANIMATION_CONFIG.FADE_OPACITY);
      scale.value = motion.withTimingQuick(ANIMATION_CONFIG.SCALE_VALUE);

      // Second phase: fade in and scale back up after a brief delay
      setTimeout(() => {
        opacity.value = motion.withTimingQuick(1);
        scale.value = motion.withTimingQuick(1);
      }, 150); // Brief delay to create the flash effect
    }, [opacity, scale]);

    // Effect to detect value changes and trigger animations
    useEffect(() => {
      // Only animate if the value has actually changed
      if (value !== prevValue.current) {
        triggerAnimation();
        // Update ref to new value for next comparison
        prevValue.current = value;
      }
    }, [value, triggerAnimation]);

    // Memoized animated style to prevent unnecessary style recalculations
    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      };
    }, [opacity.value, scale.value]);

    return (
      <Animated.View
        style={animatedStyle}
        className={cn("flex flex-row items-center", containerClassName)}
      >
        <Text className={textClassName}>{value}</Text>
      </Animated.View>
    );
  },
);

// Display name for React DevTools debugging
AnimatedValue.displayName = "AnimatedValue";
