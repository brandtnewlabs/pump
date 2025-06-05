import {
  CurveFactory,
  area,
  curveCatmullRom,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
  line,
  scaleLinear,
  scaleTime,
} from "d3";

import {
  GraphLineStyle,
  GraphNiceScaleConfig,
  GraphPoint,
  Scales,
} from "@/types/graph";
import { Skia } from "@shopify/react-native-skia";

/**
 * Creates a Skia path from SVG path data
 * @param pathData - SVG path data string
 * @returns Skia path object or null if pathData is null
 */
export const createPath = (pathData: string | null) =>
  pathData ? Skia.Path.MakeFromSVGString(pathData) : null;

/**
 * Maps each GraphLineStyle to its corresponding D3 curve factory.
 * These factories determine how points are connected in the graph:
 * - Linear: Straight lines between points
 * - Natural: Smooth curves with natural cubic splines
 * - CatmullRom: Smooth curves with Catmull-Rom splines
 * - Monotone: Smooth curves that preserve monotonicity
 * - Step: Step-wise lines with vertical transitions
 */
const CURVE_FACTORIES: Record<GraphLineStyle, CurveFactory> = {
  [GraphLineStyle.Linear]: curveLinear, // Direct lines between points
  [GraphLineStyle.Natural]: curveNatural, // Smooth natural splines
  [GraphLineStyle.CatmullRom]: curveCatmullRom, // Smooth Catmull-Rom splines
  [GraphLineStyle.Monotone]: curveMonotoneX, // Monotonic curves
  [GraphLineStyle.Step]: curveStep, // Step-wise transitions
};

/**
 * Safely retrieves the appropriate curve factory for a given line style.
 *
 * @param lineStyle - The desired style for the line/curve
 * @returns The corresponding D3 curve factory
 *
 * @example
 * const factory = getCurveFactory(GraphLineStyle.Step);
 * // Returns curveStep for step-wise line transitions
 *
 * @fallback Returns curveCatmullRom if the specified style is invalid
 */
const getCurveFactory = (
  lineStyle: GraphLineStyle = GraphLineStyle.CatmullRom,
): CurveFactory => {
  const curveFactory = CURVE_FACTORIES[lineStyle];
  if (!curveFactory) {
    console.warn(
      `Invalid line style: ${lineStyle}. Falling back to CatmullRom.`,
    );
    return curveCatmullRom;
  }
  return curveFactory;
};

/**
 * Creates a Skia path for a line segment using D3's line generator.
 *
 * @param segment - Array of data points to create the line from
 * @param scales - X and Y scales for coordinate mapping
 * @param lineStyle - Style to apply to the line (default: Linear)
 * @returns Skia path object or null if invalid
 *
 * @example
 * const path = createLinePath(
 *   [{date: new Date(), value: 100}],
 *   scales,
 *   GraphLineStyle.CatmullRom
 * );
 */
export const createLinePath = (
  segment: GraphPoint[],
  scales: Scales,
  lineStyle: GraphLineStyle = GraphLineStyle.CatmullRom,
) => {
  // Create D3 line generator with coordinate mapping
  const pathData = line<GraphPoint>()
    .x((d) => scales.xScale(d.timestamp)) // Map dates to x coordinates
    .y((d) => scales.yScale(d.value)) // Map values to y coordinates
    .curve(getCurveFactory(lineStyle))(segment); // Apply curve style

  return createPath(pathData);
};

/**
 * Creates a Skia path for an area fill using D3's area generator.
 * The area extends from the line down to the zero baseline.
 *
 * @param points - Array of data points to create the area from
 * @param scales - X and Y scales for coordinate mapping
 * @param lineStyle - Style to apply to the upper edge (default: Linear)
 * @returns Skia path object or null if invalid
 *
 * @example
 * const areaPath = createAreaPath(
 *   [{date: new Date(), value: 100}],
 *   scales,
 *   GraphLineStyle.Monotone
 * );
 */
export const createAreaPath = (
  points: GraphPoint[],
  scales: Scales,
  lineStyle: GraphLineStyle = GraphLineStyle.CatmullRom,
) => {
  if (!points.length) {
    return null;
  }

  // Create D3 area generator with coordinate mapping
  const pathData = area<GraphPoint>()
    .x((d) => scales.xScale(d.timestamp)) // Map dates to x coordinates
    .y1((d) => scales.yScale(d.value)) // Upper edge y coordinates
    .y0(scales.yScale(0)) // Lower edge at y=0 baseline
    .curve(getCurveFactory(lineStyle))(points); // Apply curve style

  return createPath(pathData);
};

