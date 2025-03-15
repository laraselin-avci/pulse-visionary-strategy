
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCards } from '@/components/dashboard/StatCards';
import { TopicFilter } from '@/components/dashboard/TopicFilter';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { useDashboardData } from '@/hooks/useDashboardData';

const Index = () => {
  const { 
    topics, 
    alerts, 
    selectedTopics, 
    filteredAlerts, 
    handleTopicClick 
  } = useDashboardData();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor and analyze key regulatory developments</p>
      </div>

      <StatCards alerts={alerts} topics={topics} />
      
      <TopicFilter 
        topics={topics} 
        selectedTopics={selectedTopics} 
        onTopicClick={handleTopicClick} 
      />
      
      <AlertsList alerts={filteredAlerts} />
    </MainLayout>
  );
};

export default Index;
