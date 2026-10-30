import React from 'react';
import { Info, FileText } from 'lucide-react';

/**
 * Detailed Calculation Results Table & Calculation Information metadata.
 */
export const CalculationDetails = ({ detailedResults = [], calculationInfo = {}, calculationDate }) => {
  const formattedDate = calculationDate
    ? new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(calculationDate))
    : new Date().toLocaleDateString();

  return (
    <div className="space-y-6">
      {/* Detailed Items Table */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-border text-text-secondary">
              <th className="pb-3 font-medium">Activity</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Input Quantity</th>
              <th className="pb-3 font-medium">Verified Emission Factor</th>
              <th className="pb-3 font-medium text-right">Calculated CO₂e</th>
              <th className="pb-3 font-medium pl-4">Factor Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {detailedResults.map((item) => (
              <tr key={item.id} className="hover:bg-background/50 transition-colors">
                <td className="py-3 pr-3 font-medium text-text-main max-w-[200px] truncate">
                  {item.activity}
                </td>
                <td className="py-3 px-3 text-text-secondary">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-background border border-border">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-3 text-text-secondary font-mono">{item.quantity}</td>
                <td className="py-3 px-3 text-text-secondary font-mono text-[11px]">
                  {item.emissionFactor}
                </td>
                <td className="py-3 pl-3 text-right font-mono font-semibold text-text-main">
                  {typeof item.emissions === 'number' ? item.emissions.toFixed(2) : item.emissions}{' '}
                  <span className="text-[10px] font-normal text-text-secondary">kg</span>
                </td>
                <td className="py-3 pl-4 text-text-secondary text-[11px] max-w-[180px] truncate">
                  {item.factorSource}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculation Information Card */}
      <div className="p-4 bg-background border border-border rounded-lg text-xs space-y-2">
        <div className="flex items-center gap-2 text-text-main font-semibold">
          <FileText className="w-4 h-4 text-primary" />
          <span>Calculation Methodology & Standards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px]">
          <div>
            <span className="text-text-secondary block">Calculation Timestamp</span>
            <span className="font-medium text-text-main">{formattedDate}</span>
          </div>
          <div>
            <span className="text-text-secondary block">Verified Factor Sources</span>
            <span className="font-medium text-text-main">
              {calculationInfo.factorSources || 'DEFRA 2024 / IPCC GHG Protocol / IEA 2024'}
            </span>
          </div>
          <div>
            <span className="text-text-secondary block">Standard Factor Year</span>
            <span className="font-medium text-text-main">
              {calculationInfo.factorYear || '2024'}
            </span>
          </div>
        </div>

        {calculationInfo.assumptions && (
          <div className="pt-2 border-t border-border/60 text-[11px] text-text-secondary flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
            <span>
              <strong>Assumptions & Scope:</strong> {calculationInfo.assumptions}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
