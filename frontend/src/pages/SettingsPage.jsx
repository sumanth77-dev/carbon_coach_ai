import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">Account & Profile Settings</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Manage your account type (Individual, Family, or Business) and carbon target limits.
        </p>
      </div>

      <Card title="Profile Information" subtitle="Update basic contact and profile information">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Account Name</label>
            <input
              type="text"
              defaultValue="Demo User"
              className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text-main"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Account Type</label>
            <select
              defaultValue="individual"
              className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text-main"
            >
              <option value="individual">Individual</option>
              <option value="family">Family / Household</option>
              <option value="business">Business / Organization</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Monthly Carbon Target (kg CO2e)</label>
            <input
              type="number"
              defaultValue={600}
              className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text-main"
            />
          </div>
          <div className="pt-2">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
