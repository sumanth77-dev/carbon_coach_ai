import React from 'react';
import { X, Leaf, Calendar, FileText, Info, Layers, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

/**
 * Activity Details Modal Dialog
 */
export const ActivityDetailsModal = ({ activity, onClose }) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fade-in">
      <div
        className="bg-surface border border-border rounded-xl shadow-card w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-text-main">
                Activity Calculation Details
              </h3>
              <p className="text-[11px] text-text-secondary">Verified Record #{activity.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-text-secondary hover:text-text-main hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          <div>
            <span className="text-[11px] text-text-secondary font-medium uppercase tracking-wider block mb-1">
              Activity Description
            </span>
            <p className="text-sm font-semibold text-text-main">{activity.activity}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-background rounded-lg border border-border">
            <div>
              <span className="text-text-secondary block mb-0.5">Category</span>
              <Badge variant="accent" size="sm">
                {activity.category}
              </Badge>
            </div>
            <div>
              <span className="text-text-secondary block mb-0.5">Status</span>
              <span className="inline-flex items-center gap-1 font-medium text-primary">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activity.status || 'Verified'}
              </span>
            </div>
            <div>
              <span className="text-text-secondary block mb-0.5">Input Quantity</span>
              <span className="font-mono font-medium text-text-main">{activity.quantity}</span>
            </div>
            <div>
              <span className="text-text-secondary block mb-0.5">Calculated Emissions</span>
              <span className="font-mono font-bold text-primary text-sm">
                {activity.emissions} {activity.unit || 'kg CO₂e'}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Timestamp</span>
              </div>
              <p className="font-medium text-text-main pl-5">
                {activity.displayDate || new Date(activity.date).toLocaleString()}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>Verified Emission Factor</span>
              </div>
              <p className="font-mono text-text-main pl-5">
                {activity.emissionFactor || 'Standard Factor'}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Factor Source</span>
              </div>
              <p className="text-text-main pl-5">{activity.factorSource || 'UK DEFRA 2024 / IPCC'}</p>
            </div>

            {activity.assumptions && (
              <div className="p-3 bg-background rounded-md border border-border/80">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-text-main">Calculation Assumptions</span>
                </div>
                <p className="text-text-secondary text-[11px] leading-relaxed">
                  {activity.assumptions}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-surface flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
