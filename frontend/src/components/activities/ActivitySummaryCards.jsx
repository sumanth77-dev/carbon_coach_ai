import React from 'react';
import { Activity, Leaf, Car, Layers } from 'lucide-react';
import { StatCard } from '../dashboard/StatCard';

/**
 * 4 Summary Cards for Activity History Page
 */
export const ActivitySummaryCards = ({ summary = {}, isLoading = false }) => {
  const {
    totalActivities = 0,
    totalEmissions = 0,
    transportationCount = 0,
    otherCount = 0,
    unit = 'kg CO₂e',
  } = summary;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-surface border border-border rounded-lg p-5">
            <div className="h-3 w-20 bg-border/60 rounded mb-3"></div>
            <div className="h-7 w-24 bg-border/80 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Activities"
        value={totalActivities}
        unit="entries"
        change="Recorded to date"
        changeType="neutral"
        changeLabel=""
        icon={Activity}
      />
      <StatCard
        title="Total Carbon Emissions"
        value={totalEmissions}
        unit={unit}
        change="Cumulative impact"
        changeType="neutral"
        changeLabel=""
        icon={Leaf}
      />
      <StatCard
        title="Transportation Activities"
        value={transportationCount}
        unit="trips"
        change={totalActivities > 0 ? `${Math.round((transportationCount / totalActivities) * 100)}% of total` : ''}
        changeType="neutral"
        changeLabel=""
        icon={Car}
      />
      <StatCard
        title="Other Activities"
        value={otherCount}
        unit="entries"
        change="Energy, Food & Waste"
        changeType="neutral"
        changeLabel=""
        icon={Layers}
      />
    </div>
  );
};
