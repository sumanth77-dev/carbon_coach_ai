import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

/**
 * Custom hook to separate Dashboard data fetching & state handling from UI.
 */
export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardService.fetchDashboardData();
      setData(result);
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isEmpty = !loading && !error && (!data || data.recentActivities?.length === 0);

  return {
    data,
    loading,
    error,
    isEmpty,
    refresh: loadData,
  };
};
