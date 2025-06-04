import { useFonts } from "expo-font";
import { useEffect } from "react";

/**
 * Custom hook to load Inter font family variants
 * @returns {Object} Object containing font loading status and error state
 * @property {boolean} fontsLoaded - Indicates if fonts have finished loading
 * @property {Error | null} fontError - Contains error if font loading failed
 */
export function useFontLoader(): {
  fontsLoaded: boolean;
  fontError: Error | null;
} {
  // Load font files using expo-font's useFonts hook
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  // Log font loading errors to console
  useEffect(() => {
    if (fontError) {
      console.error(fontError.message);
    }
  }, [fontError]);

  return { fontsLoaded, fontError };
}
