import React from 'react';

/**
 * Reusable Badge indicator component.
 */
export const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  const variants = {
    neutral: 'bg-background text-text-secondary border-border',
    success: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-secondary/20 text-primary-dark border-secondary/40',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded border ${variants[variant] || variants.neutral} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
