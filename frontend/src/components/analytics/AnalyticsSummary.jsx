import React from 'react';
import { Leaf, Calendar, Activity, PieChart } from 'lucide-react';
import { StatCard } from '../dashboard/StatCard';

export const AnalyticsSummary = ({ summary = {}, isLoading = false }) => {
  const {
    totalEmissions = 0,
    averageDaily = 0,
    totalActivities = 0,
    largestCategory = 'N/A',
    periodChange = '',
    periodChangeType = 'neutral',
  } = summary;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-surface border border-border rounded-lg p-5">
            <div className="h-3 w-24 bg-border/60 rounded mb-3" />
            <div className="h-7 w-20 bg-border/80 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Emissions"
        value={Number(totalEmissions).toFixed(1)}
        unit="kg CO₂e"
        change={periodChange}
        changeType={periodChangeType}
        changeLabel=""
        icon={Leaf}
      />
      <StatCard
        title="Average Daily Emissions"
        value={Number(averageDaily).toFixed(1)}
        unit="kg / day"
        change="Prorated over period"
        changeType="neutral"
        changeLabel=""
        icon={Calendar}
      />
      <StatCard
        title="Total Activities"
        value={totalActivities}
        unit="entries"
        change="Verified activity logs"
        changeType="neutral"
        changeLabel=""
        icon={Activity}
      />
      <StatCard
        title="Largest Category"
        value={largestCategory.split(' ')[0] || 'N/A'}
        unit={largestCategory.includes('(') ? largestCategory.match(/\((.*?)\)/)?.[0] : ''}
        change="Primary emission driver"
        changeType="neutral"
        changeLabel=""
        icon={PieChart}
      />
    </div>
  );
};
