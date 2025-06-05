import { useMemo } from "react";

import { GRADIENT_MAP, normalizeColorKey } from "@/constants/graph";
import tailwindColors from "@/tailwind-colors";
import { GraphColor, GraphSeries, SeriesColorItem } from "@/types/graph";

interface SeriesColorsReturn {
  seriesColors: SeriesColorItem[];
  negativeColor: string;
  negativeGradient: string[];
  lineColor: string;
  labelColor: string;
  cursorColor: string;
}

const BASE_COLORS = {
  negativeColor: tailwindColors.error[600],
  lineColor: tailwindColors.base[500],
  labelColor: tailwindColors.base[100],
  cursorColor: tailwindColors.base[900],
};

/**
 * Hook that provides colors for multiple graph series
 * @param graphSeries - Array of series configurations
 * @returns Object containing color mappings for each series and base styling colors
 */
export const useSeriesColors = (
  graphSeries: GraphSeries[],
): SeriesColorsReturn => {
  return useMemo(() => {
    const seriesColors: SeriesColorItem[] = graphSeries.map(
      ({ id, label, color = "grey" }) => {
        const normalizedColor = normalizeColorKey(color as GraphColor);
        return {
          id,
          label,
          color: normalizedColor,
          gradient: [...GRADIENT_MAP[normalizedColor]].reverse(),
        };
      },
    );

    return {
      ...BASE_COLORS,
      seriesColors,
      negativeGradient: [...GRADIENT_MAP.RED].reverse(),
    };
  }, [graphSeries]);
};
