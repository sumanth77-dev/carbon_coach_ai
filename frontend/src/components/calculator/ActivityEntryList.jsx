import React from 'react';
import { Calculator, RotateCcw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Summary control bar displaying total queued activities, Clear All action,
 * and the primary 'Calculate My Carbon Footprint' button.
 */
export const ActivityEntryList = ({
  totalActivitiesCount,
  countsByCategory = {},
  onClearAll,
  onCalculate,
  isCalculating = false,
  validationError = '',
}) => {
  return (
    <div className="bg-surface border border-border rounded-lg shadow-subtle p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text-main">
              Session Activity Queue ({totalActivitiesCount})
            </h3>
            {totalActivitiesCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready to Calculate
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {totalActivitiesCount === 0 ? (
              'Add at least one activity in any category above to estimate your footprint.'
            ) : (
              <span>
                {countsByCategory.transportation || 0} Transport •{' '}
                {countsByCategory.electricity || 0} Electricity •{' '}
                {countsByCategory.food || 0} Food •{' '}
                {countsByCategory.waste || 0} Waste
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {totalActivitiesCount > 0 && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isCalculating}
              onClick={onClearAll}
              icon={RotateCcw}
            >
              Clear Form
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={isCalculating || totalActivitiesCount === 0}
            onClick={onCalculate}
            icon={isCalculating ? Loader2 : Calculator}
            className={isCalculating ? 'opacity-80' : ''}
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating...
              </span>
            ) : (
              'Calculate My Carbon Footprint'
            )}
          </Button>
        </div>
      </div>

      {validationError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
