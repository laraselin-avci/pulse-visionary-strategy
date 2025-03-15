
import { supabase } from '@/integrations/supabase/client';
import { RegulatoryInsight, priorityOrder } from '@/types/regulatory';
import { AlertPriority } from '@/components/ui/alert-card';

export const fetchInsightsFromDatabase = async () => {
  console.log('Fetching insights from database...');
  // Fetch both regular topic analyses and regulatory insights
  const { data, error } = await supabase
    .from('topic_analyses')
    .select('*')
    .eq('content_type', 'regulatory_insight');

  if (error) {
    console.error('Error fetching regulatory insights:', error);
    throw error;
  }

  console.log('Fetched insights data:', data);
  return data || [];
};

export const formatDatabaseInsights = (data: any[]): RegulatoryInsight[] => {
  console.log('Formatting database insights, count:', data.length);
  
  return data.map(item => {
    // Safely access nested properties
    const analysisData = item.analysis_data || {};
    const relevantExtracts = item.relevant_extracts || {};
    
    // Safely handle topics - it could be an array or a string
    let topicValue = '';
    if (item.topics && Array.isArray(item.topics) && item.topics.length > 0) {
      topicValue = item.topics[0];
    } else if (typeof item.topics === 'string') {
      topicValue = item.topics;
    }
    
    // Create a well-formed insight with default values for missing properties
    const insight: RegulatoryInsight = {
      id: item.id || '',
      title: item.summary || analysisData.title || 'Untitled Insight',
      description: relevantExtracts.description || analysisData.description || item.summary || '',
      source: relevantExtracts.source || analysisData.source || 'Internal Source',
      priority: (relevantExtracts.priority || analysisData.priority || 'medium') as AlertPriority,
      date: relevantExtracts.date || analysisData.date || new Date(item.analysis_date).toLocaleString(),
      topic: topicValue,
      topicId: item.topic_id || ''
    };
    
    console.log('Formatted insight:', insight);
    return insight;
  });
};

export const filterInsightsByTopicAndPriority = (
  insights: RegulatoryInsight[],
  selectedTopicIds: string[],
  priorityFilter: AlertPriority[],
  topics: any[] // Add topics parameter to map names to IDs
): RegulatoryInsight[] => {
  console.log('Filtering insights:', {
    insightsCount: insights.length,
    selectedTopicIds,
    priorityFilter
  });
  
  // If no topics selected, show all insights filtered by priority
  let filteredInsights = insights;
  
  // Filter insights by topic if topics are selected
  if (selectedTopicIds.length > 0) {
    // Create a map of topic names to IDs for faster lookup
    const topicNameToId = new Map();
    topics.forEach(topic => {
      topicNameToId.set(topic.name, topic.id);
    });
    
    filteredInsights = insights.filter(insight => {
      // If we have a direct topicId match, use that
      if (insight.topicId && selectedTopicIds.includes(insight.topicId)) {
        return true;
      }
      
      // Otherwise, try to match by topic name
      const topicId = topicNameToId.get(insight.topic);
      return topicId && selectedTopicIds.includes(topicId);
    });
  }

  // Apply priority filter
  filteredInsights = filteredInsights.filter(insight => 
    priorityFilter.includes(insight.priority)
  );

  console.log('Filtered insights count:', filteredInsights.length);

  // Sort by priority
  return filteredInsights.sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
};
