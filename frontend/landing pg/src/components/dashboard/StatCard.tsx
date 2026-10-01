import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon?: LucideIcon;
  badgeText?: string;
  progressPercent?: number;
  variant?: 'light' | 'dark' | 'accent';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  badgeText,
  progressPercent,
  variant = 'light',
  onClick
}) => {
  const isDark = variant === 'dark';
  const isAccent = variant === 'accent';

  let containerStyles = "bg-white text-slate-900 border-slate-200 hover:border-slate-300";
  if (isDark) {
    containerStyles = "bg-slate-900 text-white border-slate-800 hover:border-slate-700";
  } else if (isAccent) {
    containerStyles = "bg-gradient-to-br from-secondary/10 via-white to-white text-slate-900 border-secondary/30 hover:border-secondary/50";
  }

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border shadow-2xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''
      } ${containerStyles}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className={`text-xs font-bold tracking-wide uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {title}
        </span>

        <div className="flex items-center gap-2">
          {badgeText && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isDark ? 'bg-secondary/30 text-secondary border border-secondary/40' : 'bg-secondary/10 text-secondary border border-secondary/20'
            }`}>
              {badgeText}
            </span>
          )}

          {Icon && (
            <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl sm:text-3xl font-black tracking-tight">{value}</span>
        {unit && <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{unit}</span>}
      </div>

      {(change || subtitle) && (
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {change}
            </span>
          )}

          {subtitle && (
            <span className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}

      {progressPercent !== undefined && (
        <div className="mt-3">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent > 80 ? 'bg-emerald-500' : progressPercent > 50 ? 'bg-secondary' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
