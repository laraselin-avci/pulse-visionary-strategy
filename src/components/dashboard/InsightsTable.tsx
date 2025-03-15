
import React from 'react';
import { AlertCard, AlertPriority } from '@/components/ui/alert-card';
import { useToast } from '@/components/ui/use-toast';
import { RegulatoryInsight } from '@/hooks/useRegulatoryInsights';

interface InsightsTableProps {
  insights: RegulatoryInsight[];
}

export const InsightsTable: React.FC<InsightsTableProps> = ({ insights }) => {
  const { toast } = useToast();

  const handleViewDetails = (insightId: string) => {
    toast({
      title: "Insight details",
      description: "Insight details view would open here.",
    });
  };

  return (
    <div className="w-full overflow-auto space-y-4">
      {insights.map((insight) => (
        <AlertCard
          key={insight.id}
          title={insight.title}
          description={insight.description}
          source={insight.source}
          priority={insight.priority}
          date={insight.date}
          topic={insight.topic}
          onClick={() => handleViewDetails(insight.id)}
        />
      ))}
      
      {insights.length === 0 && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
          No regulatory insights found for the selected topics.
        </div>
      )}
    </div>
  );
};
