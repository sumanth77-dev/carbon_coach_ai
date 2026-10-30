import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

/**
 * Responsive emission breakdown chart using Recharts.
 */
export const EmissionBarChart = ({ data = [] }) => {
  const defaultData = [
    { name: 'Transport', emission: 120 },
    { name: 'Energy', emission: 180 },
    { name: 'Food', emission: 90 },
    { name: 'Goods', emission: 60 },
    { name: 'Waste', emission: 25 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9E5" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#778078', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E9E5' }}
          />
          <YAxis
            tick={{ fill: '#778078', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E9E5' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E5E9E5',
              borderRadius: '0.375rem',
              fontSize: '12px',
              color: '#202923',
            }}
            formatter={(value) => [`${value} kg CO2e`, 'Emissions']}
          />
          <Bar dataKey="emission" fill="#245C45" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
