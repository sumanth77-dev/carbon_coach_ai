import React, { useState, useMemo } from 'react';
import { Calculator, Info, AlertCircle, RotateCw } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CalculatorTabs } from '../components/calculator/CalculatorTabs';
import { TransportForm } from '../components/calculator/TransportForm';
import { ElectricityForm } from '../components/calculator/ElectricityForm';
import { FoodForm } from '../components/calculator/FoodForm';
import { WasteForm } from '../components/calculator/WasteForm';
import { ActivityEntryList } from '../components/calculator/ActivityEntryList';
import { CalculatorResults } from '../components/calculator/CalculatorResults';
import { calculatorService } from '../services/calculatorService';

/**
 * Carbon Footprint Calculator Page
 */
export const CalculatorPage = () => {
  const [activeTab, setActiveTab] = useState('transportation');
  const [activities, setActivities] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiError, setApiError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [results, setResults] = useState(null);

  // Filter activities by category for child forms
  const activitiesByCategory = useMemo(() => {
    return {
      transportation: activities.filter((a) => a.category === 'transportation'),
      electricity: activities.filter((a) => a.category === 'electricity'),
      food: activities.filter((a) => a.category === 'food'),
      waste: activities.filter((a) => a.category === 'waste'),
    };
  }, [activities]);

  // Counts for tabs badges
  const categoryCounts = useMemo(() => {
    return {
      transportation: activitiesByCategory.transportation.length,
      electricity: activitiesByCategory.electricity.length,
      food: activitiesByCategory.food.length,
      waste: activitiesByCategory.waste.length,
    };
  }, [activitiesByCategory]);

  const handleAddActivity = (newActivity) => {
    setActivities((prev) => [...prev, newActivity]);
    setValidationError('');
    setApiError('');
  };

  const handleRemoveActivity = (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAll = () => {
    setActivities([]);
    setResults(null);
    setValidationError('');
    setApiError('');
  };

  const handleCalculate = async () => {
    setValidationError('');
    setApiError('');

    if (activities.length === 0) {
      setValidationError('Please enter at least one activity across any category before calculating.');
      return;
    }

    setIsCalculating(true);

    try {
      const calculationOutput = await calculatorService.calculateFootprint(activities);
      setResults(calculationOutput);

      // Smooth scroll down to results section
      setTimeout(() => {
        const resultsEl = document.getElementById('calculator-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setApiError(err.message || 'An error occurred while calculating emissions.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 3. Page Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
              Carbon Footprint Calculator
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Calculate the environmental impact of your everyday activities.
            </p>
          </div>
        </div>

        {/* Informational Note */}
        <div className="mt-3.5 p-3 rounded-md bg-background border border-border flex items-start gap-2.5 text-xs text-text-secondary">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            Enter your daily activities to estimate your carbon footprint using verified emission
            factors. You can enter details for multiple categories and calculate in one session.
          </span>
        </div>
      </div>

      {/* 4. Calculator Tabs & Forms Card */}
      <Card>
        <CalculatorTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          counts={categoryCounts}
        />

        <div className="pt-6">
          {activeTab === 'transportation' && (
            <TransportForm
              onAddActivity={handleAddActivity}
              activities={activitiesByCategory.transportation}
              onRemoveActivity={handleRemoveActivity}
            />
          )}

          {activeTab === 'electricity' && (
            <ElectricityForm
              onAddActivity={handleAddActivity}
              activities={activitiesByCategory.electricity}
              onRemoveActivity={handleRemoveActivity}
            />
          )}

          {activeTab === 'food' && (
            <FoodForm
              onAddActivity={handleAddActivity}
              activities={activitiesByCategory.food}
              onRemoveActivity={handleRemoveActivity}
            />
          )}

          {activeTab === 'waste' && (
            <WasteForm
              onAddActivity={handleAddActivity}
              activities={activitiesByCategory.waste}
              onRemoveActivity={handleRemoveActivity}
            />
          )}
        </div>
      </Card>

      {/* Session Queue Summary & Calculate Trigger */}
      <ActivityEntryList
        totalActivitiesCount={activities.length}
        countsByCategory={categoryCounts}
        onClearAll={handleClearAll}
        onCalculate={handleCalculate}
        isCalculating={isCalculating}
        validationError={validationError}
      />

      {/* API Error Box with Retry Option */}
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Calculation Service Notice</span>
              <p>{apiError}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCalculate}
            icon={RotateCw}
            className="shrink-0"
          >
            Retry
          </Button>
        </div>
      )}

      {/* 10. Results Section */}
      {results && <CalculatorResults results={results} />}
    </div>
  );
};
