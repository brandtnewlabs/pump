import React, { useEffect, useMemo } from "react";
import { useSharedValue } from "react-native-reanimated";

import { motion } from "@/animations";
import tailwindColors from "@/tailwind-colors";
import { SeriesColorItem, SeriesDataRecord } from "@/types/graph";
import { Group, LinearGradient, Path, vec } from "@shopify/react-native-skia";

/**
 * Props for the AreaGradient component
 */
type AreaGradientProps = {
  seriesData: SeriesDataRecord;
  seriesColors: SeriesColorItem[];
  graphNegativeGradient: string[];
  scales: {
    yScale: (value: number) => number;
  };
  animated?: boolean;
  animationDuration?: number;
};

/**
 * AreaGradient Component
 *
 * Renders gradient-filled areas under line charts, handling both positive and negative values.
 * Only processes the first series in seriesData as it's designed for single-series visualization.
 * Supports smooth drawing animations that sync with the line paths.
 */
export const AreaGradient = ({
  seriesData,
  seriesColors,
  graphNegativeGradient,
  scales,
  animated = true,
  animationDuration = 1000,
}: AreaGradientProps) => {
  // Shared value for animation progress (0 to 1)
  const animationProgress = useSharedValue(0);

  // Memoize first series data to prevent unnecessary re-calculations
  const firstSeriesData = useMemo(() => {
    if (Object.keys(seriesData).length === 0) {
      return null;
    }

    const firstSeriesId = Object.keys(seriesData)[0];
    if (firstSeriesId === undefined || firstSeriesId === null) {
      return null;
    }

    const data = seriesData[firstSeriesId];
    if (data === undefined || data === null) {
      return null;
    }

    return { id: firstSeriesId, data };
  }, [seriesData]);

  // Reset and start animation when data changes
  useEffect(() => {
    if (animated && firstSeriesData?.data.areaPath) {
      animationProgress.value = 0;
      // Use centralized animation system
      animationProgress.value = motion.withTimingGentle(1);
    } else {
      animationProgress.value = 1;
    }
  }, [
    firstSeriesData?.data.areaPath,
    animated,
    animationDuration,
    animationProgress,
  ]);

  // Early return if no series data
  if (!firstSeriesData) {
    return null;
  }

  // Find matching gradient colors or use fallback
  const seriesGradient = seriesColors.find((s) => s.id === firstSeriesData.id)
    ?.gradient ?? [tailwindColors.base[300], tailwindColors.base[100]];

  return (
    <Group key={`area-${firstSeriesData.id}`}>
      {/* Negative gradient area */}
      {firstSeriesData.data.min < 0 && (
        <Path
          path={firstSeriesData.data.areaPath ?? ""}
          start={0}
          end={animated ? animationProgress : 1}
        >
          <LinearGradient
            start={vec(0, scales.yScale(0))}
            end={vec(0, scales.yScale(firstSeriesData.data.min))}
            colors={graphNegativeGradient}
          />
        </Path>
      )}

      {/* Positive gradient area */}
      <Path
        path={firstSeriesData.data.areaPath ?? ""}
        start={0}
        end={animated ? animationProgress : 1}
      >
        <LinearGradient
          start={vec(
            0,
            firstSeriesData.data.min < 0
              ? scales.yScale(0)
              : scales.yScale(firstSeriesData.data.min),
          )}
          end={vec(0, scales.yScale(firstSeriesData.data.max))}
          colors={seriesGradient}
        />
      </Path>
    </Group>
  );
};
