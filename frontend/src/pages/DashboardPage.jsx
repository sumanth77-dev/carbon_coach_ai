import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Clock,
  TrendingDown,
  ClipboardList,
  Plus,
  RotateCw,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { StatCard } from '../components/dashboard/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CategoryBreakdownDonut } from '../components/charts/CategoryBreakdownDonut';
import { WeeklyTrendChart } from '../components/charts/WeeklyTrendChart';
import { RecentActivityTable } from '../components/dashboard/RecentActivityTable';
import { RecommendationPreview } from '../components/dashboard/RecommendationPreview';

/**
 * Carbon Coach Dashboard Page
 * A clean, responsive sustainability intelligence dashboard.
 */
export const DashboardPage = () => {
  const { user } = useAuth();
  const { data, loading, error, isEmpty, refresh } = useDashboardData();

  // Dynamic time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Formatted current date
  const currentDateFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  }, []);

  const displayName = user?.name || 'Sumanth';

  // Loading skeleton view
  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-border/60 rounded"></div>
            <div className="h-4 w-48 bg-border/40 rounded"></div>
          </div>
          <div className="h-9 w-32 bg-border/60 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface border border-border rounded-lg p-5">
              <div className="h-3 w-20 bg-border/50 rounded mb-4"></div>
              <div className="h-7 w-28 bg-border/60 rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-80 bg-surface border border-border rounded-lg"></div>
          <div className="lg:col-span-5 h-80 bg-surface border border-border rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Error state view
  if (error) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle text-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-text-main">Unable to load dashboard</h3>
          <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">{error}</p>
          <div className="mt-5">
            <Button variant="primary" onClick={refresh} icon={RotateCw}>
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const {
    summary,
    categoryBreakdown = [],
    weeklyTrends = [],
    recentActivities = [],
    recommendationPreview,
    isDemo,
  } = data || {};

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
              {greeting}, {displayName}
            </h1>
            {isDemo && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-secondary/15 text-primary-dark border border-secondary/30">
                <Info className="w-3 h-3" />
                Simulated Telemetry
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Here's an overview of your carbon footprint.
          </p>
        </div>

        {/* Date Display and Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="hidden lg:block text-right pr-2 border-r border-border">
            <span className="text-xs font-medium text-text-main block">
              {currentDateFormatted}
            </span>
            <span className="text-[10px] text-text-secondary block">
              Current Billing Cycle
            </span>
          </div>

          <button
            onClick={refresh}
            title="Refresh dashboard data"
            aria-label="Refresh dashboard data"
            className="p-2 rounded bg-surface border border-border text-text-secondary hover:text-text-main hover:bg-background transition-colors focus:outline-none"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <Link to="/activities">
            <Button variant="primary" size="md" icon={Plus}>
              Log Activity
            </Button>
          </Link>
        </div>
      </div>

      {/* Simulated Telemetry Alert Banner for mobile / transparent indicator */}
      {isDemo && (
        <div className="p-3 bg-surface border border-border rounded-lg flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>
              <strong>Demo Mode:</strong> Displaying simulated telemetry for UI evaluation. Ready to consume live backend metrics.
            </span>
          </div>
          <span className="text-[11px] text-primary font-medium shrink-0 ml-2">Active</span>
        </div>
      )}

      {/* 2. Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Carbon Footprint"
          value={summary?.totalFootprint?.value || '0'}
          unit={summary?.totalFootprint?.unit || 'kg CO₂e'}
          change={summary?.totalFootprint?.change}
          changeType={summary?.totalFootprint?.changeType || 'decrease'}
          changeLabel={summary?.totalFootprint?.changeLabel || 'vs last month'}
          icon={Leaf}
        />
        <StatCard
          title="Today's Emissions"
          value={summary?.todayEmissions?.value || '0'}
          unit={summary?.todayEmissions?.unit || 'kg CO₂e'}
          change={summary?.todayEmissions?.change}
          changeType={summary?.todayEmissions?.changeType || 'decrease'}
          changeLabel={summary?.todayEmissions?.changeLabel || 'vs yesterday'}
          icon={Clock}
        />
        <StatCard
          title="This Week's Emissions"
          value={summary?.thisWeekEmissions?.value || '0'}
          unit={summary?.thisWeekEmissions?.unit || 'kg CO₂e'}
          change={summary?.thisWeekEmissions?.change}
          changeType={summary?.thisWeekEmissions?.changeType || 'decrease'}
          changeLabel={summary?.thisWeekEmissions?.changeLabel || 'vs last week'}
          icon={TrendingDown}
        />
        <StatCard
          title="Activities Logged"
          value={summary?.activitiesLogged?.value || '0'}
          unit={summary?.activitiesLogged?.unit || 'activities'}
          change={summary?.activitiesLogged?.change}
          changeType={summary?.activitiesLogged?.changeType || 'neutral'}
          changeLabel={summary?.activitiesLogged?.changeLabel || ''}
          icon={ClipboardList}
        />
      </div>

      {/* 3 & 4. Primary Analytical Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 4. Emission Trends (Weekly Chart) */}
        <div className="lg:col-span-7">
          <Card
            title="Weekly Emission Trends"
            subtitle="Daily measured telemetry over the last seven days"
            action={
              <Badge variant="neutral" size="sm">
                Past 7 Days
              </Badge>
            }
          >
            <WeeklyTrendChart data={weeklyTrends} target={16.0} />
          </Card>
        </div>

        {/* 3. Carbon Emission Breakdown (Donut Chart) */}
        <div className="lg:col-span-5">
          <Card
            title="Emission Breakdown"
            subtitle="Category-wise distribution for current week"
            action={
              <span className="text-xs text-text-secondary font-mono">
                {categoryBreakdown.length} Categories
              </span>
            }
          >
            <CategoryBreakdownDonut data={categoryBreakdown} />
          </Card>
        </div>
      </div>

      {/* 5 & 6. Recent Activities Table & AI Recommendation Preview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5. Recent Activities */}
        <div className="lg:col-span-8">
          <Card
            title="Recent Activities"
            subtitle="Latest carbon emission telemetry entries"
            action={
              <Link
                to="/activities"
                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Log New
              </Link>
            }
          >
            <RecentActivityTable activities={recentActivities} />
          </Card>
        </div>

        {/* 6. AI Recommendation Preview */}
        <div className="lg:col-span-4">
          <Card
            title="AI Recommendation"
            subtitle="Analyzed by Gemini sustainability coach"
            action={
              <div className="w-5 h-5 text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            }
          >
            <RecommendationPreview recommendation={recommendationPreview} />
          </Card>
        </div>
      </div>
    </div>
  );
};
