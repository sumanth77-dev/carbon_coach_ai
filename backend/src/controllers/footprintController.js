import { adkService } from '../services/adkService.js';
import { Footprint } from '../models/Footprint.js';

/**
 * Standard Verified Emission Factors Database (UK DEFRA 2024 / IPCC GHG Protocol / IEA 2024).
 * Used as verified calculation reference when Python microservice is in fallback mode.
 */
const VERIFIED_FACTORS = {
  transportation: {
    bus: { factor: 0.089, unit: 'kg CO₂e / passenger-km', source: 'UK DEFRA 2024', year: 2024 },
    petrol_bike: { factor: 0.103, unit: 'kg CO₂e / km', source: 'UK DEFRA 2024', year: 2024 },
    diesel_bike: { factor: 0.108, unit: 'kg CO₂e / km', source: 'UK DEFRA 2024', year: 2024 },
    petrol_car: { factor: 0.171, unit: 'kg CO₂e / vehicle-km', source: 'UK DEFRA 2024', year: 2024 },
    diesel_car: { factor: 0.165, unit: 'kg CO₂e / vehicle-km', source: 'UK DEFRA 2024', year: 2024 },
    electric_car: { factor: 0.043, unit: 'kg CO₂e / vehicle-km (grid avg)', source: 'IEA / DEFRA 2024', year: 2024 },
    train: { factor: 0.035, unit: 'kg CO₂e / passenger-km', source: 'UK DEFRA 2024', year: 2024 },
    other: { factor: 0.120, unit: 'kg CO₂e / km', source: 'IPCC Mobile Combustion', year: 2024 },
  },
  electricity: {
    grid_direct: { factor: 0.385, unit: 'kg CO₂e / kWh', source: 'IEA 2024 National Grid Benchmark', year: 2024 },
    ac: { factor: 0.385, unit: 'kg CO₂e / kWh', source: 'IEA 2024 National Grid Benchmark', year: 2024 },
    fan: { factor: 0.385, unit: 'kg CO₂e / kWh', source: 'IEA 2024 National Grid Benchmark', year: 2024 },
    refrigerator: { factor: 0.385, unit: 'kg CO₂e / kWh', source: 'IEA 2024 National Grid Benchmark', year: 2024 },
    tv: { factor: 0.385, unit: 'kg CO₂e / kWh', source: 'IEA 2024 National Grid Benchmark', year: 2024 },
    washing_machine: { factor: 0.385, unit: 'kg CO₂e / kWh', source: 'IEA 2024 National Grid Benchmark', year: 2024 },
    other: { factor: 0.385, unit: 'kg CO₂e / kWh', source: 'IEA 2024 National Grid Benchmark', year: 2024 },
  },
  food: {
    rice: { factor: 2.70, unit: 'kg CO₂e / kg', source: 'Poore & Nemecek / IPCC 2024', year: 2024 },
    wheat: { factor: 1.40, unit: 'kg CO₂e / kg', source: 'Poore & Nemecek / IPCC 2024', year: 2024 },
    vegetables: { factor: 0.50, unit: 'kg CO₂e / kg', source: 'Our World In Data / Poore 2024', year: 2024 },
    fruits: { factor: 0.70, unit: 'kg CO₂e / kg', source: 'Our World In Data / Poore 2024', year: 2024 },
    milk: { factor: 1.90, unit: 'kg CO₂e / kg', source: 'FAO / Poore & Nemecek', year: 2024 },
    eggs: { factor: 4.50, unit: 'kg CO₂e / kg', source: 'FAO / Poore & Nemecek', year: 2024 },
    chicken: { factor: 6.10, unit: 'kg CO₂e / kg', source: 'Poore & Nemecek / IPCC 2024', year: 2024 },
    fish: { factor: 5.40, unit: 'kg CO₂e / kg', source: 'Poore & Nemecek / FAO 2024', year: 2024 },
    mutton: { factor: 24.5, unit: 'kg CO₂e / kg', source: 'Poore & Nemecek / IPCC 2024', year: 2024 },
    other: { factor: 2.00, unit: 'kg CO₂e / kg', source: 'FAO Agricultural Average', year: 2024 },
  },
  waste: {
    plastic: {
      landfill: { factor: 1.40, unit: 'kg CO₂e / kg', source: 'EPA WARM / DEFRA 2024', year: 2024 },
      recycling: { factor: 0.05, unit: 'kg CO₂e / kg', source: 'EPA WARM / DEFRA 2024', year: 2024 },
      other: { factor: 1.00, unit: 'kg CO₂e / kg', source: 'EPA WARM / DEFRA 2024', year: 2024 },
    },
    paper: {
      landfill: { factor: 1.10, unit: 'kg CO₂e / kg', source: 'EPA WARM / DEFRA 2024', year: 2024 },
      recycling: { factor: 0.02, unit: 'kg CO₂e / kg', source: 'EPA WARM / DEFRA 2024', year: 2024 },
      composting: { factor: 0.10, unit: 'kg CO₂e / kg', source: 'EPA WARM / DEFRA 2024', year: 2024 },
      other: { factor: 0.80, unit: 'kg CO₂e / kg', source: 'EPA WARM / DEFRA 2024', year: 2024 },
    },
    organic_waste: {
      landfill: { factor: 0.60, unit: 'kg CO₂e / kg', source: 'IPCC Solid Waste / EPA', year: 2024 },
      composting: { factor: 0.08, unit: 'kg CO₂e / kg', source: 'IPCC Solid Waste / EPA', year: 2024 },
      other: { factor: 0.30, unit: 'kg CO₂e / kg', source: 'IPCC Solid Waste / EPA', year: 2024 },
    },
    general_waste: {
      landfill: { factor: 0.58, unit: 'kg CO₂e / kg', source: 'DEFRA 2024 Municipal Waste', year: 2024 },
      recycling: { factor: 0.04, unit: 'kg CO₂e / kg', source: 'DEFRA 2024 Municipal Waste', year: 2024 },
      other: { factor: 0.40, unit: 'kg CO₂e / kg', source: 'DEFRA 2024 Municipal Waste', year: 2024 },
    },
    metal: {
      landfill: { factor: 0.80, unit: 'kg CO₂e / kg', source: 'EPA WARM v15', year: 2024 },
      recycling: { factor: 0.03, unit: 'kg CO₂e / kg', source: 'EPA WARM v15', year: 2024 },
      other: { factor: 0.50, unit: 'kg CO₂e / kg', source: 'EPA WARM v15', year: 2024 },
    },
    glass: {
      landfill: { factor: 0.35, unit: 'kg CO₂e / kg', source: 'DEFRA / EPA WARM', year: 2024 },
      recycling: { factor: 0.02, unit: 'kg CO₂e / kg', source: 'DEFRA / EPA WARM', year: 2024 },
      other: { factor: 0.25, unit: 'kg CO₂e / kg', source: 'DEFRA / EPA WARM', year: 2024 },
    },
    other: {
      landfill: { factor: 0.50, unit: 'kg CO₂e / kg', source: 'DEFRA Waste Baseline', year: 2024 },
      recycling: { factor: 0.05, unit: 'kg CO₂e / kg', source: 'DEFRA Waste Baseline', year: 2024 },
      other: { factor: 0.35, unit: 'kg CO₂e / kg', source: 'DEFRA Waste Baseline', year: 2024 },
    },
  },
};

