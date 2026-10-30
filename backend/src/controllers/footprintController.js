import { adkService } from '../services/adkService.js';
import { Footprint } from '../models/Footprint.js';

/**
 * Standard Verified Emission Factors Database (UK DEFRA 2024 / IPCC GHG Protocol / IEA 2024).
 * Used as reliable fallback when Python microservice is temporarily offline.
 */
const VERIFIED_FACTORS = {
  transportation: {
    bus: { factor: 0.089, unit: 'kg CO₂e / passenger-km', source: 'UK DEFRA 2024', year: 2024 },
    petrol_bike: { factor: 0.103, unit: 'kg CO₂e / km', source: 'UK DEFRA 2024', year: 2024 },
    diesel_bike: { factor: 0.108, unit: 'kg CO₂e / km', source: 'UK DEFRA 2024', year: 2024 },
    petrol_car: { factor: 0.171, unit: 'kg CO₂e / vehicle-km', source: 'UK DEFRA 2024', year: 2024 },
    diesel_car: { factor: 0.165, unit: 'kg CO₂e / vehicle-km', source: 'UK DEFRA 2024', year: 2024 },
    electric_car: { factor: 0.043, unit: 'kg CO₂e / vehicle-km', source: 'IEA / DEFRA 2024', year: 2024 },
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
    plastic: { factor: 1.40, unit: 'kg CO₂e / kg', source: 'EPA WARM / DEFRA 2024', year: 2024 },
    paper: { factor: 1.10, unit: 'kg CO₂e / kg', source: 'EPA WARM / DEFRA 2024', year: 2024 },
    organic: { factor: 0.08, unit: 'kg CO₂e / kg', source: 'IPCC Solid Waste / EPA', year: 2024 },
    other: { factor: 0.50, unit: 'kg CO₂e / kg', source: 'DEFRA Waste Baseline', year: 2024 },
  },
};

/**
 * Calculate Footprint Endpoint
 * Executes calculation using the Python calculation engine (factors.json)
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

    // Call Python calculation engine
    try {
      const pyResult = await adkService.calculateFootprint(activities);
      if (pyResult && pyResult.data) {
        return res.status(200).json({
          success: true,
          message: 'Carbon footprint successfully calculated using Python calculation tools.',
          data: pyResult.data,
          source: 'python_adk_engine',
        });
      }
    } catch (pyErr) {
      console.warn('[FootprintController] Python calculation service unreachable, falling back to local verified factors:', pyErr.message);
    }

    // Local fallback calculation if Python service is unavailable
    const detailedResults = [];
    const categoryTotals = { Transportation: 0, Electricity: 0, Food: 0, Waste: 0 };

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
        factorInfo = VERIFIED_FACTORS.transportation[mode] || VERIFIED_FACTORS.transportation.other;
        emissionKg = parseFloat((dist * factorInfo.factor).toFixed(3));
        displayQuantity = `${dist} km`;
        displayActivity = item.activityName || `${mode.replace('_', ' ')} (${dist} km)`;
        categoryTotals.Transportation += emissionKg;
      } else if (category === 'electricity' || category === 'energy') {
        const hours = parseFloat(item.hours_per_day || item.hours || 1);
        const kw = parseFloat(item.power_kw || (item.power_watts ? item.power_watts / 1000 : 0.06));
        const kwh = hours * kw;
        factorInfo = VERIFIED_FACTORS.electricity.grid_direct;
        emissionKg = parseFloat((kwh * factorInfo.factor).toFixed(3));
        displayQuantity = `${kwh.toFixed(2)} kWh`;
        displayActivity = item.activityName || `Electricity (${displayQuantity})`;
        categoryTotals.Electricity += emissionKg;
      } else if (category === 'food' || category === 'diet') {
        const foodItem = (item.food_item || item.activity_type || 'other').toLowerCase();
        let qtyKg = parseFloat(item.quantity || item.kg || 1);
        if (item.unit === 'grams') qtyKg = qtyKg / 1000;
        factorInfo = VERIFIED_FACTORS.food[foodItem] || VERIFIED_FACTORS.food.other;
        emissionKg = parseFloat((qtyKg * factorInfo.factor).toFixed(3));
        displayQuantity = `${qtyKg.toFixed(2)} kg`;
        displayActivity = item.activityName || `${foodItem} (${displayQuantity})`;
        categoryTotals.Food += emissionKg;
      } else if (category === 'waste') {
        const wasteType = (item.waste_type || item.activity_type || 'other').toLowerCase();
        const qtyKg = parseFloat(item.quantity || item.kg || 1);
        factorInfo = VERIFIED_FACTORS.waste[wasteType] || VERIFIED_FACTORS.waste.other;
        emissionKg = parseFloat((qtyKg * factorInfo.factor).toFixed(3));
        displayQuantity = `${qtyKg} kg`;
        displayActivity = item.activityName || `${wasteType} waste`;
        categoryTotals.Waste += emissionKg;
      }

      detailedResults.push({
        id: item.id || `calc-${i + 1}`,
        activity: displayActivity,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        quantity: displayQuantity,
        emissionFactor: `${factorInfo.factor} ${factorInfo.unit}`,
        emissions: emissionKg,
        formula: `${displayQuantity} x ${factorInfo.factor}`,
        factorSource: `${factorInfo.source} (${factorInfo.year})`,
        assumptions: 'Calculated using baseline emission factors.',
      });
    }

    const totalEmissions = parseFloat(Object.values(categoryTotals).reduce((sum, v) => sum + v, 0).toFixed(3));
    const categoryBreakdown = Object.entries(categoryTotals).map(([catName, val]) => ({
      category: catName,
      emission: parseFloat(val.toFixed(3)),
      percentage: totalEmissions > 0 ? Math.round((val / totalEmissions) * 100) : 0,
      color: catName === 'Transportation' ? '#245C45' : catName === 'Electricity' ? '#3B7A5E' : catName === 'Food' ? '#5B9377' : '#8BAF99',
    }));

    return res.status(200).json({
      success: true,
      message: 'Carbon footprint calculated.',
      data: {
        totalEmissions,
        unit: 'kg CO₂e',
        calculationPeriod: 'Session Input Activities',
        activitiesCalculated: activities.length,
        calculationDate: new Date().toISOString(),
        categoryBreakdown,
        detailedResults,
        calculationInformation: {
          methodology: 'UK DEFRA 2024 / IPCC GHG Protocol',
          factorSources: 'UK DEFRA 2024, IEA 2024 National Grid Benchmark, Poore & Nemecek',
          factorYear: 2024,
          assumptions: 'Verified emission factors.',
        },
        aiInsight: 'Calculated using verified emission factors.',
      },
      source: 'local_fallback',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save Batch Footprints Endpoint
 * Persists calculated session activities to SQLite (and MongoDB if user authenticated)
 */
