import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

const WASTE_CATEGORIES = [
  { value: 'plastic', label: 'Plastic Waste' },
  { value: 'paper', label: 'Paper & Cardboard' },
  { value: 'organic_waste', label: 'Organic / Food Waste' },
  { value: 'general_waste', label: 'General Household Waste' },
  { value: 'metal', label: 'Metal / Cans' },
  { value: 'glass', label: 'Glass Bottles & Jars' },
  { value: 'other', label: 'Other Waste Type' },
];

const DISPOSAL_METHODS = [
  { value: 'landfill', label: 'Landfill Disposal' },
  { value: 'recycling', label: 'Recycled' },
  { value: 'composting', label: 'Composted' },
  { value: 'other', label: 'Other Treatment' },
];

export const WasteForm = ({ onAddActivity, activities = [], onRemoveActivity }) => {
  const [wasteCategory, setWasteCategory] = useState('plastic');
  const [quantity, setQuantity] = useState('');
  const [disposalMethod, setDisposalMethod] = useState('landfill');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError('Waste quantity must be a positive number greater than 0 kg.');
      return;
    }

    const selectedCategory = WASTE_CATEGORIES.find((w) => w.value === wasteCategory);
    const selectedMethod = DISPOSAL_METHODS.find((d) => d.value === disposalMethod);

    const newActivity = {
      id: `waste-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'waste',
      waste_type: wasteCategory,
      activity_type: wasteCategory,
      activityName: `${selectedCategory?.label || wasteCategory} (${qtyNum} kg)`,
      quantity: qtyNum,
      unit: 'kg',
      disposal_method: disposalMethod,
      displaySummary: `${qtyNum} kg • ${selectedMethod?.label || disposalMethod}`,
    };

    onAddActivity(newActivity);
    setQuantity('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Waste Category <span className="text-red-500">*</span>
            </label>
            <select
              value={wasteCategory}
              onChange={(e) => setWasteCategory(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {WASTE_CATEGORIES.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Quantity (Kilograms) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. 2.5"
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Disposal Method <span className="text-red-500">*</span>
            </label>
            <select
              value={disposalMethod}
              onChange={(e) => setDisposalMethod(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {DISPOSAL_METHODS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" icon={Plus}>
            Add Waste Entry
          </Button>
        </div>
      </form>

      {/* Queued Activities List */}
      {activities.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider mb-2.5">
            Waste Activities in Queue ({activities.length})
          </h4>
          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-background border border-border rounded-md flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-secondary/20 text-primary-dark flex items-center justify-center shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-text-main truncate">{act.activityName}</p>
                    <p className="text-text-secondary">{act.displaySummary}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveActivity(act.id)}
                  aria-label="Remove waste activity"
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
