import { create } from "zustand";

import { MEME_TOKENS } from "@/constants/data";

const UPDATE_INTERVAL_MS = 1000;

/**
 * Represents the real-time data for a cryptocurrency ticker
 */
interface TickerData {
  /** Current progress percentage (0-100) representing market cap vs ATH */
  progress: number;
  /** Current market capitalization in USD */
  mcap: number;
  /** All-time high market cap in USD */
  ath: number;
  /** Display name of the token (e.g., "Dogecoin", "Pepe") */
  tokenName: string;
  /** Timestamp when the token was created/launched */
  createdAt: Date;
  /** Loading state indicator for UI components */
  isLoading: boolean;
}

/**
 * Zustand store interface for managing multiple cryptocurrency tickers
 * Provides real-time updates, pause/resume functionality, and centralized state management
 */
interface TickerStore {
  /** Map of ticker symbols to their current data */
  tickerData: Record<string, TickerData>;
  /** Whether the store has been initialized with ticker data */
  isInitialized: boolean;
  /** Global pause state for all ticker updates */
  isPaused: boolean;
  /** Set of reasons why updates are paused (allows multiple pause sources) */
  pauseReasons: Set<string>;

  /**
   * Initialize the store with a list of ticker symbols
   * Sets up mock data and starts the update interval
   */
  initializeTickers: (tickers: string[]) => void;

  /**
   * Update all ticker data with new simulated values
   * Called automatically by the update interval when not paused
   */
  updateTickerData: () => void;

  /**
   * Get ticker data for a specific symbol, with fallback for missing data
   */
  getTickerData: (ticker: string) => TickerData;

  /**
   * Pause ticker updates with an optional reason
   * Allows multiple pause sources to coexist
   */
  pauseUpdates: (reason?: string) => void;

  /**
   * Resume ticker updates by removing a specific pause reason
   * Only resumes when all pause reasons are cleared
   */
  resumeUpdates: (reason?: string) => void;
}

/**
 * Helper function to get meme coin display name based on ticker symbol
 * Falls back to DEFAULT if ticker is not found in the constants
 *
 * @param ticker - The ticker symbol (e.g., "DOGE", "PEPE")
 * @returns The display name for the token
 */
const getMemeTokenInfo = (ticker: string) => {
  return MEME_TOKENS[ticker.toUpperCase()] || MEME_TOKENS.DEFAULT;
};

/**
 * Cache for static ticker data to avoid recalculating deterministic values
 * This ensures consistent mock data across app sessions for the same tickers
 */
const staticTickerCache = new Map<
  string,
  {
    ath: number;
    tokenName: string;
    createdAt: Date;
    mcapBase: number;
  }
>();

/**
 * Generate or retrieve cached static data for a ticker symbol
 * Creates deterministic mock data based on ticker hash to ensure consistency
 *
 * @param ticker - The ticker symbol to generate data for
 * @returns Static ticker data including ATH, token name, creation date, and base market cap
 */
const getStaticTickerData = (ticker: string) => {
  // Return cached data if already computed
  if (staticTickerCache.has(ticker)) {
    return staticTickerCache.get(ticker)!;
  }

  // Generate a pseudo-random hash from ticker string for deterministic randomness
  const hash = ticker
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Generate mock creation date (between 1 hour and 6 months ago)
  const maxAgeMs = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds
  const minAgeMs = 60 * 60 * 1000; // 1 hour in milliseconds
  const ageMs = minAgeMs + (hash % (maxAgeMs - minAgeMs));
  const createdAt = new Date(Date.now() - ageMs);

  // Generate mock ATH (between $5K and $70K)
  const ath = 5000 + (hash % 65000);

  // Generate base market cap (starting point for volatility simulation)
  // Ensures base is always less than ATH with some reasonable range
  const mcapBase = 1000 + ((hash * 3) % Math.min(ath * 0.3, ath - 1000));

  const tokenName = getMemeTokenInfo(ticker);

  const data = { ath, tokenName, createdAt, mcapBase };

  // Cache the data to ensure consistency
  staticTickerCache.set(ticker, data);
  return data;
};

