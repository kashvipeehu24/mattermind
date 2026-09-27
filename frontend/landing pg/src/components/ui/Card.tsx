import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-8 rounded-3xl border border-[#e2e8f0] transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-xl hover:border-[#316bf3]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
