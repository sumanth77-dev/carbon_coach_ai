import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

/**
 * Weekly Emission Trend Chart (Last 7 Days).
 * Displays daily carbon telemetry against a daily target reference benchmark.
 */
export const WeeklyTrendChart = ({ data = [], target = 16.0 }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const difference = (point.emission - target).toFixed(1);
      const isUnderTarget = point.emission <= target;

      return (
        <div className="bg-surface border border-border rounded-md shadow-card p-3 text-xs">
          <p className="font-semibold text-text-main">
            {point.day} ({point.date})
          </p>
          <div className="mt-1.5 space-y-1">
            <p className="text-text-secondary flex justify-between gap-4">
              <span>Emissions:</span>
              <span className="font-semibold text-text-main">{point.emission} kg CO₂e</span>
            </p>
            <p className="text-text-secondary flex justify-between gap-4">
              <span>Daily Target:</span>
              <span className="text-text-secondary">{target} kg CO₂e</span>
            </p>
            <div className="pt-1 border-t border-border mt-1">
              <span
                className={`text-[11px] font-medium ${
                  isUnderTarget ? 'text-primary' : 'text-amber-700'
                }`}
              >
                {isUnderTarget
                  ? `${Math.abs(difference)} kg below target`
                  : `${difference} kg above target`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-text-secondary">
        No weekly telemetry available.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Legend / Subtitle */}
      <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
        <span>Daily emissions (kg CO₂e)</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block"></span>
            <span>Recorded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 border-t-2 border-dashed border-secondary inline-block"></span>
            <span>Target ({target} kg)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9E5" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#778078', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E9E5' }}
            />
            <YAxis
              tick={{ fill: '#778078', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E9E5' }}
              domain={[0, 'dataMax + 4']}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={target}
              stroke="#8BAF99"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Bar
              dataKey="emission"
              fill="#245C45"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
