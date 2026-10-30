import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingDown } from 'lucide-react';
import { Badge } from '../common/Badge';

/**
 * Compact AI Recommendation Preview card.
 * Highlights prioritized recommendation and estimated carbon savings when available.
 */
export const RecommendationPreview = ({ recommendation }) => {
  if (!recommendation) {
    return (
      <div className="py-6 text-center text-xs text-text-secondary">
        <Sparkles className="w-6 h-6 text-text-secondary/50 mx-auto mb-2" />
        <p>No active recommendations yet.</p>
      </div>
    );
  }

  const { title, explanation, estimatedSavings, category, difficulty, source } = recommendation;

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>AI Coach Tip</span>
            </span>
            {category && (
              <Badge variant="neutral" size="sm">
                {category}
              </Badge>
            )}
          </div>
          {difficulty && (
            <span className="text-[11px] text-text-secondary">Difficulty: {difficulty}</span>
          )}
        </div>

        {/* Title & Explanation */}
        <h4 className="text-sm font-semibold text-text-main tracking-tight leading-snug">
          {title}
        </h4>
        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
          {explanation}
        </p>

        {/* Estimated Savings - Only rendered when provided by data */}
        {estimatedSavings && (
          <div className="mt-3.5 p-2.5 rounded bg-background border border-border flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">
                Projected Impact
              </p>
              <p className="text-xs font-semibold text-primary truncate">
                {estimatedSavings}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer link to full recommendations page */}
      <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
        <span className="text-[10px] text-text-secondary">
          {source || 'Gemini AI Agent'}
        </span>
        <Link
          to="/recommendations"
          className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary-dark transition-colors gap-1"
        >
          <span>Explore recommendations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
