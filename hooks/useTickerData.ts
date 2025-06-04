import { useTickerStore } from "@/store/tickerStore";

interface TickerData {
  progress: number; // 0 to 100
  mcap: number; // Market cap in dollars
  ath: number; // All time high in dollars
  tokenName: string; // Display name of the token
  createdAt: Date; // When the token was created
  isLoading: boolean;
}

export const useTickerData = (ticker: string): TickerData => {
  const tickerData = useTickerStore((state) => state.tickerData[ticker]);

  if (!tickerData) {
    return {
      progress: 0,
      mcap: 0,
      ath: 0,
      tokenName: "Meme Token",
      createdAt: new Date(),
      isLoading: true,
    };
  }

  return tickerData;
};