/**
 * Global interval ID for managing the single update cycle
 * Using a single interval for all tickers improves performance and synchronization
 */
let globalUpdateInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Main Zustand store for ticker data management
 * Provides real-time cryptocurrency ticker simulation with pause/resume functionality
 */
export const useTickerStore = create<TickerStore>((set, get) => ({
  tickerData: {},
  isInitialized: false,
  isPaused: false,
  pauseReasons: new Set(),

  initializeTickers: (tickers: string[]) => {
    const tickerData: Record<string, TickerData> = {};

    // Initialize all ticker data at once to avoid multiple re-renders
    tickers.forEach((ticker) => {
      const staticData = getStaticTickerData(ticker);

      // Calculate initial progress based on the ratio of base market cap to ATH
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

    // Clean up any existing interval before starting a new one
    if (globalUpdateInterval) {
      clearInterval(globalUpdateInterval);
    }

    // Start the global update cycle (runs every second)
    globalUpdateInterval = setInterval(() => {
      const { isPaused } = get();
      // Only update if not paused
      if (!isPaused) {
        get().updateTickerData();
      }
    }, UPDATE_INTERVAL_MS);
  },

  updateTickerData: () => {
    const { tickerData } = get();
    const timeOffset = Date.now() / 1000; // Current time in seconds for smoother animation
    const updatedData: Record<string, TickerData> = {};

    // Update each ticker with new simulated market data
    Object.entries(tickerData).forEach(([ticker, data]) => {
      const staticData = getStaticTickerData(ticker);

      // Create realistic market volatility using sine and cosine waves
      // Different frequencies and ticker-specific offsets create unique patterns
      const volatility =
        Math.sin(timeOffset + ticker.length) * (staticData.ath * 0.1) +
        Math.cos(timeOffset * 1.2 + ticker.length) * (staticData.ath * 0.05);

      // Apply volatility to base market cap, ensuring it stays within realistic bounds
      const mcap = Math.max(
        1000, // Minimum market cap floor
        Math.min(staticData.ath, staticData.mcapBase + volatility), // Maximum is ATH
      );

      // Calculate progress percentage for progress bars/indicators
      const progress = (mcap / staticData.ath) * 100;

      // Create updated ticker data, preserving static fields
      updatedData[ticker] = {
        progress,
        mcap,
        ath: data.ath,
        tokenName: data.tokenName,
        createdAt: data.createdAt,
        isLoading: data.isLoading,
      };
    });

    // Update store with all new data at once
    set({ tickerData: updatedData });
  },

  getTickerData: (ticker: string) => {
    const { tickerData } = get();

    // Return existing data or fallback with loading state
    return (
      tickerData[ticker] || {
        progress: 0,
        mcap: 0,
        ath: 0,
        tokenName: getMemeTokenInfo(ticker),
        createdAt: new Date(),
        isLoading: true, // Indicates data is not yet available
      }
    );
  },

  pauseUpdates: (reason = "unknown") => {
    const { pauseReasons } = get();
    const newReasons = new Set(pauseReasons);
    newReasons.add(reason);

    set({
      isPaused: true,
      pauseReasons: newReasons,
    });
  },

  resumeUpdates: (reason = "unknown") => {
    const { pauseReasons } = get();
    const newReasons = new Set(pauseReasons);
    newReasons.delete(reason);

    // Only resume if no other pause reasons remain
    // This allows multiple components to pause/resume independently
    const shouldResume = newReasons.size === 0;

    set({
      isPaused: !shouldResume,
      pauseReasons: newReasons,
    });

    // Trigger an immediate update when fully resuming to avoid stale data
    // This ensures users see fresh data immediately after resuming
    if (shouldResume) {
      const store = get();
      if (store.isInitialized) {
        store.updateTickerData();
      }
    }
  },
}));

/**
 * Cleanup function to clear the global update interval
 * Should be called when the app unmounts or the store is no longer needed
 * Prevents memory leaks from running intervals
 */
export const cleanupTickerStore = () => {
  if (globalUpdateInterval) {
    clearInterval(globalUpdateInterval);
    globalUpdateInterval = null;
  }
};
