
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Topic, EditableTopicData } from '@/types/topics';

export const useAddTopic = (onTopicAdded: (topic: Topic) => void) => {
  const { toast } = useToast();

  // Add a new topic to Supabase
  const addTopic = async (topicData: EditableTopicData): Promise<Topic | null> => {
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
        const newTopic: Topic = {
          id: newTopicData[0].id,
          name: topicData.name,
          category: topicData.category,
          description: topicData.description || '',
          following: false,
          is_public: false,
          keywords: []
        };
        
        onTopicAdded(newTopic);
        
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

  return { addTopic };
};
