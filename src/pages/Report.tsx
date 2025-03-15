
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { MainContent } from '@/components/report/MainContent';
import { RegulatoryAssistant } from '@/components/report/RegulatoryAssistant';

const Report = () => {
  const { 
    topics, 
    alerts: insights, 
    selectedTopics, 
    filteredAlerts: filteredInsights, 
    handleTopicClick 
  } = useDashboardData();

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
          <MainContent 
            topics={topics}
            selectedTopics={selectedTopics}
            handleTopicClick={handleTopicClick}
            insights={insights}
            filteredInsights={filteredInsights}
          />
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
