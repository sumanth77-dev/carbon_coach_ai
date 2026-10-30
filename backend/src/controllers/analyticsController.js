/**
 * Analytics Controller
 * Provides aggregated analytics telemetry, category breakdowns, time-series trends, and AI insights.
 */

const PERIOD_METRICS = {
  today: {
    totalEmissions: 14.2,
    averageDaily: 14.2,
    totalActivities: 3,
    largestCategory: 'Electricity (45%)',
    periodChange: '-2.1 kg vs yesterday',
    periodChangeType: 'decrease',
    highestCategory: 'Electricity',
    lowestCategory: 'Waste',
    mostActiveDay: 'Today (3 entries)',
    categories: [
      { category: 'Transportation', emission: 4.8, percentage: 34, color: '#245C45' },
      { category: 'Electricity', emission: 6.4, percentage: 45, color: '#3B7A5E' },
      { category: 'Food', emission: 2.4, percentage: 17, color: '#5B9377' },
      { category: 'Waste', emission: 0.6, percentage: 4, color: '#8BAF99' },
    ],
    trends: [
      { label: '8 AM', emission: 6.4, target: 8.0 },
      { label: '1 PM', emission: 3.0, target: 8.0 },
      { label: '6 PM', emission: 4.8, target: 8.0 },
    ],
    aiInsights: [
      'Your electricity consumption was your primary driver today, accounting for 45% of emissions.',
      'Commute emissions were kept low thanks to using electrified public transit.',
    ],
  },
  '7days': {
    totalEmissions: 98.6,
    averageDaily: 14.09,
    totalActivities: 24,
    largestCategory: 'Transportation (42%)',
    periodChange: '-11.5% vs previous 7 days',
    periodChangeType: 'decrease',
    highestCategory: 'Transportation',
    lowestCategory: 'Waste',
    mostActiveDay: 'Tuesday, Oct 25 (18.2 kg)',
    categories: [
      { category: 'Transportation', emission: 41.5, percentage: 42, color: '#245C45' },
      { category: 'Electricity', emission: 27.8, percentage: 28, color: '#3B7A5E' },
      { category: 'Food', emission: 18.2, percentage: 19, color: '#5B9377' },
      { category: 'Waste', emission: 11.1, percentage: 11, color: '#8BAF99' },
    ],
    trends: [
      { label: 'Mon', date: 'Oct 24', emission: 15.4, target: 16.0 },
      { label: 'Tue', date: 'Oct 25', emission: 18.2, target: 16.0 },
      { label: 'Wed', date: 'Oct 26', emission: 12.8, target: 16.0 },
      { label: 'Thu', date: 'Oct 27', emission: 16.5, target: 16.0 },
      { label: 'Fri', date: 'Oct 28', emission: 14.2, target: 16.0 },
      { label: 'Sat', date: 'Oct 29', emission: 11.0, target: 16.0 },
      { label: 'Sun', date: 'Oct 30', emission: 10.5, target: 16.0 },
    ],
    aiInsights: [
      'Your largest emission source is Transportation, representing 42% of your weekly footprint.',
      'Your weekly footprint decreased by 11.5% compared to the prior period, remaining 21% below your target ceiling.',
      'Weekend emissions were 32% lower than weekday commuting averages.',
    ],
  },
  '30days': {
    totalEmissions: 432.8,
    averageDaily: 14.43,
    totalActivities: 86,
    largestCategory: 'Transportation (44%)',
    periodChange: '-8.4% vs previous 30 days',
    periodChangeType: 'decrease',
    highestCategory: 'Transportation',
    lowestCategory: 'Waste',
    mostActiveDay: 'Oct 14 (24.6 kg)',
    categories: [
      { category: 'Transportation', emission: 190.4, percentage: 44, color: '#245C45' },
      { category: 'Electricity', emission: 121.2, percentage: 28, color: '#3B7A5E' },
      { category: 'Food', emission: 77.9, percentage: 18, color: '#5B9377' },
      { category: 'Waste', emission: 43.3, percentage: 10, color: '#8BAF99' },
    ],
    trends: [
      { label: 'Week 1', date: 'Oct 1-7', emission: 112.5, target: 115.0 },
      { label: 'Week 2', date: 'Oct 8-14', emission: 118.2, target: 115.0 },
      { label: 'Week 3', date: 'Oct 15-21', emission: 103.5, target: 115.0 },
      { label: 'Week 4', date: 'Oct 22-28', emission: 98.6, target: 115.0 },
    ],
    aiInsights: [
      'A steady downward trend occurred in weeks 3 and 4 as hybrid travel and off-peak appliances were adopted.',
      'Dietary emissions contributed a moderate 18% share of your monthly total.',
    ],
  },
  this_month: {
    totalEmissions: 482.4,
    averageDaily: 15.56,
    totalActivities: 94,
    largestCategory: 'Transportation (43%)',
    periodChange: '-6.2% vs previous month',
    periodChangeType: 'decrease',
    highestCategory: 'Transportation',
    lowestCategory: 'Waste',
    mostActiveDay: 'Friday, Oct 21',
    categories: [
      { category: 'Transportation', emission: 207.4, percentage: 43, color: '#245C45' },
      { category: 'Electricity', emission: 139.9, percentage: 29, color: '#3B7A5E' },
      { category: 'Food', emission: 86.8, percentage: 18, color: '#5B9377' },
      { category: 'Waste', emission: 48.3, percentage: 10, color: '#8BAF99' },
    ],
    trends: [
      { label: 'Week 1', date: 'Oct 1-7', emission: 112.5, target: 120.0 },
      { label: 'Week 2', date: 'Oct 8-14', emission: 118.2, target: 120.0 },
      { label: 'Week 3', date: 'Oct 15-21', emission: 126.5, target: 120.0 },
      { label: 'Week 4', date: 'Oct 22-30', emission: 125.2, target: 120.0 },
    ],
    aiInsights: [
      'Monthly carbon total (482.4 kg CO₂e) tracked within your 600 kg limit (79% of ceiling used).',
      'Transportation represents your highest priority lever for next month.',
    ],
  },
};

export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const { period = '7days' } = req.query;
    const data = PERIOD_METRICS[period] || PERIOD_METRICS['7days'];

    return res.status(200).json({
      success: true,
      data: {
        period,
        totalEmissions: data.totalEmissions,
        averageDaily: data.averageDaily,
        totalActivities: data.totalActivities,
        largestCategory: data.largestCategory,
        periodChange: data.periodChange,
        periodChangeType: data.periodChangeType,
        insights: {
          highestCategory: data.highestCategory,
          lowestCategory: data.lowestCategory,
          mostActiveDay: data.mostActiveDay,
        },
        aiInsights: data.aiInsights,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsTrends = async (req, res, next) => {
  try {
    const { period = '7days', interval = 'daily' } = req.query;
    const data = PERIOD_METRICS[period] || PERIOD_METRICS['7days'];

    return res.status(200).json({
      success: true,
      data: {
        period,
        interval,
        trends: data.trends,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsCategories = async (req, res, next) => {
  try {
    const { period = '7days' } = req.query;
    const data = PERIOD_METRICS[period] || PERIOD_METRICS['7days'];

    // Category comparison with standard target limits
    const comparisons = data.categories.map((c) => ({
      category: c.category,
      recorded: c.emission,
      benchmark: parseFloat((c.emission * 1.15).toFixed(1)),
      color: c.color,
    }));

    return res.status(200).json({
      success: true,
      data: {
        period,
        categories: data.categories,
        comparisons,
      },
    });
  } catch (error) {
    next(error);
  }
};
