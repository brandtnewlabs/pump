import { useEffect, useState } from "react";

interface TickerData {
  progress: number; // 0 to 100
  mcap: number; // Market cap in dollars
  ath: number; // All time high in dollars
  tokenName: string; // Display name of the token
  createdAt: Date; // When the token was created
  isLoading: boolean;
}

// Helper function to get meme coin name based on ticker
const getMemeTokenInfo = (ticker: string) => {
  const memeTokens: Record<string, string> = {
    BONK: "Bonk",
    WIF: "dogwifhat",
    POPCAT: "Popcat",
    PNUT: "Peanut the Squirrel",
    GOAT: "Goatseus Maximus",
    MOODENG: "Moo Deng",
    DEFAULT: "N/A",
  };

  return memeTokens[ticker.toUpperCase()] || memeTokens.DEFAULT;
};

export const useTickerData = (ticker: string): TickerData => {
  const [data, setData] = useState<TickerData>({
    progress: 0,
    mcap: 0,
    ath: 0,
    tokenName: "",
    createdAt: new Date(),
    isLoading: true,
  });

  useEffect(() => {
    // Generate static values once based on ticker (these don't change over time)
    const hash = ticker
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Generate mock creation date (between 1 hour and 6 months ago) - static
    const maxAgeMs = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds
    const minAgeMs = 60 * 60 * 1000; // 1 hour in milliseconds
    const ageMs = minAgeMs + (hash % (maxAgeMs - minAgeMs));
    const createdAt = new Date(Date.now() - ageMs);

    // Generate mock ATH for meme coins (between 5K and 70K) - static
    const ath = 5000 + (hash % 65000);

    // Generate base market cap - static base value
    const mcapBase = 1000 + ((hash * 3) % Math.min(ath * 0.3, ath - 1000));

    // Get token name - static
    const tokenName = getMemeTokenInfo(ticker);

    // Mock data simulation function
    const simulateTickerData = () => {
      // Add some animation over time with more volatility for meme coins
      const timeOffset = Date.now() / 1000;
      const volatility =
        Math.sin(timeOffset) * (ath * 0.15) +
        Math.cos(timeOffset * 1.5) * (ath * 0.08);
      const mcap = Math.max(1000, Math.min(ath, mcapBase + volatility));

      // Calculate progress as mcap/ath ratio (0 to 100)
      const progress = (mcap / ath) * 100;

      setData({
        progress,
        mcap,
        ath,
        tokenName,
        createdAt, // This stays constant
        isLoading: false,
      });
    };

    // Initial load
    simulateTickerData();

    // Update every 2 seconds for mock animation (only mcap and progress change)
    const interval = setInterval(simulateTickerData, 2000);

    return () => clearInterval(interval);
  }, [ticker]);

  return data;
};