export const saveBatchFootprints = async (req, res, next) => {
  try {
    const { activities } = req.body;
    const userId = req.user?.id || req.user?._id || 'default_user';

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No activities provided to save.',
      });
    }

    let savedCount = 0;

    // Log to Python SQLite database
    for (const act of activities) {
      try {
        await adkService.logActivity({
          category: (act.category || 'transport').toLowerCase(),
          activity_type: act.activity || act.activityName || 'activity',
          quantity: act.quantity ? parseFloat(String(act.quantity).replace(/[^\d.]/g, '')) || 1.0 : 1.0,
          unit: act.unit || 'units',
          kg_co2e: parseFloat(act.emissions || act.emissionValue || 0.0),
          user_id: userId,
          emission_factor: act.emissionFactor || '',
          formula: act.formula || '',
          source: act.factorSource || 'UK DEFRA 2024 / IPCC',
        });
        savedCount++;
      } catch (logErr) {
        console.warn('[FootprintController] Failed to log activity to SQLite:', logErr.message);
      }
    }

    // If authenticated in MongoDB, optionally persist to MongoDB collection too
    if (req.user?.id || req.user?._id) {
      try {
        const docs = activities.map((item) => ({
          userId,
          category: (item.category || 'transportation').toLowerCase(),
          activityName: item.activity || item.activityName || 'Activity',
          emissionValue: item.emissions || item.emissionValue || 0,
          unit: 'kg_co2e',
          activityData: {
            quantity: item.quantity,
            factorSource: item.factorSource,
          },
          loggedAt: new Date(),
        }));
        await Footprint.insertMany(docs);
      } catch (mongoErr) {
        console.warn('[FootprintController] MongoDB insertMany skipped:', mongoErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      savedCount,
      message: `Successfully saved ${savedCount} activities to activity history.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Footprint Summary Endpoint for Dashboard
 * Aggregates real SQLite telemetry data from Python service
 */
export const getFootprintSummary = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'default_user';

    let weeklyData = null;
    let dailyData = null;
    let allActs = [];
    let recs = null;

    try {
      const [weeklyRes, dailyRes, historyRes, recsRes] = await Promise.all([
        adkService.getWeeklySummary(userId),
        adkService.getDailySummary(userId),
        adkService.getActivities(userId, 500),
        adkService.getRecommendations(userId),
      ]);

      weeklyData = weeklyRes;
      dailyData = dailyRes;
      allActs = historyRes?.activities || [];
      recs = recsRes;
    } catch (err) {
      console.warn('[FootprintController] Python service telemetry query note:', err.message);
    }

    const todayKg = dailyData?.total_emissions_kg_co2e || 0;
    const weeklyKg = weeklyData?.total_emissions_kg_co2e || 0;
    const totalCount = allActs.length;
    const allTimeTotal = parseFloat(
      allActs.reduce((sum, act) => sum + (Number(act.kg_co2e) || 0), 0).toFixed(2)
    );

    // Build canonical category breakdown - strictly 0 duplicates
    const rawBreakdown = weeklyData?.category_breakdown || {};
    const colors = {
      transportation: '#245C45',
      electricity: '#3B7A5E',
      food: '#5B9377',
      waste: '#8BAF99',
      shopping: '#4F7965',
    };

    const mergedBreakdown = {};
    let totalCatEmissions = 0;

    for (const [k, v] of Object.entries(rawBreakdown)) {
      const catKey = (k || '').toLowerCase().trim();
      const normCat =
        catKey === 'transport' || catKey === 'transportation' ? 'Transportation' :
        catKey === 'electricity' || catKey === 'energy' ? 'Electricity' :
        catKey === 'food' || catKey === 'diet' ? 'Food' :
        catKey === 'waste' ? 'Waste' :
        catKey === 'shopping' ? 'Shopping' :
        k.charAt(0).toUpperCase() + k.slice(1);

      const kg = typeof v === 'object' ? Number(v.kg_co2e) || 0 : Number(v) || 0;
      mergedBreakdown[normCat] = parseFloat(((mergedBreakdown[normCat] || 0) + kg).toFixed(3));
      totalCatEmissions += kg;
    }

    const categoryBreakdown = Object.entries(mergedBreakdown).map(([catName, kg]) => {
      const pct = totalCatEmissions > 0 ? Math.round((kg / totalCatEmissions) * 100) : 0;
      return {
        category: catName,
        emission: kg,
        percentage: pct,
        color: colors[catName.toLowerCase()] || '#245C45',
      };
    });

    // Build weekly trend
    const rawDailyTrend = weeklyData?.daily_trend || {};
    const weeklyTrends = Object.entries(rawDailyTrend).map(([dStr, val]) => {
      const dt = new Date(dStr);
      const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        day: dayName || dStr,
        date: monthDay || dStr,
        emission: val,
        target: 16.0,
      };
    });

    // Format recent activities (first 5)
    const recentActivities = allActs.slice(0, 5).map((act) => {
      const c = (act.category || '').toLowerCase();
      const normCat =
        c === 'transport' || c === 'transportation' ? 'Transportation' :
        c === 'electricity' ? 'Electricity' :
        c === 'food' ? 'Food' :
        c === 'waste' ? 'Waste' :
        act.category.charAt(0).toUpperCase() + act.category.slice(1);

      return {
        id: act.activity_id,
        activity: (act.activity_type || 'Activity').replace(/_/g, ' ').replace(/\b\w/g, (x) => x.toUpperCase()),
        category: normCat,
        date: act.created_at ? new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(act.created_at)) : 'Recent',
        emission: act.kg_co2e,
        unit: 'kg CO₂e',
      };
    });

    // Format recommendations list
    const recommendationsList = (recs?.recommendations || []).map((r, idx) => ({
      id: r.id || `rec-${idx + 1}`,
      title: r.title,
      explanation: r.explanation,
      relevance: r.relevance || 'Based on your recent activity profile',
      action: r.action || 'Adopt sustainable practices to reduce footprint',
      estimatedSavings: r.estimatedSavings || null,
      category: r.category || 'General',
      difficulty: r.difficulty || 'Easy',
      source: r.source || 'Python ADK & Gemini Engine',
    }));

    const firstRec = recommendationsList[0] || {
      id: 'rec-1',
      title: 'Adopt Low-Carbon Commute Options',
      explanation: 'Using bus, rail or bicycle for medium distances significantly reduces transport footprint.',
      relevance: 'Based on recorded daily journeys',
      action: 'Switch to bus transit for regular trips',
      estimatedSavings: '24 kg CO₂e / month',
      category: 'Transportation',
      difficulty: 'Easy',
      source: 'Google ADK & Gemini',
    };

    return res.status(200).json({
      success: true,
      data: {
        isDemo: totalCount === 0 && weeklyKg === 0,
        summary: {
          totalFootprint: {
            value: String(allTimeTotal),
            unit: 'kg CO₂e',
            change: totalCount > 0 ? `${totalCount} records logged` : 'No records yet',
            changeType: 'neutral',
            changeLabel: 'recorded to date',
          },
          todayEmissions: {
            value: String(todayKg),
            unit: 'kg CO₂e',
            change: todayKg > 0 ? `${todayKg} kg logged` : '0 kg',
            changeType: 'neutral',
            changeLabel: 'today',
          },
          thisWeekEmissions: {
            value: String(weeklyKg),
            unit: 'kg CO₂e',
            change: weeklyKg > 0 ? `${weeklyKg} kg` : '0 kg',
            changeType: 'neutral',
            changeLabel: 'past 7 days',
          },
          activitiesLogged: {
            value: String(totalCount),
            unit: 'activities',
            change: totalCount > 0 ? `${totalCount} entries` : 'None yet',
            changeType: 'neutral',
            changeLabel: '',
          },
        },
        categoryBreakdown,
        weeklyTrends,
        recentActivities,
        recommendations: recommendationsList,
        recommendationPreview: {
          ...firstRec,
          actionUrl: '/chat',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logEmissionActivity = async (req, res, next) => {
  return saveBatchFootprints(req, res, next);
};

export const getFootprintHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'default_user';
    const result = await adkService.getActivities(userId, 50);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
