import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';
import { Button } from '../common/Button';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'food', label: 'Food' },
  { value: 'waste', label: 'Waste' },
  { value: 'shopping', label: 'Shopping' },
];

const DATE_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Emissions' },
  { value: 'lowest', label: 'Lowest Emissions' },
];

export const ActivityFilters = ({
  category,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  onResetFilters,
}) => {
  const hasActiveFilters = category !== 'all' || dateRange !== 'all' || search.trim() !== '' || sortBy !== 'newest';

  return (
    <div className="bg-surface border border-border rounded-lg shadow-subtle p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search activities or notes..."
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            {DATE_RANGES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onResetFilters}
              title="Reset all filters"
              icon={RotateCcw}
              className="shrink-0 px-2.5"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
