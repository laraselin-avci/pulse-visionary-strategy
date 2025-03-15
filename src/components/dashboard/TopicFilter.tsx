
import React from 'react';
import { TopicBadge } from '@/components/ui/topic-badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Topic {
  id: string;
  name: string;
  count?: number;
  is_public?: boolean;
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

  // Separate topics into public and custom
  const publicTopics = topics.filter(topic => topic.is_public);
  const customTopics = topics.filter(topic => !topic.is_public);

  return (
    <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Monitored Topics</h2>
        <div className="flex gap-2">
          {selectedTopics.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                // Clear all selected topics
                localStorage.setItem('selectedTopics', JSON.stringify([]));
                selectedTopics.forEach(id => onTopicClick(id));
              }}
            >
              Clear Selection
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleManageTopics}>
            Manage Topics
          </Button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-politix-gray">
        {publicTopics.length > 0 && (
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Public Topics</h3>
            <div className="flex flex-wrap gap-2">
              {publicTopics.map((topic) => (
                <TopicBadge
                  key={topic.id}
                  label={topic.name}
                  selected={selectedTopics.includes(topic.id)}
                  onClick={() => onTopicClick(topic.id)}
                />
              ))}
            </div>
          </div>
        )}

        {customTopics.length > 0 && (
          <div className={publicTopics.length > 0 ? "pt-3 border-t border-gray-100" : ""}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Custom Topics</h3>
            <div className="flex flex-wrap gap-2">
              {customTopics.map((topic) => (
                <TopicBadge
                  key={topic.id}
                  label={topic.name}
                  selected={selectedTopics.includes(topic.id)}
                  onClick={() => onTopicClick(topic.id)}
                />
              ))}
            </div>
          </div>
        )}

        {topics.length === 0 && (
          <p className="text-gray-500 text-sm">No topics selected. Go to "Manage Topics" to select topics to monitor.</p>
        )}
      </div>
    </div>
  );
};
