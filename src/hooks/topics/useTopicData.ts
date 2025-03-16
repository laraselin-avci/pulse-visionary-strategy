
import { useState } from 'react';
import { Topic, EditableTopicData } from '@/types/topics';
import { useFetchTopics } from './useFetchTopics';
import { useAddTopic } from './useAddTopic';
import { useUpdateTopic } from './useUpdateTopic';

export const useTopicData = () => {
  // Get topics from Supabase
  const { topics: fetchedTopics, isLoading, fetchTopics } = useFetchTopics();
  
  // Maintain a local state of topics
  const [topics, setTopics] = useState<Topic[]>([]);

  // Update local state when fetchedTopics changes
  useState(() => {
    setTopics(fetchedTopics);
  });

  // Handle adding a topic
  const handleTopicAdded = (newTopic: Topic) => {
    setTopics(prevTopics => [...prevTopics, newTopic]);
  };

  // Handle updating a topic
  const handleTopicUpdated = (id: string, updatedData: EditableTopicData) => {
    setTopics(prevTopics => prevTopics.map(topic => 
      topic.id === id 
        ? { 
            ...topic, 
            ...updatedData,
          } 
        : topic
    ));
  };

  // Hook for adding topics
  const { addTopic } = useAddTopic(handleTopicAdded);

  // Hook for updating topics
  const { updateTopic } = useUpdateTopic(handleTopicUpdated);

  return {
    topics: fetchedTopics, // Use the fetched topics directly
    isLoading,
    fetchTopics,
    addTopic,
    updateTopic
  };
};
