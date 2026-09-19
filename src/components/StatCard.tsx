import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  label: string;
  value: string | number;
  subValue?: string;
  source?: string;
  icon: LucideIcon;
  variant?: 'danger' | 'warning' | 'info' | 'neutral';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  label,
  value,
  subValue,
  source = 'Registraduría Nacional / Defensoría',
  icon: Icon,
  variant = 'neutral',
  trend,
}) => {
  const variantStyles = {
    danger: {
      border: 'border-rose-900/40 bg-slate-900/60',
      iconBg: 'bg-rose-950/50 text-rose-400 border border-rose-800/40',
      badge: 'text-rose-300 bg-rose-950/40 border border-rose-800/50',
      indicator: 'bg-rose-500',
    },
    warning: {
      border: 'border-amber-900/40 bg-slate-900/60',
      iconBg: 'bg-amber-950/50 text-amber-400 border border-amber-800/40',
      badge: 'text-amber-300 bg-amber-950/40 border border-amber-800/50',
      indicator: 'bg-amber-500',
    },
    info: {
      border: 'border-sky-900/40 bg-slate-900/60',
      iconBg: 'bg-sky-950/50 text-sky-400 border border-sky-800/40',
      badge: 'text-sky-300 bg-sky-950/40 border border-sky-800/50',
      indicator: 'bg-sky-500',
    },
    neutral: {
      border: 'border-slate-800/80 bg-slate-900/60',
      iconBg: 'bg-slate-800/70 text-slate-300 border border-slate-700/60',
      badge: 'text-slate-300 bg-slate-800/50 border border-slate-700/60',
      indicator: 'bg-slate-400',
    },
  }[variant];

  return (
    <div
      id={id}
      className={`relative rounded-xl border p-4 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700 ${variantStyles.border}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 flex-1 pr-2">
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${variantStyles.indicator}`}></span>
            <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
              {label}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-white">
              {value}
            </span>
            {trend && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${variantStyles.badge}`}>
                {trend}
              </span>
            )}
          </div>

          {subValue && (
            <p className="text-xs text-slate-300 font-sans">{subValue}</p>
          )}

          <div className="pt-1 text-[10px] text-slate-500 font-mono">
            {source}
          </div>
        </div>

        <div className={`rounded-lg p-2.5 shrink-0 ${variantStyles.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
