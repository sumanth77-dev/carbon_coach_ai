import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { CalculatorPage } from '../pages/CalculatorPage';
import { ActivitiesPage } from '../pages/ActivitiesPage';
import { RecommendationsPage } from '../pages/RecommendationsPage';
import { ChatPage } from '../pages/ChatPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';

/**
 * Central routing configuration for Carbon Coach.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
