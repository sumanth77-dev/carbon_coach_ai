import React, { useState, useEffect, useCallback } from 'react';
import { History, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { ActivitySummaryCards } from '../components/activities/ActivitySummaryCards';
import { ActivityFilters } from '../components/activities/ActivityFilters';
import { ActivityTable } from '../components/activities/ActivityTable';
import { ActivityDetailsModal } from '../components/activities/ActivityDetailsModal';
import { Button } from '../components/common/Button';

export const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState({
    totalActivities: 0,
    totalEmissions: 0,
    transportationCount: 0,
    otherCount: 0,
    unit: 'kg CO₂e',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    category: 'all',
    dateRange: 'all',
    search: '',
    sortBy: 'newest',
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async (currentPage = 1, currentFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await activityService.getActivities({
        page: currentPage,
        limit: 10,
        category: currentFilters.category !== 'all' ? currentFilters.category : undefined,
        dateRange: currentFilters.dateRange !== 'all' ? currentFilters.dateRange : undefined,
        search: currentFilters.search.trim() ? currentFilters.search.trim() : undefined,
        sortBy: currentFilters.sortBy,
      });

      setActivities(data.activities || []);
      if (data.summary) {
        setSummary(data.summary);
      }
      if (data.pagination) {
        setPagination({
          page: data.pagination.currentPage || data.pagination.page || 1,
          limit: data.pagination.limit || 10,
          total: data.pagination.totalRecords ?? data.pagination.total ?? 0,
          totalPages: data.pagination.totalPages || 1,
        });
      }
    } catch (err) {
      setError(err.message || 'Unable to load activities. Please check your backend connection.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchActivities(1, filters);
  }, [filters.category, filters.dateRange, filters.sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivities(1, filters);
    }, 350);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchActivities(newPage, filters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    const reset = {
      category: 'all',
      dateRange: 'all',
      search: '',
      sortBy: 'newest',
    };
    setFilters(reset);
    fetchActivities(1, reset);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
              Activity History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track and understand the environmental impact of your everyday activities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => fetchActivities(pagination.page, filters)}
            isLoading={isLoading}
          >
            Refresh Records
          </Button>

          <Link to="/calculator">
            <Button variant="primary" size="sm" icon={Plus}>
              Log Activity
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between gap-3 text-red-800 text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to fetch activities</p>
              <p className="text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchActivities(pagination.page, filters)}
            className="font-medium underline hover:text-red-900 shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <ActivitySummaryCards summary={summary} isLoading={isLoading && activities.length === 0} />

      {/* Filters Bar */}
      <ActivityFilters
        category={filters.category}
        onCategoryChange={(val) => setFilters((prev) => ({ ...prev, category: val }))}
        dateRange={filters.dateRange}
        onDateRangeChange={(val) => setFilters((prev) => ({ ...prev, dateRange: val }))}
        search={filters.search}
        onSearchChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
        sortBy={filters.sortBy}
        onSortByChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val }))}
        onResetFilters={handleResetFilters}
      />

      {/* Table & Pagination */}
      <ActivityTable
        activities={activities}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSelectActivity={(act) => setSelectedActivity(act)}
      />

      {/* Details Modal */}
      {selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
};
