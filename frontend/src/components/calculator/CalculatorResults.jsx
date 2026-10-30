import React, { useState } from 'react';
import {
  Leaf,
  Sparkles,
  BookmarkCheck,
  Check,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CategoryBreakdown } from './CategoryBreakdown';
import { CalculationDetails } from './CalculationDetails';
import { calculatorService } from '../../services/calculatorService';

/**
 * Complete Results Section for Carbon Footprint Calculator.
 */
export const CalculatorResults = ({ results, onSaveSuccess }) => {
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [saveMessage, setSaveMessage] = useState('');

  if (!results) return null;

  const {
    totalEmissions = 0,
    unit = 'kg CO₂e',
    calculationPeriod = 'Single Session',
    activitiesCalculated = 0,
    calculationDate,
    categoryBreakdown = [],
    detailedResults = [],
    calculationInformation = {},
    reductionTip,
    aiInsight,
  } = results;

  const handleSaveToHistory = async () => {
    if (saveStatus === 'saved' || saveStatus === 'saving') return;

    setSaveStatus('saving');
    setSaveMessage('');

    try {
      const res = await calculatorService.saveActivitiesToHistory(detailedResults);
      setSaveStatus('saved');
      setSaveMessage(res.message || 'Activities successfully saved to your footprint history!');
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      setSaveStatus('error');
      setSaveMessage(err.message || 'Failed to save activities to history.');
    }
  };

  return (
    <div id="calculator-results-section" className="space-y-6 pt-2">
      {/* Total Footprint Header Card */}
      <div className="bg-surface border border-border rounded-lg shadow-subtle p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Calculation Output
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-text-main tracking-tight font-mono">
                {totalEmissions}
              </span>
              <span className="text-base font-semibold text-text-secondary">{unit}</span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Estimated total carbon footprint calculated from verified emission factors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-xs space-y-1 sm:text-right pr-2 sm:border-r border-border">
              <div className="flex items-center sm:justify-end gap-1.5 text-text-secondary">
                <Calendar className="w-3.5 h-3.5" />
                <span>Period: {calculationPeriod}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5 text-text-secondary">
                <Layers className="w-3.5 h-3.5" />
                <span>{activitiesCalculated} activities calculated</span>
              </div>
            </div>

            {/* Save to History Button */}
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <Button
                type="button"
                variant={saveStatus === 'saved' ? 'secondary' : 'primary'}
                size="md"
                disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                onClick={handleSaveToHistory}
                icon={
                  saveStatus === 'saving'
                    ? Loader2
                    : saveStatus === 'saved'
                    ? Check
                    : BookmarkCheck
                }
              >
                {saveStatus === 'saving' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : saveStatus === 'saved' ? (
                  'Saved to History'
                ) : (
                  'Save Activities to My History'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Feedback message for Save operation */}
        {saveMessage && (
          <div
            className={`mt-4 p-3 rounded-md text-xs flex items-center gap-2 ${
              saveStatus === 'saved'
                ? 'bg-primary/10 border border-primary/20 text-primary font-medium'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {saveStatus === 'saved' ? (
              <Check className="w-4 h-4 text-primary shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Section 1.B: Relevant Reduction Tip Post-Calculation */}
        {reductionTip && (
          <div className="mt-5 p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Personalized Reduction Tip
                </span>
              </div>
              {reductionTip.category && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface border border-border text-text-main">
                  {reductionTip.category}
                </span>
              )}
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-text-main">
                {reductionTip.title}
              </h4>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                {reductionTip.explanation}
              </p>
            </div>

            {reductionTip.action && (
              <div className="p-2.5 rounded bg-surface border border-border/70 text-xs flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text-main text-[11px] block">Action:</span>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    {reductionTip.action}
                  </p>
                </div>
              </div>
            )}

            {reductionTip.estimatedSavings && (
              <div className="text-[11px] text-primary font-semibold flex items-center gap-1.5 pt-0.5">
                <span className="text-text-secondary font-medium">Estimated Impact:</span>
                <span className="font-mono">{reductionTip.estimatedSavings}</span>
              </div>
            )}
          </div>
        )}

        {/* AI Insight Box */}
        {aiInsight && !reductionTip && (
          <div className="mt-5 p-3.5 bg-background border border-border rounded-md flex items-start gap-3 text-xs">
            <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-text-main block mb-0.5">
                AI Sustainability Insight
              </span>
              <p className="text-text-secondary leading-relaxed">{aiInsight}</p>
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown Card */}
      <Card
        title="Emission Breakdown by Category"
        subtitle="Distribution across Transportation, Electricity, Food, and Waste"
      >
        <CategoryBreakdown breakdown={categoryBreakdown} totalEmissions={totalEmissions} />
      </Card>

      {/* Detailed Items Table & Calculation Standards */}
      <Card
        title="Itemized Calculation Breakdown"
        subtitle="Transparent accounting with factor sources and quantities"
      >
        <CalculationDetails
          detailedResults={detailedResults}
          calculationInfo={calculationInformation}
          calculationDate={calculationDate}
        />
      </Card>
    </div>
  );
};
