/**
 * Database Seed Script for Carbon Coach
 * Demonstrates standard seed data structure for initial system setup.
 */

export const seedEmissionFactors = [
  { category: 'transportation', subcategory: 'gasoline_car', factor: 0.21, unit: 'kg_co2e_per_km' },
  { category: 'transportation', subcategory: 'electric_car', factor: 0.05, unit: 'kg_co2e_per_km' },
  { category: 'transportation', subcategory: 'bus', factor: 0.08, unit: 'kg_co2e_per_km' },
  { category: 'transportation', subcategory: 'train', factor: 0.035, unit: 'kg_co2e_per_km' },
  { category: 'transportation', subcategory: 'flight_short_haul', factor: 0.15, unit: 'kg_co2e_per_km' },
  { category: 'energy', subcategory: 'grid_electricity', factor: 0.385, unit: 'kg_co2e_per_kwh' },
  { category: 'energy', subcategory: 'natural_gas', factor: 0.18, unit: 'kg_co2e_per_kwh' },
  { category: 'diet', subcategory: 'meat_heavy', factor: 7.2, unit: 'kg_co2e_per_day' },
  { category: 'diet', subcategory: 'vegetarian', factor: 3.8, unit: 'kg_co2e_per_day' },
  { category: 'diet', subcategory: 'vegan', factor: 2.9, unit: 'kg_co2e_per_day' },
];

console.log(`[Seed Definition] Loaded ${seedEmissionFactors.length} standard emission benchmark factors.`);
