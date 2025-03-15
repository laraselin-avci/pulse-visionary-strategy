
import { supabase } from '@/integrations/supabase/client';
import { RegulatoryInsight, priorityOrder } from '@/types/regulatory';
import { AlertPriority } from '@/components/ui/alert-card';

export const fetchInsightsFromDatabase = async () => {
  // Fetch both regular topic analyses and regulatory insights
  const { data, error } = await supabase
    .from('topic_analyses')
    .select('*')
    .eq('content_type', 'regulatory_insight');

  if (error) {
    console.error('Error fetching regulatory insights:', error);
    throw error;
  }

  return data || [];
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

export const filterInsightsByTopicAndPriority = (
  insights: RegulatoryInsight[],
  selectedTopicIds: string[],
  priorityFilter: AlertPriority[]
): RegulatoryInsight[] => {
  // If no topics selected, show all insights filtered by priority
  let filteredInsights = insights;
  
  // Filter insights by topic if topics are selected
  if (selectedTopicIds.length > 0) {
    filteredInsights = insights.filter(insight => 
      selectedTopicIds.includes(insight.topicId)
    );
  }

  // Apply priority filter
  filteredInsights = filteredInsights.filter(insight => 
    priorityFilter.includes(insight.priority)
  );

  // Sort by priority
  return filteredInsights.sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
};
