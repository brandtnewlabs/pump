import { useMemo } from "react";

import { calculateEvenlySpacedSteps } from "@/lib/graph-helpers";
import { GraphNiceScaleConfig, Scales } from "@/types/graph";
import { SkPath, Skia } from "@shopify/react-native-skia";

/**
 * Props for grid calculations
 */
type UseGridCalculationsProps = {
  /** Scale configurations for the chart axes */
  scales: Scales;
  /** Total width of the chart area */
  width: number;
  /** Padding from the left and right edges */
  horizontalPadding: number;
  /** Number of grid lines to display */
  tickCount: number;
  /** Whether to use nice scaling for better readable values */
  niceScale: boolean;
  /** Configuration for nice scale calculations */
  niceScaleConfig: GraphNiceScaleConfig;
};

/**
 * Return type for grid calculations
 */
type GridCalculationsReturn = {
  /** Array of calculated grid line values */
  gridValues: number[];
  /** Array of Skia paths for rendering grid lines */
  gridLinePaths: SkPath[];
};

/**
 * Hook for calculating grid values and paths for chart visualization.
 * Handles both positive-only and mixed (positive/negative) value ranges.
 *
 * @param scales - Scale configurations for chart axes
 * @param width - Total width of chart area
 * @param horizontalPadding - Padding from left and right edges
 * @param tickCount - Number of grid lines to display
 * @param niceScale - Whether to use nice scaling
 * @param niceScaleConfig - Configuration for nice scale calculations
 * @returns Object containing grid values and their corresponding paths
 */
export const useGridCalculations = ({
  scales,
  width,
  horizontalPadding,
  tickCount,
  niceScale,
  niceScaleConfig,
}: UseGridCalculationsProps): GridCalculationsReturn => {
  // Calculate grid values based on the scale
  const gridValues = useMemo(() => {
    const domain = scales.yScale.domain();

    // Check if domain is empty or invalid
    if (!domain || domain.length !== 2) {
      return [];
    }

    const [firstValue, secondValue] = domain;

    if (
      firstValue === undefined ||
      firstValue === null ||
      secondValue === undefined ||
      secondValue === null
    ) {
      return [];
    }

    // Always use evenly spaced steps
    const steps = calculateEvenlySpacedSteps(
      firstValue,
      secondValue,
      tickCount,
      niceScale && niceScaleConfig.method === "fixed"
        ? niceScaleConfig.roundTo
        : null,
    );

    return steps;
  }, [scales.yScale, tickCount, niceScale, niceScaleConfig]);

  // Generate the grid line paths for rendering
  const gridLinePaths = useMemo(() => {
    if (tickCount === 0 || gridValues.length === 0) {
      return [];
    }

    return gridValues
      .map((value) => {
        // Convert value to Y-axis position
        const yPosition = scales.yScale(value);

        // Skip invalid positions
        if (typeof yPosition !== "number" || isNaN(yPosition)) {
          return null;
        }

        // Create horizontal line path from left to right padding
        const path = Skia.Path.Make();
        path.moveTo(horizontalPadding, yPosition);
        path.lineTo(width - horizontalPadding, yPosition);
        return path;
      })
      .filter((path): path is SkPath => path !== null);
  }, [tickCount, gridValues, width, horizontalPadding, scales]);

  return {
    gridValues,
    gridLinePaths,
  };
};
