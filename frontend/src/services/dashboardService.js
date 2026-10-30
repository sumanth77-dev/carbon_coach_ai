import api from './api';

/**
 * Labeled Mock / Demo Data for Dashboard Development.
 * Disclaimed: This data is simulated demo telemetry for UI development
 * and does not represent real measured calculations.
 */
export const MOCK_DASHBOARD_DATA = {
  isDemo: true,
  summary: {
    totalFootprint: {
      value: '482.4',
      unit: 'kg CO₂e',
      change: '-8.4%',
      changeType: 'decrease',
      changeLabel: 'vs last month',
    },
    todayEmissions: {
      value: '14.2',
      unit: 'kg CO₂e',
      change: '-2.1 kg',
      changeType: 'decrease',
      changeLabel: 'vs yesterday',
    },
    thisWeekEmissions: {
      value: '98.6',
      unit: 'kg CO₂e',
      change: '-11.5%',
      changeType: 'decrease',
      changeLabel: 'vs last week',
    },
    activitiesLogged: {
      value: '24',
      unit: 'activities',
      change: '+3 logged today',
      changeType: 'neutral',
      changeLabel: '',
    },
  },
  categoryBreakdown: [
    {
      category: 'Transportation',
      emission: 41.5,
      percentage: 42,
      color: '#245C45', // Primary
    },
    {
      category: 'Electricity',
      emission: 27.8,
      percentage: 28,
      color: '#3B7A5E', // Forest Green
    },
    {
      category: 'Food',
      emission: 18.2,
      percentage: 19,
      color: '#5B9377', // Muted Sage
    },
    {
      category: 'Waste',
      emission: 11.1,
      percentage: 11,
      color: '#8BAF99', // Secondary
    },
  ],
  weeklyTrends: [
    { day: 'Mon', date: 'Oct 24', emission: 15.4, target: 16.0 },
    { day: 'Tue', date: 'Oct 25', emission: 18.2, target: 16.0 },
    { day: 'Wed', date: 'Oct 26', emission: 12.8, target: 16.0 },
    { day: 'Thu', date: 'Oct 27', emission: 16.5, target: 16.0 },
    { day: 'Fri', date: 'Oct 28', emission: 14.2, target: 16.0 },
    { day: 'Sat', date: 'Oct 29', emission: 11.0, target: 16.0 },
    { day: 'Sun', date: 'Oct 30', emission: 10.5, target: 16.0 },
  ],
  recentActivities: [
    {
      id: 'act-1',
      activity: 'Electric Metro Commute',
      category: 'Transportation',
      date: 'Today, 2:30 PM',
      emission: 1.8,
      unit: 'kg CO₂e',
    },
    {
      id: 'act-2',
      activity: 'Residential Power Consumption',
      category: 'Electricity',
      date: 'Today, 8:00 AM',
      emission: 6.4,
      unit: 'kg CO₂e',
    },
    {
      id: 'act-3',
      activity: 'Plant-forward Meal Lunch',
      category: 'Food',
      date: 'Yesterday, 1:15 PM',
      emission: 2.1,
      unit: 'kg CO₂e',
    },
    {
      id: 'act-4',
      activity: 'Household Organic Composting',
      category: 'Waste',
      date: 'Oct 28, 5:45 PM',
      emission: 0.6,
      unit: 'kg CO₂e',
    },
    {
      id: 'act-5',
      activity: 'Grocery Trip via Hybrid Vehicle',
      category: 'Transportation',
      date: 'Oct 27, 11:20 AM',
      emission: 4.5,
      unit: 'kg CO₂e',
    },
  ],
  recommendationPreview: {
    id: 'rec-1',
    title: 'Off-Peak EV & Appliance Timing',
    explanation:
      'Shifting major electricity usage (vehicle charging, washing cycles) between 11 PM and 5 AM leverages off-peak grid efficiency, lowering indirect emissions.',
    estimatedSavings: '32 kg CO₂e / month',
    category: 'Electricity',
    difficulty: 'Easy',
    source: 'Google ADK & Gemini',
    actionUrl: '/recommendations',
  },
};

/**
 * Service to fetch dashboard data.
 * Ready to consume real backend `/api/v1/footprints/summary` when connected,
 * falling back gracefully to labeled simulated data during development.
 */
export const dashboardService = {
  async fetchDashboardData() {
    try {
      const response = await api.get('/footprints/summary');
      if (response.data?.data) {
        return {
          isDemo: false,
          ...response.data.data,
        };
      }
    } catch (error) {
      // Endpoint not implemented yet or backend offline; return simulated demo data
      console.info('[DashboardService] Using labeled demo telemetry data for UI development.');
    }

    // Simulate minor network latency for realistic loading experience
    await new Promise((resolve) => setTimeout(resolve, 350));
    return MOCK_DASHBOARD_DATA;
  },
};
