import React, { useCallback, useLayoutEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { motion } from "@/animations";
import { cn } from "@/lib/cn";

/**
 * Available spring animation presets for the progress bar animation
 * - default: Standard spring animation
 * - playful: Bouncy, fun animation
 * - playfulFast: Quick bouncy animation
 * - snappy: Sharp, responsive animation
 * - rigid: Minimal bounce, direct animation
 */
type SpringPreset = "default" | "playful" | "playfulFast" | "snappy" | "rigid";

interface ProgressBarProps {
  /** Progress value between 0 and 1 (0% to 100%) */
  progress: number;
  /** Height of the progress bar in pixels */
  height?: number;
  /** Additional CSS classes for styling customization */
  className?: string;
  /** Animation spring preset to control the feel of progress transitions */
  springPreset?: SpringPreset;
}

/**
 * ProgressBar - An animated progress indicator component
 *
 * Features:
 * - Smooth spring animations using react-native-reanimated
 * - Customizable spring presets for different animation feels
 * - Dynamic width calculation based on container size
 * - Automatic progress value clamping (0-1)
 * - NativeWind styling support
 *
 * @example
 * ```tsx
 * <ProgressBar
 *   progress={0.65}
 *   height={8}
 *   springPreset="playful"
 *   className="mx-4"
 * />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = React.memo(
  ({ progress, height = 4, className = "", springPreset = "playfulFast" }) => {
    // State to track the container's measured width for accurate progress calculation
    const [containerWidth, setContainerWidth] = useState(0);

    // Shared value for smooth width animations on the UI thread
    // Initialize with 0 to avoid reading during render
    const progressWidth = useSharedValue(0);

    /**
     * Handles layout changes to capture the container's dynamic width
     * This is essential for responsive progress bars that adapt to their container
     */
    const handleLayout = useCallback((event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setContainerWidth(width);
    }, []);

    /**
     * Updates the progress animation whenever progress value or container dimensions change
     * Uses useLayoutEffect to ensure animations are synchronized with layout updates
     */
    useLayoutEffect(() => {
      // Only animate when we have a valid container width
      if (containerWidth > 0) {
        // Clamp progress between 0 and 1 to prevent invalid values
        const clampedProgress = Math.max(0, Math.min(1, progress));

        // Calculate target width based on progress percentage and container width
        const targetWidth = clampedProgress * containerWidth;

        // Animate to target width using the specified spring preset
        progressWidth.value = motion.createSpring(targetWidth, springPreset);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress, containerWidth, springPreset]);

    /**
     * Animated style that interpolates the width value on the UI thread
     * This ensures smooth 60fps animations without blocking the JS thread
     * Note: We don't include progressWidth in dependencies to avoid accessing .value during render
     */
    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: progressWidth.value,
      };
    });

    return (
      // Container view that establishes the full width and background
      <Animated.View
        onLayout={handleLayout}
        className={cn(
          // Base styles: secondary background, rounded corners, clip content
          "overflow-hidden rounded-full bg-background-secondary",
          className,
        )}
        style={{ height }}
      >
        {/* Progress fill view that animates its width based on progress value */}
        <Animated.View
          className="h-full rounded-full bg-background-brand"
          style={animatedStyle}
        />
      </Animated.View>
    );
  },
);

// Set display name for better debugging experience
ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
