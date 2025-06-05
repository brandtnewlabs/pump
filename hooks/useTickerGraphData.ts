import { useMemo } from "react";

import {
  generateAlignedMockData,
  generateMockPriceData,
} from "@/lib/mock-graph-data";
import { GraphSeries } from "@/types/graph";

import { useTickerData } from "./useTickerData";

/**
 * Hook return type for ticker graph data
 */
interface UseTickerGraphDataReturn {
  /** Graph series data ready for the Graph component */
  graphData: GraphSeries[];
  /** Loading state - true when either ticker data or graph data is loading */
  isLoading: boolean;
  /** Error state - if there's an issue fetching or generating data */
  error: Error | null;
}

/**
 * Custom hook for fetching/generating graph data for a cryptocurrency ticker
 *
 * Currently uses mock data generation that:
 * - Aligns trend with progress data from useTickerData
 * - Creates realistic price movements over 24 hours
 * - Provides data compatible with the Graph component
 *
 * Future enhancement: Replace mock data with real API calls
 *
 * @param ticker - The cryptocurrency ticker symbol
 * @returns Graph data and loading states
 */
export function useTickerGraphData(ticker: string): UseTickerGraphDataReturn {
  // Get existing ticker data to align graph trends
  const { progress, isLoading: tickerLoading } = useTickerData(ticker);

  // Generate graph data based on ticker information
  const graphData = useMemo(() => {
    // Don't generate graph data while ticker data is still loading
    if (tickerLoading) {
      return [];
    }

    try {
      // Generate mock data aligned with progress trends
      const series = generateAlignedMockData(ticker, progress);

      return [series];
    } catch (error) {
      console.error(`Error generating graph data for ${ticker}:`, error);
      return [];
    }
  }, [ticker, progress, tickerLoading]);

  // Determine loading state
  const isLoading = useMemo(() => {
    return tickerLoading || graphData.length === 0;
  }, [tickerLoading, graphData.length]);

  return {
    graphData,
    isLoading,
    error: null, // No error handling for mock data, but ready for real API
  };
}

/**
 * Extended hook with additional configuration options
 *
 * @param ticker - The cryptocurrency ticker symbol
 * @param options - Additional configuration options
 * @returns Graph data with extended configuration
 */
interface UseTickerGraphDataOptions {
  /** Override the base price for graph generation */
  basePrice?: number;
  /** Custom volatility level (0-1, default: 0.12) */
  volatility?: number;
  /** Force specific trend regardless of progress (-1 to 1) */
  forceTrend?: number;
  /** Number of data points to generate (default: 48) */
  dataPoints?: number;
  /** Disable graph data generation entirely */
  disabled?: boolean;
}

export function useTickerGraphDataExtended(
  ticker: string,
  options: UseTickerGraphDataOptions = {},
): UseTickerGraphDataReturn {
  const {
    basePrice,
    volatility = 0.12,
    forceTrend,
    dataPoints = 48,
    disabled = false,
  } = options;

  // Get existing ticker data
  const { progress, isLoading: tickerLoading } = useTickerData(ticker);

  // Generate graph data with extended options
  const graphData = useMemo(() => {
    if (tickerLoading || disabled) {
      return [];
    }

    try {
      let series: GraphSeries;

      if (forceTrend !== undefined) {
        // Use forced trend instead of progress-based trend
        series = generateMockPriceData(ticker, {
          trend: forceTrend,
          basePrice,
          volatility,
          dataPoints,
        });
      } else {
        // Use progress-aligned trend (default behavior)
        series = generateAlignedMockData(ticker, progress, basePrice);
      }

      return [series];
    } catch (error) {
      console.error(
        `Error generating extended graph data for ${ticker}:`,
        error,
      );
      return [];
    }
  }, [
    ticker,
    progress,
    tickerLoading,
    disabled,
    basePrice,
    volatility,
    forceTrend,
    dataPoints,
  ]);

  const isLoading = useMemo(() => {
    return tickerLoading || (graphData.length === 0 && !disabled);
  }, [tickerLoading, graphData.length, disabled]);

  return {
    graphData,
    isLoading,
    error: null,
  };
}
