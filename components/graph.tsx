import { useEffect, useMemo } from "react";
import { ActivityIndicator, ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { motion } from "@/animations";
import { useGraphDimensions } from "@/hooks/useGraphDimensions";
import { useSeriesColors } from "@/hooks/useSeriesColors";
import { useSeriesData } from "@/hooks/useSeriesData";
import {
  ActivePoint,
  GraphDisplayMode,
  GraphLineStyle,
  GraphNiceScaleConfig,
  GraphSeries,
  GraphYAxisLabelPosition,
} from "@/types/graph";
import { Canvas, Group } from "@shopify/react-native-skia";

import { AreaGradient } from "./graph-area-gradient";
import { StrokePath } from "./graph-path";

interface GraphProps extends ViewProps {
  // Data
  series: GraphSeries[];
  loading?: boolean;
  displayMode?: GraphDisplayMode;

  // Appearance
  cursorColor?: string;

  // Active point
  onActivePointsChange?: (points: ActivePoint[]) => void;

  // Line styling
  strokeWidth?: number;

  /**
   * Defines how the line between data points should be drawn
   * @default GraphLineStyle.CatmullRom
   */
  graphLineStyle?: GraphLineStyle;

  // Padding
  graphVerticalPadding?: number;
  graphHorizontalPadding?: number;

  // Features
  withAreaGradient?: boolean;
  withLabelsYAxis?: boolean;
  withLabelsXAxis?: boolean;
  withLabelsYAxisMinMax?: boolean;
  withGridLines?: boolean;
  withCursor?: boolean;
  withPanGesture?: boolean;
  withLegend?: boolean;

  // Grid customization
  gridLineDash?: [number, number];
  gridLineWidth?: number;

  // Axis configuration
  yAxisTicks?: number;
  xAxisTicks?: number;
  yAxisLabelPosition?: GraphYAxisLabelPosition;

  /**
   * Whether to enable "nice" scaling of the y-axis values.
   * When enabled, the graph will adjust its y-axis scale to use rounded numbers
   * that are more human-readable (e.g., 100, 200, 300 instead of 98, 196, 294).
   * This helps create more intuitive and cleaner looking axis labels.
   */
  niceScale?: boolean;
  /**
   * Configuration options for the nice scaling behavior
   * @property roundTo - Number of decimal places to round to (e.g., 2 for 1.23)
   * @property method - Scaling method to use:
   *                   'auto' - Automatically determines appropriate rounding
   *                   'fixed' - Uses the specified roundTo value strictly
   */
  niceScaleConfig?: GraphNiceScaleConfig;

  // Animation configuration
  /**
   * Whether to animate the graph drawing
   * @default true
   */
  animated?: boolean;
  /**
   * Duration of the drawing animation in milliseconds
   * @default 1000
   */
  animationDuration?: number;
  /**
   * Whether to animate the graph scale-in on first appearance
   * @default true
   */
  withEntranceAnimation?: boolean;
}

export const Graph = ({
  // Display configuration
  strokeWidth = 2,
  graphVerticalPadding = 40,
  graphHorizontalPadding = 0,
  graphLineStyle = GraphLineStyle.CatmullRom,

  // Grid configuration
  gridLineDash = [4, 4],
  gridLineWidth = 0.5,
  yAxisTicks = 3,
  xAxisTicks = 3,

  // Label configuration
  withLabelsYAxisMinMax = false,
  yAxisLabelPosition = GraphYAxisLabelPosition.Left,
  displayMode = GraphDisplayMode.Currency,

  // Feature flags
  withAreaGradient = true,
  withLabelsYAxis = true,
  withLabelsXAxis = true,
  withGridLines = true,
  withCursor = true,
  withPanGesture = true,
  withLegend = true,
  // Scale configuration
  niceScale = false,
  niceScaleConfig = { method: "auto" },

  // Animation configuration
  animated = true,
  animationDuration = 1000,
  withEntranceAnimation = true,

  // Data
  series,

  // Optional props
  cursorColor,
  loading = false,
  onActivePointsChange,
  ...props
}: GraphProps) => {
  // Get the dimensions of the graph
  const { width, height, onLayout } = useGraphDimensions();

  // Animation shared values
  const scaleValue = useSharedValue(withEntranceAnimation ? 0.95 : 1);
  const opacityValue = useSharedValue(withEntranceAnimation ? 0 : 1);

  // Get the appropriate colors for each graph in the series
  const {
    seriesColors,
    negativeColor: negativeGraphColor,
    cursorColor: graphCursorColor,
    negativeGradient: graphNegativeGradient,
    lineColor,
    labelColor,
  } = useSeriesColors(series);

  // Get the graph data using our new hook
  const { seriesData, gridValues, gridLinePaths, scales } = useSeriesData({
    series,
    height,
    width,
    verticalPadding: graphVerticalPadding,
    horizontalPadding: graphHorizontalPadding,
    tickCount: yAxisTicks,
    niceScale,
    niceScaleConfig,
    displayMode,
    lineStyle: graphLineStyle,
  });

  // Determine if we have multiple graphs in the series
  const withMultipleGraphs = useMemo(
    () => Object.keys(series).length > 1,
    [series],
  );

  // Trigger entrance animation when graph is ready
  useEffect(() => {
    if (withEntranceAnimation && !loading && width && height) {
      // Use centralized animation system with spring for more dynamic entrance
      scaleValue.value = motion.withSpringPlayful(1);
      opacityValue.value = motion.withTimingDefault(1);
    }
  }, [loading, width, height, withEntranceAnimation, scaleValue, opacityValue]);

  // Animated style for entrance animation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
      opacity: opacityValue.value,
    };
  });

  return (
    <Animated.View
      onLayout={onLayout}
      className="flex flex-1 flex-col bg-transparent"
      {...props}
    >
      {loading || !width || !height ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Animated.View style={animatedStyle}>
          <Canvas style={{ width, height }}>
            <Group>
              {/* Optional Gradient fill paths for single series */}
              {withAreaGradient && !withMultipleGraphs && (
                <AreaGradient
                  seriesData={seriesData}
                  seriesColors={seriesColors}
                  graphNegativeGradient={graphNegativeGradient}
                  scales={scales}
                  animated={animated}
                  animationDuration={animationDuration}
                />
              )}

              {/* Stroke path: Positive and negative values */}
              {Object.entries(seriesData).map(([seriesId, data]) => (
                <StrokePath
                  key={seriesId}
                  seriesId={seriesId}
                  data={data}
                  width={width}
                  scales={scales}
                  strokeWidth={strokeWidth}
                  negativeGraphColor={negativeGraphColor}
                  seriesColors={seriesColors}
                  animated={animated}
                  animationDuration={animationDuration}
                />
              ))}
            </Group>
          </Canvas>
        </Animated.View>
      )}
    </Animated.View>
  );
};
