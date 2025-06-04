import { create } from "zustand";

import { MEME_TOKENS } from "@/constants/data";

interface TickerData {
  progress: number; // 0 to 100
  mcap: number; // Market cap in dollars
  ath: number; // All time high in dollars
  tokenName: string; // Display name of the token
  createdAt: Date; // When the token was created
  isLoading: boolean;
}

interface TickerStore {
  tickerData: Record<string, TickerData>;
  isInitialized: boolean;
  initializeTickers: (tickers: string[]) => void;
  updateTickerData: () => void;
  getTickerData: (ticker: string) => TickerData;
}

// Helper function to get meme coin name based on ticker
const getMemeTokenInfo = (ticker: string) => {
  return MEME_TOKENS[ticker.toUpperCase()] || MEME_TOKENS.DEFAULT;
};

// Cache for static ticker data to avoid recalculation
const staticTickerCache = new Map<
  string,
  {
    ath: number;
    tokenName: string;
    createdAt: Date;
    mcapBase: number;
  }
>();

const getStaticTickerData = (ticker: string) => {
  if (staticTickerCache.has(ticker)) {
    return staticTickerCache.get(ticker)!;
  }

  // Generate static values once based on ticker hash
  const hash = ticker
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Generate mock creation date (between 1 hour and 6 months ago)
  const maxAgeMs = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months
  const minAgeMs = 60 * 60 * 1000; // 1 hour
  const ageMs = minAgeMs + (hash % (maxAgeMs - minAgeMs));
  const createdAt = new Date(Date.now() - ageMs);

  // Generate mock ATH (between 5K and 70K)
  const ath = 5000 + (hash % 65000);

  // Generate base market cap
  const mcapBase = 1000 + ((hash * 3) % Math.min(ath * 0.3, ath - 1000));

  const tokenName = getMemeTokenInfo(ticker);

  const data = { ath, tokenName, createdAt, mcapBase };
  staticTickerCache.set(ticker, data);
  return data;
};

// Global interval ID to manage single update cycle
let globalUpdateInterval: ReturnType<typeof setInterval> | null = null;

export const useTickerStore = create<TickerStore>((set, get) => ({
  tickerData: {},
  isInitialized: false,

  initializeTickers: (tickers: string[]) => {
    const tickerData: Record<string, TickerData> = {};

    // Initialize all ticker data at once
    tickers.forEach((ticker) => {
      const staticData = getStaticTickerData(ticker);
      const initialProgress = (staticData.mcapBase / staticData.ath) * 100;

      tickerData[ticker] = {
        progress: initialProgress,
        mcap: staticData.mcapBase,
        ath: staticData.ath,
        tokenName: staticData.tokenName,
        createdAt: staticData.createdAt,
        isLoading: false,
      };
    });

    set({ tickerData, isInitialized: true });

    // Start single global update interval
    if (globalUpdateInterval) {
      clearInterval(globalUpdateInterval);
    }

    globalUpdateInterval = setInterval(() => {
      get().updateTickerData();
    }, 1000);
  },

  updateTickerData: () => {
    const { tickerData } = get();
    const timeOffset = Date.now() / 1000;
    const updatedData: Record<string, TickerData> = {};

    Object.entries(tickerData).forEach(([ticker, data]) => {
      const staticData = getStaticTickerData(ticker);

      const volatility =
        Math.sin(timeOffset + ticker.length) * (staticData.ath * 0.1) +
        Math.cos(timeOffset * 1.2 + ticker.length) * (staticData.ath * 0.05);

      const mcap = Math.max(
        1000,
        Math.min(staticData.ath, staticData.mcapBase + volatility),
      );
      const progress = (mcap / staticData.ath) * 100;

      updatedData[ticker] = {
        progress,
        mcap,
        ath: data.ath,
        tokenName: data.tokenName,
        createdAt: data.createdAt,
        isLoading: data.isLoading,
      };
    });

    set({ tickerData: updatedData });
  },

  getTickerData: (ticker: string) => {
    const { tickerData } = get();
    return (
      tickerData[ticker] || {
        progress: 0,
        mcap: 0,
        ath: 0,
        tokenName: getMemeTokenInfo(ticker),
        createdAt: new Date(),
        isLoading: true,
      }
    );
  },
}));

// Cleanup function for when the app unmounts
export const cleanupTickerStore = () => {
  if (globalUpdateInterval) {
    clearInterval(globalUpdateInterval);
    globalUpdateInterval = null;
  }
};
