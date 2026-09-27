import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-2.5',
    lg: 'text-base md:text-lg px-8 py-4',
  };

  const variantStyles = {
    primary:
      'bg-[#0f172a] text-white hover:bg-black hover:shadow-xl hover:shadow-slate-900/10 active:scale-[0.99]',
    secondary:
      'bg-white text-[#0f172a] border border-[#e2e8f0] hover:bg-slate-50 active:scale-[0.99]',
    outline:
      'bg-transparent text-[#0f172a] border border-[#0f172a] hover:bg-[#0f172a] hover:text-white active:scale-[0.99]',
    ghost:
      'bg-transparent text-[#45464d] hover:text-[#0f172a] hover:bg-slate-100/60',
    blue:
      'bg-[#316bf3] text-white hover:bg-[#2563eb] hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