/**
 * Creates D3 scales for mapping data values to pixel coordinates
 *
 * @param domain - Tuple of [min, max] values for y-axis
 * @param timeRange - Tuple of [startTime, endTime] in milliseconds for x-axis
 * @param dimensions - Object containing graph dimensions
 * @param dimensions.height - Total height of graph area in pixels
 * @param dimensions.width - Total width of graph area in pixels
 * @param dimensions.verticalPadding - Padding from top/bottom edges
 * @param dimensions.horizontalPadding - Padding from left/right edges
 * @param niceScale - Whether to enable D3's "nice" scaling for rounded values
 * @param niceScaleConfig - Configuration for nice scaling behavior
 * @param niceScaleConfig.method - Either 'auto' or 'fixed'
 * @param niceScaleConfig.roundTo - For 'fixed' method, value to round to
 * @param tickCount - Number of ticks to generate when using auto nice scaling
 *
 * @returns Object containing:
 *   - yScale: D3 linear scale for vertical values
 *   - xScale: D3 time scale for horizontal dates
 *
 * @example
 * const scales = createScales(
 *   [0, 100],
 *   [Date.now() - 86400000, Date.now()],
 *   { height: 300, width: 600, verticalPadding: 20, horizontalPadding: 10 },
 *   true,
 *   { method: 'auto' },
 *   5
 * );
 */
export const createScales = (
  domain: [number, number],
  timeRange: [number, number],
  dimensions: {
    height: number;
    width: number;
    verticalPadding: number;
    horizontalPadding: number;
  },
  niceScale: boolean,
  niceScaleConfig: GraphNiceScaleConfig,
  tickCount: number,
  isPercentage: boolean = false,
) => {
  // Calculate a more evenly distributed domain when using nice scale
  let adjustedDomain = domain;
  if (niceScale) {
    // Calculate the total range between min and max values
    const range = domain[1] - domain[0]; // e.g., 54000 - 44000 = 10000

    // Different rounding logic for percentages vs currency
    let roundedStep;
    if (isPercentage) {
      // For percentages, use 5% or 10% steps depending on the range
      if (range > 50) {
        roundedStep = 10; // Use 10% steps for larger ranges
      } else {
        roundedStep = 5; // Use 5% steps for smaller ranges
      }
    } else {
      // For currency/numbers, find appropriate step size based on range magnitude
      const magnitude = Math.floor(Math.log10(range));
      const baseStep = Math.pow(10, magnitude - 1);

      if (range / baseStep <= 10) {
        roundedStep = baseStep; // Use 1, 10, 100, etc.
      } else if (range / baseStep <= 20) {
        roundedStep = baseStep * 2; // Use 2, 20, 200, etc.
      } else if (range / baseStep <= 50) {
        roundedStep = baseStep * 5; // Use 5, 50, 500, etc.
      } else {
        roundedStep = baseStep * 10; // Use 10, 100, 1000, etc.
      }
    }

    // Calculate new min by rounding down to nearest step
    // e.g., floor(44000 / 4000) * 4000 = floor(11) * 4000 = 44000
    const min = Math.floor(domain[0] / roundedStep) * roundedStep;

    // Calculate new max by rounding up to nearest step
    // e.g., ceil(54000 / 4000) * 4000 = ceil(13.5) * 4000 = 56000
    const max = Math.ceil(domain[1] / roundedStep) * roundedStep;

    // Use these new boundaries for our scale
    // This will give us evenly spaced ticks: 44000, 48000, 52000, 56000
    adjustedDomain = [min, max];
  }

  // Create vertical scale
  // Maps data values to y-coordinates, inverted range because SVG coordinates
  // increase downward while we want values to increase upward
  const yScale = scaleLinear()
    .domain(adjustedDomain)
    .range([
      dimensions.height - dimensions.verticalPadding, // Bottom of graph
      dimensions.verticalPadding, // Top of graph
    ]);

  // Apply D3's "nice" adjustment for auto method only
  // This rounds the scale to nice human-readable values
  if (niceScale && niceScaleConfig.method === "auto") {
    yScale.nice(tickCount);
  }

  // Create horizontal scale
  // Maps dates to x-coordinates, from left padding to right padding
  const xScale = scaleTime()
    .domain([new Date(timeRange[0]), new Date(timeRange[1])])
    .range([
      dimensions.horizontalPadding, // Left edge
      dimensions.width - dimensions.horizontalPadding, // Right edge
    ]);

  return { yScale, xScale };
};

