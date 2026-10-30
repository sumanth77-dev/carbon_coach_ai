import { Footprint } from '../models/Footprint.js';

/**
 * Baseline Seed Activities for Activity History
 */
const BASELINE_ACTIVITIES = [
  {
    id: 'act-001',
    activity: 'Electric Metro Commute',
    category: 'Transportation',
    date: '2026-10-30T09:00:00.000Z',
    displayDate: 'Today, 2:30 PM',
    quantity: '18 km',
    emissions: 1.8,
    unit: 'kg CO₂e',
    status: 'Verified',
    emissionFactor: '0.089 kg CO₂e / passenger-km',
    factorSource: 'UK DEFRA 2024 / National Rail',
    assumptions: 'Grid emissions evaluated based on electrified urban rail average.',
  },
  {
    id: 'act-002',
    activity: 'Residential Power Consumption',
    category: 'Electricity',
    date: '2026-10-30T02:30:00.000Z',
    displayDate: 'Today, 8:00 AM',
    quantity: '16.5 kWh',
    emissions: 6.4,
    unit: 'kg CO₂e',
    status: 'Calculated',
    emissionFactor: '0.385 kg CO₂e / kWh',
    factorSource: 'IEA 2024 National Grid Benchmark',
    assumptions: 'Standard national electricity grid emission coefficient.',
  },
  {
    id: 'act-003',
    activity: 'Plant-forward Meal Lunch',
    category: 'Food',
    date: '2026-10-29T07:45:00.000Z',
    displayDate: 'Yesterday, 1:15 PM',
    quantity: '0.6 kg',
    emissions: 2.1,
    unit: 'kg CO₂e',
    status: 'Verified',
    emissionFactor: '3.50 kg CO₂e / kg composite',
    factorSource: 'Poore & Nemecek (2018/2024) / Science',
    assumptions: 'Farm-gate through distribution life-cycle boundary.',
  },
  {
    id: 'act-004',
    activity: 'Household Organic Composting',
    category: 'Waste',
    date: '2026-10-28T12:15:00.000Z',
    displayDate: 'Oct 28, 5:45 PM',
    quantity: '3.2 kg',
    emissions: 0.6,
    unit: 'kg CO₂e',
    status: 'Verified',
    emissionFactor: '0.08 kg CO₂e / kg',
    factorSource: 'EPA WARM v15 / IPCC Solid Waste',
    assumptions: 'Aerobic home composting diversion vs anaerobic municipal landfill.',
  },
  {
    id: 'act-005',
    activity: 'Grocery Trip via Hybrid Vehicle',
    category: 'Transportation',
    date: '2026-10-27T05:50:00.000Z',
    displayDate: 'Oct 27, 11:20 AM',
    quantity: '26 km',
    emissions: 4.5,
    unit: 'kg CO₂e',
    status: 'Calculated',
    emissionFactor: '0.171 kg CO₂e / vehicle-km',
    factorSource: 'UK DEFRA 2024 (Passenger Car)',
    assumptions: 'Medium hybrid passenger vehicle real-world fuel economy.',
  },
  {
    id: 'act-006',
    activity: 'Eco-Certified Cotton Apparel Purchase',
    category: 'Shopping',
    date: '2026-10-26T10:10:00.000Z',
    displayDate: 'Oct 26, 3:40 PM',
    quantity: '1 item (0.4 kg)',
    emissions: 3.2,
    unit: 'kg CO₂e',
    status: 'Verified',
    emissionFactor: '8.00 kg CO₂e / garment',
    factorSource: 'WRAP Sustainable Clothing Action Plan',
    assumptions: 'Textile supply chain cradle-to-retail.',
  },
  {
    id: 'act-007',
    activity: 'Residential AC Usage (Warm Afternoon)',
    category: 'Electricity',
    date: '2026-10-25T08:00:00.000Z',
    displayDate: 'Oct 25, 1:30 PM',
    quantity: '4.5 hours (6 kWh)',
    emissions: 2.3,
    unit: 'kg CO₂e',
    status: 'Calculated',
    emissionFactor: '0.385 kg CO₂e / kWh',
    factorSource: 'IEA 2024 National Grid Benchmark',
    assumptions: 'Rated 1.3 kW cooling load with average inverter duty cycle.',
  },
  {
    id: 'act-008',
    activity: 'Intercity Rail Journey',
    category: 'Transportation',
    date: '2026-10-24T03:00:00.000Z',
    displayDate: 'Oct 24, 8:30 AM',
    quantity: '120 km',
    emissions: 4.2,
    unit: 'kg CO₂e',
    status: 'Verified',
    emissionFactor: '0.035 kg CO₂e / passenger-km',
    factorSource: 'UK DEFRA 2024 / Intercity Rail',
    assumptions: 'National passenger average load factor.',
  },
];

