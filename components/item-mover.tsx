import React from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { useTickerData } from "@/hooks/useTickerData";
import { formatCurrency } from "@/lib/currency";
import { formatAge } from "@/lib/time";

import { ProgressBar } from "./progress-bar";

interface ItemMoverProps {
  ticker: string;
}

interface LabelValueProps {
  label: string;
  value: string;
}

const LabelValue: React.FC<LabelValueProps> = ({ label, value }) => {
  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-1">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className="text-text-tertiary text-base font-semibold uppercase"
        >
          {label}
        </Text>
      </View>
      <View className="flex flex-1">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className="text-text-primary text-right text-base font-semibold"
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

export const ItemMover: React.FC<ItemMoverProps> = ({ ticker }) => {
  const { progress, mcap, ath, tokenName, createdAt, isLoading } =
    useTickerData(ticker);

  if (isLoading) {
    return null;
  }

  // Convert progress from 0-100 to 0-1 for the ProgressBar component
  const normalizedProgress = progress / 100;

  return (
    <Animated.View className="flex flex-row">
      <View className="flex flex-col gap-y-2 w-9/12 pr-2">
        <View className="flex flex-row gap-x-2">
          <View className="w-14 h-14 bg-background-tertiary rounded" />
          <View className="flex flex-1 flex-col gap-y-1 justify-center">
            <Text className="text-text-primary text-base font-semibold">
              {tokenName}
            </Text>
            <Text className="text-text-tertiary text-xs">
              ${ticker.toUpperCase()}
            </Text>
          </View>
          <View className="flex flex-1 bg-background-secondary rounded" />
        </View>
        <ProgressBar progress={normalizedProgress} springPreset="playful" />
      </View>
      <View className="flex flex-col justify-between w-3/12 -mt-1 -mb-1">
        <LabelValue label="age" value={formatAge(createdAt)} />
        <LabelValue label="mcp" value={formatCurrency(mcap)} />
        <LabelValue label="ath" value={formatCurrency(ath)} />
      </View>
    </Animated.View>
  );
};

export default ItemMover;
