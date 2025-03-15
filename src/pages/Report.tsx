
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { MainContent } from '@/components/report/MainContent';
import { RegulatoryAssistant } from '@/components/report/RegulatoryAssistant';
import { useTopicData } from '@/hooks/useTopicData';
import { Topic } from '@/types/topics';

const Report = () => {
  const { 
    alerts: insights, 
    filteredAlerts: filteredInsights
  } = useDashboardData();
  
  // Fetch topics from the database
  const { topics, isLoading } = useTopicData();
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  // Initialize selected topics (select first 3 topics by default if available)
  useEffect(() => {
    if (topics.length > 0 && selectedTopicIds.length === 0) {
      const initialSelectedIds = topics.slice(0, 3).map(topic => topic.id);
      setSelectedTopicIds(initialSelectedIds);
    }
  }, [topics]);

  // Handle topic selection toggle
  const handleTopicClick = (topicId: string) => {
    setSelectedTopicIds(prevSelected => {
      if (prevSelected.includes(topicId)) {
        return prevSelected.filter(id => id !== topicId);
      } else {
        return [...prevSelected, topicId];
      }
    });
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
          {isLoading ? (
            <div className="h-full p-4 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                <p className="text-sm text-gray-500">Loading topics...</p>
              </div>
            </div>
          ) : (
            <MainContent 
              topics={topics}
              selectedTopics={selectedTopicIds}
              handleTopicClick={handleTopicClick}
              insights={insights}
              filteredInsights={filteredInsights}
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
