import React from 'react';
import { Card } from '../components/common/Card';
import { EmissionLogForm } from '../components/forms/EmissionLogForm';

export const ActivitiesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">Activity Telemetry</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Record and monitor daily carbon footprint activities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title="Log New Emission" subtitle="Provide activity details for calculation">
            <EmissionLogForm />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="Recent Activity Logs" subtitle="Historical records">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-text-secondary">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Activity</th>
                    <th className="py-2.5 px-3 text-right">CO2e (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2.5 px-3 text-text-secondary">Today</td>
                    <td className="py-2.5 px-3 font-medium">Transportation</td>
                    <td className="py-2.5 px-3">Commute by Metro</td>
                    <td className="py-2.5 px-3 text-right font-medium text-text-main">1.8</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-text-secondary">Yesterday</td>
                    <td className="py-2.5 px-3 font-medium">Energy</td>
                    <td className="py-2.5 px-3">Residential Power (Daily Avg)</td>
                    <td className="py-2.5 px-3 text-right font-medium text-text-main">8.4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
