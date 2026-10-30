import React from 'react';
import { Eye, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Calculator, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ActivityCategoryBadge } from './ActivityCategoryBadge';
import { Button } from '../common/Button';

export const ActivityTable = ({
  activities = [],
  isLoading = false,
  pagination = { page: 1, totalPages: 1, total: 0, limit: 10 },
  onPageChange,
  onSelectActivity,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg shadow-subtle overflow-hidden">
        <div className="p-8 space-y-4">
          <div className="h-6 w-48 bg-border/40 rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-border/20 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg shadow-subtle p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-4 text-text-secondary">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-text-main mb-1">No activities recorded yet.</h3>
        <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6">
          Start logging your daily routines or use our AI assistant to calculate your emissions automatically.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={MessageSquare}
            onClick={() => navigate('/chat')}
          >
            Chat with AI Coach
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Calculator}
            onClick={() => navigate('/calculator')}
          >
            Carbon Calculator
          </Button>
        </div>
      </div>
    );
  }

  const { page, totalPages, total, limit } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="bg-surface border border-border rounded-lg shadow-subtle overflow-hidden flex flex-col">
      {/* Table Container with horizontal overflow */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-background border-b border-border text-text-secondary uppercase tracking-wider text-[11px] font-semibold">
              <th className="py-3 px-4">Activity</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4 text-right">Emissions (kg CO₂e)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text-main">
            {activities.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-background/60 transition-colors group cursor-pointer"
                onClick={() => onSelectActivity(item)}
              >
                <td className="py-3.5 px-4 font-medium max-w-xs truncate text-text-main">
                  {item.activity}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <ActivityCategoryBadge category={item.category} />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-text-secondary">
                  {item.displayDate || new Date(item.date).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-text-secondary">
                  {item.quantity}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono font-bold text-primary">
                  {Number(item.emissions).toFixed(2)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    {item.status || 'Verified'}
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectActivity(item);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors px-2 py-1 rounded hover:bg-primary/5"
                    title="View calculation details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3 sm:p-4 border-t border-border bg-background/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
        <div>
          Showing <span className="font-semibold text-text-main">{startItem}</span> to{' '}
          <span className="font-semibold text-text-main">{endItem}</span> of{' '}
          <span className="font-semibold text-text-main">{total}</span> records
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            icon={ChevronLeft}
            className="px-2.5 py-1.5"
          >
            Previous
          </Button>
          <span className="px-2 text-text-main font-medium">
            Page {page} of {totalPages || 1}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            icon={ChevronRight}
            className="px-2.5 py-1.5"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
