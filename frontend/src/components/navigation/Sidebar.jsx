import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  Activity,
  BarChart3,
  Sparkles,
  MessageSquare,
  Settings,
  X,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'AI Assistant', path: '/chat', icon: MessageSquare },
  { name: 'Carbon Calculator', path: '/calculator', icon: Calculator },
  { name: 'Activity History', path: '/activities', icon: Activity },
  { name: 'Carbon Analytics', path: '/analytics', icon: BarChart3 },
];

/**
 * Responsive collapsible Sidebar for Carbon Coach.
 */
export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 md:hidden border-b border-border">
          <span className="font-semibold text-sm text-text-main">Navigation</span>
          <button onClick={onClose} aria-label="Close navigation" className="p-1 text-text-secondary hover:text-text-main">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-main hover:bg-background'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="p-3 rounded bg-background border border-border">
            <p className="text-xs font-medium text-text-main">Monthly Target</p>
            <p className="text-xs text-text-secondary mt-1">450 kg CO2e / 600 kg limit</p>
            <div className="w-full bg-border rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
