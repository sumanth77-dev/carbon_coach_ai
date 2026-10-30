import React from 'react';
import { Target, TrendingDown, CheckCircle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

/**
 * Section 1.C: Your Carbon Reduction Opportunities component for Analytics.
 * Highlights the user's highest emission sector, specific practical actions, and historical progress.
 */
export const CarbonReductionOpportunities = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card
        title="Your Carbon Reduction Opportunities"
        subtitle="Identifying high-impact reduction pathways based on your activity data"
      >
        <div className="space-y-4 animate-pulse">
          <div className="h-16 bg-border/20 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-border/20 rounded-lg"></div>
            <div className="h-32 bg-border/20 rounded-lg"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const {
    highestCategory = 'Transportation',
    highestCategoryEmissions = 0,
    sharePercentage = 0,
    opportunities = [],
    progress = {},
  } = data;

  const {
    currentTotal = 0,
    dailyTarget = 16.0,
    status = 'Within sustainable carbon budget',
    historicalTrend = '',
  } = progress;

  const isUnderBudget = currentTotal <= dailyTarget;
  const budgetPercent = Math.min(100, Math.round((currentTotal / dailyTarget) * 100));

  return (
    <Card
      title="Your Carbon Reduction Opportunities"
      subtitle="Data-driven reduction levers targeted at your highest emission sector"
      action={
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
          Target: {highestCategory}
        </span>
      }
    >
      <div className="space-y-5">
        {/* Top Banner: Highest Emission Category Identification */}
        <div className="p-4 rounded-lg bg-background border border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Highest-Emission Sector
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-text-main tracking-tight">
                {highestCategory}
              </h3>
              <span className="text-xs font-semibold text-primary">
                ({sharePercentage}% of recorded emissions • {highestCategoryEmissions} kg CO₂e)
              </span>
            </div>
            <p className="text-xs text-text-secondary max-w-xl">
              Concentrating reduction efforts on {highestCategory.toLowerCase()} yields the most significant and immediate drop in your environmental footprint.
            </p>
          </div>

          {/* Progress against budget */}
          <div className="bg-surface p-3 rounded-md border border-border shrink-0 min-w-[220px] text-xs space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Budget Status:</span>
              <span className={`font-semibold ${isUnderBudget ? 'text-primary' : 'text-amber-700'}`}>
                {status}
              </span>
            </div>
            <div className="w-full bg-border/60 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${isUnderBudget ? 'bg-primary' : 'bg-amber-600'}`}
                style={{ width: `${budgetPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-text-secondary">
              <span>{currentTotal} kg logged</span>
              <span>Target: {dailyTarget} kg</span>
            </div>
          </div>
        </div>

        {/* Practical Ways to Reduce Emissions in this Category */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Practical Ways to Reduce Emissions in {highestCategory}
          </h4>

          {opportunities.length === 0 ? (
            <div className="p-4 rounded-md bg-background border border-border text-xs text-text-secondary text-center">
              Record more {highestCategory.toLowerCase()} activities to reveal tailored reduction strategies.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp, idx) => (
                <div
                  key={opp.id || idx}
                  className="p-4 rounded-lg bg-surface border border-border flex flex-col justify-between space-y-3 shadow-subtle hover:shadow-card transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {opp.category}
                      </span>
                      {opp.difficulty && (
                        <span className="text-[10px] text-text-secondary">
                          Effort: {opp.difficulty}
                        </span>
                      )}
                    </div>

                    <h5 className="text-sm font-semibold text-text-main leading-snug">
                      {opp.title}
                    </h5>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {opp.explanation}
                    </p>

                    {opp.action && (
                      <div className="p-2.5 rounded bg-background border border-border/80 text-xs flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-text-main text-[11px] block">
                            Recommended Action:
                          </span>
                          <span className="text-text-secondary text-[11px] leading-relaxed">
                            {opp.action}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {opp.estimatedSavings && (
                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-text-secondary text-[11px]">Estimated Impact:</span>
                      <span className="font-semibold text-primary font-mono text-[11px]">
                        {opp.estimatedSavings}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
