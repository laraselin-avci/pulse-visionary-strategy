import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { categorizeTopics } from '@/utils/topicUtils';

export const useTopicSelection = (topics: any[]) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Handle topic selection/deselection
  const handleTopicSelect = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(prevSelected => {
        const newSelected = prevSelected.filter(id => id !== topicId);
        // Save to localStorage whenever selection changes
        localStorage.setItem('selectedTopics', JSON.stringify(newSelected));
        return newSelected;
      });
    } else {
      if (selectedTopics.length >= 10) {
        toast({
          title: "Maximum topics reached",
          description: "You can select up to 10 topics. Please remove some to add more.",
          variant: "destructive",
        });
        return;
      }
      setSelectedTopics(prevSelected => {
        const newSelected = [...prevSelected, topicId];
        // Save to localStorage whenever selection changes
        localStorage.setItem('selectedTopics', JSON.stringify(newSelected));
        return newSelected;
      });
    }
  };

  // Handle saving selected topics
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

  // Filter topics based on search query
  const filteredTopics = searchQuery.trim() === '' 
    ? topics 
    : topics.filter(topic => 
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (topic.category && topic.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Group topics by category
  const categorizedTopics = categorizeTopics(filteredTopics);

  // Initialize selected topics on component mount
  useEffect(() => {
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
    filteredTopics,
    categorizedTopics,
    handleSearch,
    handleTopicSelect,
    handleSaveChanges,
  };
};
