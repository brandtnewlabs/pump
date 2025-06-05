import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

import { usePumpIconDexScreener } from "@/hooks/usePumpIconDexScreener";
import { cn } from "@/lib/cn";

/**
 * Size variants for the TokenIcon component
 */
const SIZE_VARIANTS = {
  sm: {
    container: "h-8 w-8",
    text: "text-xs",
    imageSize: 32,
  },
  md: {
    container: "h-12 w-12",
    text: "text-sm",
    imageSize: 48,
  },
  lg: {
    container: "h-14 w-14",
    text: "text-base",
    imageSize: 56,
  },
  xl: {
    container: "h-16 w-16",
    text: "text-lg",
    imageSize: 64,
  },
} as const;

export type TokenIconSize = keyof typeof SIZE_VARIANTS;

/**
 * Props for the TokenIcon component
 */
export interface TokenIconProps {
  /** The token ticker symbol (e.g., "PNUT", "PEPE") */
  ticker: string;
  /** Size variant for the icon */
  size?: TokenIconSize;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show a loading skeleton (default: true) */
  showLoading?: boolean;
  /** Whether to show error states (default: true) */
  showError?: boolean;
  /** Custom fallback component when no image is available */
  fallback?: React.ReactNode;
  /** Whether to enable the query (default: true) */
  enabled?: boolean;
}

/**
 * Loading skeleton component for TokenIcon
 */
function TokenIconSkeleton({
  size,
  className,
}: {
  size: TokenIconSize;
  className?: string;
}) {
  const sizeConfig = SIZE_VARIANTS[size];

  return (
    <View
      className={cn(
        sizeConfig.container,
        "animate-pulse rounded-full bg-background-tertiary",
        className,
      )}
    />
  );
}

/**
 * Error fallback component for TokenIcon
 */
function TokenIconError({
  ticker,
  size,
  className,
}: {
  ticker: string;
  size: TokenIconSize;
  className?: string;
}) {
  const sizeConfig = SIZE_VARIANTS[size];
  const initials = ticker.slice(0, 2).toUpperCase();

  return (
    <View
      className={cn(
        sizeConfig.container,
        "border-base-700 items-center justify-center rounded-full border bg-background-secondary",
        className,
      )}
    >
      <Text className={cn(sizeConfig.text, "font-semibold text-text-tertiary")}>
        {initials}
      </Text>
    </View>
  );
}

/**
 * Default fallback component for TokenIcon when no image is available
 */
function TokenIconFallback({
  ticker,
  size,
  className,
}: {
  ticker: string;
  size: TokenIconSize;
  className?: string;
}) {
  const sizeConfig = SIZE_VARIANTS[size];
  const initials = ticker.slice(0, 2).toUpperCase();

  return (
    <View
      className={cn(
        sizeConfig.container,
        "border-primary-400/20 items-center justify-center rounded-full border bg-background-tertiary",
        className,
      )}
    >
      <Text className={cn(sizeConfig.text, "text-primary-400 font-semibold")}>
        {initials}
      </Text>
    </View>
  );
}

/**
 * TokenIcon Component
 *
 * A robust component for displaying cryptocurrency token icons with:
 * - Automatic image loading from DexScreener API via usePumpIconDexScreener hook
 * - Loading skeletons and error states
 * - Multiple size variants
 * - Fallback to ticker initials when no image is available
 * - Optimized caching (24h) and error handling
 * - Uses expo-image for better performance
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TokenIcon ticker="PNUT" size="md" />
 *
 * // With custom fallback
 * <TokenIcon
 *   ticker="CUSTOM"
 *   size="lg"
 *   fallback={<CustomIcon />}
 * />
 *
 * // Disabled loading (static fallback)
 * <TokenIcon
 *   ticker="STATIC"
 *   enabled={false}
 *   showLoading={false}
 * />
 * ```
 */
export const TokenIcon = React.memo<TokenIconProps>(
  ({
    ticker,
    size = "md",
    className,
    showLoading = true,
    showError = true,
    fallback,
    enabled = true,
  }) => {
    // Fetch token metadata using our optimized hook
    const {
      data: tokenMeta,
      isLoading,
      error,
    } = usePumpIconDexScreener(ticker, {
      enabled,
    });

    // Memoize size configuration to avoid recalculation
    const sizeConfig = useMemo(() => SIZE_VARIANTS[size], [size]);

    // Show loading skeleton
    if (isLoading && showLoading) {
      return <TokenIconSkeleton size={size} className={className} />;
    }

    // Show error state
    if (error && showError) {
      return (
        <TokenIconError ticker={ticker} size={size} className={className} />
      );
    }

    // Show image if available
    if (tokenMeta?.image) {
      return (
        <View
          className={cn(
            sizeConfig.container,
            "overflow-hidden rounded-full",
            className,
          )}
        >
          <Image
            source={{ uri: tokenMeta.image }}
            style={{
              width: sizeConfig.imageSize,
              height: sizeConfig.imageSize,
            }}
            className="rounded-full"
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }} // Generic placeholder blurhash
            cachePolicy="memory-disk"
            priority="normal"
            onError={() => {
              // Log image loading errors for debugging
              console.warn(`Failed to load image for token: ${ticker}`);
            }}
          />
        </View>
      );
    }

    // Show custom fallback or default fallback
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <TokenIconFallback ticker={ticker} size={size} className={className} />
    );
  },
);

// Set display name for better debugging
TokenIcon.displayName = "TokenIcon";
