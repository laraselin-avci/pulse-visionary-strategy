
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

  return (
    <div className="bg-white rounded-lg border border-politix-gray p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{name}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {topics.map(topic => (
          <TopicCard
            key={topic.id}
            id={topic.id}
            name={topic.name}
            description={topic.description}
            isSelected={selectedTopics.includes(topic.id)}
            onSelect={onTopicSelect}
            onEdit={onEditTopic ? () => onEditTopic(topic) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
