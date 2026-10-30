import React from 'react';
import { Car, Zap, Utensils, Trash2 } from 'lucide-react';

export const CATEGORIES = [
  { id: 'transportation', label: 'Transportation', icon: Car, color: '#245C45' },
  { id: 'electricity', label: 'Electricity', icon: Zap, color: '#3B7A5E' },
  { id: 'food', label: 'Food', icon: Utensils, color: '#5B9377' },
  { id: 'waste', label: 'Waste', icon: Trash2, color: '#8BAF99' },
];

/**
 * Category navigation tabs for the Carbon Footprint Calculator.
 */
export const CalculatorTabs = ({ activeTab, onSelectTab, counts = {} }) => {
  return (
    <div className="border-b border-border">
      <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectTab(cat.id)}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors focus:outline-none ${
                isActive
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-text-secondary hover:text-text-main hover:border-border'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold rounded-full ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-background border border-border text-text-secondary'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
