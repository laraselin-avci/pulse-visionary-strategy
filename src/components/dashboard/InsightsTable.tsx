
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

  // Log insights for debugging
  console.log('Rendering insights table with insights:', insights);

  return (
    <div className="w-full overflow-auto space-y-4">
      {insights.map((insight) => {
        // Validate insight data before rendering
        if (!insight || !insight.id) {
          console.error('Invalid insight data:', insight);
          return null;
        }
        
        return (
          <AlertCard
            key={insight.id}
            title={insight.title || 'Untitled Insight'}
            description={insight.description || 'No description available'}
            source={insight.source || 'Unknown source'}
            priority={insight.priority || 'medium'}
            date={insight.date || 'Unknown date'}
            topic={insight.topic || 'Unspecified topic'}
            onClick={() => handleViewDetails(insight.id)}
          />
        );
      })}
      
      {(!insights || insights.length === 0) && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
          No regulatory insights found. 
          <div className="mt-2 text-sm">
            Check Supabase for data in the topic_analyses table or adjust your filters.
          </div>
        </div>
      )}
    </div>
  );
};
