import { useState, useEffect, useCallback } from "react";

interface UseDataFetchOptions {
  enableCache?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseDataFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useDataFetch<T>(
  url: string | null,
  options: UseDataFetchOptions = {}
): UseDataFetchReturn<T> {
  const { enableCache = true, retryAttempts = 3, retryDelay = 1000 } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (attemptCount = 0): Promise<void> => {
      if (!url) return;

      setLoading(true);
      setError(null);

      try {
        // Check cache first
        if (enableCache) {
          const cached = cache.get(url);
          if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            setData(cached.data as T);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Cache the result
        if (enableCache) {
          cache.set(url, { data: result, timestamp: Date.now() });
        }

        setData(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";

        // Retry logic
        if (attemptCount < retryAttempts) {
          setTimeout(() => {
            fetchData(attemptCount + 1);
          }, retryDelay * Math.pow(2, attemptCount)); // Exponential backoff
          return;
        }

        setError(errorMessage);
        console.error(`Failed to fetch ${url}:`, err);
      } finally {
        setLoading(false);
      }
    },
    [url, enableCache, retryAttempts, retryDelay]
  );

  const refetch = useCallback(() => {
    if (url && enableCache) {
      cache.delete(url);
    }
    fetchData();
  }, [fetchData, url, enableCache]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export function clearCache(): void {
  cache.clear();
}

export function getCacheSize(): number {
  return cache.size;
}
