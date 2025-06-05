import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

interface UseAppFocusOptions {
  /** Callback when app/screen loses focus */
  onFocusLost?: () => void;
  /** Callback when app/screen gains focus */
  onFocusGained?: () => void;
}

/**
 * Hook for detecting app and screen focus changes
 *
 * Combines AppState (for app backgrounding) and navigation focus (for screen changes)
 * to provide comprehensive focus detection for pause/resume functionality.
 *
 * @param options Callbacks for focus state changes
 */
export const useAppFocus = (options: UseAppFocusOptions = {}) => {
  const { onFocusLost, onFocusGained } = options;

  // Track current focus state to avoid duplicate calls
  const isFocusedRef = useRef(true);
  const appStateRef = useRef(AppState.currentState);

  // Handle AppState changes (app backgrounding/foregrounding)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const wasActive = appStateRef.current === "active";
      const isActive = nextAppState === "active";

      appStateRef.current = nextAppState;

      // Only trigger callbacks if focus state actually changed
      if (wasActive && !isActive && isFocusedRef.current) {
        // App lost focus
        isFocusedRef.current = false;
        onFocusLost?.();
      } else if (!wasActive && isActive && !isFocusedRef.current) {
        // App gained focus
        isFocusedRef.current = true;
        onFocusGained?.();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, [onFocusLost, onFocusGained]);

  // Handle navigation focus changes (screen navigation)
  useFocusEffect(() => {
    // Screen gained focus
    if (!isFocusedRef.current && AppState.currentState === "active") {
      isFocusedRef.current = true;
      onFocusGained?.();
    }

    return () => {
      // Screen lost focus (navigating away)
      if (isFocusedRef.current) {
        isFocusedRef.current = false;
        onFocusLost?.();
      }
    };
  });
};
