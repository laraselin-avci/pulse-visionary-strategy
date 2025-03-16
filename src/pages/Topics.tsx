
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import TopicSearch from '@/components/topics/TopicSearch';
import CategorySection from '@/components/topics/CategorySection';
import TopicForm from '@/components/topics/TopicForm';
import { useTopics } from '@/hooks/useTopics';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Topics: React.FC = () => {
  const navigate = useNavigate();
  
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
    handleSaveChanges,
  } = useTopics();

  const analyzedWebsite = localStorage.getItem('analyzedWebsite');

  return (
    <MainLayout>
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Monitoring Topics</h1>
        <p className="text-gray-600">Select topics that matter to your organization (5-10 recommended)</p>
      </div>

      {analyzedWebsite && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            Showing topics generated for: <span className="font-semibold">{analyzedWebsite}</span>
          </p>
        </div>
      )}

      <TopicSearch 
        searchQuery={searchQuery} 
        onSearchChange={handleSearch} 
      />

      <div className="flex justify-between items-center mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{selectedTopics.length}</span> topics selected 
          <span className="text-gray-400"> (recommended: 5-10)</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleSaveChanges}>
          Save Selection
        </Button>
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
      ) : categorizedTopics.length > 0 ? (
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {categorizedTopics.map((category) => (
            <CategorySection
              key={category.name}
              name={category.name}
              topics={category.topics}
              selectedTopics={selectedTopics}
              onTopicSelect={handleTopicSelect}
              onEditTopic={handleEditTopic}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No topics found for this website. You can add custom topics.</p>
          <Button onClick={() => setIsTopicFormOpen(true)}>
            Add Custom Topic
          </Button>
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
