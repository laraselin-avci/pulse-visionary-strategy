
import React from 'react';
import { TopicFilter } from '@/components/dashboard/TopicFilter';
import { InsightsTable } from '@/components/dashboard/InsightsTable';
import { Topic } from '@/types/topics';

interface MainContentProps {
  topics: Topic[];
  selectedTopics: string[];
  handleTopicClick: (topicId: string) => void;
  insights: any[];
  filteredInsights: any[];
}

export const MainContent: React.FC<MainContentProps> = ({
  topics,
  selectedTopics,
  handleTopicClick,
  filteredInsights
}) => {
  return (
    <div className="h-full p-4 overflow-auto flex flex-col">
      {/* Monitored Topics */}
      <TopicFilter 
        topics={topics} 
        selectedTopics={selectedTopics} 
        onTopicClick={handleTopicClick} 
      />
      
      {/* Insights Table */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-4">Regulatory Insights</h2>
        <InsightsTable insights={filteredInsights} />
      </div>
    </div>
  );
};
