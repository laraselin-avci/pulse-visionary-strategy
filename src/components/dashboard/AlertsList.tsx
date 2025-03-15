
import React from 'react';
import { AlertCard, AlertPriority } from '@/components/ui/alert-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Alert {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: AlertPriority;
  date: string;
  topic: string;
}

interface AlertsListProps {
  alerts: Alert[];
  showHeader?: boolean;
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts, showHeader = false }) => {
  const { toast } = useToast();

  const handleAlertClick = (alertId: string) => {
    toast({
      title: "Alert details",
      description: "Alert details view would open here.",
    });
  };

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            title={alert.title}
            description={alert.description}
            source={alert.source}
            priority={alert.priority}
            date={alert.date}
            topic={alert.topic}
            onClick={() => handleAlertClick(alert.id)}
          />
        ))}
      </div>
    </div>
  );
};
