
import { useTopicData } from '@/hooks/useTopicData';
import { useTopicSelection } from '@/hooks/useTopicSelection';
import { useTopicForm } from '@/hooks/useTopicForm';
import { EditableTopicData } from '@/types/topics';

export const useTopics = () => {
  // Get topic data from Supabase
  const { 
    topics, 
    isLoading, 
    addTopic, 
    updateTopic 
  } = useTopicData();

  // Topic selection and filtering
  const {
    searchQuery,
    selectedTopics,
    filteredTopics,
    categorizedTopics,
    handleSearch,
    handleTopicSelect,
    handleSaveChanges,
  } = useTopicSelection(topics);

  // Topic form operations
  const {
    isTopicFormOpen,
    setIsTopicFormOpen,
    editingTopic,
    handleAddTopic,
    handleEditTopic,
    handleTopicFormSubmit,
  } = useTopicForm(
    // Pass the add/update functions from useTopicData to useTopicForm
    (data: EditableTopicData) => addTopic(data),
    (id: string, data: EditableTopicData) => updateTopic(id, data)
  );

  return {
    // Topic data
    topics, // Expose raw topics for debugging
    filteredTopics,
    isLoading,
    
    // Topic selection
    searchQuery,
    selectedTopics,
    categorizedTopics,
    handleSearch,
    handleTopicSelect,
    handleSaveChanges,
    
    // Topic form
    isTopicFormOpen,
    setIsTopicFormOpen,
    editingTopic,
    handleAddTopic,
    handleEditTopic,
    handleTopicFormSubmit,
  };
};