/**
 * Get Activity History with Filtering, Searching, Sorting, and Pagination
 */
export const getActivities = async (req, res, next) => {
  try {
    const {
      category = 'all',
      dateRange = 'all',
      search = '',
      sortBy = 'newest',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    // Check if MongoDB has real logged records for user
    const userId = req.user?.id || req.user?._id;
    let records = [];

    if (userId) {
      const dbFootprints = await Footprint.find({ userId }).sort({ loggedAt: -1 }).lean();
      if (dbFootprints && dbFootprints.length > 0) {
        records = dbFootprints.map((item) => ({
          id: item._id.toString(),
          activity: item.activityName,
          category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          date: item.loggedAt,
          displayDate: new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(item.loggedAt)),
          quantity: item.activityData?.quantity || '1 unit',
          emissions: item.emissionValue,
          unit: 'kg CO₂e',
          status: 'Logged',
          emissionFactor: item.activityData?.factorSource || 'Verified Standard',
          factorSource: item.activityData?.factorSource || 'DEFRA / IPCC 2024',
          assumptions: 'User logged activity record.',
        }));
      }
    }

    // Combine with baseline activities if records are empty
    if (records.length === 0) {
      records = [...BASELINE_ACTIVITIES];
    }

    // 1. Filter by category
    if (category && category !== 'all') {
      records = records.filter(
        (r) => r.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 2. Filter by search query
    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      records = records.filter(
        (r) =>
          r.activity.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.factorSource && r.factorSource.toLowerCase().includes(q))
      );
    }

    // 3. Filter by dateRange
    const now = new Date();
    if (dateRange === 'today') {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      records = records.filter((r) => new Date(r.date) >= oneDayAgo);
    } else if (dateRange === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      records = records.filter((r) => new Date(r.date) >= oneWeekAgo);
    } else if (dateRange === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      records = records.filter((r) => new Date(r.date) >= oneMonthAgo);
    }

    // 4. Sort
    if (sortBy === 'newest') {
      records.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      records.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'highest') {
      records.sort((a, b) => b.emissions - a.emissions);
    } else if (sortBy === 'lowest') {
      records.sort((a, b) => a.emissions - b.emissions);
    }

    // Compute Summary Figures over filtered records
    const totalActivities = records.length;
    const totalEmissions = parseFloat(
      records.reduce((sum, item) => sum + item.emissions, 0).toFixed(1)
    );
    const transportationCount = records.filter(
      (r) => r.category.toLowerCase() === 'transportation'
    ).length;
    const otherCount = totalActivities - transportationCount;

    // 5. Pagination
    const totalPages = Math.ceil(totalActivities / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedActivities = records.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      summary: {
        totalActivities,
        totalEmissions,
        transportationCount,
        otherCount,
        unit: 'kg CO₂e',
      },
      activities: paginatedActivities,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalRecords: totalActivities,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Activity by ID
 */
export const getActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const found = BASELINE_ACTIVITIES.find((a) => a.id === id);

    if (found) {
      return res.status(200).json({ success: true, activity: found });
    }

    const dbRecord = await Footprint.findById(id).lean();
    if (dbRecord) {
      return res.status(200).json({
        success: true,
        activity: {
          id: dbRecord._id.toString(),
          activity: dbRecord.activityName,
          category: dbRecord.category.charAt(0).toUpperCase() + dbRecord.category.slice(1),
          date: dbRecord.loggedAt,
          displayDate: new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(dbRecord.loggedAt)),
          quantity: dbRecord.activityData?.quantity || '1 unit',
          emissions: dbRecord.emissionValue,
          unit: 'kg CO₂e',
          status: 'Logged',
          emissionFactor: dbRecord.activityData?.factorSource || 'Verified Factor',
          factorSource: dbRecord.activityData?.factorSource || 'DEFRA 2024 / IPCC',
          assumptions: 'Telemetry record stored in database.',
        },
      });
    }

    return res.status(404).json({ success: false, message: 'Activity record not found.' });
  } catch (error) {
    next(error);
  }
};