/**
 * Splits points into positive and negative segments, adding intersection points at zero crossings
 * @param points - Array of graph points to segment
 * @returns Object containing arrays of positive and negative segments
 */
export const createSegments = (points: GraphPoint[]) => {
  // Initialize segments object to store positive and negative point arrays
  const segments: { positive: GraphPoint[][]; negative: GraphPoint[][] } = {
    positive: [],
    negative: [],
  };
  let currentSegment: GraphPoint[] = [];

  const firstPoint = points[0];

  if (firstPoint === undefined || firstPoint === null) {
    return segments;
  }

  let isPositive = firstPoint.value >= 0;

  points.forEach((point, index) => {
    const currentIsPositive = point.value >= 0;

    // When crossing zero, create intersection point and split segment
    if (currentIsPositive !== isPositive && index > 0) {
      const prevPoint = points[index - 1];
      if (!prevPoint) {
        return;
      }
      // Calculate intersection point using linear interpolation
      const ratio =
        Math.abs(prevPoint.value) /
        (Math.abs(prevPoint.value) + Math.abs(point.value));
      const intersectionTimestamp =
        prevPoint.timestamp + (point.timestamp - prevPoint.timestamp) * ratio;
      const intersectionPoint = { timestamp: intersectionTimestamp, value: 0 };

      // Add intersection point to current segment and start new segment
      currentSegment.push(intersectionPoint);
      segments[isPositive ? "positive" : "negative"].push([...currentSegment]);
      currentSegment = [intersectionPoint];
      isPositive = currentIsPositive;
    }

    currentSegment.push(point);
  });

  // Add final segment
  if (currentSegment.length) {
    segments[isPositive ? "positive" : "negative"].push(currentSegment);
  }

  return segments;
};

interface DomainResult {
  min: number;
  max: number;
  domain: [number, number];
}

/**
 * Calculates the domain and boundary values for the graph based on nice scale configuration
 * @param minValue - Minimum value in the data range
 * @param maxValue - Maximum value in the data range
 * @param niceScale - Whether to use nice scale
 * @param niceScaleConfig - Nice scale configuration
 * @param isPercentage - Whether the graph is a percentage graph
 * @returns Object containing:
 *   - min: The calculated minimum boundary value
 *   - max: The calculated maximum boundary value
 *   - domain: Tuple of [min, max] for use with scales
 */
export const calculateDomain = (
  minValue: number,
  maxValue: number,
  niceScale: boolean,
  niceScaleConfig: GraphNiceScaleConfig,
  isPercentage: boolean = false,
): DomainResult => {
  if (isPercentage) {
    // Special handling for percentage values
    if (niceScale) {
      // Round to nearest 5 or 10 percent
      const roundTo =
        niceScaleConfig.method === "fixed" ? niceScaleConfig.roundTo || 5 : 5;

      const min = Math.floor(minValue / roundTo) * roundTo;
      const max = Math.ceil(maxValue / roundTo) * roundTo;

      // Ensure domain includes zero for percentages
      return {
        min: Math.min(0, min),
        max: Math.max(max, min + roundTo),
        domain: [Math.min(0, min), Math.max(max, min + roundTo)],
      };
    }

    // Without nice scale
    const min = Math.min(0, minValue);
    const max = Math.max(maxValue, min);
    return { min, max, domain: [min, max] };
  }

  if (
    niceScale &&
    niceScaleConfig.method === "fixed" &&
    niceScaleConfig.roundTo
  ) {
    const roundTo = niceScaleConfig.roundTo;
    const min = Math.floor(minValue / roundTo) * roundTo;
    const max = Math.ceil(maxValue / roundTo) * roundTo;
    return { min, max, domain: [min, max] };
  }

  return { min: minValue, max: maxValue, domain: [minValue, maxValue] };
};

/**
 * Calculates evenly spaced steps between min and max values
 * @param min - Minimum value
 * @param max - Maximum value
 * @param count - Number of steps to generate
 * @param roundTo - Optional value to round steps to
 * @returns Array of step values
 */