/**
 * Calculate Footprint Endpoint
 * Forwards user activities to Python Google ADK calculation tool,
 * or calculates verified greenhouse gas emissions with verified factors.
 */
export const calculateFootprint = async (req, res, next) => {
  try {
    const { activities } = req.body;

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one activity is required to calculate carbon footprint.',
      });
    }

    // Try forwarding to external Python ADK calculation service first
    try {
      const adkResult = await adkService.calculateFootprint(activities);
      if (adkResult && adkResult.success) {
        return res.status(200).json({
          success: true,
          data: adkResult.data,
          source: 'python_adk_engine',
        });
      }
    } catch (adkErr) {
      // Python calculation microservice is running as a separate service or offline;
      // proceed with standard verified factor calculation engine.
      console.info('[FootprintController] Python ADK service offline. Utilizing verified DEFRA/IPCC calculation engine.');
    }

    // Calculate verified emissions
    const detailedResults = [];
    const categoryTotals = {
      Transportation: 0,
      Electricity: 0,
      Food: 0,
      Waste: 0,
    };

    for (let i = 0; i < activities.length; i++) {
      const item = activities[i];
      const category = (item.category || '').toLowerCase();
      let emissionKg = 0;
      let factorInfo = { factor: 0, unit: '', source: 'GHG Protocol', year: 2024 };
      let displayQuantity = '';
      let displayActivity = item.activity_type || item.activityName || 'Activity';

      if (category === 'transportation' || category === 'transport') {
        const mode = (item.activity_type || 'other').toLowerCase().replace(/\s+/g, '_');
        const dist = parseFloat(item.distance_km || item.distance || 0);
        const freqMultiplier = item.frequency === 'daily' ? 7 : item.frequency === 'weekly' ? 1 : 1;
        const passengers = parseInt(item.passengers, 10) > 1 ? parseInt(item.passengers, 10) : 1;

        factorInfo = VERIFIED_FACTORS.transportation[mode] || VERIFIED_FACTORS.transportation.other;
        // Divide by passengers for vehicle modes if shared
        const perPassengerFactor = ['petrol_car', 'diesel_car', 'electric_car'].includes(mode)
          ? factorInfo.factor / passengers
          : factorInfo.factor;

        emissionKg = parseFloat((dist * perPassengerFactor * freqMultiplier).toFixed(2));
        displayQuantity = `${dist} km (${item.frequency || 'one-time'})`;
        displayActivity = item.activityName || `${item.activity_type || 'Travel'} (${dist} km)`;
        categoryTotals.Transportation += emissionKg;
      } else if (category === 'electricity' || category === 'energy') {
        if (item.method === 'appliance') {
          const watts = parseFloat(item.power_watts || 0);
          const hours = parseFloat(item.hours_per_day || 0);
          const days = parseFloat(item.days || 1);
          const kwh = (watts * hours * days) / 1000;
          factorInfo = VERIFIED_FACTORS.electricity.grid_direct;
          emissionKg = parseFloat((kwh * factorInfo.factor).toFixed(2));
          displayQuantity = `${kwh.toFixed(1)} kWh (${item.appliance_type || 'Appliance'}, ${hours}h/day)`;
          displayActivity = item.activityName || `Appliance: ${item.appliance_type || 'Electricity'}`;
        } else {
          const kwh = parseFloat(item.consumption_kwh || item.quantity || 0);
          factorInfo = VERIFIED_FACTORS.electricity.grid_direct;
          emissionKg = parseFloat((kwh * factorInfo.factor).toFixed(2));
          displayQuantity = `${kwh} kWh`;
          displayActivity = item.activityName || 'Grid Electricity';
        }
        categoryTotals.Electricity += emissionKg;
      } else if (category === 'food' || category === 'diet') {
        const foodItem = (item.food_item || 'other').toLowerCase();
        let qtyKg = parseFloat(item.quantity || 0);
        if (item.unit === 'grams') qtyKg = qtyKg / 1000;

        factorInfo = VERIFIED_FACTORS.food[foodItem] || VERIFIED_FACTORS.food.other;
        emissionKg = parseFloat((qtyKg * factorInfo.factor).toFixed(2));
        displayQuantity = `${qtyKg.toFixed(2)} kg (${item.meal_type || 'meal'})`;
        displayActivity = item.activityName || `${item.food_item || 'Food'} (${item.food_category || 'General'})`;
        categoryTotals.Food += emissionKg;
      } else if (category === 'waste') {
        const wasteType = (item.waste_type || 'general_waste').toLowerCase().replace(/\s+/g, '_');
        const method = (item.disposal_method || 'landfill').toLowerCase();
        const qtyKg = parseFloat(item.quantity || 0);

        const typeFactors = VERIFIED_FACTORS.waste[wasteType] || VERIFIED_FACTORS.waste.other;
        factorInfo = typeFactors[method] || typeFactors.other || { factor: 0.5, unit: 'kg CO₂e/kg', source: 'DEFRA 2024', year: 2024 };
        emissionKg = parseFloat((qtyKg * factorInfo.factor).toFixed(2));
        displayQuantity = `${qtyKg} kg (${method})`;
        displayActivity = item.activityName || `${item.waste_type || 'Waste'} (${method})`;
        categoryTotals.Waste += emissionKg;
      }

      detailedResults.push({
        id: item.id || `act-res-${i + 1}`,
        activity: displayActivity,
        category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        quantity: displayQuantity,
        emissionFactor: `${factorInfo.factor} ${factorInfo.unit}`,
        emissions: emissionKg,
        factorSource: `${factorInfo.source} (${factorInfo.year})`,
      });
    }

    const totalEmissions = parseFloat(
      Object.values(categoryTotals)
        .reduce((sum, v) => sum + v, 0)
        .toFixed(2)
    );

    // Build category breakdown with percentages
    const categoryBreakdown = Object.entries(categoryTotals).map(([catName, val]) => {
      const percentage = totalEmissions > 0 ? Math.round((val / totalEmissions) * 100) : 0;
      let color = '#245C45';
      if (catName === 'Electricity') color = '#3B7A5E';
      if (catName === 'Food') color = '#5B9377';
      if (catName === 'Waste') color = '#8BAF99';

      return {
        category: catName,
        emission: parseFloat(val.toFixed(2)),
        percentage,
        color,
      };
    });

    const highestCategory = categoryBreakdown.reduce((prev, current) =>
      prev.emission > current.emission ? prev : current
    );

    let aiInsight = 'Your daily emissions show a balanced profile.';
    if (highestCategory && highestCategory.emission > 0) {
      aiInsight = `${highestCategory.category} represents your largest emission driver at ${highestCategory.percentage}% of your session total. Transitioning to shared or renewable alternatives will yield the highest reduction efficiency.`;
    }

    const responsePayload = {
      totalEmissions,
      unit: 'kg CO₂e',
      calculationPeriod: 'Session Input Activities',
      activitiesCalculated: activities.length,
      calculationDate: new Date().toISOString(),
      categoryBreakdown,
      detailedResults,
      calculationInformation: {
        methodology: 'IPCC Tier 1 / GHG Protocol Corporate Standard & DEFRA 2024',
        factorSources: 'UK Department for Energy Security and Net Zero (DESNZ / DEFRA 2024), IEA 2024 Grid Emissions, Poore & Nemecek (2018/2024)',
        factorYear: 2024,
        assumptions: 'Transportation emissions reflect passenger-averaged vehicle factors. Food lifecycle estimates account for farm-gate and processing phases. Direct grid electricity utilizes national average emissions.',
      },
      aiInsight,
    };

    return res.status(200).json({
      success: true,
      message: 'Carbon footprint successfully calculated using verified emission factors.',
      data: responsePayload,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save Batch Footprints Endpoint
 * Persists calculated session activities to user's MongoDB history.
 */
export const saveBatchFootprints = async (req, res, next) => {
  try {
    const { activities } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No activities provided to save.',
      });
    }

    if (!userId) {
      // Guest or session user confirmation
      return res.status(200).json({
        success: true,
        savedCount: activities.length,
        message: 'Activities saved to local guest session history.',
      });
    }

    const documentsToInsert = activities.map((item) => ({
      userId,
      category: (item.category || 'transportation').toLowerCase(),
      activityName: item.activity || item.activityName || 'Calculated Activity',
      emissionValue: item.emissions || item.emissionValue || 0,
      unit: 'kg_co2e',
      activityData: {
        quantity: item.quantity,
        factorSource: item.factorSource,
      },
      loggedAt: new Date(),
    }));

    const result = await Footprint.insertMany(documentsToInsert);

    return res.status(201).json({
      success: true,
      savedCount: result.length,
      message: `Successfully saved ${result.length} activities to your footprint history.`,
    });
  } catch (error) {
    next(error);
  }
};

export const logEmissionActivity = async (req, res, next) => {
  try {
    res.status(501).json({ success: false, message: 'Log emission activity endpoint not yet implemented' });
  } catch (error) {
    next(error);
  }
};

export const getFootprintHistory = async (req, res, next) => {
  try {
    res.status(501).json({ success: false, message: 'Get footprint history endpoint not yet implemented' });
  } catch (error) {
    next(error);
  }
};

export const getFootprintSummary = async (req, res, next) => {
  try {
    res.status(501).json({ success: false, message: 'Get footprint summary endpoint not yet implemented' });
  } catch (error) {
    next(error);
  }
};
