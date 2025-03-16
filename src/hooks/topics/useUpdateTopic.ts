
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Topic, EditableTopicData } from '@/types/topics';

export const useUpdateTopic = (onTopicUpdated: (id: string, updatedData: EditableTopicData) => void) => {
  const { toast } = useToast();

  // Update an existing topic in Supabase
  const updateTopic = async (id: string, topicData: EditableTopicData): Promise<boolean> => {
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
      
      // Call the callback to update local state
      onTopicUpdated(id, topicData);
      
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

  return { updateTopic };
};
