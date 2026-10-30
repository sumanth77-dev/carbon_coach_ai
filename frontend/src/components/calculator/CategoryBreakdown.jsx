import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

/**
 * Category Breakdown Donut Chart for Calculated Results
 */
export const CategoryBreakdown = ({ breakdown = [], totalEmissions = 0 }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-md shadow-card p-2.5 text-xs">
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
            Share: <span className="font-medium text-text-main">{item.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
      {/* Donut Chart */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={breakdown}
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
              {breakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">
            Total
          </span>
          <span className="text-xl font-bold text-text-main leading-tight">
            {totalEmissions}
          </span>
          <span className="text-[10px] text-text-secondary">kg CO₂e</span>
        </div>
      </div>

      {/* Legend & Percentages List */}
      <div className="w-full flex-1 space-y-2.5">
        {breakdown.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between p-2.5 rounded bg-background/60 border border-border/60 text-xs hover:bg-background transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-text-main truncate">{item.category}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <span className="text-text-secondary font-mono">{item.emission} kg CO₂e</span>
              <span className="font-semibold text-text-main w-10 text-right font-mono">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
