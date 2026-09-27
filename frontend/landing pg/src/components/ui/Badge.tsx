import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  className = '',
  dot = false,
}) => {
  const baseStyles =
    'inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full';

  const variantStyles = {
    primary: 'bg-[#0f172a]/5 text-[#0f172a]',
    secondary: 'bg-[#316bf3]/10 text-[#316bf3]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    outline: 'bg-white border border-[#e2e8f0] text-[#45464d]',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#316bf3] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#316bf3]"></span>
        </span>
      )}
      {children}
    </div>
  );
};
