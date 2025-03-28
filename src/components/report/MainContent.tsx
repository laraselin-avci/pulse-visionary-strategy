
import React from 'react';
import { TopicFilter } from '@/components/dashboard/TopicFilter';
import { InsightsTable } from '@/components/dashboard/InsightsTable';
import { Topic } from '@/types/topics';
import { RegulatoryInsight } from '@/hooks/useRegulatoryInsights';
import { AlertPriority } from '@/components/ui/alert-card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Filter as FilterIcon } from 'lucide-react';

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
  insights,
  filteredInsights,
  priorityFilter,
  onPriorityFilterChange
}) => {
  const handlePriorityToggle = (priority: AlertPriority) => {
    if (priorityFilter.includes(priority)) {
      onPriorityFilterChange(priorityFilter.filter(p => p !== priority));
    } else {
      onPriorityFilterChange([...priorityFilter, priority]);
    }
  };

  const priorityColors = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-blue-100 text-blue-800',
    low: 'bg-green-100 text-green-800',
    info: 'bg-gray-100 text-gray-800',
  };

  const priorities: AlertPriority[] = ['urgent', 'high', 'medium', 'low', 'info'];

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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Regulatory Insights</h2>
            <span className="ml-2 text-sm text-gray-500">
              ({filteredInsights.length} items)
            </span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filter by Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {priorities.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={priorityFilter.includes(priority)}
                  onCheckedChange={() => handlePriorityToggle(priority)}
                >
                  <span className={`px-2 py-0.5 rounded text-xs font-medium mr-2 ${priorityColors[priority]}`}>
                    {priority}
                  </span>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={priorityFilter.length === priorities.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onPriorityFilterChange(priorities);
                  } else {
                    onPriorityFilterChange([]);
                  }
                }}
              >
                Select All
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <InsightsTable insights={filteredInsights} />
      </div>
    </div>
  );
};
