import { useState, useEffect } from 'react';
import { Topic } from '@/types/topics';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { allTopics, categories } from '@/data/topics';

export const useTopics = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const [topics, setTopics] = useState<Topic[]>(allTopics);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setTopics(allTopics);
    } else {
      const filtered = allTopics.filter(topic => 
        topic.name.toLowerCase().includes(query) || 
        topic.category.toLowerCase().includes(query)
      );
      setTopics(filtered);
    }
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

  const handleSaveChanges = () => {
    // Save the selected topics (in a real app this would go to a database)
    localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics));
    
    toast({
      title: "Topics updated",
      description: `You are now following ${selectedTopics.length} topics.`,
    });
    
    // Navigate to dashboard after saving
    navigate('/');
  };

  const categorizedTopics = categories.map(category => ({
    name: category,
    topics: topics.filter(topic => topic.category === category),
  }));

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
      // Otherwise, check for previously saved topics or use default following topics
      const savedTopics = localStorage.getItem('selectedTopics');
      if (savedTopics) {
        setSelectedTopics(JSON.parse(savedTopics));
      } else {
        const initialSelected = allTopics
          .filter(topic => topic.following)
          .map(topic => topic.id);
        setSelectedTopics(initialSelected);
      }
    }
  }, []);

  return {
    searchQuery,
    selectedTopics,
    categorizedTopics,
    handleSearch,
    handleTopicSelect,
    handleSaveChanges
  };
};
