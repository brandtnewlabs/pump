import { ScaleLinear, ScaleTime } from "d3";

import { SkPath } from "@shopify/react-native-skia";

/**
 * Available color options for the graph
 */
export type GraphColor = "red" | "green" | "grey" | "lightGreen" | "lightRed";

/**
 * Display modes for the graph
 */
export enum GraphDisplayMode {
  Currency = "currency",
  Percentage = "percentage",
}

/**
 * D3 scale types used for axis calculations
 */
export type Scales = {
  yScale: ScaleLinear<number, number>;
  xScale: ScaleTime<number, number>;
};

/**
 * Represents a color configuration for a single series
 */
export interface SeriesColorItem {
  /** Unique identifier for the series */
  id: string;
  /** The computed color for the series */
  color: string;
  /** The gradient colors for the series */
  gradient: string[];
  /** The label for the series */
  label?: string;
}

/**
 * Data structure for each series' calculated paths and metrics
 */
export type SeriesData = {
  /** Minimum value in this series */
  min: number;
  /** Maximum value in this series */
  max: number;
  /** Path for the main curve line */
  curvePath: SkPath | null;
  /** Path for the filled area under the curve */
  areaPath: SkPath | null;
  /** Scale functions for transforming data to pixel coordinates */
  scales: Scales;

  /** Separate curve paths for positive and negative values */
  curveValuePath: {
    positive: SkPath | null;
    negative: SkPath | null;
  };
  /** Separate area paths for positive and negative values */
  areaValuePath: {
    positive: SkPath | null;
    negative: SkPath | null;
  };
};

/**
 * Record of series data, keyed by series ID
 */
export type SeriesDataRecord = Record<string, SeriesData>;

/**
 * Basic data point structure for the graph
 */
export interface GraphPoint {
  timestamp: number;
  value: number;
}

/**
 * Graph series structure
 */
export interface GraphSeries {
  id: string;
  points: GraphPoint[];
  color?: string;
  label?: string;
}

/**
 * Active point structure for the graph
 */
export interface ActivePoint {
  timestamp: number;
  value: number;
}

/**
 * Different line styles for financial data visualization
 */
export enum GraphLineStyle {
  /**
   * Direct lines between points without any smoothing
   * Best for:
   * - Simple trend visualization
   * - Forecasted data
   * - When exact rate of change is important
   */
  Linear = "linear",

  /**
   * Smoothest curve that passes through all points
   * Best for:
   * - Long-term market trends
   * - When overall pattern is more important than exact values
   * @warning Can overshoot and create artificial extremes
   */
  Natural = "natural",

  /**
   * Balanced curve with controlled smoothing
   * Best for:
   * - Stock price charts
   * - Market indices
   * - Default choice for most financial charts
   * @recommended Default choice for market data
   */
  CatmullRom = "catmull",

  /**
   * Smooth curve that preserves data direction
   * Best for:
   * - Cumulative returns
   * - YTD performance
   * - Any monotonic data (consistently increasing/decreasing)
   * @note Prevents overshooting while maintaining smoothness
   */
  Monotone = "monotone",

  /**
   * Discrete steps between value changes
   * Best for:
   * - Account balances
   * - Transaction history
   * - Dividend payments
   * - Any discrete value changes
   */
  Step = "step",
}

/**
 * Y axis label position
 */
export enum GraphYAxisLabelPosition {
  Left = "left",
  Right = "right",
}

/**
 * Nice scale configuration
 */
export type GraphNiceScaleConfig = {
  roundTo?: number;
  method?: "auto" | "fixed";
};
