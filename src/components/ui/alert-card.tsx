
import React from 'react';
import { AlertTriangle, ArrowRight, Info, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type AlertPriority = 'urgent' | 'high' | 'medium' | 'low' | 'info';

interface AlertCardProps {
  title: string;
  description: string;
  source: string;
  priority: AlertPriority;
  date: string;
  topic: string;
  onClick?: () => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  title,
  description,
  source,
  priority,
  date,
  topic,
  onClick,
  className,
}) => {
  const priorityConfig = {
    urgent: {
      icon: AlertTriangle,
      color: 'text-politix-crimson bg-red-50 border-red-100',
      badge: 'bg-red-100 text-red-800',
    },
    high: {
      icon: AlertTriangle,
      color: 'text-amber-700 bg-amber-50 border-amber-100',
      badge: 'bg-amber-100 text-amber-800',
    },
    medium: {
      icon: Info,
      color: 'text-blue-700 bg-blue-50 border-blue-100',
      badge: 'bg-blue-100 text-blue-800',
    },
    low: {
      icon: Info,
      color: 'text-gray-700 bg-gray-50 border-gray-100',
      badge: 'bg-gray-100 text-gray-800',
    },
    info: {
      icon: Info,
      color: 'text-gray-700 bg-gray-50 border-gray-100',
      badge: 'bg-gray-100 text-gray-800',
    },
  };

  const { icon: Icon, color, badge } = priorityConfig[priority];

  return (
    <div
      className={cn(
        'bg-white rounded-lg border shadow-sm p-4 transition-all duration-200 hover:shadow-md',
        color,
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', badge)}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
              <span className="text-xs text-gray-500">{date}</span>
            </div>
            <span className="text-xs font-medium text-gray-600">{topic}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">Source: {source}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClick}
              className="flex items-center text-blue-600 hover:text-blue-800 p-0 h-auto"
            >
              <span className="mr-1 text-xs">View Details</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
