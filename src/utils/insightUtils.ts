
import { supabase } from '@/integrations/supabase/client';
import { RegulatoryInsight, priorityOrder } from '@/types/regulatory';
import { AlertPriority } from '@/components/ui/alert-card';
import { Topic } from '@/types/topics';

// Function to fetch insights from the database
export const fetchInsightsFromDatabase = async () => {
  try {
    const { data, error } = await supabase
      .from('topic_analyses')
      .select('*')
      .order('analysis_date', { ascending: false });

    if (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchInsightsFromDatabase:', error);
    throw error;
  }
};

// Function to format database insights
export const formatDatabaseInsights = (data: any[]): RegulatoryInsight[] => {
  if (!Array.isArray(data)) {
    console.error('Expected array but received:', data);
    return [];
  }

  const priorityTypes: AlertPriority[] = ['urgent', 'high', 'medium', 'low', 'info'];
  
  return data.map((item, index) => {
    // Use a deterministic pattern based on the index to distribute priorities
    const priorityIndex = index % 5;
    const priority = priorityTypes[priorityIndex];
    
    // Format date to readable string
    const date = new Date(item.analysis_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const topicsList = Array.isArray(item.topics) ? item.topics : [];
    const firstTopic = topicsList.length > 0 ? topicsList[0] : 'General';

    // Create a formatted insight object
    return {
      id: item.id,
      title: item.summary?.split('.')[0] || 'Regulatory Update',
      description: item.summary || 'No summary available',
      source: item.content_type || 'Unknown',
      priority,
      date,
      topic: firstTopic,
      topicId: item.topic_id,
      contentId: item.content_id,
      contentType: item.content_type,
      relevantExtracts: item.relevant_extracts, // Include relevant extracts
    };
  });
};

// Function to filter insights by topic
export const filterInsightsByTopicAndPriority = (
  insights: RegulatoryInsight[],
  selectedTopicIds: string[],
  priorityFilter: AlertPriority[],
  topics: Topic[]
): RegulatoryInsight[] => {
  // If no topics are selected, return all insights filtered by priority
  if (selectedTopicIds.length === 0) {
    return insights.filter(insight => priorityFilter.includes(insight.priority));
  }

  // Get topic names from selected topic IDs
  const selectedTopicNames = topics
    .filter(topic => selectedTopicIds.includes(topic.id))
    .map(topic => topic.name.toLowerCase());

  // Filter insights by selected topics and priority
  return insights.filter(insight => {
    const topicMatch = selectedTopicNames.some(topicName => 
      insight.topic.toLowerCase() === topicName.toLowerCase()
    );
    
    const priorityMatch = priorityFilter.includes(insight.priority);
    
    return topicMatch && priorityMatch;
  });
};
