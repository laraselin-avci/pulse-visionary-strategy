
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import TopicSearch from '@/components/topics/TopicSearch';
import CategorySection from '@/components/topics/CategorySection';
import { useTopics } from '@/hooks/useTopics';

const Topics: React.FC = () => {
  const {
    searchQuery,
    selectedTopics,
    categorizedTopics,
    handleSearch,
    handleTopicSelect,
    handleSaveChanges
  } = useTopics();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Monitoring Topics</h1>
        <p className="text-gray-600">Select topics that matter to your organization (5-10 recommended)</p>
      </div>

      <TopicSearch 
        searchQuery={searchQuery} 
        onSearchChange={handleSearch} 
      />

      <div className="flex justify-between items-center mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{selectedTopics.length}</span> topics selected 
          <span className="text-gray-400"> (recommended: 5-10)</span>
        </div>
        <Button 
          onClick={handleSaveChanges}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Save Changes
        </Button>
      </div>

      <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {categorizedTopics.map((category) => (
          <CategorySection
            key={category.name}
            name={category.name}
            topics={category.topics}
            selectedTopics={selectedTopics}
            onTopicSelect={handleTopicSelect}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default Topics;
