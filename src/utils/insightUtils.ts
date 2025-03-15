
import { supabase } from '@/integrations/supabase/client';
import { RegulatoryInsight, priorityOrder } from '@/types/regulatory';
import { AlertPriority } from '@/components/ui/alert-card';

export const fetchInsightsFromDatabase = async () => {
  // Fetch all topic analyses without filtering by content_type
  const { data, error } = await supabase
    .from('topic_analyses')
    .select('*');

  if (error) {
    console.error('Error fetching data from topic_analyses:', error);
    throw error;
  }

  console.log('Data fetched from topic_analyses:', data);
  return data || [];
};

export const formatDatabaseInsights = (data: any[]): RegulatoryInsight[] => {
  return data.map(item => {
    const analysisData = item.analysis_data;
    const relevantExtracts = item.relevant_extracts;
    
    // Map the topic from the array to a string (taking the first topic if there's more than one)
    const topic = item.topics && item.topics.length > 0 ? item.topics[0] : '';
    
    return {
      id: item.id,
      title: item.summary || (analysisData?.title || ''),
      description: (relevantExtracts?.description || analysisData?.description || ''),
      source: (relevantExtracts?.source || analysisData?.source || ''),
      priority: (relevantExtracts?.priority || analysisData?.priority || 'medium') as AlertPriority,
      date: (relevantExtracts?.date || analysisData?.date || new Date(item.analysis_date).toLocaleString()),
      topic: topic,
      topicId: item.topic_id || '',
      // Include all additional fields
      analysisData: analysisData,
      relevantExtracts: relevantExtracts,
      keywords: item.keywords,
      sentiment: item.sentiment,
      summary: item.summary,
      topics: item.topics,
      contentId: item.content_id,
      contentType: item.content_type,
      analysisDate: item.analysis_date,
      analyzedAt: item.analyzed_at
    };
  });
};

export const filterInsightsByTopicAndPriority = (
  insights: RegulatoryInsight[],
  selectedTopicIds: string[],
  priorityFilter: AlertPriority[],
  topics: any[] // Add topics parameter to map names to IDs
): RegulatoryInsight[] => {
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

  // Sort by priority
  return filteredInsights.sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
};
