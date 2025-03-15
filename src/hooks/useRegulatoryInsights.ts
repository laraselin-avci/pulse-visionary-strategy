
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { RegulatoryInsight } from '@/types/regulatory';
import { AlertPriority } from '@/components/ui/alert-card';
import { 
  fetchInsightsFromDatabase, 
  formatDatabaseInsights,
  filterInsightsByTopicAndPriority 
} from '@/utils/insightUtils';
import { Topic } from '@/types/topics';

// Re-export priorityOrder and RegulatoryInsight interface for backward compatibility
export { priorityOrder, type RegulatoryInsight } from '@/types/regulatory';

export const useRegulatoryInsights = (
  topics: Topic[],
  selectedTopicIds: string[] = [],
  priorityFilter: AlertPriority[] = ['urgent', 'high', 'medium', 'low', 'info']
) => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<RegulatoryInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        // Fetch insights from the database
        const data = await fetchInsightsFromDatabase();
        console.log('Raw data from database:', data);
        
        // Format database insights
        const formattedInsights = formatDatabaseInsights(data || []);
        console.log('Formatted insights:', formattedInsights);
        
        // Store all unfiltered insights
        setInsights(formattedInsights);
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
  }, [toast]);

  // Apply topic and priority filters
  const filteredInsights = filterInsightsByTopicAndPriority(
    insights,
    selectedTopicIds,
    priorityFilter,
    topics
  );

  // For debugging
  console.log('All insights:', insights);
  console.log('Filtered insights:', filteredInsights);
  console.log('Selected topic IDs:', selectedTopicIds);
  console.log('Priority filter:', priorityFilter);

  return {
    insights,
    isLoading,
    filteredInsights,
  };
};
