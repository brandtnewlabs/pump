import React, { useLayoutEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { motion } from "@/animations";
import { cn } from "@/lib/cn";

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  className?: string;
  springPreset?: "default" | "playful" | "playfulFast" | "snappy" | "rigid";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  className = "",
  springPreset = "playful",
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const progressWidth = useSharedValue(0);

  // Handle layout changes to get dynamic width
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  // Update progress animation when progress or container width changes
  useLayoutEffect(() => {
    if (containerWidth > 0) {
      const targetWidth = Math.max(0, Math.min(1, progress)) * containerWidth;
      progressWidth.value = motion.createSpring(targetWidth, springPreset);
    }
  }, [progress, containerWidth, springPreset, progressWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: progressWidth.value,
    };
  });

  return (
    <Animated.View
      onLayout={handleLayout}
      className={cn(
        "bg-background-secondary rounded-full overflow-hidden",
        className
      )}
      style={{ height }}
    >
      <Animated.View
        className="bg-background-brand rounded-full h-full"
        style={animatedStyle}
      />
    </Animated.View>
  );
};

export default ProgressBar;
