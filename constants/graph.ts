import tailwindColors from "@/tailwind-colors";
import { GraphColor } from "@/types/graph";

const { error, success, base } = tailwindColors;

export const gradientColors = {
  positive: success[600],
  positiveGradient: [
    `${success[600]}99`,
    `${success[600]}66`,
    `${success[600]}4D`,
    `${success[600]}1A`,
    `${success[600]}00`,
  ],
  negative: error[600],
  negativeGradient: [
    `${error[600]}99`,
    `${error[600]}66`,
    `${error[600]}4D`,
    `${error[600]}1A`,
    `${error[600]}00`,
  ],
  neutral: base[500],
  neutralGradient: [
    `${base[500]}99`,
    `${base[500]}66`,
    `${base[500]}4D`,
    `${base[500]}1A`,
    `${base[500]}00`,
  ],
  lightGreen: success[500],
  lightGreenGradient: [
    `${success[500]}99`,
    `${success[500]}66`,
    `${success[500]}4D`,
    `${success[500]}1A`,
    `${success[500]}00`,
  ],
  lightRed: error[500],
  lightRedGradient: [
    `${error[500]}99`,
    `${error[500]}66`,
    `${error[500]}4D`,
    `${error[500]}1A`,
    `${error[500]}00`,
  ],
};

/**
 * Mapping of graph colors to their solid color values
 * @constant {Record<GraphColor, string>}
 */
export const COLOR_MAP = {
  RED: error[500],
  GREEN: success[500],
  GREY: base[500],
  LIGHTGREEN: success[100],
  LIGHTRED: error[100],
} as const;

/**
 * Mapping of graph colors to their gradient color arrays
 * @constant {Record<GraphColor, string[]>}
 */
export const GRADIENT_MAP = {
  RED: gradientColors.negativeGradient,
  GREEN: gradientColors.positiveGradient,
  GREY: gradientColors.neutralGradient,
  LIGHTGREEN: gradientColors.lightGreenGradient,
  LIGHTRED: gradientColors.lightRedGradient,
} as const;

/**
 * Normalizes a color key to match the COLOR_MAP format
 * Example: 'light-blue' -> 'LIGHT_BLUE'
 * @param color - The graph color to normalize
 * @returns A key that matches the COLOR_MAP object
 */
export const normalizeColorKey = (
  color: GraphColor,
): keyof typeof COLOR_MAP => {
  return color.toUpperCase().replace("-", "_") as keyof typeof COLOR_MAP;
};
