/**
 * MongoDB Index Definitions for Carbon Coach
 * Defines primary, unique, and compound indexes to optimize query performance.
 */

export const indexDefinitions = {
  users: [
    { key: { email: 1 }, options: { unique: true, name: 'idx_users_email_unique' } },
    { key: { accountType: 1 }, options: { name: 'idx_users_account_type' } },
  ],
  footprints: [
    { key: { userId: 1, loggedAt: -1 }, options: { name: 'idx_footprints_user_date' } },
    { key: { userId: 1, category: 1 }, options: { name: 'idx_footprints_user_category' } },
    { key: { loggedAt: 1 }, options: { name: 'idx_footprints_logged_at' } },
  ],
  recommendations: [
    { key: { userId: 1, status: 1 }, options: { name: 'idx_recommendations_user_status' } },
    { key: { userId: 1, category: 1 }, options: { name: 'idx_recommendations_user_category' } },
  ],
};
