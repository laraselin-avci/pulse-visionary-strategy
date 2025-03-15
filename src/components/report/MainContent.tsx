
import React from 'react';
import { TopicFilter } from '@/components/dashboard/TopicFilter';
import { InsightsTable } from '@/components/dashboard/InsightsTable';
import { Topic } from '@/types/topics';
import { RegulatoryInsight } from '@/hooks/useRegulatoryInsights';
import { AlertPriority } from '@/components/ui/alert-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MainContentProps {
  topics: Topic[];
  selectedTopics: string[];
  handleTopicClick: (topicId: string) => void;
  insights: RegulatoryInsight[];
  filteredInsights: RegulatoryInsight[];
  priorityFilter: AlertPriority[];
  onPriorityFilterChange: (priorities: AlertPriority[]) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  topics,
  selectedTopics,
  handleTopicClick,
  filteredInsights,
  priorityFilter,
  onPriorityFilterChange
}) => {
  
  const handlePriorityToggle = (priority: AlertPriority) => {
    if (priorityFilter.includes(priority)) {
      // Remove priority if already selected
      onPriorityFilterChange(priorityFilter.filter(p => p !== priority));
    } else {
      // Add priority if not selected
      onPriorityFilterChange([...priorityFilter, priority]);
    }
  };

  const priorityColors = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-blue-100 text-blue-800',
    low: 'bg-green-100 text-green-800',
  };

  return (
    <div className="h-full p-4 overflow-auto flex flex-col">
      {/* Monitored Topics */}
      <TopicFilter 
        topics={topics} 
        selectedTopics={selectedTopics} 
        onTopicClick={handleTopicClick} 
      />
      
      {/* Priority Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by Priority</h3>
        <div className="flex flex-wrap gap-4">
          {(['urgent', 'high', 'medium', 'low'] as AlertPriority[]).map((priority) => (
            <div key={priority} className="flex items-center space-x-2">
              <Checkbox 
                id={`priority-${priority}`}
                checked={priorityFilter.includes(priority)}
                onCheckedChange={() => handlePriorityToggle(priority)}
              />
              <Label 
                htmlFor={`priority-${priority}`}
                className={`rounded px-2 py-1 text-xs font-medium capitalize ${priorityColors[priority]}`}
              >
                {priority}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Insights Table */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-4">Regulatory Insights</h2>
        <InsightsTable insights={filteredInsights} />
      </div>
    </div>
  );
};
