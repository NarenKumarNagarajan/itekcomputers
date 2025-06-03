import { useState, useCallback, useRef } from "react";
import { api } from "../services/api";

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cache = useRef(new Map());

  const execute = useCallback(async (apiCall, params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache
      const cacheKey = JSON.stringify({ apiCall, params });
      const cachedData = cache.current.get(cacheKey);

      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
        setData(cachedData.data);
        setIsLoading(false);
        return cachedData.data;
      }

      // Make API call
      const result = await apiCall(params);

      // Update cache
      cache.current.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    cache.current.clear();
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    clearCache,
  };
};
