import { useState, useCallback } from "react";
import { api } from "../services/api";

export const useApiData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint, token) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(endpoint, token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const postData = useCallback(async (endpoint, data, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(endpoint, data, token);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchData,
    postData,
  };
};
