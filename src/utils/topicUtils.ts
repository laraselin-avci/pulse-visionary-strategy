
// Utility functions for working with topics

/**
 * Derives a category for a topic when it's not explicitly set in the database
 */
export const deriveCategoryFromTopic = (topic: any): string => {
  // If the category is explicitly set in the database (future-proofing)
  if (topic.category) {
    return topic.category;
  }
  
  // Try to derive a category from keywords
  if (topic.keywords && topic.keywords.length > 0) {
    const keywordCategories: Record<string, string> = {
      'AI': 'Technology',
      'regulation': 'Government',
      'policy': 'Government',
      'ethics': 'Ethics',
      'privacy': 'Privacy',
      'data': 'Data',
      'safety': 'Safety',
      'research': 'Research',
      'funding': 'Finance',
      'infrastructure': 'Infrastructure'
    };
    
    // Try to find a matching category from the keywords
    for (const keyword of topic.keywords) {
      for (const [key, category] of Object.entries(keywordCategories)) {
        if (keyword.toLowerCase().includes(key.toLowerCase())) {
          return category;
        }
      }
    }
  }
  
  // Default categories based on name patterns
  const namePatterns: Record<string, string> = {
    'AI': 'Technology',
    'Regulation': 'Government',
    'Ethics': 'Ethics',
    'Privacy': 'Privacy',
    'Data': 'Data',
    'Safety': 'Safety',
    'Research': 'Research',
    'Funding': 'Finance',
    'Infrastructure': 'Infrastructure'
  };
  
  for (const [pattern, category] of Object.entries(namePatterns)) {
    if (topic.name.includes(pattern)) {
      return category;
    }
  }
  
  // Default fallback
  return 'Uncategorized';
};

/**
 * Formats topics from Supabase into the app's Topic format
 */
export const formatTopicsFromSupabase = (data: any[]): any[] => {
  return data.map((topic: any) => ({
    id: topic.id,
    name: topic.name,
    // Since category is not in the database schema, we'll derive it from keywords or name
    category: deriveCategoryFromTopic(topic),
    description: topic.description || '',
    following: false, // Will be updated when we fetch selected topics
    is_public: topic.is_public,
    keywords: topic.keywords
  }));
};

/**
 * Groups topics by category
 */
export const categorizeTopics = (topics: any[]) => {
  // Extract unique categories
  const categories = Array.from(
    new Set(topics.map(topic => topic.category || 'Uncategorized'))
  );
  
  // Group topics by category
  return categories.map(category => ({
    name: category,
    topics: topics.filter(topic => (topic.category || 'Uncategorized') === category),
  }));
};
