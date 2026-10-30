import React, { useState } from 'react';
import { Plus, Trash2, Zap, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

const APPLIANCE_TYPES = [
  { value: 'ac', label: 'Air Conditioner (AC)' },
  { value: 'refrigerator', label: 'Refrigerator' },
  { value: 'fan', label: 'Ceiling / Desk Fan' },
  { value: 'tv', label: 'Television (LED / OLED)' },
  { value: 'washing_machine', label: 'Washing Machine' },
  { value: 'other', label: 'Other Appliance' },
];

export const ElectricityForm = ({ onAddActivity, activities = [], onRemoveActivity }) => {
  const [method, setMethod] = useState('direct'); // 'direct' or 'appliance'
  const [consumptionKwh, setConsumptionKwh] = useState('');

  // Appliance fields
  const [applianceType, setApplianceType] = useState('ac');
  const [powerWatts, setPowerWatts] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [days, setDays] = useState('1');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');

    if (method === 'direct') {
      const kwh = parseFloat(consumptionKwh);
      if (isNaN(kwh) || kwh <= 0) {
        setError('Electricity consumption must be a positive number greater than 0 kWh.');
        return;
      }

      const newActivity = {
        id: `electricity-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        category: 'electricity',
        method: 'direct',
        activity_type: 'grid_electricity',
        activityName: `Grid Electricity (${kwh} kWh)`,
        consumption_kwh: kwh,
        displaySummary: `${kwh} kWh direct grid consumption`,
      };

      onAddActivity(newActivity);
      setConsumptionKwh('');
    } else {
      // Appliance-based method
      const watts = parseFloat(powerWatts);
      if (isNaN(watts) || watts <= 0) {
        setError('Power rating must be a positive number in Watts.');
        return;
      }

      const hours = parseFloat(hoursPerDay);
      if (isNaN(hours) || hours <= 0 || hours > 24) {
        setError('Usage hours per day must be between 0.1 and 24 hours.');
        return;
      }

      const numDays = parseInt(days, 10);
      if (isNaN(numDays) || numDays < 1) {
        setError('Number of days must be at least 1.');
        return;
      }

      const selectedAppliance = APPLIANCE_TYPES.find((a) => a.value === applianceType);

      const newActivity = {
        id: `electricity-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        category: 'electricity',
        method: 'appliance',
        activity_type: applianceType,
        appliance_type: selectedAppliance?.label || applianceType,
        activityName: `Appliance: ${selectedAppliance?.label || applianceType}`,
        power_watts: watts,
        hours_per_day: hours,
        days: numDays,
        displaySummary: `${selectedAppliance?.label || applianceType} • ${watts}W • ${hours} hrs/day for ${numDays} day(s)`,
      };

      onAddActivity(newActivity);
      setPowerWatts('');
      setHoursPerDay('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Method Selector Tabs */}
      <div className="flex rounded-md border border-border p-1 bg-background max-w-sm">
        <button
          type="button"
          onClick={() => {
            setMethod('direct');
            setError('');
          }}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-colors ${
            method === 'direct'
              ? 'bg-surface text-text-main shadow-subtle font-semibold'
              : 'text-text-secondary hover:text-text-main'
          }`}
        >
          Direct (kWh Meter)
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod('appliance');
            setError('');
          }}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-colors ${
            method === 'appliance'
              ? 'bg-surface text-text-main shadow-subtle font-semibold'
              : 'text-text-secondary hover:text-text-main'
          }`}
        >
          Appliance Estimation
        </button>
      </div>

      <form onSubmit={handleAdd} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {method === 'direct' ? (
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Electricity Consumed (kWh) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.1"
              value={consumptionKwh}
              onChange={(e) => {
                setConsumptionKwh(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. 120 (from electricity bill or meter)"
              className="w-full max-w-md px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <p className="text-[11px] text-text-secondary mt-1">
              Enter the total kilowatt-hours consumed across your billing or evaluation cycle.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Appliance Type <span className="text-red-500">*</span>
              </label>
              <select
                value={applianceType}
                onChange={(e) => setApplianceType(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {APPLIANCE_TYPES.map((app) => (
                  <option key={app.value} value={app.value}>
                    {app.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Power Rating (Watts) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={powerWatts}
                onChange={(e) => setPowerWatts(e.target.value)}
                placeholder="e.g. 1500 (for AC) or 75 (for Fan)"
                className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Hours Used per Day <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                max="24"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                placeholder="e.g. 8"
                className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Number of Days
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" icon={Plus}>
            Add Electricity Entry
          </Button>
        </div>
      </form>

      {/* Queued Activities List */}
      {activities.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider mb-2.5">
            Electricity Activities in Queue ({activities.length})
          </h4>
          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-background border border-border rounded-md flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-[#3B7A5E]/10 text-[#3B7A5E] flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-text-main truncate">{act.activityName}</p>
                    <p className="text-text-secondary">{act.displaySummary}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveActivity(act.id)}
                  aria-label="Remove electricity activity"
                  className="p-1 text-text-secondary hover:text-red-600 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
