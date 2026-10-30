import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Zap, Utensils, Trash2, ArrowRight, Activity as ActivityIcon } from 'lucide-react';

const CATEGORY_CONFIG = {
  transportation: {
    label: 'Transportation',
    icon: Car,
    bg: 'bg-primary/10',
    color: 'text-primary',
  },
  electricity: {
    label: 'Electricity',
    icon: Zap,
    bg: 'bg-[#3B7A5E]/10',
    color: 'text-[#3B7A5E]',
  },
  food: {
    label: 'Food',
    icon: Utensils,
    bg: 'bg-[#5B9377]/10',
    color: 'text-[#5B9377]',
  },
  waste: {
    label: 'Waste',
    icon: Trash2,
    bg: 'bg-secondary/20',
    color: 'text-primary-dark',
  },
};

/**
 * Professional, responsive activity table displaying recent carbon emission events.
 */
export const RecentActivityTable = ({ activities = [] }) => {
  const getCategoryDetails = (categoryName = '') => {
    const key = categoryName.toLowerCase();
    return (
      CATEGORY_CONFIG[key] || {
        label: categoryName || 'Other',
        icon: ActivityIcon,
        bg: 'bg-background',
        color: 'text-text-secondary',
      }
    );
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center">
        <ActivityIcon className="w-8 h-8 text-text-secondary/50 mx-auto mb-2" />
        <p className="text-xs text-text-secondary">No activity logs recorded yet.</p>
        <Link
          to="/activities"
          className="mt-3 inline-flex items-center text-xs font-semibold text-primary hover:text-primary-dark"
        >
          Log your first activity
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-border text-text-secondary">
              <th className="pb-3 font-medium">Activity</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Date & Time</th>
              <th className="pb-3 font-medium text-right">Emissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {activities.map((item) => {
              const categoryDetails = getCategoryDetails(item.category);
              const Icon = categoryDetails.icon;

              return (
                <tr key={item.id} className="hover:bg-background/50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-md ${categoryDetails.bg} ${categoryDetails.color} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-text-main">{item.activity}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-text-secondary">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-background border border-border">
                      {categoryDetails.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-text-secondary font-mono text-[11px]">
                    {item.date}
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <span className="font-semibold text-text-main font-mono">
                      {typeof item.emission === 'number' ? item.emission.toFixed(1) : item.emission}
                    </span>
                    <span className="text-[11px] text-text-secondary ml-1">kg CO₂e</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-3 border-t border-border mt-3 flex justify-end">
        <Link
          to="/activities"
          className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary-dark transition-colors gap-1"
        >
          <span>View all activity history</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
