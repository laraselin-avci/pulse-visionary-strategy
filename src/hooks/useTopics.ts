import { useState, useEffect } from 'react';
import { Topic, EditableTopicData } from '@/types/topics';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useTopics = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog state for adding/editing topics
  const [isTopicFormOpen, setIsTopicFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // Fetch topics from Supabase
  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      // Fetch topics from Supabase
      const { data, error } = await supabase
        .from('topics')
        .select('*');

      if (error) {
        console.error('Error fetching topics:', error);
        toast({
          title: "Error fetching topics",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Convert Supabase data to Topic type
      const formattedTopics: Topic[] = data.map((topic: any) => ({
        id: topic.id,
        name: topic.name,
        // Since category is not in the database schema, we'll derive it from keywords or name
        category: deriveCategoryFromTopic(topic),
        description: topic.description || '',
        following: false, // Will be updated when we fetch selected topics
        is_public: topic.is_public,
        keywords: topic.keywords
      }));

      setTopics(formattedTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast({
        title: "Error fetching topics",
        description: "Failed to fetch topics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to derive a category when it's not in the database
  const deriveCategoryFromTopic = (topic: any): string => {
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleTopicSelect = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      if (selectedTopics.length >= 10) {
        toast({
          title: "Maximum topics reached",
          description: "You can select up to 10 topics. Please remove some to add more.",
          variant: "destructive",
        });
        return;
      }
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // In a real app with authentication, we would save topic subscriptions to the database
      // For now, we'll just save to localStorage
      localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics));
      
      toast({
        title: "Topics updated",
        description: `You are now following ${selectedTopics.length} topics.`,
      });
      
      // Navigate to dashboard after saving
      navigate('/');
    } catch (error) {
      console.error('Error saving topic selections:', error);
      toast({
        title: "Error saving topics",
        description: "Failed to save your topic selections. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add a new topic
  const handleAddTopic = () => {
    setEditingTopic(null);
    setIsTopicFormOpen(true);
  };

  // Edit an existing topic
  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setIsTopicFormOpen(true);
  };

  // Submit the topic form (for both add and edit)
  const handleTopicFormSubmit = async (data: EditableTopicData) => {
    try {
      if (editingTopic) {
        // Update existing topic in Supabase
        const { error } = await supabase
          .from('topics')
          .update({
            name: data.name,
            description: data.description,
            // Don't include category as it's not in the database schema
            updated_at: new Date().toISOString() // Convert Date to string
          })
          .eq('id', editingTopic.id);

        if (error) throw error;
        
        // Update local state
        setTopics(topics.map(topic => 
          topic.id === editingTopic.id 
            ? { 
                ...topic, 
                ...data,
                // Make sure the category is preserved in the local state
                category: data.category || topic.category 
              } 
            : topic
        ));
        
        toast({
          title: "Topic updated",
          description: `The topic "${data.name}" has been updated.`,
        });
      } else {
        // Add new topic to Supabase
        // We need to include only the fields expected by the Supabase schema
        const { data: newTopicData, error } = await supabase
          .from('topics')
          .insert({
            name: data.name,
            description: data.description,
            is_public: false,
            keywords: [], // Default empty array
            // user_id will be handled by RLS or with auth context in a real app
            // For now, use a default or anonymous user ID if needed
            user_id: '00000000-0000-0000-0000-000000000000' // Use a default user ID
          })
          .select();

        if (error) throw error;
        
        if (newTopicData && newTopicData.length > 0) {
          const newTopic: Topic = {
            id: newTopicData[0].id,
            name: data.name,
            category: data.category || deriveCategoryFromTopic({ 
              name: data.name, 
              description: data.description 
            }),
            description: data.description || '',
            following: false,
            is_public: false,
            keywords: []
          };
          
          setTopics([...topics, newTopic]);
          
          toast({
            title: "Topic added",
            description: `The topic "${data.name}" has been added.`,
          });
        }
      }
    } catch (error: any) {
      console.error('Error saving topic:', error);
      toast({
        title: "Error saving topic",
        description: error.message || "Failed to save topic. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter topics based on search query
  const filteredTopics = searchQuery.trim() === '' 
    ? topics 
    : topics.filter(topic => 
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (topic.category && topic.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Group topics by category
  const categories = Array.from(new Set(filteredTopics.map(topic => topic.category || 'Uncategorized')));
  
  const categorizedTopics = categories.map(category => ({
    name: category,
    topics: filteredTopics.filter(topic => (topic.category || 'Uncategorized') === category),
  }));

  // Initialize selected topics on component mount
  useEffect(() => {
    fetchTopics();
    
    // First check if there are preselected topics from onboarding
    const preselectedTopics = localStorage.getItem('preselectedTopics');
    
    if (preselectedTopics) {
      // If we have preselected topics, use them and remove the key from localStorage
      setSelectedTopics(JSON.parse(preselectedTopics));
      localStorage.removeItem('preselectedTopics');
      
      toast({
        title: "Topics pre-selected",
        description: "We've selected topics based on your website. You can modify this selection.",
      });
    } else {
      // Otherwise, check for previously saved topics
      const savedTopics = localStorage.getItem('selectedTopics');
      if (savedTopics) {
        setSelectedTopics(JSON.parse(savedTopics));
      }
    }
  }, []);

  return {
    searchQuery,
    selectedTopics,
    categorizedTopics,
    topics: filteredTopics,
    isLoading,
    handleSearch,
    handleTopicSelect,
    handleSaveChanges,
    handleAddTopic,
    handleEditTopic,
    handleTopicFormSubmit,
    isTopicFormOpen,
    setIsTopicFormOpen,
    editingTopic
  };
};
