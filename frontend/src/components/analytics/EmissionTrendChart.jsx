import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Card } from '../common/Card';

export const EmissionTrendChart = ({ trends = [], isLoading = false, period = '7days' }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'area'

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const targetVal = dataPoint.target || 16.0;
      const difference = (dataPoint.emission - targetVal).toFixed(1);
      const isUnderTarget = dataPoint.emission <= targetVal;

      return (
        <div className="bg-surface border border-border rounded-lg shadow-card p-3 text-xs min-w-[160px]">
          <div className="font-semibold text-text-main pb-1 border-b border-border/80 flex items-center justify-between">
            <span>{dataPoint.label}</span>
            {dataPoint.date && <span className="text-[11px] text-text-secondary">{dataPoint.date}</span>}
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                Emissions:
              </span>
              <span className="font-mono font-bold text-text-main">{dataPoint.emission} kg CO₂e</span>
            </div>
            {targetVal && (
              <div className="flex justify-between items-center text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 border-t-2 border-dashed border-secondary inline-block" />
                  Target:
                </span>
                <span className="font-mono text-text-secondary">{targetVal} kg CO₂e</span>
              </div>
            )}
            <div className="pt-1.5 border-t border-border mt-1.5">
              <span
                className={`text-[11px] font-medium block ${
                  isUnderTarget ? 'text-primary' : 'text-amber-700'
                }`}
              >
                {isUnderTarget
                  ? `✓ ${Math.abs(difference)} kg below ceiling`
                  : `! ${difference} kg over ceiling`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const targetValue = trends.length > 0 ? trends[0].target : 16.0;

  return (
    <Card
      title="Emission Trends"
      subtitle="Recorded carbon footprint over the selected time horizon"
      action={
        <div className="flex items-center bg-background border border-border rounded-md p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-surface text-primary shadow-xs font-semibold'
                : 'text-text-secondary hover:text-text-main'
            }`}
          >
            Bar
          </button>
          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              chartType === 'area'
                ? 'bg-surface text-primary shadow-xs font-semibold'
                : 'text-text-secondary hover:text-text-main'
            }`}
          >
            Area
          </button>
        </div>
      }
    >
      {isLoading ? (
        <div className="h-64 flex items-center justify-center animate-pulse">
          <div className="w-full h-44 bg-border/20 rounded" />
        </div>
      ) : trends.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-text-secondary">
          No trend telemetry available for this period.
        </div>
      ) : (
        <div className="w-full pt-2">
          {/* Legend and Units */}
          <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
            <span className="font-medium">Emissions (kg CO₂e)</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />
                <span>Recorded</span>
              </div>
              {targetValue && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 border-t-2 border-dashed border-secondary inline-block" />
                  <span>Target Limit ({targetValue} kg)</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={trends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9E5" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#778078', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E9E5' }}
                  />
                  <YAxis
                    tick={{ fill: '#778078', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E9E5' }}
                    domain={[0, 'dataMax + 4']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {targetValue && (
                    <ReferenceLine
                      y={targetValue}
                      stroke="#8BAF99"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                  )}
                  <Bar
                    dataKey="emission"
                    name="Emissions"
                    fill="#245C45"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              ) : (
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#245C45" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#245C45" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9E5" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#778078', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E9E5' }}
                  />
                  <YAxis
                    tick={{ fill: '#778078', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E9E5' }}
                    domain={[0, 'dataMax + 4']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {targetValue && (
                    <ReferenceLine
                      y={targetValue}
                      stroke="#8BAF99"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="emission"
                    name="Emissions"
                    stroke="#245C45"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#trendGradient)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
};
