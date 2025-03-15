
import React from 'react';
import { TopicBadge } from '@/components/ui/topic-badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Topic {
  id: string;
  name: string;
  count: number;
}

interface TopicFilterProps {
  topics: Topic[];
  selectedTopics: string[];
  onTopicClick: (topicId: string) => void;
}

export const TopicFilter: React.FC<TopicFilterProps> = ({
  topics,
  selectedTopics,
  onTopicClick,
}) => {
  const navigate = useNavigate();

  const handleManageTopics = () => {
    navigate('/topics');
  };

  return (
    <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Monitored Topics</h2>
        <Button variant="outline" size="sm" onClick={handleManageTopics}>
          Manage Topics
        </Button>
      </div>
      <div className="bg-white p-4 rounded-lg border border-politix-gray">
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <TopicBadge
              key={topic.id}
              label={topic.name}
              selected={selectedTopics.includes(topic.id)}
              onClick={() => onTopicClick(topic.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
