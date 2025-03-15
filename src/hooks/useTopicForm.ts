
import { useState } from 'react';
import { Topic, EditableTopicData } from '@/types/topics';

export const useTopicForm = (
  addTopic: (data: EditableTopicData) => Promise<any>,
  updateTopic: (id: string, data: EditableTopicData) => Promise<boolean>
) => {
  const [isTopicFormOpen, setIsTopicFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

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
    if (editingTopic) {
      // Update existing topic
      await updateTopic(editingTopic.id, data);
    } else {
      // Add new topic
      await addTopic(data);
    }
    
    // Close the dialog after submission
    setIsTopicFormOpen(false);
  };

  return {
    isTopicFormOpen,
    setIsTopicFormOpen,
    editingTopic,
    handleAddTopic,
    handleEditTopic,
    handleTopicFormSubmit,
  };
};
