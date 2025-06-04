import React, { useMemo } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { useTickerData } from "@/hooks/useTickerData";
import { formatCurrency } from "@/lib/currency";
import { formatAge } from "@/lib/time";

import { LabelValue } from "./label-value";
import { ProgressBar } from "./progress-bar";

interface ItemMoverProps {
  /** The ticker symbol for the cryptocurrency/token */
  ticker: string;
}

/**
 * ItemMover Component
 *
 * Displays comprehensive information about a cryptocurrency token including:
 * - Token name, ticker symbol, and placeholder logo
 * - Progress bar showing completion towards a milestone
 * - Age, market cap, and all-time high metrics
 *
 * Optimized for performance with React.memo and memoized calculations.
 * Layout uses a 3:1 ratio split between main content and metrics.
 */
export const ItemMover = React.memo<ItemMoverProps>(({ ticker }) => {
  // Fetch all ticker-related data using our custom hook
  const { progress, mcap, ath, tokenName, createdAt, isLoading } =
    useTickerData(ticker);

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
            <View className="h-14 w-14 animate-pulse rounded bg-background-tertiary" />
            <View className="flex flex-1 flex-col justify-center gap-y-1">
              <View className="h-4 animate-pulse rounded bg-background-tertiary" />
              <View className="h-3 w-16 animate-pulse rounded bg-background-tertiary" />
            </View>
            <View className="flex flex-1 animate-pulse rounded bg-background-secondary" />
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
        {/* Token header section with logo, name, and action area */}
        <View className="flex flex-row gap-x-2">
          {/* Token logo placeholder - 56x56px (w-14 h-14) */}
          <View className="h-14 w-14 rounded bg-background-tertiary" />

          {/* Token identification section */}
          <View className="flex flex-1 flex-col justify-center gap-y-1">
            <Text className="text-base font-semibold text-text-primary">
              {tokenName}
            </Text>
            <Text className="text-xs text-text-tertiary">
              ${memoizedValues.upperTicker}
            </Text>
          </View>

          {/* Action/interaction area - placeholder for future features */}
          <View className="flex flex-1 rounded bg-background-secondary" />
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
