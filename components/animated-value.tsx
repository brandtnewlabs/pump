import React, { useEffect } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { withTimingInstant } from "@/animations/motion";
import { cn } from "@/lib/cn";

// Add text to whitelisted props for animation
Animated.addWhitelistedNativeProps({ text: true });

// Create animated TextInput component
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// Animation constants
const MAX_TRANSLATE_Y = 10;

// Styles outside component to avoid recreation
const styles = StyleSheet.create({
  characterContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

/**
 * AnimatedCharacter displays a single character with entry/exit animation when the value changes.
 * Uses react-native-reanimated for smooth transitions.
 */
const AnimatedCharacter: React.FC<{
  char: string;
  textClassName?: string;
  index: number;
}> = React.memo(({ char, textClassName, index }) => {
  // Store the previous character to detect changes
  const prevChar = React.useRef<string>(char);
  // Shared values for animation
  const charValue = useSharedValue<string>(char);
  const opacity = useSharedValue<number>(1);
  const translateY = useSharedValue<number>(0);

  useEffect(() => {
    // If the character changes, animate out then in
    if (char !== prevChar.current) {
      // Add slight delay based on index for staggered animation
      const delay = index * 20;

      setTimeout(() => {
        opacity.value = withTimingInstant(0); // Fade out
        translateY.value = withTimingInstant(MAX_TRANSLATE_Y); // Move down

        // After out animation, update value and animate in
        setTimeout(() => {
          charValue.value = char;
          opacity.value = withTimingInstant(1); // Fade in
          translateY.value = withTimingInstant(0); // Move up
        }, 100); // 100ms matches the 'quick' duration
      }, delay);

      prevChar.current = char;
    }
  }, [char, charValue, opacity, translateY, index]);

  // Animated style for fade/slide effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Animated props for TextInput (text value)
  const animatedProps = useAnimatedProps(() => {
    return {
      text: charValue.value,
      defaultValue: charValue.value,
    };
  });

  return (
    <View style={styles.characterContainer}>
      <Animated.View style={animatedStyle}>
        <AnimatedTextInput
          className={textClassName}
          editable={false}
          animatedProps={animatedProps}
          defaultValue={char}
        />
      </Animated.View>
    </View>
  );
});

AnimatedCharacter.displayName = "AnimatedCharacter";

/**
 * Props for the AnimatedValue component
 */
interface AnimatedValueProps {
  /** The value to display and animate */
  value: string;
  /** Optional className for the container */
  containerClassName?: string;
  /** Optional className for the text */
  textClassName?: string;
}

/**
 * AnimatedValue component displays text with smooth animations when the value changes.
 *
 * - Uses reanimated for character transitions with staggered timing
 * - Animates each character individually for smooth effect
 * - Accepts custom styling via className props
 */
export const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  containerClassName,
  textClassName,
}) => {
  // Memoize chars array for performance; splits value into characters
  const chars = React.useMemo<string[]>(() => value.split(""), [value]);

  return (
    <View className={cn("flex flex-row items-center", containerClassName)}>
      {chars.map((char: string, idx: number) => (
        <AnimatedCharacter
          key={`char-${idx}`}
          char={char}
          textClassName={textClassName}
          index={idx}
        />
      ))}
    </View>
  );
};
