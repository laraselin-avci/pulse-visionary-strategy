
import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import TopicSearch from '@/components/topics/TopicSearch';
import CategorySection from '@/components/topics/CategorySection';
import TopicForm from '@/components/topics/TopicForm';
import { useTopics } from '@/hooks/useTopics';
import { Skeleton } from '@/components/ui/skeleton';

const Topics: React.FC = () => {
  const {
    searchQuery,
    selectedTopics,
    categorizedTopics,
    isLoading,
    handleSearch,
    handleTopicSelect,
    handleEditTopic,
    handleTopicFormSubmit,
    isTopicFormOpen,
    setIsTopicFormOpen,
    editingTopic,
    topics
  } = useTopics();

  // Debugging info
  useEffect(() => {
    const analyzedWebsite = localStorage.getItem('analyzedWebsite');
    console.log('Analyzed website URL:', analyzedWebsite);
    console.log('All topics:', topics);
    console.log('Categorized topics:', categorizedTopics);
    console.log('Selected topics:', selectedTopics);
  }, [topics, categorizedTopics, selectedTopics]);

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
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-32 w-full rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {categorizedTopics.length > 0 ? (
            categorizedTopics.map((category) => (
              <CategorySection
                key={category.name}
                name={category.name}
                topics={category.topics}
                selectedTopics={selectedTopics}
                onTopicSelect={handleTopicSelect}
                onEditTopic={handleEditTopic}
              />
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-lg border border-politix-gray">
              <p className="text-gray-500">No topics found for this website. You can add custom topics or analyze another website.</p>
            </div>
          )}
        </div>
      )}

      {/* Topic Form Dialog */}
      <TopicForm 
        open={isTopicFormOpen}
        onOpenChange={setIsTopicFormOpen}
        onSubmit={handleTopicFormSubmit}
        initialData={editingTopic}
        title={editingTopic ? "Edit Topic" : "Add New Topic"}
      />
    </MainLayout>
  );
};

export default Topics;
