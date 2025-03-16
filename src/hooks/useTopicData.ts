
import { useState, useEffect } from 'react';
import { Topic } from '@/types/topics';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatTopicsFromSupabase } from '@/utils/topicUtils';

export const useTopicData = () => {
  const { toast } = useToast();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize URL by removing trailing slashes, converting to lowercase, etc.
  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    // Remove trailing slash if present
    let normalized = url.trim();
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    // Additional normalization could include removing http/https, www, etc.
    return normalized.toLowerCase();
  };

  // Fetch topics from Supabase
  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      // Get the source website from localStorage
      const rawSourceWebsite = localStorage.getItem('analyzedWebsite');
      
      if (!rawSourceWebsite) {
        console.warn('No analyzed website URL found in localStorage');
        setIsLoading(false);
        setTopics([]);
        return;
      }
      
      const sourceWebsite = normalizeUrl(rawSourceWebsite);
      console.log('Fetching topics for normalized website:', sourceWebsite);
      console.log('Original website URL:', rawSourceWebsite);
      
      // First fetch all topics to examine the data
      const { data: allTopics, error: allTopicsError } = await supabase
        .from('topics')
        .select('*');
      
      if (allTopicsError) {
        console.error('Error fetching all topics:', allTopicsError);
        setIsLoading(false);
        return;
      }
      
      console.log('All topics from database:', allTopics);
      
      if (allTopics) {
        // Log all unique sources to debug
        const uniqueSources = new Set(allTopics.map(topic => topic.topics_source));
        console.log('All unique sources in database:', Array.from(uniqueSources));
        
        // Try multiple matching strategies:
        
        // 1. Direct exact match
        let matchedTopics = allTopics.filter(topic => normalizeUrl(topic.topics_source) === sourceWebsite);
        console.log('Exact match topics:', matchedTopics);
        
        // 2. If no exact matches, try contains match (URL might be stored with or without protocol)
        if (matchedTopics.length === 0) {
          console.log('No exact matches, trying contains match...');
          
          // Extract domain part for more flexible matching
          const domainMatch = sourceWebsite.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);
          const sourceDomain = domainMatch ? domainMatch[1] : sourceWebsite;
          console.log('Extracted domain for matching:', sourceDomain);
          
          matchedTopics = allTopics.filter(topic => {
            if (!topic.topics_source) return false;
            
            // Check if the source contains our domain or vice versa
            const normalizedSource = normalizeUrl(topic.topics_source);
            return normalizedSource.includes(sourceDomain) || 
                   sourceDomain.includes(normalizedSource);
          });
          
          console.log('Domain-based matched topics:', matchedTopics);
        }
        
        // Convert matched topics to Topic type
        const formattedTopics = formatTopicsFromSupabase(matchedTopics);
        console.log('Final formatted topics:', formattedTopics);
        setTopics(formattedTopics);
      }
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
      
      // Get the source website from localStorage
      const sourceWebsite = localStorage.getItem('analyzedWebsite');
      console.log('Adding topic with source:', sourceWebsite);
      
      // Add new topic to Supabase
      const { data: newTopicData, error } = await supabase
        .from('topics')
        .insert({
          name: topicData.name,
          description: topicData.description,
          is_public: false,
          keywords: [], // Default empty array
          user_id: temporaryUserId, // Use a fixed user ID for development
          topics_source: sourceWebsite // Set the source website
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
