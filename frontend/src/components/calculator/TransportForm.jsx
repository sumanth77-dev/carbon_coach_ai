import React, { useState } from 'react';
import { Plus, Trash2, Car, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

const TRANSPORT_MODES = [
  { value: 'bus', label: 'Bus (Public Transit)' },
  { value: 'petrol_bike', label: 'Petrol Motorbike / Scooter' },
  { value: 'diesel_bike', label: 'Diesel Motorbike' },
  { value: 'petrol_car', label: 'Petrol Passenger Car' },
  { value: 'diesel_car', label: 'Diesel Passenger Car' },
  { value: 'electric_car', label: 'Electric Vehicle (EV)' },
  { value: 'train', label: 'Train / Rail Transit' },
  { value: 'other', label: 'Other Transport Mode' },
];

const FREQUENCIES = [
  { value: 'one_time', label: 'One-time Trip' },
  { value: 'daily', label: 'Daily Commute' },
  { value: 'weekly', label: 'Weekly Travel' },
];

export const TransportForm = ({ onAddActivity, activities = [], onRemoveActivity }) => {
  const [mode, setMode] = useState('bus');
  const [distance, setDistance] = useState('');
  const [frequency, setFrequency] = useState('one_time');
  const [passengers, setPassengers] = useState('1');
  const [vehicleNotes, setVehicleNotes] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');

    const distNum = parseFloat(distance);
    if (isNaN(distNum) || distNum <= 0) {
      setError('Distance travelled must be greater than 0 kilometres.');
      return;
    }

    const passNum = parseInt(passengers, 10);
    if (isNaN(passNum) || passNum < 1) {
      setError('Passenger count must be at least 1.');
      return;
    }

    const selectedMode = TRANSPORT_MODES.find((m) => m.value === mode);
    const selectedFreq = FREQUENCIES.find((f) => f.value === frequency);

    const newActivity = {
      id: `transport-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'transportation',
      activity_type: mode,
      activityName: `${selectedMode?.label || mode} (${distNum} km)`,
      distance_km: distNum,
      frequency: frequency,
      passengers: passNum,
      vehicle_notes: vehicleNotes.trim(),
      displaySummary: `${distNum} km • ${selectedFreq?.label || frequency}${
        passNum > 1 ? ` • ${passNum} passengers` : ''
      }`,
    };

    onAddActivity(newActivity);
    setDistance('');
    setVehicleNotes('');
  };

  const isCarMode = ['petrol_car', 'diesel_car', 'electric_car'].includes(mode);

  return (
    <div className="space-y-6">
      {/* Form Input Section */}
      <form onSubmit={handleAdd} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Transport Mode <span className="text-red-500">*</span>
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {TRANSPORT_MODES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Distance Travelled (km) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.1"
              value={distance}
              onChange={(e) => {
                setDistance(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. 15.5"
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Travel Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {isCarMode && (
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Number of Passengers (Carpooling)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          )}

          <div className={isCarMode ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Vehicle Model / Notes (Optional)
            </label>
            <input
              type="text"
              value={vehicleNotes}
              onChange={(e) => setVehicleNotes(e.target.value)}
              placeholder="e.g. 2022 Hybrid sedan, City bus route #4"
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" icon={Plus}>
            Add Transport Activity
          </Button>
        </div>
      </form>

      {/* Category Activities List */}
      {activities.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider mb-2.5">
            Transportation Activities in Queue ({activities.length})
          </h4>
          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-background border border-border rounded-md flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-text-main truncate">{act.activityName}</p>
                    <p className="text-text-secondary">{act.displaySummary}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveActivity(act.id)}
                  aria-label="Remove transport activity"
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
