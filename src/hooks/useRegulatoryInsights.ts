import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { RegulatoryInsight } from '@/types/regulatory';
import { AlertPriority } from '@/components/ui/alert-card';
import { 
  fetchInsightsFromDatabase, 
  formatDatabaseInsights, 
  combineAndFilterInsights 
} from '@/utils/insightUtils';

// Re-export priorityOrder and RegulatoryInsight interface for backward compatibility
export { priorityOrder, type RegulatoryInsight } from '@/types/regulatory';

export const useRegulatoryInsights = (
  selectedTopicIds: string[] = [],
  priorityFilter: AlertPriority[] = ['urgent', 'high', 'medium', 'low']
) => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<RegulatoryInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        let query = fetchInsightsFromDatabase();

        if (selectedTopicIds.length > 0) {
          // This filtering is now handled by the combineAndFilterInsights function
          // But we keep the structure similar to the original code
        }

        const data = await query;
        
        // Format database insights
        const formattedInsights = formatDatabaseInsights(data || []);
        
        // Combine, filter, and sort insights
        const processedInsights = combineAndFilterInsights(
          formattedInsights,
          selectedTopicIds,
          priorityFilter
        );
        
        setInsights(processedInsights);
      } catch (error: any) {
        console.error('Error fetching regulatory insights:', error);
        toast({
          title: "Error fetching insights",
          description: "Failed to fetch insights. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [selectedTopicIds, priorityFilter, toast]);

  return {
    insights,
    isLoading,
    filteredInsights: insights,
  };
};
