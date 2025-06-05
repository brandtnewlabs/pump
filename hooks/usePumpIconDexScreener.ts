import { UseQueryOptions, useQuery } from "@tanstack/react-query";

// Re-export the interface for convenience
export interface PumpTokenMeta {
  name: string;
  symbol: string;
  image: string;
  mint: string;
}

// Enhanced error types for better error handling
export interface PumpIconError {
  type: "network" | "api" | "not_found" | "invalid_response" | "rate_limit";
  message: string;
  originalError?: unknown;
  ticker?: string;
}

/**
 * Helper function to make fetch requests with timeout and proper error handling
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Core function to fetch pump token metadata from DexScreener API
 * DexScreener has excellent coverage of Solana meme coins and is free
 */
async function fetchPumpIcon(ticker: string): Promise<PumpTokenMeta | null> {
  if (!ticker || typeof ticker !== "string" || ticker.trim() === "") {
    throw new Error("Invalid ticker provided");
  }

  const normalizedTicker = ticker.trim().toUpperCase();

  try {
    // Use DexScreener API - free and excellent for Solana meme coins
    const searchUrl = `https://api.dexscreener.com/latest/dex/search/?q=${normalizedTicker}`;

    const searchResponse = await fetchWithTimeout(searchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!searchResponse.ok) {
      if (searchResponse.status === 429) {
        const pumpError: PumpIconError = {
          type: "rate_limit",
          message: "API rate limit exceeded. Please try again later.",
          originalError: new Error(`HTTP ${searchResponse.status}`),
          ticker: normalizedTicker,
        };
        throw pumpError;
      }

      if (searchResponse.status >= 400 && searchResponse.status < 500) {
        const pumpError: PumpIconError = {
          type: "api",
          message: `API error: ${searchResponse.status} - ${searchResponse.statusText}`,
          originalError: new Error(`HTTP ${searchResponse.status}`),
          ticker: normalizedTicker,
        };
        throw pumpError;
      }

      throw new Error(
        `HTTP ${searchResponse.status}: ${searchResponse.statusText}`,
      );
    }

    const data = await searchResponse.json();

    // Find Solana token with matching symbol
    const solanaToken = data.pairs?.find(
      (pair: any) =>
        pair.chainId === "solana" &&
        (pair.baseToken?.symbol?.toUpperCase() === normalizedTicker ||
          pair.quoteToken?.symbol?.toUpperCase() === normalizedTicker),
    );

    if (!solanaToken) {
      return null;
    }

    // Determine which token matches our symbol
    const isBaseToken =
      solanaToken.baseToken?.symbol?.toUpperCase() === normalizedTicker;
    const tokenInfo = isBaseToken
      ? solanaToken.baseToken
      : solanaToken.quoteToken;

    if (!tokenInfo) {
      return null;
    }

    // Extract image URL from the info object which contains imageUrl
    const imageUrl = solanaToken.info?.imageUrl || tokenInfo.logo || "";

    const result = {
      name: tokenInfo.name || normalizedTicker,
      symbol: tokenInfo.symbol || normalizedTicker,
      image: imageUrl,
      mint: tokenInfo.address || "",
    };

    return result;
  } catch (error) {
    console.error(
      `[fetchPumpIcon] Error caught for ${normalizedTicker}:`,
      error,
    );

    // Enhanced error handling for fetch-specific errors
    if (error instanceof Error) {
      // Handle AbortError (timeout)
      if (error.name === "AbortError") {
        const pumpError: PumpIconError = {
          type: "network",
          message: "Request timeout. Please check your connection.",
          originalError: error,
          ticker: normalizedTicker,
        };
        throw pumpError;
      }

      // Handle network errors (no internet, DNS issues, etc.)
      if (
        error.message.includes("fetch") ||
        error.message.includes("network")
      ) {
        const pumpError: PumpIconError = {
          type: "network",
          message: "Network error occurred while fetching token data.",
          originalError: error,
          ticker: normalizedTicker,
        };
        throw pumpError;
      }
    }

    // If it's already a PumpIconError, re-throw it
    if (error && typeof error === "object" && "type" in error) {
      throw error;
    }

    // Generic error fallback
    const pumpError: PumpIconError = {
      type: "network",
      message: "An unexpected error occurred while fetching token data.",
      originalError: error,
      ticker: normalizedTicker,
    };
    throw pumpError;
  }
}

/**
 * Options for the usePumpIconDexScreener hook
 */
export interface UsePumpIconOptions {
  /** Whether to enable the query (default: true) */
  enabled?: boolean;
  /** Custom stale time in milliseconds (overrides default 24h) */
  staleTime?: number;
  /** Custom cache time in milliseconds (overrides default 48h) */
  gcTime?: number;
}

/**
 * Hook to fetch pump token icon and metadata using DexScreener API
 *
 * Features:
 * - Uses DexScreener API (free, excellent for meme coins)
 * - 24-hour cache by default (token metadata rarely changes)
 * - Request deduplication (multiple calls for same ticker = single request)
 * - Exponential backoff retry logic
 * - Proper error handling with typed errors
 * - Loading and error states
 *
 * @param ticker - The token ticker symbol (e.g., "PNUT", "PEPE")
 * @param options - Optional configuration
 */
export function usePumpIconDexScreener(
  ticker: string,
  options: UsePumpIconOptions = {},
) {
  const {
    enabled = true,
    staleTime = 24 * 60 * 60 * 1000, // 24 hours default
    gcTime = 48 * 60 * 60 * 1000, // 48 hours default
  } = options;

  const queryOptions: UseQueryOptions<
    PumpTokenMeta | null,
    PumpIconError,
    PumpTokenMeta | null,
    string[]
  > = {
    queryKey: ["pumpIconDexScreener", ticker?.toLowerCase() || ""],
    queryFn: () => fetchPumpIcon(ticker),
    enabled: enabled && !!ticker,
    staleTime,
    gcTime,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) or rate limits
      if (error && typeof error === "object" && "type" in error) {
        const pumpError = error as PumpIconError;
        if (pumpError.type === "api" || pumpError.type === "rate_limit") {
          return false;
        }
      }
      // Retry up to 3 times for network errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  };

  return useQuery(queryOptions);
}
