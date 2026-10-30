import React from 'react';
import { Car, Zap, Utensils, Trash2, ShoppingBag, Layers } from 'lucide-react';

const categoryConfig = {
  transportation: {
    label: 'Transportation',
    icon: Car,
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  electricity: {
    label: 'Electricity',
    icon: Zap,
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  energy: {
    label: 'Electricity',
    icon: Zap,
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  food: {
    label: 'Food',
    icon: Utensils,
    bg: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  waste: {
    label: 'Waste',
    icon: Trash2,
    bg: 'bg-stone-100 text-stone-800 border-stone-200',
  },
  shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    bg: 'bg-sky-50 text-sky-800 border-sky-200',
  },
};

export const ActivityCategoryBadge = ({ category = '' }) => {
  const key = category?.toLowerCase();
  const config = categoryConfig[key] || {
    label: category || 'Other',
    icon: Layers,
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${config.bg}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
