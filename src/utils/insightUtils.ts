
import { supabase } from '@/integrations/supabase/client';
import { RegulatoryInsight, priorityOrder } from '@/types/regulatory';
import { getOpenAIMockInsights } from '@/data/mockOpenAIInsights';
import { AlertPriority } from '@/components/ui/alert-card';

export const fetchInsightsFromDatabase = async () => {
  const { data, error } = await supabase
    .from('topic_analyses')
    .select('*')
    .eq('content_type', 'regulatory_insight');

  if (error) {
    throw error;
  }

  return data;
};

export const formatDatabaseInsights = (data: any[]): RegulatoryInsight[] => {
  return data.map(item => {
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
      topicId: item.topic_id || ''
    };
  });
};

export const combineAndFilterInsights = (
  dbInsights: RegulatoryInsight[],
  selectedTopicIds: string[],
  priorityFilter: AlertPriority[]
): RegulatoryInsight[] => {
  // Get and filter OpenAI mock insights
  const openAIMockInsights = getOpenAIMockInsights();
  const filteredOpenAIInsights = selectedTopicIds.length > 0
    ? openAIMockInsights.filter(insight => selectedTopicIds.includes(insight.topicId))
    : openAIMockInsights;

  // Combine real and mock insights
  const combinedInsights: RegulatoryInsight[] = [...dbInsights, ...filteredOpenAIInsights];

  // Apply priority filter
  const priorityFilteredInsights = combinedInsights.filter(insight => 
    priorityFilter.includes(insight.priority)
  );

  // Sort by priority
  return priorityFilteredInsights.sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
};
