import { adkService } from '../services/adkService.js';

/**
 * Get Activity History with Filtering, Searching, Sorting, and Pagination.
 * Uses real SQLite activity storage from Python ADK service.
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
    const userId = req.user?.id || req.user?._id || 'default_user';

    let rawActivities = [];

    // Fetch real recorded activities from Python SQLite
    try {
      const result = await adkService.getActivities(userId, 100);
      if (result && Array.isArray(result.activities)) {
        rawActivities = result.activities;
      }
    } catch (err) {
      console.warn('[ActivityController] Could not reach Python SQLite activities service:', err.message);
    }

    // Map SQLite records to frontend Activity model
    let records = rawActivities.map((item) => {
      const catKey = (item.category || '').toLowerCase();
      const normCategory =
        catKey === 'transport' ? 'Transportation' :
        catKey === 'electricity' ? 'Electricity' :
        catKey === 'food' ? 'Food' :
        catKey === 'waste' ? 'Waste' :
        catKey === 'shopping' ? 'Shopping' :
        catKey.charAt(0).toUpperCase() + catKey.slice(1);

      const typeFormatted = (item.activity_type || 'Activity')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        id: item.activity_id,
        activity: typeFormatted,
        category: normCategory,
        date: item.created_at,
        displayDate: item.created_at
          ? new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(item.created_at))
          : 'Just now',
        quantity: `${item.quantity} ${item.unit || 'units'}`,
        emissions: item.kg_co2e,
        unit: 'kg CO₂e',
        status: item.data_quality === 'calculated' ? 'Calculated' : 'Verified',
        emissionFactor: item.emission_factor || 'Verified Factor',
        factorSource: item.source || 'UK DEFRA 2024 / IPCC',
        formula: item.formula || '',
        assumptions: Array.isArray(item.assumptions)
          ? item.assumptions.join('; ')
          : String(item.assumptions || ''),
      };
    });

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
      records.reduce((sum, item) => sum + item.emissions, 0).toFixed(2)
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
    const userId = req.user?.id || req.user?._id || 'default_user';

    try {
      const result = await adkService.getActivities(userId, 100);
      const found = (result?.activities || []).find((a) => a.activity_id === id);

      if (found) {
        const catKey = (found.category || '').toLowerCase();
        const normCategory =
          catKey === 'transport' ? 'Transportation' :
          catKey === 'electricity' ? 'Electricity' :
          catKey === 'food' ? 'Food' :
          catKey === 'waste' ? 'Waste' :
          catKey.charAt(0).toUpperCase() + catKey.slice(1);

        return res.status(200).json({
          success: true,
          activity: {
            id: found.activity_id,
            activity: found.activity_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            category: normCategory,
            date: found.created_at,
            displayDate: new Date(found.created_at).toLocaleString(),
            quantity: `${found.quantity} ${found.unit || 'units'}`,
            emissions: found.kg_co2e,
            unit: 'kg CO₂e',
            status: found.data_quality === 'calculated' ? 'Calculated' : 'Verified',
            emissionFactor: found.emission_factor || 'Verified Factor',
            factorSource: found.source || 'UK DEFRA 2024 / IPCC',
            formula: found.formula || '',
            assumptions: Array.isArray(found.assumptions)
              ? found.assumptions.join('; ')
              : String(found.assumptions || ''),
          },
        });
      }
    } catch (err) {
      console.warn('[ActivityController] Could not fetch activity detail from Python SQLite:', err.message);
    }

    return res.status(404).json({ success: false, message: 'Activity record not found.' });
  } catch (error) {
    next(error);
  }
};
