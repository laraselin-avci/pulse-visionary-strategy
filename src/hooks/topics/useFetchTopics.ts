
import { useState, useEffect } from 'react';
import { Topic } from '@/types/topics';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatTopicsFromSupabase } from '@/utils/topicUtils';

export const useFetchTopics = () => {
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

  // Initialize topics on component mount
  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    topics,
    isLoading,
    fetchTopics
  };
};
