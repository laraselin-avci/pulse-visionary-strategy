
import React from 'react';
import { cn } from '@/lib/utils';

interface TopicBadgeProps {
  label: string;
  type?: 'default' | 'outline';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TopicBadge: React.FC<TopicBadgeProps> = ({
  label,
  type = 'default',
  selected = false,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200',
        'cursor-pointer select-none',
        type === 'default' ? 'bg-blue-100 text-blue-800' : 'border border-blue-300 text-blue-700',
        selected && 'bg-blue-600 text-white border-blue-600',
        onClick && 'hover:bg-opacity-90',
        className
      )}
    >
      {label}
    </div>
  );
};