export const calculateEvenlySpacedSteps = (
  min: number,
  max: number,
  count: number,
  roundTo: number | null = 1,
) => {
  const step = (max - min) / (count - 1);

  return Array.from({ length: count }, (_, i) => {
    const value = max - step * i;
    return roundTo ? Math.round(value / roundTo) * roundTo : value;
  });
};

/**
 * Calculates grid values with fixed step sizes, optimizing for readability
 * @param min - Minimum value in the data range
 * @param max - Maximum value in the data range
 * @param tickCount - Number of grid lines to generate
 * @param roundTo - Value to round steps to (e.g., 1000 for thousands)
 * @returns Array of evenly spaced grid values
 *
 * This function handles two cases:
 * 1. When negative values are small compared to positive ones (skipZero)
 * 2. When we want evenly distributed values around zero
 */
export const calculateFixedStepValues = (
  min: number,
  max: number,
  tickCount: number,
  roundTo: number,
): number[] => {
  const values: number[] = [];
  // Determine if we have an even number of ticks
  const isEvenTickCount = tickCount % 2 === 0;
  // Calculate how many ticks should be on each side of zero
  const halfTickCount = Math.floor(tickCount / 2);

  // Calculate step sizes for positive and negative ranges
  // Steps are rounded to the nearest multiple of roundTo
  const positiveStep = Math.round(max / halfTickCount / roundTo) * roundTo;
  const negativeStep =
    Math.round(Math.abs(min) / halfTickCount / roundTo) * roundTo;

  // Skip zero if negative values are relatively small
  // This prevents awkward spacing when negative values are minor
  const skipZero = negativeStep <= positiveStep / 2;

  // Case 1: Skip zero and distribute ticks evenly across the range
  if (skipZero) {
    const totalRange = max - min;
    const step = totalRange / (tickCount - 1);

    // Generate values from max to min
    for (let i = 0; i < tickCount; i++) {
      const value = max - step * i;
      values.push(Math.round(value / roundTo) * roundTo);
    }
    return values;
  }

  // Case 2: Include zero and distribute values around it

  // Calculate negative values
  // For even tick counts, we use (tickCount-2)/2 to reserve space for zero
  const negativeCount = isEvenTickCount ? (tickCount - 2) / 2 : halfTickCount;
  for (let i = negativeCount; i > 0; i--) {
    values.push(-i * negativeStep);
  }

  // Add zero as the center point
  values.push(0);

  // Calculate positive values
  // For even tick counts, we use exactly half the ticks
  const positiveCount = isEvenTickCount ? tickCount / 2 : halfTickCount;
  for (let i = 1; i <= positiveCount; i++) {
    values.push(i * positiveStep);
  }

  return values;
};

/**
 * Calculates grid values automatically with dynamic step sizes
 * @param min - Minimum value in the data range
 * @param max - Maximum value in the data range
 * @param tickCount - Number of grid lines to generate
 * @returns Array of grid values distributed around zero
 *
 * This function differs from calculateFixedStepValues by:
 * 1. Always including zero as a reference point
 * 2. Using dynamic step sizes based on the actual data range
 * 3. Handling positive and negative ranges independently
 */
export const calculateAutoStepValues = (
  min: number,
  max: number,
  tickCount: number,
): number[] => {
  const values: number[] = [];
  // Determine if we need to handle an even or odd number of ticks
  const isEvenTickCount = tickCount % 2 === 0;
  // Calculate base number of ticks for each side of zero
  const halfTickCount = Math.floor(tickCount / 2);

  // Separate positive and negative ranges
  const positiveRange = max;
  const negativeRange = Math.abs(min);

  // Calculate step sizes for each range
  // For positive values, divide range by half tick count
  const positiveStep = positiveRange / halfTickCount;
  // For negative values, adjust division based on even/odd tick count
  const negativeStep = isEvenTickCount
    ? negativeRange / (halfTickCount - 1) // One less step for even counts
    : negativeRange / halfTickCount; // Equal steps for odd counts

  // Generate negative values from lowest to highest
  const negativeCount = isEvenTickCount ? (tickCount - 2) / 2 : halfTickCount;
  for (let i = negativeCount; i > 0; i--) {
    values.push(-i * negativeStep);
  }

  // Always include zero as a reference point
  values.push(0);

  // Generate positive values from lowest to highest
  const positiveCount = isEvenTickCount ? tickCount / 2 : halfTickCount;
  for (let i = 1; i <= positiveCount; i++) {
    values.push(i * positiveStep);
  }

  return values;
};
