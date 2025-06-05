import React, { useMemo } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { useTickerData } from "@/hooks/useTickerData";
import { useTickerGraphData } from "@/hooks/useTickerGraphData";
import { formatCurrency } from "@/lib/currency";
import { formatAge } from "@/lib/time";
import { GraphDisplayMode } from "@/types/graph";

import { Graph } from "./graph";
import { LabelValue } from "./label-value";
import { ProgressBar } from "./progress-bar";
import { TokenIcon } from "./token-icon";

interface ItemMoverProps {
  /** The ticker symbol for the cryptocurrency/token */
  ticker: string;
}

/**
 * ItemMover Component
 *
 * Displays comprehensive information about a cryptocurrency token including:
 * - Token name, ticker symbol, and real token logo via TokenIcon
 * - Progress bar showing completion towards a milestone
 * - Mini price chart showing recent price movements via Graph component
 * - Age, market cap, and all-time high metrics
 *
 * Optimized for performance with React.memo and memoized calculations.
 * Layout uses a 3:1 ratio split between main content and metrics.
 * Now features real token icons loaded from DexScreener API with caching.
 * Graph integration shows 24-hour price trends aligned with progress data.
 */
export const ItemMover = React.memo<ItemMoverProps>(({ ticker }) => {
  // Fetch all ticker-related data using our custom hook
  const { progress, mcap, ath, tokenName, createdAt, isLoading } =
    useTickerData(ticker);

  // Fetch graph data for the mini price chart
  const { graphData, isLoading: graphLoading } = useTickerGraphData(ticker);

  // Memoize expensive calculations to prevent unnecessary re-computations
  const memoizedValues = useMemo(() => {
    // Convert progress from percentage (0-100) to normalized value (0-1) for ProgressBar
    // Clamp to 1 to prevent overflow visualization
    const normalizedProgress = Math.min(progress / 100, 1);

    // Pre-format display values to avoid recalculation on each render
    const formattedAge = formatAge(createdAt);
    const formattedMcap = formatCurrency(mcap);
    const formattedAth = formatCurrency(ath);
    const upperTicker = ticker.toUpperCase();

    return {
      normalizedProgress,
      formattedAge,
      formattedMcap,
      formattedAth,
      upperTicker,
    };
  }, [progress, createdAt, mcap, ath, ticker]);

  // Early return for loading state to prevent flash of incomplete content
  if (isLoading) {
    return (
      <Animated.View className="flex flex-row opacity-50">
        {/* Loading skeleton matching the actual layout structure */}
        <View className="flex w-9/12 flex-col gap-y-2 pr-2">
          <View className="flex flex-row gap-x-2">
            {/* Token icon with loading state */}
            <TokenIcon
              ticker={ticker}
              size="lg"
              showLoading={true}
              enabled={false} // Don't fetch during ticker data loading
            />
            <View className="flex flex-1 flex-col justify-center gap-y-1">
              <View className="h-4 animate-pulse rounded bg-background-tertiary" />
              <View className="h-3 w-16 animate-pulse rounded bg-background-tertiary" />
            </View>
            {/* Graph loading skeleton */}
            <View className="flex h-12 flex-1 animate-pulse rounded bg-background-secondary" />
          </View>
          <View className="h-1 animate-pulse rounded bg-background-tertiary" />
        </View>
        <View className="-mb-1 -mt-1 flex w-3/12 flex-col justify-between">
          <View className="h-8 animate-pulse rounded bg-background-tertiary" />
          <View className="h-8 animate-pulse rounded bg-background-tertiary" />
          <View className="h-8 animate-pulse rounded bg-background-tertiary" />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View className="flex flex-row">
      {/* Main content area - 75% width (9/12) */}
      <View className="flex w-9/12 flex-col gap-y-2 pr-2">
        {/* Token header section with logo, name, and mini price chart */}
        <View className="flex flex-row gap-x-2">
          {/* Real token logo with fallback - 56x56px (lg size) */}
          <TokenIcon
            ticker={ticker}
            size="lg"
            showLoading={true}
            showError={true}
            enabled={true}
          />

          {/* Token identification section */}
          <View className="flex flex-1 flex-col justify-center gap-y-1">
            <Text className="text-base font-semibold text-text-primary">
              {tokenName}
            </Text>
            <Text className="text-xs text-text-tertiary">
              ${memoizedValues.upperTicker}
            </Text>
          </View>

          {/* Mini price chart - replaces the placeholder */}
          <View className="flex h-12 flex-1 bg-transparent">
            <Graph
              series={graphData}
              loading={graphLoading}
              displayMode={GraphDisplayMode.Currency}
              strokeWidth={1.5}
              graphVerticalPadding={5}
              graphHorizontalPadding={2}
              withAreaGradient={true}
              withLabelsYAxis={false}
              withLabelsXAxis={false}
              withGridLines={false}
              withCursor={false}
              withPanGesture={false}
              withLegend={false}
            />
          </View>
        </View>

        {/* Progress visualization - shows completion towards milestone */}
        <ProgressBar
          height={4}
          progress={memoizedValues.normalizedProgress}
          springPreset="playful"
        />
      </View>

      {/* Metrics sidebar - 25% width (3/12) with negative margins for alignment */}
      <View className="-mb-1 -mt-1 flex w-3/12 flex-col justify-between">
        {/* Key performance indicators displayed vertically */}
        <LabelValue label="age" value={memoizedValues.formattedAge} />
        <LabelValue label="mcp" value={memoizedValues.formattedMcap} />
        <LabelValue label="ath" value={memoizedValues.formattedAth} />
      </View>
    </Animated.View>
  );
});

// Display name for React DevTools debugging
ItemMover.displayName = "ItemMover";

export default ItemMover;
