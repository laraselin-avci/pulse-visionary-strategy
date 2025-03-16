
import { useState, useEffect } from 'react';
import { Topic } from '@/types/topics';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatTopicsFromSupabase } from '@/utils/topicUtils';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export const useTopicData = () => {
  const { toast } = useToast();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch topics from Supabase
  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      // Get the analyzed website from localStorage
      const analyzedWebsite = localStorage.getItem('analyzedWebsite');
      
      // Fetch topics from Supabase
      let query = supabase.from('topics').select('*');
      
      // If we have an analyzed website, filter topics to only those from that website
      if (analyzedWebsite) {
        // Instead of chaining methods which causes TS to create deep type instantiations,
        // we'll use a different approach by directly awaiting the query result
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .eq('source_website', analyzedWebsite);
          
        if (error) throw error;
        
        // If successful, format and set the topics
        const formattedTopics = formatTopicsFromSupabase(data || []);
        setTopics(formattedTopics);
        setIsLoading(false);
        return;
      }
      
      // If no analyzed website, proceed with the unfiltered query
      const { data, error } = await query;

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
      const formattedTopics = formatTopicsFromSupabase(data);
      setTopics(formattedTopics);
    } catch (error: any) {
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

  // Add a new topic to Supabase
  const addTopic = async (topicData: any) => {
    try {
      // Generate a temporary fixed user ID for development (UUID format)
      // NOTE: This is a temporary solution for development. In production, 
      // this should be replaced with the actual authenticated user's ID.
      const temporaryUserId = '00000000-0000-0000-0000-000000000000';
      
      // Get the analyzed website from localStorage
      const analyzedWebsite = localStorage.getItem('analyzedWebsite');
      
      // Add new topic to Supabase
      const { data: newTopicData, error } = await supabase
        .from('topics')
        .insert({
          name: topicData.name,
          description: topicData.description,
          is_public: false,
          keywords: [], // Default empty array
          user_id: temporaryUserId, // Use a fixed user ID for development
          source_website: analyzedWebsite || null // Associate with the analyzed website
        })
        .select();

      if (error) {
        console.error('Error adding topic:', error);
        toast({
          title: "Error adding topic",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      if (newTopicData && newTopicData.length > 0) {
        const newTopic = {
          id: newTopicData[0].id,
          name: topicData.name,
          category: topicData.category,
          description: topicData.description || '',
          following: false,
          is_public: false,
          keywords: []
        };
        
        setTopics(prevTopics => [...prevTopics, newTopic]);
        
        toast({
          title: "Topic added",
          description: `The topic "${topicData.name}" has been added.`,
        });
        
        return newTopic;
      }
      return null;
    } catch (error: any) {
      console.error('Error adding topic:', error);
      toast({
        title: "Error adding topic",
        description: error.message || "Failed to add topic. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update an existing topic in Supabase
  const updateTopic = async (id: string, topicData: any) => {
    try {
      // Update existing topic in Supabase
      const { error } = await supabase
        .from('topics')
        .update({
          name: topicData.name,
          description: topicData.description,
          updated_at: new Date().toISOString() // Convert Date to string
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setTopics(prevTopics => prevTopics.map(topic => 
        topic.id === id 
          ? { 
              ...topic, 
              ...topicData,
            } 
          : topic
      ));
      
      toast({
        title: "Topic updated",
        description: `The topic "${topicData.name}" has been updated.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating topic:', error);
      toast({
        title: "Error updating topic",
        description: error.message || "Failed to update topic. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Initialize topics on component mount
  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    topics,
    isLoading,
    fetchTopics,
    addTopic,
    updateTopic
  };
};
