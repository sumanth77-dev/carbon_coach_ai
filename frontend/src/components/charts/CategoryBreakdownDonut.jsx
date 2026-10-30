import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

/**
 * Donut chart showing category breakdown for Transportation, Electricity, Food, and Waste.
 * Conforms strictly to the brand palette (#245C45, #3B7A5E, #5B9377, #8BAF99).
 */
export const CategoryBreakdownDonut = ({ data = [] }) => {
  // Defensively consolidate categories so each category appears strictly once
  const consolidatedData = React.useMemo(() => {
    const map = {};
    for (const item of data) {
      const cat = item.category;
      if (!map[cat]) {
        map[cat] = { ...item };
      } else {
        map[cat].emission = parseFloat((map[cat].emission + item.emission).toFixed(2));
      }
    }
    const total = Object.values(map).reduce((sum, it) => sum + (it.emission || 0), 0);
    return Object.values(map).map((it) => ({
      ...it,
      percentage: total > 0 ? Math.round((it.emission / total) * 100) : 0,
    }));
  }, [data]);

  const totalEmission = consolidatedData.reduce((acc, item) => acc + (item.emission || 0), 0);

  // Custom clean tooltip matching the design system
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

  if (!consolidatedData || consolidatedData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-text-secondary">
        No category emission data logged yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-1">
      {/* Donut Chart with Center Metric */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={consolidatedData}
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
              {consolidatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Summary */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">Total</span>
          <span className="text-lg font-bold text-text-main leading-tight">
            {totalEmission.toFixed(1)}
          </span>
          <span className="text-[10px] text-text-secondary">kg CO₂e</span>
        </div>
      </div>

      {/* Structured Category Legend with Percentages */}
      <div className="w-full flex-1 space-y-2.5">
        {consolidatedData.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between p-2 rounded bg-background/60 border border-border/50 text-xs hover:bg-background transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-text-main truncate">{item.category}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <span className="text-text-secondary font-mono">{item.emission} kg</span>
              <span className="font-semibold text-text-main w-9 text-right font-mono">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
