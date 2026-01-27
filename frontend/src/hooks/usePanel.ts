import { useCallback, useEffect, useState } from "react";
import { type PanelType, PANEL_CONFIG } from "../config/panelConfig";

export function usePanel<T>(panelType: PanelType) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    fetchData();
	}, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}