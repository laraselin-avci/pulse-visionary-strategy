
import React from 'react';
import TopicCard from './TopicCard';
import { Topic } from '@/types/topics';
import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';

interface CategorySectionProps {
  name: string;
  topics: Topic[];
  selectedTopics: string[];
  onTopicSelect: (topicId: string) => void;
  onEditTopic?: (topic: Topic) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  name,
  topics,
  selectedTopics,
  onTopicSelect,
  onEditTopic
}) => {
  if (topics.length === 0) return null;

  // Separate topics into public and custom
  const publicTopics = topics.filter(topic => topic.is_public);
  const customTopics = topics.filter(topic => !topic.is_public);

  return (
    <div className="bg-white rounded-lg border border-politix-gray p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{name}</h2>
      
      {publicTopics.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Public Topics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {publicTopics.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isSelected={selectedTopics.includes(topic.id)}
                onSelect={onTopicSelect}
                onEdit={undefined} // Public topics cannot be edited
              />
            ))}
          </div>
        </div>
      )}
      
      {customTopics.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Custom Topics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {customTopics.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isSelected={selectedTopics.includes(topic.id)}
                onSelect={onTopicSelect}
                onEdit={onEditTopic ? () => onEditTopic(topic) : undefined}
              />
            ))}
          </div>
        </div>
      )}
      
      {topics.length === 0 && (
        <p className="text-gray-500">No topics found in this category.</p>
      )}
    </div>
  );
};

export default CategorySection;
