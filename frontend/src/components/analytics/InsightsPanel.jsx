import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  Award,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Card } from '../common/Card';

export const InsightsPanel = ({
  insights = {},
  aiInsights = [],
  periodChange = '',
  periodChangeType = 'decrease',
  isLoading = false,
}) => {
  const {
    highestCategory = 'Transportation',
    lowestCategory = 'Waste',
    mostActiveDay = 'Not available',
  } = insights;

  const isPositive = periodChangeType === 'decrease';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Empirical Emission Insights */}
      <Card
        title="Emission Insights"
        subtitle="Empirical patterns identified from your telemetry records"
      >
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-border/20 rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-text-secondary block text-[11px]">Highest Emission Sector</span>
                  <span className="font-semibold text-text-main text-xs">{highestCategory}</span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Primary Focus
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-text-secondary block text-[11px]">Lowest Emission Sector</span>
                  <span className="font-semibold text-text-main text-xs">{lowestCategory}</span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Optimized
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-text-secondary block text-[11px]">Peak Impact Day</span>
                  <span className="font-semibold text-text-main text-xs">{mostActiveDay}</span>
                </div>
              </div>
            </div>

            {periodChange && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-secondary/15 text-primary border border-secondary/30 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-text-secondary block text-[11px]">Historical Period Shift</span>
                    <span
                      className={`font-semibold text-xs ${
                        isPositive ? 'text-primary' : 'text-amber-700'
                      }`}
                    >
                      {periodChange}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* AI Intelligence & Observations */}
      <Card
        title="AI Intelligence & Synthesis"
        subtitle="Automated analysis derived from your verified carbon trajectory"
        action={
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/20">
            <Sparkles className="w-3 h-3" />
            Gemini Engine
          </span>
        }
      >
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-border/20 rounded" />
            ))}
          </div>
        ) : !aiInsights || aiInsights.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-xs text-text-secondary text-center px-4">
            Record more activities to unlock personalized AI sustainability findings.
          </div>
        ) : (
          <div className="space-y-2.5 text-xs">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3 bg-background rounded-lg border border-border/70 flex items-start gap-2.5 transition-colors hover:border-border"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-text-main leading-relaxed font-normal">{insight}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
