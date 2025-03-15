
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AlertPriority } from '@/components/ui/alert-card';

export interface RegulatoryInsight {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: AlertPriority;
  date: string;
  topic: string;
  topicId?: string;
}

export const useRegulatoryInsights = (selectedTopicIds: string[] = []) => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<RegulatoryInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('topic_analyses')
          .select('*')
          .eq('content_type', 'regulatory_insight');

        // Filter by selected topics if any are selected
        if (selectedTopicIds.length > 0) {
          query = query.in('topic_id', selectedTopicIds);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching regulatory insights:', error);
          toast({
            title: "Error fetching insights",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // Map database data to RegulatoryInsight format
          const formattedInsights = data.map(item => {
            const analysisData = item.analysis_data as any;
            const relevantExtracts = item.relevant_extracts as any;
            
            return {
              id: item.id,
              title: item.summary || analysisData?.title || '',
              description: relevantExtracts?.description || analysisData?.description || '',
              source: relevantExtracts?.source || analysisData?.source || '',
              priority: (relevantExtracts?.priority || analysisData?.priority || 'medium') as AlertPriority,
              date: relevantExtracts?.date || analysisData?.date || new Date(item.analysis_date).toLocaleString(),
              topic: item.topics && item.topics.length > 0 ? item.topics[0] : '',
              topicId: item.topic_id
            };
          });
          
          setInsights(formattedInsights);
        }
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
  }, [selectedTopicIds, toast]);

  return {
    insights,
    isLoading,
    filteredInsights: insights,
  };
};
