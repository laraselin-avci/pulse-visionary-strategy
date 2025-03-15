
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  subtitle,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-politix-gray p-4 transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change && (
          <span
            className={cn(
              'ml-2 text-sm font-medium',
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            )}
          >
            <span className="flex items-center">
              {change.type === 'increase' ? (
                <ArrowUp className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-0.5" />
              )}
              {change.value}%
            </span>
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};
