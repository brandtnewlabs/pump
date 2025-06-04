import React from "react";
import { View } from "react-native";

import { AnimatedValue } from "./animated-value";

/**
 * Props for the LabelValue component
 */
interface LabelValueProps {
  /** The label text to display on the left side (e.g., "Price", "Volume", "Status") */
  label: string;
  /** The value text to display on the right side (e.g., "$1,234", "1.5M", "Active") */
  value: string;
  /** Optional className for the container View */
  containerClassName?: string;
  /** Optional className override for the label text styling */
  labelClassName?: string;
  /** Optional className override for the value text styling */
  valueClassName?: string;
}

/**
 * LabelValue Component
 *
 * A reusable component that displays a label-value pair in a horizontal layout.
 * Both the label and value support smooth animations when their content changes,
 * making it ideal for displaying dynamic data like prices, stats, or status indicators.
 *
 * Features:
 * - Responsive horizontal layout with space-between alignment
 * - Animated text transitions when label or value changes
 * - Customizable styling through className props
 * - Optimized for performance with React.memo
 * - Consistent typography and spacing
 *
 * Usage:
 * ```tsx
 * <LabelValue label="Price" value="$1,234.56" />
 * <LabelValue label="Status" value="Active" />
 * <LabelValue
 *   label="Custom Label"
 *   value="Custom Value"
 *   containerClassName="mb-4"
 *   labelClassName="text-custom-color"
 *   valueClassName="text-custom-value-color"
 * />
 * ```
 *
 * Performance optimizations:
 * - Wrapped in React.memo to prevent unnecessary re-renders when parent re-renders
 * - Uses AnimatedValue component which is optimized for native thread animations
 * - Minimal prop interface reduces bundle size and improves type safety
 */
export const LabelValue = React.memo<LabelValueProps>(
  ({ label, value, containerClassName, labelClassName, valueClassName }) => {
    // Default styling classes - can be overridden via props
    const defaultLabelClass =
      "text-text-tertiary text-base font-semibold uppercase";
    const defaultValueClass =
      "text-text-primary text-right text-base font-semibold";

    return (
      <View
        className={`flex flex-row items-center justify-between ${
          containerClassName || ""
        }`}
      >
        {/* Label side - typically displays the data category */}
        <AnimatedValue
          value={label}
          textClassName={labelClassName || defaultLabelClass}
        />

        {/* Value side - typically displays the actual data/measurement */}
        <AnimatedValue
          value={value}
          textClassName={valueClassName || defaultValueClass}
        />
      </View>
    );
  },
);

// Display name for React DevTools - helps with debugging and component identification
LabelValue.displayName = "LabelValue";
