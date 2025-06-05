import React, { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";

import { motion } from "@/animations";
import { Scales, SeriesColorItem, SeriesData } from "@/types/graph";
import { Group, Mask, Path, Rect } from "@shopify/react-native-skia";

type StrokePathProps = {
  seriesId: string;
  data: SeriesData;
  width: number;
  scales: Scales;
  strokeWidth: number;
  negativeGraphColor: string;
  seriesColors: SeriesColorItem[];
  animated?: boolean;
  animationDuration?: number;
};

/**
 * StrokePath Component
 *
 * Renders the stroke paths for both positive and negative values in a line chart.
 * Uses masking to separate positive and negative sections of the path.
 * Supports smooth drawing animations.
 */
export const StrokePath = ({
  seriesId,
  data,
  width,
  scales,
  strokeWidth,
  negativeGraphColor,
  seriesColors,
  animated = true,
  animationDuration = 1000,
}: StrokePathProps) => {
  // Shared value for animation progress (0 to 1)
  const animationProgress = useSharedValue(0);

  // Reset and start animation when data changes
  useEffect(() => {
    if (animated && data.curvePath) {
      animationProgress.value = 0;
      // Use centralized animation system
      animationProgress.value = motion.withTimingGentle(1);
    } else {
      animationProgress.value = 1;
    }
  }, [data.curvePath, animated, animationDuration, animationProgress]);

  return (
    <Group key={seriesId}>
      {/* Base path (negative color) */}
      {data.min < 0 && (
        <Path
          style="stroke"
          strokeJoin="round"
          strokeCap="round"
          strokeWidth={strokeWidth}
          color={negativeGraphColor}
          path={data.curvePath ?? ""}
          start={0}
          end={animated ? animationProgress : 1}
        />
      )}
      {/* Positive values */}
      <Group>
        <Mask
          mask={
            <Rect
              x={0}
              y={0}
              width={width}
              height={scales.yScale(0)}
              color="white"
            />
          }
        >
          <Path
            style="stroke"
            strokeJoin="round"
            strokeCap="round"
            strokeWidth={strokeWidth}
            color={seriesColors.find((s) => s.id === seriesId)?.color ?? "grey"}
            path={data.curvePath ?? ""}
            start={0}
            end={animated ? animationProgress : 1}
          />
        </Mask>
      </Group>
    </Group>
  );
};
