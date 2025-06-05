import { useCallback, useEffect } from "react";
import { View } from "react-native";

import { ItemMover } from "@/components/item-mover";
import { TICKERS } from "@/constants/data";
import { useAppFocus } from "@/hooks/useAppFocus";
import { useScrollState } from "@/hooks/useScrollState";
import { useTickerStore } from "@/store/tickerStore";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";

// Simple interface for list items - just need ticker and unique id
interface TickerItem {
  id: string;
  ticker: string;
}

// Generate 100 items using the ticker data - moved outside component for better performance
const LIST_DATA: TickerItem[] = (() => {
  const items: TickerItem[] = [];
  for (let i = 0; i < 100; i++) {
    const ticker = TICKERS[i % TICKERS.length]; // Cycle through tickers
    items.push({
      id: `${ticker}-${i}`,
      ticker,
    });
  }
  return items;
})();

// Extract unique tickers for store initialization
const UNIQUE_TICKERS = Array.from(
  new Set(LIST_DATA.map((item) => item.ticker)),
);

export default function Screen() {
  const initializeTickers = useTickerStore((state) => state.initializeTickers);
  const isInitialized = useTickerStore((state) => state.isInitialized);
  const isPaused = useTickerStore((state) => state.isPaused);
  const pauseUpdates = useTickerStore((state) => state.pauseUpdates);
  const resumeUpdates = useTickerStore((state) => state.resumeUpdates);

  // Initialize ticker store on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeTickers(UNIQUE_TICKERS);
    }
  }, [initializeTickers, isInitialized]);

  // Cleanup on unmount - ensure updates are resumed if paused
  useEffect(() => {
    return () => {
      if (isPaused) {
        resumeUpdates("scroll");
        resumeUpdates("focus");
      }
    };
  }, [isPaused, resumeUpdates]);

  // Set up app focus detection to pause when screen/app loses focus
  useAppFocus({
    onFocusLost: () => pauseUpdates("focus"),
    onFocusGained: () => resumeUpdates("focus"),
  });

  // Set up scroll state detection with ticker store integration
  const scrollHandlers = useScrollState({
    pauseDelay: 150, // Start pausing updates 150ms after scroll begins
    resumeDelay: 400, // Resume updates 400ms after scroll ends
    onScrollStart: () => pauseUpdates("scroll"),
    onScrollEnd: () => resumeUpdates("scroll"),
  });

  const renderItem = useCallback(
    ({ item }: LegendListRenderItemProps<TickerItem>) => {
      return <ItemMover ticker={item.ticker} />;
    },
    [],
  );

  const keyExtractor = useCallback((item: TickerItem) => item.id, []);

  const ItemSeparatorComponent = useCallback(
    () => <View className="h-4" />,
    [],
  );

  return (
    <View className="flex flex-1 flex-col bg-background-primary">
      <LegendList
        data={LIST_DATA}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        recycleItems={true}
        maintainVisibleContentPosition
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 4 }}
        ItemSeparatorComponent={ItemSeparatorComponent}
        onScrollBeginDrag={scrollHandlers.onScrollBeginDrag}
        onScrollEndDrag={scrollHandlers.onScrollEndDrag}
        onMomentumScrollEnd={scrollHandlers.onMomentumScrollEnd}
      />
    </View>
  );
}
