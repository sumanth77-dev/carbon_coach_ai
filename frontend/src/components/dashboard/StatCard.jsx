import React from 'react';

/**
 * Metric summary card for Dashboard telemetry adhering strictly to the Carbon Coach design system.
 */
export const StatCard = ({
  title,
  value,
  unit,
  change,
  changeType = 'decrease',
  changeLabel = 'vs last month',
  icon: Icon,
  className = '',
}) => {
  const isPositiveChange = changeType === 'decrease'; // in carbon footprint reduction, a decrease is positive!
  const isNeutral = changeType === 'neutral';

  let changeColor = 'text-primary';
  if (isNeutral) {
    changeColor = 'text-text-secondary';
  } else if (!isPositiveChange) {
    changeColor = 'text-amber-700';
  }

  return (
    <div className={`bg-surface border border-border rounded-lg shadow-subtle p-5 transition-shadow hover:shadow-card ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-md bg-background border border-border/60 flex items-center justify-center text-primary shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-text-main tracking-tight">{value}</span>
        {unit && <span className="text-xs font-medium text-text-secondary">{unit}</span>}
      </div>

      {change && (
        <div className="mt-2 flex items-center text-xs">
          <span className={`font-semibold ${changeColor}`}>
            {change}
          </span>
          {changeLabel && (
            <span className="text-text-secondary ml-1.5 truncate">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};
