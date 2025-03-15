
import React from 'react';
import { AlertCard, AlertPriority } from '@/components/ui/alert-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Insight {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: AlertPriority;
  date: string;
  topic: string;
}

interface InsightsListProps {
  insights: Insight[];
  showHeader?: boolean;
}

export const InsightsList: React.FC<InsightsListProps> = ({ insights, showHeader = false }) => {
  const { toast } = useToast();

  const handleInsightClick = (insightId: string) => {
    toast({
      title: "Insight details",
      description: "Insight details view would open here.",
    });
  };

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Insights</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <AlertCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
            source={insight.source}
            priority={insight.priority}
            date={insight.date}
            topic={insight.topic}
            onClick={() => handleInsightClick(insight.id)}
          />
        ))}
      </div>
    </div>
  );
};
