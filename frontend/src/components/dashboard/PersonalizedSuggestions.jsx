import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingDown, CheckCircle, ArrowRight, Lightbulb, Compass } from 'lucide-react';
import { Badge } from '../common/Badge';

/**
 * Ways to Reduce Your Carbon Footprint section for Dashboard.
 * Displays 3 personalized suggestions based on user's actual recorded activities.
 */
export const PersonalizedSuggestions = ({ suggestions = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-60 bg-border/40 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-surface border border-border rounded-lg p-5 animate-pulse space-y-3">
              <div className="h-4 w-24 bg-border/50 rounded"></div>
              <div className="h-5 w-4/5 bg-border/60 rounded"></div>
              <div className="h-12 w-full bg-border/30 rounded"></div>
              <div className="h-10 w-full bg-border/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const categoryColorMap = {
    Transportation: {
      badge: 'bg-primary/10 text-primary border-primary/20',
      pill: '#245C45',
    },
    Electricity: {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      pill: '#3B7A5E',
    },
    Food: {
      badge: 'bg-teal-50 text-teal-800 border-teal-200',
      pill: '#5B9377',
    },
    Waste: {
      badge: 'bg-sage/20 text-primary-dark border-sage/30',
      pill: '#8BAF99',
    },
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-text-main tracking-tight">
              Ways to Reduce Your Carbon Footprint
            </h2>
            <p className="text-xs text-text-secondary">
              Personalized reduction opportunities derived from your actual recorded activities.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-text-secondary bg-surface px-2.5 py-1 rounded border border-border shrink-0 self-start sm:self-auto">
          3 Tailored Levers
        </span>
      </div>

      {/* 3 Personalized Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.slice(0, 3).map((item, idx) => {
          const colors = categoryColorMap[item.category] || categoryColorMap.Transportation;

          return (
            <div
              key={item.id || idx}
              className="bg-surface border border-border rounded-lg p-5 flex flex-col justify-between shadow-subtle hover:shadow-card transition-shadow"
            >
              <div className="space-y-3">
                {/* Header: Category Badge & AI Indicator */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${colors.badge}`}
                  >
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-text-secondary font-medium">
                    <Sparkles className="w-3 h-3 text-primary" />
                    Verified Agent
                  </span>
                </div>

                {/* Suggestion Title */}
                <h3 className="text-sm font-semibold text-text-main tracking-tight leading-snug">
                  {item.title}
                </h3>

                {/* Short Explanation */}
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.explanation}
                </p>

                {/* Why this is relevant to the user's activities */}
                {item.relevance && (
                  <div className="p-2.5 rounded bg-background border border-border/80 text-[11px]">
                    <span className="text-text-secondary font-medium block text-[10px] uppercase tracking-wider mb-0.5">
                      Why this applies to your footprint:
                    </span>
                    <span className="text-text-main font-medium leading-tight block">
                      {item.relevance}
                    </span>
                  </div>
                )}

                {/* Practical Action to Take */}
                {item.action && (
                  <div className="flex items-start gap-2 pt-1 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-semibold text-text-main block text-[11px]">
                        Action to take:
                      </span>
                      <p className="text-text-secondary text-[11px] leading-relaxed">
                        {item.action}
                      </p>
                    </div>
                  </div>
                )}

                {/* Estimated CO2 Savings - Only rendered when backend reliably provides it */}
                {item.estimatedSavings && (
                  <div className="p-2.5 rounded bg-primary/5 border border-primary/15 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <TrendingDown className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-medium text-text-secondary block uppercase tracking-wider">
                        Estimated CO₂ Savings
                      </span>
                      <span className="text-xs font-bold text-primary truncate block font-mono">
                        {item.estimatedSavings}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Link to Chat */}
              <div className="pt-3 border-t border-border mt-4 flex items-center justify-between text-[11px]">
                <span className="text-text-secondary text-[10px]">
                  {item.source || 'ADK Python Tools'}
                </span>
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  <span>Ask Coach</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
