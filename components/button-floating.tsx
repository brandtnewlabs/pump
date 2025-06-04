import { cn } from "@/lib/cn";
import { Octicons } from "@expo/vector-icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useMemo } from "react";
import { Pressable } from "react-native";

import tailwindColors from "@/tailwind-colors";
import AnimatedPressable from "./animated-pressable";

/**
 * Button variants configuration using class-variance-authority
 * Defines the base styles and variant-specific styles for the floating button
 */
const buttonVariants = cva(
  // Base styles applied to all button variants
  "flex items-center justify-center rounded-full shadow-lg",
  {
    variants: {
      // Visual style variants
      variant: {
        primary: "bg-background-brand shadow-primary-400/25",
        secondary: "bg-background-secondary shadow-base-900/50",
        tertiary: "bg-background-tertiary shadow-base-900/25",
      },
      // Size variants with consistent aspect ratios
      size: {
        default: "h-12 w-12", // 48x48px
        sm: "h-10 w-10", // 40x40px
        lg: "h-14 w-14", // 56x56px
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

/**
 * Maps button variants to their corresponding icon colors
 * Uses memoized calculation to avoid redundant color lookups
 *
 * @param variant - The button variant type
 * @returns The appropriate icon color for the variant
 */
const getIconColor = (
  variant: "primary" | "secondary" | "tertiary" | null | undefined,
): string => {
  switch (variant) {
    case "primary":
      return tailwindColors.text.brandDark;
    case "secondary":
      return tailwindColors.text.secondary;
    case "tertiary":
      return tailwindColors.text.tertiary;
    default:
      // Fallback color for edge cases
      return tailwindColors.text.brandDark;
  }
};

/**
 * Maps button sizes to their corresponding icon sizes
 * Maintains consistent visual proportions across different button sizes
 *
 * @param size - The button size variant
 * @returns The appropriate icon size in pixels
 */
const getIconSize = (
  size: "sm" | "default" | "lg" | null | undefined,
): number => {
  switch (size) {
    case "sm":
      return 16;
    case "lg":
      return 24;
    case "default":
    default:
      return 20;
  }
};

/**
 * Props interface for the FloatingButton component
 * Extends VariantProps from cva and AnimatedPressable props
 */
interface FloatingButtonProps
  extends VariantProps<typeof buttonVariants>,
    Omit<React.ComponentProps<typeof AnimatedPressable>, "children"> {
  /** The Octicon name to display in the button */
  octicon: keyof typeof Octicons.glyphMap;
  /** Additional CSS classes to apply */
  className?: string;
  /** Override the default icon color */
  iconColor?: string;
}

/**
 * FloatingButton Component
 *
 * A highly customizable floating action button with consistent styling,
 * haptic feedback, and smooth animations. Supports multiple variants and sizes
 * with automatic icon color mapping.
 *
 * Features:
 * - Three visual variants (primary, secondary, tertiary)
 * - Three size options (sm, default, lg)
 * - Automatic icon color mapping based on variant
 * - Haptic feedback on press
 * - Smooth press animations via AnimatedPressable
 * - Full TypeScript support with proper prop validation
 *
 * @example
 * ```tsx
 * <FloatingButton
 *   octicon="plus"
 *   variant="primary"
 *   size="lg"
 *   onPress={() => console.log('Pressed!')}
 * />
 * ```
 */
const FloatingButton = forwardRef<
  React.ComponentRef<typeof Pressable>,
  FloatingButtonProps
>(({ octicon, variant, size, className, iconColor, ...props }, ref) => {
  // Memoize icon size calculation to avoid recalculation on re-renders
  const iconSize = useMemo(() => getIconSize(size), [size]);

  // Memoize icon color calculation, preferring custom color over variant-based color
  const color = useMemo(() => {
    return iconColor || getIconColor(variant);
  }, [iconColor, variant]);

  return (
    <AnimatedPressable
      ref={ref}
      haptic // Provides tactile feedback on press
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <Octicons name={octicon} size={iconSize} color={color} />
    </AnimatedPressable>
  );
});

// Set display name for better debugging experience
FloatingButton.displayName = "FloatingButton";

export { buttonVariants, FloatingButton };
