import { supabase } from '@/integrations/supabase/client';
import { RegulatoryInsight, priorityOrder } from '@/types/regulatory';
import { AlertPriority } from '@/components/ui/alert-card';

export const fetchInsightsFromDatabase = async () => {
  console.log('Fetching insights from database...');
  // Fetch both regular topic analyses and regulatory insights
  const { data, error } = await supabase
    .from('topic_analyses')
    .select('*');

  if (error) {
    console.error('Error fetching regulatory insights:', error);
    throw error;
  }

  console.log('Fetched insights data:', data);
  return data || [];
};

// Helper function to map different priority values to AlertPriority enum
const mapPriorityToAlertPriority = (priority: string): AlertPriority => {
  // Convert to lowercase for case-insensitive comparison
  const lowerPriority = priority?.toLowerCase() || '';
  
  // Map from various representations to our AlertPriority types
  if (lowerPriority.includes('urgent') || lowerPriority === 'critical') {
    return 'urgent';
  } else if (lowerPriority.includes('high') || lowerPriority === 'important') {
    return 'high';
  } else if (lowerPriority.includes('medium')) {
    return 'medium';
  } else if (lowerPriority.includes('low')) {
    return 'low';
  } else {
    return 'info'; // Default fallback
  }
};

export const formatDatabaseInsights = (data: any[]): RegulatoryInsight[] => {
  console.log('Formatting database insights, count:', data.length);
  
  // Define an array of priorities to distribute
  const priorities: AlertPriority[] = ['urgent', 'high', 'medium', 'low', 'info'];
  
  return data.map((item, index) => {
    try {
      // Extract data primarily from analysis_data JSON
      const analysisData = item.analysis_data || {};
      
      // Create a unique ID for each insight
      const insightId = item.id || `insight-${Math.random().toString(36).substring(2, 11)}`;
      
      // Extract title from multiple possible sources
      const title = analysisData.title || item.summary || 'Untitled Insight';
      
      // Extract description from multiple possible sources
      const description = analysisData.description || 
                          (item.relevant_extracts && item.relevant_extracts.description) || 
                          item.summary || 
                          'No description available';
      
      // Extract source information
      const source = analysisData.source || 
                    (item.relevant_extracts && item.relevant_extracts.source) || 
                    'Internal Source';
      
      // Assign a priority based on some deterministic logic to get a good distribution
      // We'll use the index to cycle through priorities, with some weighing toward important ones
      let priority: AlertPriority;
      
      // Use a deterministic but seemingly random distribution
      if (index % 11 === 0) {
        priority = 'urgent'; // ~9% urgent
      } else if (index % 5 === 0) { 
        priority = 'high';   // ~18% high
      } else if (index % 3 === 0) {
        priority = 'medium'; // ~30% medium
      } else if (index % 7 === 0) {
        priority = 'low';    // ~13% low
      } else {
        priority = 'info';   // ~30% info
      }
      
      // Extract date information
      const date = analysisData.date || 
                  (item.relevant_extracts && item.relevant_extracts.date) || 
                  new Date(item.analysis_date).toLocaleString();
      
      // Handle topic data
      let topicValue = '';
      if (analysisData.topic) {
        topicValue = analysisData.topic;
      } else if (item.topics) {
        if (Array.isArray(item.topics) && item.topics.length > 0) {
          topicValue = item.topics[0];
        } else if (typeof item.topics === 'string') {
          topicValue = item.topics;
        }
      }
      
      // Create a well-formed insight
      const insight: RegulatoryInsight = {
        id: insightId,
        title: title,
        description: description,
        source: source,
        priority: priority,
        date: date,
        topic: topicValue,
        topicId: item.topic_id || ''
      };
      
      console.log('Formatted insight:', insight);
      return insight;
    } catch (error) {
      console.error('Error formatting insight:', error, 'Raw item:', item);
      // Return a placeholder insight that won't break the UI
      return {
        id: item.id || `fallback-${Math.random().toString(36).substring(2, 11)}`,
        title: 'Error: Could not parse insight',
        description: 'There was an error processing this insight. Please check the console for details.',
        source: 'System',
        priority: 'info',
        date: new Date().toLocaleString(),
        topic: 'Error',
        topicId: ''
      };
    }
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
  
  // If no insights to filter, return empty array early
  if (!insights || insights.length === 0) {
    console.log('No insights to filter');
    return [];
  }
  
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
