import React, { useState } from 'react';
import { Button } from '../common/Button';

/**
 * Form scaffold for logging a carbon emission activity.
 */
export const EmissionLogForm = ({ onSubmit }) => {
  const [category, setCategory] = useState('transportation');
  const [activityName, setActivityName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ category, activityName, quantity: parseFloat(quantity) });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">Activity Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="transportation">Transportation</option>
          <option value="energy">Home & Energy</option>
          <option value="diet">Food & Diet</option>
          <option value="consumption">Goods & Shopping</option>
          <option value="waste">Waste</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">Activity Description</label>
        <input
          type="text"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          placeholder="e.g. Flight to Chicago, Weekly groceries"
          className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">Quantity / Metric Value</label>
        <input
          type="number"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 50 (km, kWh, etc.)"
          className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" className="w-full">
          Log Activity
        </Button>
      </div>
    </form>
  );
};
