
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { MainContent } from '@/components/report/MainContent';
import { RegulatoryAssistant } from '@/components/report/RegulatoryAssistant';
import { useTopicData } from '@/hooks/useTopicData';
import { useToast } from '@/components/ui/use-toast';
import { useRegulatoryInsights, priorityOrder } from '@/hooks/useRegulatoryInsights';
import { AlertPriority } from '@/components/ui/alert-card';

const Report = () => {
  const { toast } = useToast();
  
  // Fetch topics from the database
  const { topics, isLoading: topicsLoading } = useTopicData();
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority[]>(['urgent', 'high', 'medium', 'low']);

  // Fetch insights from the database
  const { insights, filteredInsights, isLoading: insightsLoading } = useRegulatoryInsights(selectedTopicIds, priorityFilter);

  // Initialize selected topics from localStorage
  useEffect(() => {
    const savedTopics = localStorage.getItem('selectedTopics');
    if (savedTopics) {
      const parsedTopics = JSON.parse(savedTopics);
      setSelectedTopicIds(parsedTopics);
    } else if (topics.length > 0 && selectedTopicIds.length === 0) {
      // Fallback: select first 3 topics by default if no saved selection exists
      const initialSelectedIds = topics.slice(0, 3).map(topic => topic.id);
      setSelectedTopicIds(initialSelectedIds);
      localStorage.setItem('selectedTopics', JSON.stringify(initialSelectedIds));
    }
  }, [topics]);

  // Handle topic selection toggle
  const handleTopicToggle = (topicId: string) => {
    setSelectedTopicIds(prevSelected => {
      let newSelected;
      if (prevSelected.includes(topicId)) {
        newSelected = prevSelected.filter(id => id !== topicId);
      } else {
        if (prevSelected.length >= 10) {
          toast({
            title: "Maximum topics reached",
            description: "You can select up to 10 topics. Please remove some to add more.",
            variant: "destructive",
          });
          return prevSelected;
        }
        newSelected = [...prevSelected, topicId];
      }
      localStorage.setItem('selectedTopics', JSON.stringify(newSelected));
      return newSelected;
    });
  };

  // Handle priority filter change
  const handlePriorityFilterChange = (priorities: AlertPriority[]) => {
    setPriorityFilter(priorities);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report</h1>
        <p className="text-gray-600">Monitor and analyze key regulatory developments</p>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[600px] rounded-lg border"
      >
        {/* Left Panel - Topics and Insights */}
        <ResizablePanel defaultSize={67} minSize={50}>
          {topicsLoading || insightsLoading ? (
            <div className="h-full p-4 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                <p className="text-sm text-gray-500">Loading data...</p>
              </div>
            </div>
          ) : (
            <MainContent 
              topics={topics}
              selectedTopics={selectedTopicIds}
              handleTopicClick={handleTopicToggle}
              insights={insights}
              filteredInsights={filteredInsights}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={handlePriorityFilterChange}
            />
          )}
        </ResizablePanel>
        
        {/* Resize Handle */}
        <ResizableHandle withHandle />
        
        {/* Right Panel - Chat Interface */}
        <ResizablePanel defaultSize={33} minSize={25}>
          <RegulatoryAssistant />
        </ResizablePanel>
      </ResizablePanelGroup>
    </MainLayout>
  );
};

export default Report;
