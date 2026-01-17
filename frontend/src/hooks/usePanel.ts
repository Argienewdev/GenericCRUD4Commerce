import { useCallback, useEffect, useState } from "react";
import { PANEL_CONFIG, type PanelType } from "../config/panelConfig";

export function usePanel<T>(panelType: PanelType, options?: { enabled?: boolean }) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { enabled = true } = options || {};
  const config = PANEL_CONFIG[panelType];

  /**
   * Memorize fetchData so its reference is stable
   */
  const fetchData = useCallback(async () => {
    if (!config.fetchData) return;

    setLoading(true);
    setError(null);

    try {
      const result = await config.fetchData();
      setData(result as T[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error loading data";
      setError(message);
      console.error(`Failed to fetch ${panelType}:`, err);
    } finally {
      setLoading(false);
    }
  }, [config, panelType]);

  /**
   * Fetch when panelType changes or enabled becomes true
   */
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [fetchData, enabled]);

  return {
    data,
    loading,
    error,
    config,
    setData,
    refetch: fetchData,
  };
}