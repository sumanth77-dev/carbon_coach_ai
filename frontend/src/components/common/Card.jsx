import React from 'react';

/**
 * Reusable Card component with clean, minimal borders and subtle shadow.
 */
export const Card = ({ children, title, subtitle, action, className = '' }) => {
  return (
    <div className={`bg-surface border border-border rounded-lg shadow-subtle p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
          <div>
            {title && <h3 className="text-base font-semibold text-text-main">{title}</h3>}
            {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
