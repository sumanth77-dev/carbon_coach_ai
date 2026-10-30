import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card } from '../common/Card';

export const CategoryComparisonChart = ({ comparisons = [], isLoading = false }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const difference = (dataPoint.benchmark - dataPoint.recorded).toFixed(1);

      return (
        <div className="bg-surface border border-border rounded-lg shadow-card p-3 text-xs min-w-[170px]">
          <p className="font-semibold text-text-main pb-1 border-b border-border/80">
            {dataPoint.category} Sector
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />
                Your Footprint:
              </span>
              <span className="font-mono font-bold text-text-main">{dataPoint.recorded} kg</span>
            </div>
            <div className="flex justify-between items-center text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-secondary inline-block" />
                Benchmark Ceiling:
              </span>
              <span className="font-mono text-text-secondary">{dataPoint.benchmark} kg</span>
            </div>
            <div className="pt-1.5 border-t border-border mt-1 text-[11px] font-medium text-primary">
              ✓ {difference} kg buffer preserved
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Category Comparison vs Benchmarks"
      subtitle="Comparison of your footprint across sectors against regional targets"
      className="h-full"
    >
      {isLoading ? (
        <div className="h-64 flex items-center justify-center animate-pulse">
          <div className="w-full h-40 bg-border/20 rounded" />
        </div>
      ) : comparisons.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-text-secondary">
          No comparison data available for this period.
        </div>
      ) : (
        <div className="w-full pt-2">
          {/* Legend */}
          <div className="flex items-center justify-end gap-5 text-xs text-text-secondary mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />
              <span>Your Recorded (kg)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-secondary inline-block" />
              <span>Target Benchmark</span>
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisons}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9E5" />
                <XAxis
                  dataKey="category"
                  tick={{ fill: '#778078', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E9E5' }}
                />
                <YAxis
                  tick={{ fill: '#778078', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E9E5' }}
                  domain={[0, 'dataMax + 10']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="recorded"
                  name="Your Footprint"
                  fill="#245C45"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="benchmark"
                  name="Target Benchmark"
                  fill="#8BAF99"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
};
