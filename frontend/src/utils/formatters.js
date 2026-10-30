/**
 * Formatting utilities for numbers, currencies, and carbon metrics.
 */

export const formatCarbonEmission = (kgCo2e) => {
  if (typeof kgCo2e !== 'number' || isNaN(kgCo2e)) return '0 kg CO2e';
  if (kgCo2e >= 1000) {
    return `${(kgCo2e / 1000).toFixed(2)} tonnes CO2e`;
  }
  return `${kgCo2e.toFixed(1)} kg CO2e`;
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
