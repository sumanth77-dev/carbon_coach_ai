import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsSummary } from '../components/analytics/AnalyticsSummary';
import { CategoryDonutChart } from '../components/analytics/CategoryDonutChart';
import { EmissionTrendChart } from '../components/analytics/EmissionTrendChart';
import { CategoryComparisonChart } from '../components/analytics/CategoryComparisonChart';
import { CarbonReductionOpportunities } from '../components/analytics/CarbonReductionOpportunities';
import { InsightsPanel } from '../components/analytics/InsightsPanel';
import { Button } from '../components/common/Button';

const TIME_PERIODS = [
  { id: 'today', label: 'Today' },
  { id: '7days', label: 'Last 7 days' },
  { id: '30days', label: 'Last 30 days' },
  { id: 'this_month', label: 'This month' },
];

export const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [summaryData, setSummaryData] = useState({});
  const [trendsData, setTrendsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [comparisonsData, setComparisonsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllAnalytics = useCallback(async (period) => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, trendsRes, categoriesRes] = await Promise.all([
        analyticsService.getSummary(period),
        analyticsService.getTrends(period),
        analyticsService.getCategories(period),
      ]);

      setSummaryData(summaryRes || {});
      setTrendsData(trendsRes?.trends || []);
      setCategoriesData(categoriesRes?.categories || []);
      setComparisonsData(categoriesRes?.comparisons || []);
    } catch (err) {
      setError(err.message || 'Failed to load analytics telemetry. Check backend service status.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAnalytics(selectedPeriod);
  }, [selectedPeriod, fetchAllAnalytics]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            Carbon Analytics
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Explore your carbon emissions, identify patterns and understand your environmental impact.
          </p>
        </div>

        {/* Time Period Selector Tabs & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center bg-surface border border-border rounded-lg p-1 shadow-subtle">
            {TIME_PERIODS.map((period) => (
              <button
                key={period.id}
                type="button"
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedPeriod === period.id
                    ? 'bg-primary text-white shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-main hover:bg-background'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => fetchAllAnalytics(selectedPeriod)}
            isLoading={isLoading}
            className="px-2.5"
            title="Refresh analytics data"
          />
        </div>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between gap-3 text-red-800 text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">Analytics Server Telemetry Error</p>
              <p className="text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchAllAnalytics(selectedPeriod)}
            className="font-medium underline hover:text-red-900 shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <AnalyticsSummary summary={summaryData} isLoading={isLoading && !summaryData.totalEmissions} />

      {/* Trends & Category Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmissionTrendChart
            trends={trendsData}
            isLoading={isLoading && trendsData.length === 0}
            period={selectedPeriod}
          />
        </div>
        <div className="lg:col-span-1">
          <CategoryDonutChart
            categories={categoriesData}
            isLoading={isLoading && categoriesData.length === 0}
          />
        </div>
      </div>

      {/* Category Benchmark Comparison */}
      <div>
        <CategoryComparisonChart
          comparisons={comparisonsData}
          isLoading={isLoading && comparisonsData.length === 0}
        />
      </div>

      {/* Section 1.C: Your Carbon Reduction Opportunities */}
      <div>
        <CarbonReductionOpportunities
          data={summaryData.reductionOpportunities}
          isLoading={isLoading && !summaryData.reductionOpportunities}
        />
      </div>

      {/* Telemetry & AI Insights Panels */}
      <div>
        <InsightsPanel
          insights={summaryData.insights}
          aiInsights={summaryData.aiInsights}
          periodChange={summaryData.periodChange}
          periodChangeType={summaryData.periodChangeType}
          isLoading={isLoading && !summaryData.insights}
        />
      </div>
    </div>
  );
};
