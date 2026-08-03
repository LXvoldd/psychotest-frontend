import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export function useApi(apiFunction, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result.data);
        return result.data;
      } catch (err) {
        setError(err);
        const message = err.response?.data?.message || err.message || "Terjadi kesalahan";
        if (options.showToast !== false) {
          toast.error(message);
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options.showToast]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}