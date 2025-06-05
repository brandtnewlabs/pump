import { GraphPoint, GraphSeries } from "@/types/graph";

/**
 * Configuration for generating mock price data
 */
interface MockDataConfig {
  /** Number of data points to generate (default: 48 for 24 hours with 30min intervals) */
  dataPoints?: number;
  /** Starting price for the ticker (will use reasonable default if not provided) */
  basePrice?: number;
  /** Maximum volatility percentage (default: 15% up or down) */
  volatility?: number;
  /** Overall trend direction (-1 to 1, where -1 is bearish, 1 is bullish, 0 is neutral) */
  trend?: number;
  /** Time span in milliseconds (default: 24 hours) */
  timeSpan?: number;
}

/**
 * Generates realistic mock price data for a cryptocurrency ticker
 *
 * Creates a realistic price series with:
 * - Natural price volatility within specified bounds
 * - Trending behavior (bullish/bearish/neutral)
 * - Realistic timestamp progression
 * - Compatible with GraphSeries interface
 *
 * @param ticker - The cryptocurrency ticker symbol
 * @param config - Configuration options for data generation
 * @returns GraphSeries compatible with the Graph component
 */
export function generateMockPriceData(
  ticker: string,
  config: MockDataConfig = {},
): GraphSeries {
  const {
    dataPoints = 48, // 48 points for 24 hours (30min intervals)
    basePrice = getBasePriceForTicker(ticker),
    volatility = 0.15, // 15% max volatility
    trend = 0, // Neutral trend by default
    timeSpan = 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  } = config;

  const now = Date.now();
  const intervalMs = timeSpan / (dataPoints - 1);
  const points: GraphPoint[] = [];

  let currentPrice = basePrice;
  const trendFactor = trend * 0.02; // Convert trend to a small price influence per step

  for (let i = 0; i < dataPoints; i++) {
    const timestamp = now - timeSpan + i * intervalMs;

    // Generate price change with volatility and trend
    const randomChange = (Math.random() - 0.5) * 2; // -1 to 1
    const volatilityFactor = volatility * randomChange;
    const changePercent = volatilityFactor + trendFactor;

    // Apply price change
    currentPrice = currentPrice * (1 + changePercent);

    // Ensure price doesn't go negative (crypto can't have negative prices)
    currentPrice = Math.max(currentPrice, basePrice * 0.1);

    points.push({
      timestamp,
      value: currentPrice,
    });
  }

  return {
    id: `${ticker.toLowerCase()}-price`,
    points,
    label: `${ticker.toUpperCase()} Price`,
    color: "lightGreen", // Green color for the price chart
  };
}

/**
 * Returns a reasonable base price for common tickers
 * Used when no base price is provided
 */
function getBasePriceForTicker(ticker: string): number {
  const tickerUpper = ticker.toUpperCase();

  // Common cryptocurrency price ranges
  const priceMap: Record<string, number> = {
    BTC: 45000,
    ETH: 2800,
    SOL: 95,
    ADA: 0.45,
    DOT: 6.2,
    AVAX: 28,
    MATIC: 0.85,
    LINK: 14.5,
    UNI: 7.2,
    ATOM: 9.8,
  };

  // Return mapped price or generate a reasonable random price
  return priceMap[tickerUpper] || generateRandomPrice();
}

/**
 * Generates a random but reasonable cryptocurrency price
 * Covers the typical range from altcoins to major tokens
 */
function generateRandomPrice(): number {
  // Generate prices in realistic ranges:
  // 60% chance: $0.10 - $50 (most altcoins)
  // 30% chance: $50 - $500 (mid-cap tokens)
  // 10% chance: $500 - $5000 (major tokens)

  const rand = Math.random();

  if (rand < 0.6) {
    // Most altcoins: $0.10 - $50
    return Math.random() * 49.9 + 0.1;
  } else if (rand < 0.9) {
    // Mid-cap tokens: $50 - $500
    return Math.random() * 450 + 50;
  } else {
    // Major tokens: $500 - $5000
    return Math.random() * 4500 + 500;
  }
}

/**
 * Creates mock graph data with trend aligned to progress data
 *
 * @param ticker - The cryptocurrency ticker
 * @param progress - Progress percentage (0-100) to align trend with
 * @param basePrice - Optional base price override
 * @returns GraphSeries with trend matching progress direction
 */
export function generateAlignedMockData(
  ticker: string,
  progress: number,
  basePrice?: number,
): GraphSeries {
  // Convert progress to trend direction
  // progress 0-40: bearish trend (-1 to -0.2)
  // progress 40-60: neutral trend (-0.2 to 0.2)
  // progress 60-100: bullish trend (0.2 to 1)

  let trend: number;
  if (progress < 40) {
    trend = -1 + (progress / 40) * 0.8; // -1 to -0.2
  } else if (progress <= 60) {
    trend = -0.2 + ((progress - 40) / 20) * 0.4; // -0.2 to 0.2
  } else {
    trend = 0.2 + ((progress - 60) / 40) * 0.8; // 0.2 to 1
  }

  return generateMockPriceData(ticker, {
    trend,
    basePrice,
    volatility: 0.12, // Slightly less volatile for aligned data
  });
}
