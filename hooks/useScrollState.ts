import { useCallback, useEffect, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

interface UseScrollStateOptions {
  /** Delay in ms before calling onScrollStart after scrolling begins (default: 150ms) */
  pauseDelay?: number;
  /** Delay in ms before calling onScrollEnd after scrolling stops (default: 400ms) */
  resumeDelay?: number;
  /** Callback when scrolling starts (after pauseDelay) */
  onScrollStart?: () => void;
  /** Callback when scrolling ends (after resumeDelay) */
  onScrollEnd?: () => void;
}

interface UseScrollStateReturn {
  /** Handler for onScrollBeginDrag prop */
  onScrollBeginDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Handler for onScrollEndDrag prop */
  onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Handler for onMomentumScrollEnd prop */
  onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Handler for onScroll prop - optional for additional scroll tracking */
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

/**
 * Hook for tracking scroll state with debounced callbacks
 *
 * Provides optimized scroll event handlers that trigger callbacks after configurable delays
 * to avoid excessive pause/resume cycles during scrolling.
 *
 * @param options Configuration for delays and callbacks
 * @returns Object with scroll event handlers for React Native ScrollView/FlatList
 */
export const useScrollState = (
  options: UseScrollStateOptions = {},
): UseScrollStateReturn => {
  const {
    pauseDelay = 150,
    resumeDelay = 400,
    onScrollStart,
    onScrollEnd,
  } = options;

  // Refs to track timeout IDs and scroll state
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef(false);
  const hasPausedRef = useRef(false);

  // Clear any existing timeouts
  const clearAllTimeouts = useCallback(() => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      // If we were paused when unmounting, make sure to resume
      if (hasPausedRef.current && onScrollEnd) {
        onScrollEnd();
      }
    };
  }, [clearAllTimeouts, onScrollEnd]);

  // Start the pause process when scrolling begins
  const startPauseProcess = useCallback(() => {
    // Clear any existing resume timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    // If not already paused, start the pause timeout
    if (!hasPausedRef.current) {
      pauseTimeoutRef.current = setTimeout(() => {
        if (onScrollStart && isScrollingRef.current) {
          onScrollStart();
          hasPausedRef.current = true;
        }
        pauseTimeoutRef.current = null;
      }, pauseDelay);
    }
  }, [onScrollStart, pauseDelay]);

  // Start the resume process when scrolling ends
  const startResumeProcess = useCallback(() => {
    // Clear any existing pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    // Start the resume timeout
    resumeTimeoutRef.current = setTimeout(() => {
      if (onScrollEnd && hasPausedRef.current) {
        onScrollEnd();
        hasPausedRef.current = false;
      }
      resumeTimeoutRef.current = null;
    }, resumeDelay);
  }, [onScrollEnd, resumeDelay]);

  // Handler for when user starts dragging
  const onScrollBeginDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isScrollingRef.current = true;
      startPauseProcess();
    },
    [startPauseProcess],
  );

  // Handler for when user stops dragging (but momentum might continue)
  const onScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Don't immediately stop - momentum scrolling might continue
      // The momentum end handler will handle the actual end
    },
    [],
  );

  // Handler for when momentum scrolling ends
  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isScrollingRef.current = false;
      startResumeProcess();
    },
    [startResumeProcess],
  );

  // Handler for scroll events (can be used for additional tracking)
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // This can be used for additional scroll tracking if needed
      // Currently just a placeholder for potential future use
    },
    [],
  );

  return {
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollEnd,
    onScroll,
  };
};
