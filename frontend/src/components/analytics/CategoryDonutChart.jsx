import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../common/Card';

export const CategoryDonutChart = ({ categories = [], isLoading = false }) => {
  const total = categories.reduce((sum, item) => sum + (Number(item.emission) || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg shadow-card p-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-semibold text-text-main">{item.category}</span>
          </div>
          <p className="text-text-secondary">
            Emissions: <span className="font-medium text-text-main">{item.emission} kg CO₂e</span>
          </p>
          <p className="text-text-secondary">
            Contribution: <span className="font-medium text-text-main">{item.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Category Breakdown"
      subtitle="Proportional share of carbon emissions across sectors"
      className="h-full flex flex-col justify-between"
    >
      {isLoading ? (
        <div className="h-64 flex items-center justify-center animate-pulse">
          <div className="w-40 h-40 rounded-full border-4 border-border/40 border-t-primary" />
        </div>
      ) : categories.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-text-secondary">
          No category records available for this period.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
          {/* Donut Chart */}
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="emission"
                  nameKey="category"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#245C45'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                Period Total
              </span>
              <span className="text-lg font-bold text-text-main leading-tight font-mono">
                {total.toFixed(1)}
              </span>
              <span className="text-[10px] text-text-secondary">kg CO₂e</span>
            </div>
          </div>

          {/* Structured Legend */}
          <div className="w-full flex-1 space-y-2">
            {categories.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between p-2 rounded-md bg-background/70 border border-border/60 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-text-main truncate">{item.category}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-text-secondary font-mono">{item.emission} kg</span>
                  <span className="font-semibold text-text-main w-10 text-right font-mono">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
