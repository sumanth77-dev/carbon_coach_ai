import React from 'react';
import { Menu, Bell, User, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Responsive top Navbar for Carbon Coach.
 */
export const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const displayName = user?.name || 'Sumanth';
  const planName = user?.plan || 'Individual Plan';

  return (
    <header className="h-16 bg-surface border-b border-border sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 -ml-2 text-text-secondary hover:text-text-main md:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white shadow-subtle">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-text-main tracking-tight">Carbon Coach</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          aria-label="Notifications"
          className="p-2 text-text-secondary hover:text-text-main hover:bg-background rounded-full transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center text-primary-dark font-semibold text-xs">
            {displayName.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-text-main leading-tight">{displayName}</p>
            <p className="text-[10px] text-text-secondary">{planName}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
