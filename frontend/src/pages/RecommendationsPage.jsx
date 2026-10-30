import React from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const RecommendationsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">AI Carbon Recommendations</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Tailored emission reduction strategies analyzed by Google ADK & Gemini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="accent">Energy Efficiency</Badge>
                <Badge variant="neutral">Difficulty: Easy</Badge>
              </div>
              <h3 className="text-base font-semibold text-text-main">Smart Thermostat Night Setback</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Lowering heating by 2°C during sleep hours will cut monthly residential heating emissions by approximately 8%.
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs">
                <span className="font-semibold text-primary">Potential: -28 kg CO2e / mo</span>
                <span className="text-text-secondary">Est. Savings: $18/mo</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={CheckCircle2}>
              Adopt
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="accent">Transportation</Badge>
                <Badge variant="neutral">Difficulty: Moderate</Badge>
              </div>
              <h3 className="text-base font-semibold text-text-main">Weekly Remote Work Day</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Working from home one additional day per week eliminates 60km of personal car commute emissions weekly.
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs">
                <span className="font-semibold text-primary">Potential: -52 kg CO2e / mo</span>
                <span className="text-text-secondary">Est. Savings: $40/mo</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={CheckCircle2}>
              Adopt
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
