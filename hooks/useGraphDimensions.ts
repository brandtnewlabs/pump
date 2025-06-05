import { useCallback, useState } from "react";
import { LayoutChangeEvent } from "react-native";

/**
 * Interface defining the dimensions of a container
 * Used to store width and height measurements in pixels
 */
interface Dimensions {
  /** Width of the container in pixels */
  width: number;
  /** Height of the container in pixels */
  height: number;
}

/**
 * Return type for the useGraphDimensions hook
 * Includes container dimensions and layout event handler
 */
type GraphDimensionsReturn = {
  /** Current width of the container in pixels */
  width: number;
  /** Current height of the container in pixels */
  height: number;
  /** Event handler for layout changes */
  onLayout: (event: LayoutChangeEvent) => void;
};

/**
 * Custom hook to manage and track container dimensions
 * Provides responsive measurements by handling layout change events
 *
 * @returns {GraphDimensionsReturn} Object containing:
 *   - width: current container width
 *   - height: current container height
 *   - onLayout: event handler to update dimensions
 *
 * @example
 * const { width, height, onLayout } = useGraphDimensions();
 * return <View onLayout={onLayout}>{width > 0 && <Chart width={width} />}</View>
 */
export const useGraphDimensions = (): GraphDimensionsReturn => {
  // Initialize dimensions state with zero values
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  // Handle layout changes and update dimensions
  // Memoized to maintain reference stability
  const onLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setDimensions({
        width: Math.round(layout.width),
        height: Math.round(layout.height),
      });
    },
    [],
  );

  return { ...dimensions, onLayout };
};
