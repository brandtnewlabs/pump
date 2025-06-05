import { useMemo } from "react";

import { useGridCalculations } from "@/hooks/useGridCalculations";
import {
  calculateDomain,
  createAreaPath,
  createLinePath,
  createScales,
  createSegments,
} from "@/lib/graph-helpers";
import {
  GraphDisplayMode,
  GraphLineStyle,
  GraphNiceScaleConfig,
  GraphSeries,
  Scales,
  SeriesData,
  SeriesDataRecord,
} from "@/types/graph";
import { SkPath } from "@shopify/react-native-skia";

/**
 * Props for the useSeriesData hook
 */
type UseSeriesDataProps = {
  /** Array of data series to be rendered */
  series: GraphSeries[];
  /** Height of the chart area in pixels */
  height: number;
  /** Width of the chart area in pixels */
  width: number;
  /** Optional padding from top and bottom edges */
  verticalPadding?: number;
  /** Optional padding from left and right edges */
  horizontalPadding?: number;
  /** Number of grid lines/ticks to display */
  tickCount?: number;
  /** Whether to use nice scaling for axis values */
  niceScale?: boolean;
  /** Configuration for nice scaling algorithm */
  niceScaleConfig?: GraphNiceScaleConfig;
  /** Display mode for the graph */
  displayMode?: GraphDisplayMode;
  /** The style of the line to create */
  lineStyle?: GraphLineStyle;
};

/**
 * Return type for the useSeriesData hook
 */
type SeriesDataReturn = {
  /** Calculated data for each series, keyed by series ID */
  seriesData: SeriesDataRecord;
  /** Global minimum value across all series */
  min: number;
  /** Global maximum value across all series */
  max: number;
  /** Values for grid lines */
  gridValues: number[];
  /** Paths for grid lines */
  gridLinePaths: SkPath[];
  /** Scale functions for the entire chart */
  scales: Scales;
};

/**
 * Hook that calculates all necessary paths and metrics for rendering multi-line charts
 *
 * This hook handles:
 * - Calculating global min/max values and time range
 * - Creating scale functions for data transformation
 * - Generating grid lines and values
 * - Creating curve and area paths for each series
 * - Separating positive and negative value paths
 *
 * @param props Configuration options for the chart
 * @returns Calculated paths, scales, and metrics for rendering
 */
export const useSeriesData = ({
  series,
  height,
  width,
  verticalPadding = 0,
  horizontalPadding = 0,
  tickCount = 3,
  niceScale = false,
  niceScaleConfig = { method: "auto" },
  displayMode = GraphDisplayMode.Currency,
  lineStyle = GraphLineStyle.CatmullRom,
}: UseSeriesDataProps): SeriesDataReturn => {
  // Calculate overall min, max, and time range
  const { min, max, timeRange } = useMemo(() => {
    if (!series.length) {
      return { min: 0, max: 0, timeRange: [0, 0] as [number, number] };
    }

    let minValue = Infinity;
    let maxValue = -Infinity;
    let minTime = Infinity;
    let maxTime = -Infinity;

    series.forEach((s) => {
      s.points.forEach((point) => {
        minValue = Math.min(minValue, point.value);
        maxValue = Math.max(maxValue, point.value);
        minTime = Math.min(minTime, point.timestamp);
        maxTime = Math.max(maxTime, point.timestamp);
      });
    });

    return {
      min: minValue,
      max: maxValue,
      timeRange: [minTime, maxTime] as [number, number],
    };
  }, [series]);

  // Create scales based on the calculated domain
  const scales = useMemo(() => {
    const { domain } = calculateDomain(
      min,
      max,
      niceScale,
      niceScaleConfig,
      displayMode === GraphDisplayMode.Percentage,
    );

    return createScales(
      domain,
      timeRange,
      {
        height,
        width,
        verticalPadding,
        horizontalPadding,
      },
      niceScale,
      niceScaleConfig,
      tickCount,
      displayMode === GraphDisplayMode.Percentage,
    );
  }, [
    min,
    max,
    timeRange,
    height,
    width,
    verticalPadding,
    horizontalPadding,
    niceScale,
    niceScaleConfig,
    tickCount,
    displayMode,
  ]);

  // Calculate grid values and paths
  const { gridValues, gridLinePaths } = useGridCalculations({
    scales,
    width,
    horizontalPadding,
    tickCount,
    niceScale,
    niceScaleConfig,
  });

  // Calculate paths for each series using helper functions
  const seriesData = useMemo(() => {
    const result: Record<string, SeriesData> = {};

    series.forEach((s) => {
      if (!s.points.length) {
        result[s.id] = {
          min: 0,
          max: 0,
          curvePath: null,
          areaPath: null,
          scales,
          curveValuePath: {
            positive: null,
            negative: null,
          },
          areaValuePath: {
            positive: null,
            negative: null,
          },
        };
        return;
      }

      // Calculate series-specific min/max
      const seriesMin = Math.min(...s.points.map((p) => p.value));
      const seriesMax = Math.max(...s.points.map((p) => p.value));

      // Create main curve path using createLinePath helper
      const curvePath = createLinePath(s.points, scales, lineStyle);

      // Create area path for the entire series
      const areaPath = createAreaPath(s.points, scales, lineStyle);

      // Create separate paths for positive and negative values using createSegments
      const segments = createSegments(s.points);

      // Create curve paths for positive and negative segments
      const positiveLinePaths = segments.positive.map((segment) =>
        createLinePath(segment, scales, lineStyle),
      );

      const negativeLinePaths = segments.negative.map((segment) =>
        createLinePath(segment, scales, lineStyle),
      );

      // Combine positive and negative curve paths
      const positivePath = positiveLinePaths.reduce(
        (combined, path) => {
          if (!combined) {
            return path;
          }
          if (!path) {
            return combined;
          }
          combined.addPath(path);
          return combined;
        },
        null as SkPath | null,
      );

      const negativePath = negativeLinePaths.reduce(
        (combined, path) => {
          if (!combined) {
            return path;
          }
          if (!path) {
            return combined;
          }
          combined.addPath(path);
          return combined;
        },
        null as SkPath | null,
      );

      // Keep the area path calculations as they are
      const positiveAreaPaths = segments.positive.map((segment) =>
        createAreaPath(segment, scales, lineStyle),
      );

      const negativeAreaPaths = segments.negative.map((segment) =>
        createAreaPath(segment, scales, lineStyle),
      );

      // Combine positive and negative area paths
      const positiveAreaPath = positiveAreaPaths.reduce(
        (combined, path) => {
          if (!combined) {
            return path;
          }
          if (!path) {
            return combined;
          }
          combined.addPath(path);
          return combined;
        },
        null as SkPath | null,
      );

      const negativeAreaPath = negativeAreaPaths.reduce(
        (combined, path) => {
          if (!combined) {
            return path;
          }
          if (!path) {
            return combined;
          }
          combined.addPath(path);
          return combined;
        },
        null as SkPath | null,
      );

      result[s.id] = {
        min: seriesMin,
        max: seriesMax,
        curvePath,
        areaPath,
        scales,
        curveValuePath: {
          positive: positivePath,
          negative: negativePath,
        },
        areaValuePath: {
          positive: positiveAreaPath,
          negative: negativeAreaPath,
        },
      };
    });

    return result;
  }, [series, scales, lineStyle]);

  return {
    seriesData,
    min,
    max,
    gridValues,
    gridLinePaths: gridLinePaths.filter((path) => path !== null) as SkPath[],
    scales,
  };
};
